import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { username } = await request.json()
    
    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 })
    }
    
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { username },
      include: {
        favorites: true,
        presets: true
      }
    })
    
    if (!user) {
      user = await prisma.user.create({
        data: { username },
        include: {
          favorites: true,
          presets: true
        }
      })
    }
    
    return NextResponse.json({ user })
    
  } catch (error) {
    console.error('User API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const address = searchParams.get('address')
    
    if (!userId && !address) {
      return NextResponse.json({ error: 'User ID or wallet address required' }, { status: 400 })
    }
    
    const whereClause = userId ? { id: userId } : { walletAddress: address }
    
    let user = await prisma.user.findUnique({
      where: whereClause,
      include: {
        favorites: true,
        presets: true,
        multiplayerPlayer1: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            player2: true,
            winner: true
          }
        },
        multiplayerPlayer2: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            player1: true,
            winner: true
          }
        }
      }
    })
    
    // Create user if doesn't exist and we have wallet address
    if (!user && address) {
      user = await prisma.user.create({
        data: { 
          username: `Player_${address.slice(-6)}`,
          walletAddress: address 
        },
        include: {
          favorites: true,
          presets: true,
          multiplayerPlayer1: true,
          multiplayerPlayer2: true
        }
      })
    }
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Combine battle history
    const allBattles = [...(user.multiplayerPlayer1 || []), ...(user.multiplayerPlayer2 || [])]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
    
    return NextResponse.json({ user: { ...user, battleHistory: allBattles } })
    
  } catch (error) {
    console.error('User GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}