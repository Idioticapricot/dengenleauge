const algosdk = require('algosdk')

const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '')

const SWAP_CONFIG = {
  assetId: parseInt(process.env.DEGEN_ASSET_ID),
  rate: 10000, // 1 ALGO = 10,000 DEGEN
  minPurchase: 0.1,
  maxPurchase: 100
}

async function createAtomicSwap(buyerAddress, algoAmount) {
  try {
    console.log('Creating atomic swap for:', { buyerAddress, algoAmount })

    // Validate environment variables
    if (!process.env.DEGEN_ASSET_ID) {
      throw new Error('DEGEN_ASSET_ID environment variable is not set')
    }

    if (!process.env.CREATOR_MNEMONIC) {
      throw new Error('CREATOR_MNEMONIC environment variable is not set')
    }

    // Validate inputs with better error messages
    if (!buyerAddress || buyerAddress === '' || buyerAddress === null || buyerAddress === undefined) {
      throw new Error('Wallet address is required. Please connect your wallet.')
    }

    // Validate Algorand address format (should be 58 characters)
    if (typeof buyerAddress !== 'string' || buyerAddress.length !== 58) {
      throw new Error(`Invalid wallet address format. Expected 58 characters, got ${buyerAddress.length}`)
    }

    if (!algoAmount || algoAmount <= 0) {
      throw new Error('Valid ALGO amount is required')
    }

    if (algoAmount < SWAP_CONFIG.minPurchase || algoAmount > SWAP_CONFIG.maxPurchase) {
      throw new Error(`Amount must be between ${SWAP_CONFIG.minPurchase} and ${SWAP_CONFIG.maxPurchase} ALGO`)
    }

    console.log('Validation passed, creating transaction...')

    const degenAmount = Math.floor(algoAmount * SWAP_CONFIG.rate * 1e6)
    const algoMicroAmount = Math.floor(algoAmount * 1e6)
    console.log('Calculated amounts:', { degenAmount, algoMicroAmount })

    // Check creator account balance
    console.log('Checking creator account balance...')
    const creatorAccount = algosdk.mnemonicToSecretKey(process.env.CREATOR_MNEMONIC)
    console.log('Creator address:', creatorAccount.addr)

    try {
      const accountInfo = await algodClient.accountInformation(creatorAccount.addr).do()
      console.log('Creator account info:', {
        address: creatorAccount.addr,
        amount: Number(accountInfo.amount) / 1e6, // Convert BigInt to number then to ALGO
        assets: accountInfo.assets?.map(asset => ({
          id: asset['asset-id'],
          amount: Number(asset.amount) // Convert BigInt to number
        }))
      })

      // Check if creator has enough DEGEN tokens
      const degenAsset = accountInfo.assets?.find(asset => asset['asset-id'] === parseInt(SWAP_CONFIG.assetId))
      if (!degenAsset || degenAsset.amount < degenAmount) {
        throw new Error(`Creator account has insufficient DEGEN balance. Has: ${degenAsset?.amount || 0}, Needs: ${degenAmount}`)
      }
      console.log('Creator has sufficient DEGEN balance')
    } catch (balanceError) {
      console.error('Error checking creator balance:', balanceError)
      throw new Error(`Failed to check creator account balance: ${balanceError.message}`)
    }

    // Check buyer account balance (optional but helpful)
    console.log('Checking buyer account balance...')
    try {
      const buyerAccountInfo = await algodClient.accountInformation(buyerAddress).do()
      console.log('Buyer account info:', {
        address: buyerAddress,
        amount: Number(buyerAccountInfo.amount) / 1e6, // Convert BigInt to number then to ALGO
        minBalance: Number(buyerAccountInfo['min-balance']) / 1e6
      })

      // Check if buyer has enough ALGO (including min balance)
      const availableBalance = Number(buyerAccountInfo.amount) - Number(buyerAccountInfo['min-balance'])
      if (availableBalance < algoMicroAmount) {
        throw new Error(`Buyer account has insufficient ALGO balance. Available: ${availableBalance / 1e6}, Needs: ${algoAmount}`)
      }
      console.log('Buyer has sufficient ALGO balance')
    } catch (buyerBalanceError) {
      console.error('Error checking buyer balance:', buyerBalanceError)
      // Don't fail the swap if we can't check buyer balance, but log it
      console.log('Continuing without buyer balance check due to error')
    }

    console.log('Getting transaction params...')
    const params = await algodClient.getTransactionParams().do()
    console.log('Transaction params:', params)

    console.log('Creating ALGO payment transaction...')
    console.log('From address:', buyerAddress)
    console.log('To address:', creatorAccount.addr)
    console.log('Amount (microAlgos):', algoMicroAmount)

    let algoTxn, degenTxn
    try {
      // Create atomic transaction group
      algoTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: buyerAddress,
        to: creatorAccount.addr,
        amount: algoMicroAmount,
        suggestedParams: params
      })
      console.log('ALGO transaction created successfully')
    } catch (algoTxnError) {
      console.error('Error creating ALGO transaction:', algoTxnError)
      throw new Error(`Failed to create ALGO payment transaction: ${algoTxnError.message}`)
    }

    console.log('Creating DEGEN transfer transaction...')
    try {
      degenTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: creatorAccount.addr,
        to: buyerAddress,
        amount: degenAmount,
        assetIndex: SWAP_CONFIG.assetId,
        suggestedParams: params
      })
      console.log('DEGEN transaction created successfully')
    } catch (degenTxnError) {
      console.error('Error creating DEGEN transaction:', degenTxnError)
      throw new Error(`Failed to create DEGEN transfer transaction: ${degenTxnError.message}`)
    }

    console.log('Grouping transactions...')
    // Group transactions atomically
    const txnGroup = [algoTxn, degenTxn]
    algosdk.assignGroupID(txnGroup)
    console.log('Transactions grouped successfully')

    // Creator signs their transaction
    const signedDegenTxn = degenTxn.signTxn(creatorAccount.sk)

    // Return unsigned ALGO transaction for buyer to sign
    const unsignedAlgoTxn = algosdk.encodeUnsignedTransaction(algoTxn)

    return {
      success: true,
      data: {
        unsignedTransaction: Array.from(unsignedAlgoTxn),
        signedCreatorTransaction: Array.from(signedDegenTxn),
        degenAmount: degenAmount / 1e6,
        algoAmount,
        rate: SWAP_CONFIG.rate
      }
    }

  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

async function submitAtomicSwap(signedUserTransaction, signedCreatorTransaction) {
  try {
    const userTxn = new Uint8Array(signedUserTransaction)
    const creatorTxn = new Uint8Array(signedCreatorTransaction)

    const { txId } = await algodClient.sendRawTransaction([userTxn, creatorTxn]).do()
    await algosdk.waitForConfirmation(algodClient, txId, 4)

    return {
      success: true,
      data: {
        txId,
        explorerUrl: `https://testnet.algoexplorer.io/tx/${txId}`
      }
    }

  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

module.exports = {
  createAtomicSwap,
  submitAtomicSwap,
  SWAP_CONFIG
}