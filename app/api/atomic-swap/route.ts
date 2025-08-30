import { NextResponse } from 'next/server'
import algosdk from 'algosdk'

// Initialize the Algod client to connect to the TestNet
const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');

// --- Configuration ---
const SWAP_CONFIG = {
  assetId: parseInt(process.env.DEGEN_ASSET_ID!),
  rate: 10000, // 1 ALGO = 10,000 DEGEN
  creatorMnemonic: process.env.CREATOR_MNEMONIC!,
  minPurchase: 0.1,
  maxPurchase: 100,
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
    const creatorAddressString = creatorAccount.addr; // Use the string representation of the address

    const degenAmount = Math.floor(algoAmount * SWAP_CONFIG.rate * 1e6);
    const algoMicroAmount = Math.floor(algoAmount * 1e6);
    const params = await algodClient.getTransactionParams().do();

    // ✅ CORRECT METHOD: Use the modern, robust "...FromObject" functions.
    // This is the standard and avoids the errors you were seeing.
    const algoTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: buyerAddress,
      to: creatorAddressString,
      amount: algoMicroAmount,
      suggestedParams: params,
    });

    const degenTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: creatorAddressString,
      to: buyerAddress,
      amount: degenAmount,
      assetIndex: SWAP_CONFIG.assetId,
      suggestedParams: params,
    });

    // --- 3. Group, Sign, and Encode ---
    algosdk.assignGroupID([algoTxn, degenTxn]);
    const signedDegenTxn = degenTxn.signTxn(creatorAccount.sk);
    const unsignedAlgoTxn = algosdk.encodeUnsignedTransaction(algoTxn);

    // --- 4. Return Response ---
    return NextResponse.json({
      success: true,
      data: {
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

      const userTxn = new Uint8Array(signedUserTransaction);
      const creatorTxn = new Uint8Array(signedCreatorTransaction);

      const { txId } = await algodClient.sendRawTransaction([userTxn, creatorTxn]).do();
      await algosdk.waitForConfirmation(algodClient, txId, 4);

      return NextResponse.json({
        success: true,
        data: {
          txId,
          explorerUrl: `https://testnet.algoexplorer.io/tx/${txId}`
        }
      });

    } catch (error: any) {
      console.error('Transaction submission error:', error);
      return NextResponse.json({ success: false, error: "Failed to submit transaction to the network." }, { status: 500 });
    }
}