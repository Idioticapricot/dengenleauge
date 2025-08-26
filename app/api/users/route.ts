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
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        favorites: true,
        presets: true,
        player1Battles: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    return NextResponse.json({ user })
    
  } catch (error) {
    console.error('User GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}