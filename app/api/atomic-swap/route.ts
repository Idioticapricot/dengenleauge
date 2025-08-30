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
    const { signedUserTransaction, signedCreatorTransaction, buyerAddress, degenAmount } = await request.json()

    if (!signedUserTransaction || !signedCreatorTransaction) {
      return NextResponse.json({
        success: false,
        error: 'Both signed transactions required'
      }, { status: 400 })
    }

    const result = await submitAtomicSwap(signedUserTransaction, signedCreatorTransaction)

    if (result.success && buyerAddress && degenAmount) {
      // Update user's DEGEN balance after successful swap
      try {
        const balanceResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/user-degen-balance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress: buyerAddress,
            amount: degenAmount,
            action: 'add'
          })
        })

        const balanceData = await balanceResponse.json()
        if (!balanceData.success) {
          console.error('Failed to update DEGEN balance:', balanceData.error)
        }
      } catch (balanceError) {
        console.error('Error updating DEGEN balance:', balanceError)
        // Don't fail the swap if balance update fails
      }

      return NextResponse.json({
        ...result,
        message: 'Swap successful! DEGEN tokens added to your account.'
      })
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