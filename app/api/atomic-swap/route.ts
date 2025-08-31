import { NextResponse } from 'next/server'
import algosdk from 'algosdk'

// Initialize the Algod client to connect to the TestNet
const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');

// --- Configuration ---
const SWAP_CONFIG = {
  assetId: parseInt(process.env.DEGEN_ASSET_ID || '745007115'), // Fallback for testing
  rate: 100, // 1 ALGO = 100 DEGEN
  creatorMnemonic: process.env.CREATOR_MNEMONIC || '',
  minPurchase: 0.01,
  maxPurchase: 1,
};

/**
 * POST: Creates and prepares the atomic swap transaction group.
 * This is the single, definitive endpoint for creating swaps.
 */
export async function POST(request: Request) {
  try {

    // --- 1. Robust Validation ---
    if (!SWAP_CONFIG.assetId || isNaN(SWAP_CONFIG.assetId)) {
        throw new Error("Server Error: DEGEN_ASSET_ID is missing or invalid in the .env.local file.");
    }
    if (!SWAP_CONFIG.creatorMnemonic) {
        throw new Error("Server Error: CREATOR_MNEMONIC is not set in the .env.local file.");
    }

    const { buyerAddress, algoAmount } = await request.json();

    if (!buyerAddress || typeof buyerAddress !== 'string' || !algosdk.isValidAddress(buyerAddress)) {
      return NextResponse.json({ success: false, error: 'A valid buyer wallet address is required.' }, { status: 400 });
    }
    if (!algoAmount || algoAmount < SWAP_CONFIG.minPurchase || algoAmount > SWAP_CONFIG.maxPurchase) {
      return NextResponse.json({ success: false, error: `Purchase amount must be between ${SWAP_CONFIG.minPurchase} and ${SWAP_CONFIG.maxPurchase} ALGO.`}, { status: 400 });
    }

    // --- 2. Setup and Transaction Creation ---
    const creatorAccount = algosdk.mnemonicToSecretKey(SWAP_CONFIG.creatorMnemonic);
    const creatorAddressString = creatorAccount.addr.toString(); // Use the string representation of the address

    // Log creator wallet information for debugging
    console.log('Creator Wallet Info:');
    console.log('Mnemonic:', SWAP_CONFIG.creatorMnemonic);
    console.log('Address:', creatorAddressString);

    const degenAmount = Math.floor(algoAmount * SWAP_CONFIG.rate * 1e6);
    const algoMicroAmount = Math.floor(algoAmount * 1e6);
    const params = await algodClient.getTransactionParams().do();

    // --- 2.5. Check if buyer has already opted into the asset and validate balances ---
    let buyerAlreadyOptedIn = false;
    try {
      const buyerAccountInfo = await algodClient.accountInformation(buyerAddress).do();
      const buyerAssets = buyerAccountInfo.assets || [];
      const degenAsset = buyerAssets.find((asset: any) => asset['asset-id'] === SWAP_CONFIG.assetId);
      buyerAlreadyOptedIn = !!degenAsset;

      // Check buyer ALGO balance
      const availableAlgoBalance = Number(buyerAccountInfo.amount) - Number(buyerAccountInfo.minBalance || 100000);
      if (availableAlgoBalance < algoMicroAmount) {
        throw new Error(`Insufficient ALGO balance. Available: ${(availableAlgoBalance / 1e6).toFixed(6)}, Required: ${algoAmount}`);
      }
    } catch (accountError: any) {
      if (accountError.message.includes('Insufficient ALGO balance')) {
        throw accountError;
      }
      // If we can't check, assume opt-in needed for safety
    }

    // Check creator DEGEN balance
    try {
      const creatorAccountInfo = await algodClient.accountInformation(creatorAddressString).do();
      const creatorAssets = creatorAccountInfo.assets || [];
      const degenAsset = creatorAssets.find((asset: any) => asset['asset-id'] === SWAP_CONFIG.assetId);

      // Log creator's current DEGEN balance for debugging
      const currentBalance = degenAsset ? Number(degenAsset.amount) / 1e6 : 0;
      console.log(`Creator DEGEN balance: ${currentBalance} (required: ${degenAmount / 1e6})`);

      // Re-enabled balance validation now that creator has sufficient DEGEN
      if (!degenAsset || Number(degenAsset.amount) < degenAmount) {
        throw new Error('Creator account has insufficient DEGEN balance');
      }
    } catch (creatorError: any) {
      if (creatorError.message.includes('insufficient DEGEN balance')) {
        throw creatorError;
      }
      throw new Error('Failed to verify creator balance');
    }

    // ✅ ALGOSDK v3.x COMPATIBLE: Use the modern "...FromObject" functions.

    // Create transactions array, conditionally include opt-in
    const transactions = [];

    // Only create opt-in transaction if buyer hasn't opted in
    let optInTxn;
    if (!buyerAlreadyOptedIn) {
      optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: buyerAddress,
        to: buyerAddress, // Send to self to opt-in
        amount: 0, // 0 amount for opt-in
        assetIndex: SWAP_CONFIG.assetId,
        suggestedParams: params,
      });
      transactions.push(optInTxn);
    }

    // Payment transaction
    const algoTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: buyerAddress,
      to: creatorAddressString,
      amount: algoMicroAmount,
      suggestedParams: params,
    });
    transactions.push(algoTxn);

    // DEGEN transfer transaction
    const degenTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: creatorAddressString,
      to: buyerAddress,
      amount: degenAmount,
      assetIndex: SWAP_CONFIG.assetId,
      suggestedParams: params,
    });
    transactions.push(degenTxn);

    // --- 3. Group, Sign, and Encode ---
    algosdk.assignGroupID(transactions);
    const signedDegenTxn = degenTxn.signTxn(creatorAccount.sk);


    // --- 4. Return Complete Transaction Group ---
    const transactionData = [];

    if (optInTxn) {
      const unsignedOptInTxn = algosdk.encodeUnsignedTransaction(optInTxn);
      transactionData.push({
        txn: Array.from(unsignedOptInTxn),
        signers: [buyerAddress], // User needs to sign opt-in
      });
    }

    const unsignedAlgoTxn = algosdk.encodeUnsignedTransaction(algoTxn);
    transactionData.push({
      txn: Array.from(unsignedAlgoTxn),
      signers: [buyerAddress], // User needs to sign payment
    });

    transactionData.push({
      txn: Array.from(signedDegenTxn),
      signers: [], // Already signed by creator
    });

    return NextResponse.json({
      success: true,
      data: {
        // Send complete transaction group to wallet
        transactions: transactionData,
        // Keep backward compatibility
        unsignedTransaction: Array.from(unsignedAlgoTxn),
        signedCreatorTransaction: Array.from(signedDegenTxn),
      },
    });

  } catch (error: any) {
    console.error('Error creating atomic swap:', error);
    // Return a generic error to the user for security
    return NextResponse.json({ success: false, error: "An internal server error occurred. Please try again later." }, { status: 500 });
  }
}

/**
 * PUT: Submits the fully signed transaction group to the network.
 */
export async function PUT(request: Request) {
    try {
      const { signedUserTransaction, signedCreatorTransaction } = await request.json();

      if (!signedUserTransaction || !signedCreatorTransaction) {
        return NextResponse.json({ success: false, error: "Both signed transactions are required." }, { status: 400 });
      }

      // Handle the transaction group - could be 1, 2, or 3 transactions
      let optInTxn: Uint8Array | null = null;
      let userTxn: Uint8Array | null = null;
      const creatorTxn = new Uint8Array(signedCreatorTransaction);

      if (signedUserTransaction && signedUserTransaction.length > 0) {
        if (signedUserTransaction.length >= 1) {
          userTxn = new Uint8Array(signedUserTransaction[0]);
        }
        if (signedUserTransaction.length >= 2) {
          optInTxn = new Uint8Array(signedUserTransaction[1]);
        }
      }

      // Validate transaction formats
      try {
        if (optInTxn) {
          algosdk.decodeSignedTransaction(optInTxn);
        }

        if (userTxn) {
          algosdk.decodeSignedTransaction(userTxn);
        } else {
          // Check if this is a fallback scenario where only creator transaction is provided
          if (signedUserTransaction && signedUserTransaction.length === 0) {
            // In fallback mode, we only need the creator transaction
          } else {
            return NextResponse.json({
              success: false,
              error: 'User transaction is required but was not provided'
            }, { status: 400 });
          }
        }

        algosdk.decodeSignedTransaction(creatorTxn);
      } catch (decodeError: any) {
        console.error('Transaction decoding failed:', decodeError);
        return NextResponse.json({
          success: false,
          error: `Invalid transaction format: ${decodeError.message}`
        }, { status: 400 });
      }

      // Build transaction array dynamically
      const transactionsToSubmit: Uint8Array[] = [];
      if (optInTxn) transactionsToSubmit.push(optInTxn);
      if (userTxn) transactionsToSubmit.push(userTxn);
      transactionsToSubmit.push(creatorTxn);

      // Only submit if we have at least the creator transaction
      if (transactionsToSubmit.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'No valid transactions to submit'
        }, { status: 400 });
      }
      let txId: string;
      try {
        const sendResponse = await algodClient.sendRawTransaction(transactionsToSubmit).do();
        txId = sendResponse.txid;

        // Wait for confirmation
        await algosdk.waitForConfirmation(algodClient, txId, 4);

      } catch (submitError: any) {
        console.error('Transaction submission failed:', submitError);
        return NextResponse.json({
          success: false,
          error: `Transaction submission failed: ${submitError.message}`
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        data: {
          txId,
          explorerUrl: `https://testnet.algoexplorer.io/tx/${txId}`
        }
      });

    } catch (error: any) {
      console.error('Transaction submission error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      return NextResponse.json({ success: false, error: "Failed to submit transaction to the network." }, { status: 500 });
    }
}