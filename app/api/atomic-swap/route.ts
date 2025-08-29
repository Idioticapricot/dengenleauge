import { NextResponse } from 'next/server'
import algosdk from 'algosdk'

const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '');

const SWAP_CONFIG = {
  assetId: parseInt(process.env.DEGEN_ASSET_ID!),
  rate: 10000, // 1 ALGO = 10,000 DEGEN
  creatorMnemonic: process.env.CREATOR_MNEMONIC!,
  creatorAddress: process.env.CREATOR_ADDRESS!
}

export async function POST(request: Request) {
  try {
    const { buyerAddress, algoAmount } = await request.json()

    if (!buyerAddress || !algoAmount) {
      return NextResponse.json({ 
        success: false, 
        error: 'buyerAddress and algoAmount required' 
      }, { status: 400 })
    }

    const degenAmount = Math.floor(algoAmount * SWAP_CONFIG.rate * 1e6) // Convert to microDEGEN
    const algoMicroAmount = Math.floor(algoAmount * 1e6) // Convert to microALGO

    // Get creator account
    const creatorAccount = algosdk.mnemonicToSecretKey(SWAP_CONFIG.creatorMnemonic)
    
    // Get suggested params
    const params = await algodClient.getTransactionParams().do()

    // Create atomic transaction group:
    // 1. Buyer sends ALGO to creator
    // 2. Creator sends DEGEN to buyer
    
    const algoTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: buyerAddress,
      to: SWAP_CONFIG.creatorAddress,
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

    return NextResponse.json({
      success: true,
      data: {
        unsignedTransaction: Array.from(unsignedAlgoTxn),
        signedCreatorTransaction: Array.from(signedDegenTxn),
        degenAmount: degenAmount / 1e6,
        algoAmount,
        rate: SWAP_CONFIG.rate
      }
    })

  } catch (error: any) {
    console.error('Atomic swap error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { signedUserTransaction, signedCreatorTransaction } = await request.json()

    // Convert arrays back to Uint8Array
    const userTxn = new Uint8Array(signedUserTransaction)
    const creatorTxn = new Uint8Array(signedCreatorTransaction)

    // Submit atomic transaction group
    const { txId } = await algodClient.sendRawTransaction([userTxn, creatorTxn]).do()

    // Wait for confirmation
    await algosdk.waitForConfirmation(algodClient, txId, 4)

    return NextResponse.json({
      success: true,
      data: {
        txId,
        explorerUrl: `https://testnet.algoexplorer.io/tx/${txId}`
      }
    })

  } catch (error: any) {
    console.error('Transaction submission error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}