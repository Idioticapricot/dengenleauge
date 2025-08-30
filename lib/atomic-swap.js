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
    // Validate inputs
    if (!buyerAddress || !algoAmount) {
      throw new Error('buyerAddress and algoAmount required')
    }

    if (algoAmount < SWAP_CONFIG.minPurchase || algoAmount > SWAP_CONFIG.maxPurchase) {
      throw new Error(`Amount must be between ${SWAP_CONFIG.minPurchase} and ${SWAP_CONFIG.maxPurchase} ALGO`)
    }

    const degenAmount = Math.floor(algoAmount * SWAP_CONFIG.rate * 1e6)
    const algoMicroAmount = Math.floor(algoAmount * 1e6)

    const creatorAccount = algosdk.mnemonicToSecretKey(process.env.CREATOR_MNEMONIC)
    const params = await algodClient.getTransactionParams().do()

    // Create atomic transaction group
    const algoTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: buyerAddress,
      to: creatorAccount.addr,
      amount: algoMicroAmount,
      suggestedParams: params
    })

    const degenTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: creatorAccount.addr,
      to: buyerAddress,
      amount: degenAmount,
      assetIndex: SWAP_CONFIG.assetId,
      suggestedParams: params
    })

    // Group transactions atomically
    const txnGroup = [algoTxn, degenTxn]
    algosdk.assignGroupID(txnGroup)

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