import { NextResponse } from 'next/server'
import algosdk from 'algosdk'

const ALGOD_TOKEN = '';
const ALGOD_SERVER = 'https://testnet-api.algonode.cloud';
const ALGOD_PORT = '';
const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_SERVER, ALGOD_PORT);

const DEGEN_TOKEN_CONFIG = {
  total: 1000000000,
  decimals: 6,
  defaultFrozen: false,
  unitName: 'DEGEN',
  assetName: 'DengenLeague Token',
  url: 'https://dengenleague.com/token',
}

export async function POST(request: Request) {
  try {
    const { creatorMnemonic } = await request.json()
    const mnemonicToUse = creatorMnemonic?.trim() || process.env.CREATOR_MNEMONIC

    if (!mnemonicToUse) {
      return NextResponse.json(
        { success: false, error: 'Creator mnemonic not found in request or environment' },
        { status: 400 }
      )
    }

    const creatorAccount = algosdk.mnemonicToSecretKey(mnemonicToUse)
    const creatorAddress = creatorAccount.addr

    const accountInfo = await algodClient.accountInformation(creatorAddress).do()

    // FIX: Convert BigInt to Number for comparison and calculations.
    const balanceAlgo = Number(accountInfo.amount) / 1e6

    if (Number(accountInfo.amount) < 100000) {
      return NextResponse.json(
        { success: false, error: `Insufficient balance. Account has ${balanceAlgo} ALGO, need at least 0.1 ALGO` },
        { status: 400 }
      )
    }

    const suggestedParams = await algodClient.getTransactionParams().do();
    suggestedParams.fee = 1000;
    suggestedParams.flatFee = true;
    
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: creatorAddress,
      total: DEGEN_TOKEN_CONFIG.total,
      decimals: DEGEN_TOKEN_CONFIG.decimals,
      defaultFrozen: DEGEN_TOKEN_CONFIG.defaultFrozen,
      unitName: DEGEN_TOKEN_CONFIG.unitName,
      assetName: DEGEN_TOKEN_CONFIG.assetName,
      assetURL: DEGEN_TOKEN_CONFIG.url,
      manager: creatorAddress,
      reserve: creatorAddress,
      freeze: creatorAddress,
      clawback: creatorAddress,
      suggestedParams,
    });

    const signedTxn = txn.signTxn(creatorAccount.sk)
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do()

    const result = await algosdk.waitForConfirmation(algodClient, txId, 4)
    const assetId = result['asset-index']

    return NextResponse.json({
      success: true,
      data: {
        assetId,
        txId,
        config: DEGEN_TOKEN_CONFIG,
        creatorAddress: creatorAddress,
        explorerUrl: `https://testnet.algoexplorer.io/asset/${assetId}`
      }
    })
  } catch (error) {
    console.error('Token deployment error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to deploy token' },
      { status: 500 }
    )
  }
}