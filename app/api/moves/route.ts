import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const elementType = searchParams.get('elementType')
    const tier = searchParams.get('tier')
    const minLevel = searchParams.get('minLevel')

    const where: any = {}
    
    if (elementType) {
      where.elementType = elementType.toUpperCase()
    }
    
    if (tier) {
      where.tier = tier.toUpperCase()
    }
    
    if (minLevel) {
      where.minLevel = { lte: parseInt(minLevel) }
    }

    const moves = await prisma.move.findMany({
      where,
      orderBy: { minLevel: 'asc' }
    })

    return NextResponse.json(moves)
  } catch (error) {
    console.error('Error fetching moves:', error)
    return NextResponse.json({ error: 'Failed to fetch moves' }, { status: 500 })
  }
}