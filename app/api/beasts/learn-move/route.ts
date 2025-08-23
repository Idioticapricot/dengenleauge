import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { beastId, moveId, slotIndex } = await request.json()
    
    if (!beastId || !moveId || slotIndex === undefined) {
      return NextResponse.json({ error: 'Beast ID, move ID, and slot index required' }, { status: 400 })
    }

    // Remove existing move in slot if any
    await prisma.beastMove.deleteMany({
      where: {
        beastId,
        slotIndex
      }
    })

    // Add new move
    const beastMove = await prisma.beastMove.create({
      data: {
        beastId,
        moveId,
        slotIndex
      },
      include: {
        move: true
      }
    })

    return NextResponse.json(beastMove)
  } catch (error) {
    console.error('Error learning move:', error)
    return NextResponse.json({ error: 'Failed to learn move' }, { status: 500 })
  }
}