import { NextResponse } from 'next/server'
import algosdk from 'algosdk'
import { createDegenToken, DEGEN_TOKEN_CONFIG } from '../../../../contracts/DegenToken.algo'

const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', '')

export async function POST(request: Request) {
  try {
    const { creatorMnemonic } = await request.json()
    
    if (!creatorMnemonic) {
      return NextResponse.json(
        { success: false, error: 'Creator mnemonic required' },
        { status: 400 }
      )
    }
    
    const creatorAccount = algosdk.mnemonicToSecretKey(creatorMnemonic)
    const assetId = await createDegenToken(algodClient, creatorAccount)
    
    return NextResponse.json({
      success: true,
      data: {
        assetId,
        config: DEGEN_TOKEN_CONFIG,
        creatorAddress: creatorAccount.addr
      }
    })
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to deploy token' },
      { status: 500 }
    )
  }
}