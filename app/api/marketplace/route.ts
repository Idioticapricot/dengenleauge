import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tier = searchParams.get('tier')
    const element = searchParams.get('element')
    const rarity = searchParams.get('rarity')

    const where: any = {
      status: 'ACTIVE'
    }

    if (tier && tier !== 'all') {
      where.beast = { tier: tier.toUpperCase() }
    }
    if (element && element !== 'all') {
      where.beast = { ...where.beast, elementType: element.toUpperCase() }
    }
    if (rarity && rarity !== 'all') {
      where.beast = { ...where.beast, rarity: rarity.toUpperCase() }
    }

    const listings = await prisma.marketplaceListing.findMany({
      where,
      include: {
        beast: {
          include: {
            moves: {
              include: { move: true }
            }
          }
        },
        seller: {
          select: { username: true, walletAddress: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(listings)
  } catch (error) {
    console.error('Error fetching marketplace:', error)
    return NextResponse.json({ error: 'Failed to fetch marketplace' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { beastId, sellerId, price } = await request.json()
    
    if (!beastId || !sellerId || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Update beast status
    await prisma.beast.update({
      where: { id: beastId },
      data: { 
        isForSale: true,
        salePrice: price
      }
    })

    // Create marketplace listing
    const listing = await prisma.marketplaceListing.create({
      data: {
        beastId,
        sellerId,
        price
      }
    })

    return NextResponse.json(listing)
  } catch (error) {
    console.error('Error creating listing:', error)
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 })
  }
}