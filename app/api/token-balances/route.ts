import { NextResponse } from 'next/server'
import algosdk from 'algosdk'

const algodClient = new algosdk.Algodv2('', 'https://mainnet-api.algonode.cloud', '')

// Known token IDs (you'll need to update these with actual ASA IDs)
const TOKEN_IDS = {
  DEGEN: 123456789, // Replace with actual DEGEN ASA ID
  WAM: 987654321,   // Replace with actual WAM ASA ID
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    
    if (!address) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
    }
    
    // Get account info
    const accountInfo = await algodClient.accountInformation(address).do()
    
    const balances: Record<string, string> = {
      ALGO: (accountInfo.amount / 1000000).toFixed(6) // Convert microAlgos to Algos
    }
    
    // Get ASA balances
    if (accountInfo.assets) {
      for (const asset of accountInfo.assets) {
        if (asset['asset-id'] === TOKEN_IDS.DEGEN) {
          balances.DEGEN = (asset.amount / Math.pow(10, 6)).toFixed(6) // Assuming 6 decimals
        }
        if (asset['asset-id'] === TOKEN_IDS.WAM) {
          balances.WAM = (asset.amount / Math.pow(10, 6)).toFixed(6) // Assuming 6 decimals
        }
      }
    }
    
    // Set default values if tokens not found
    if (!balances.DEGEN) balances.DEGEN = '0.000000'
    if (!balances.WAM) balances.WAM = '0.000000'
    
    return NextResponse.json({ balances })
    
  } catch (error) {
    console.error('Token balance error:', error)
    // Return mock data on error for development
    return NextResponse.json({ 
      balances: {
        ALGO: '0.000000',
        DEGEN: '0.000000', 
        WAM: '0.000000'
      }
    })
  }
}