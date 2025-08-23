import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const rankings = await prisma.userRanking.findMany({
      include: {
        user: {
          select: {
            username: true,
            walletAddress: true,
            totalBattles: true,
            wins: true,
            losses: true
          }
        }
      },
      orderBy: { rankPoints: 'desc' },
      take: 100
    })

    // Calculate current ranks
    const leaderboard = rankings.map((ranking, index) => ({
      ...ranking,
      currentRank: index + 1
    }))

    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}