import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { beastId, newStats } = await request.json()
    
    if (!beastId || !newStats) {
      return NextResponse.json({ error: 'Beast ID and new stats required' }, { status: 400 })
    }

    const beast = await prisma.beast.findUnique({
      where: { id: beastId }
    })

    if (!beast) {
      return NextResponse.json({ error: 'Beast not found' }, { status: 404 })
    }

    const updatedBeast = await prisma.beast.update({
      where: { id: beastId },
      data: {
        level: beast.level + 1,
        health: newStats.health,
        stamina: newStats.stamina,
        power: newStats.power,
        currentExp: 0,
        requiredExp: 100
      }
    })

    const shouldLearnMove = updatedBeast.level % 5 === 0

    return NextResponse.json({ 
      beast: updatedBeast,
      shouldLearnMove
    })
  } catch (error) {
    console.error('Error leveling up beast:', error)
    return NextResponse.json({ error: 'Failed to level up beast' }, { status: 500 })
  }
}