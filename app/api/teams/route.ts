import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const team = await prisma.team.findUnique({
      where: { userId },
      include: {
        beast1: {
          include: {
            moves: {
              include: { move: true }
            }
          }
        },
        beast2: {
          include: {
            moves: {
              include: { move: true }
            }
          }
        },
        beast3: {
          include: {
            moves: {
              include: { move: true }
            }
          }
        }
      }
    })

    return NextResponse.json(team)
  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, beast1Id, beast2Id, beast3Id } = await request.json()
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const team = await prisma.team.upsert({
      where: { userId },
      update: {
        beast1Id: beast1Id || null,
        beast2Id: beast2Id || null,
        beast3Id: beast3Id || null
      },
      create: {
        userId,
        beast1Id: beast1Id || null,
        beast2Id: beast2Id || null,
        beast3Id: beast3Id || null
      }
    })

    return NextResponse.json(team)
  } catch (error) {
    console.error('Error updating team:', error)
    return NextResponse.json({ error: 'Failed to update team' }, { status: 500 })
  }
}