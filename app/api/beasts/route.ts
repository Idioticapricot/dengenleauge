import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const beasts = await prisma.beast.findMany({
      where: { 
        ownerId: userId,
        isForSale: false 
      },
      include: {
        moves: {
          include: {
            move: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(beasts)
  } catch (error) {
    console.error('Error fetching beasts:', error)
    return NextResponse.json({ error: 'Failed to fetch beasts' }, { status: 500 })
  }
}