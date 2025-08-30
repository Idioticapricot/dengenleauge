import { NextResponse } from 'next/server'
const { createAtomicSwap, submitAtomicSwap } = require('../../../lib/atomic-swap')

export async function POST(request: Request) {
  try {
    const { buyerAddress, algoAmount } = await request.json()

    const result = await createAtomicSwap(buyerAddress, algoAmount)
    
    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { signedUserTransaction, signedCreatorTransaction } = await request.json()

    if (!signedUserTransaction || !signedCreatorTransaction) {
      return NextResponse.json({ 
        success: false, 
        error: 'Both signed transactions required' 
      }, { status: 400 })
    }

    const result = await submitAtomicSwap(signedUserTransaction, signedCreatorTransaction)
    
    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}