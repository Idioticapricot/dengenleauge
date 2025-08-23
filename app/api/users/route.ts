import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, username } = await request.json()
    
    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { walletAddress }
    })

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          walletAddress,
          username: username || `User_${walletAddress.slice(-6)}`
        }
      })

      // Create empty team for new user
      await prisma.team.create({
        data: {
          userId: user.id
        }
      })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error creating/fetching user:', error)
    return NextResponse.json({ error: 'Failed to process user' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')
    
    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress },
      include: {
        ranking: true,
        _count: {
          select: { beasts: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}