import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    
    const battles = await prisma.memeBattle.findMany({
      where: {
        OR: [
          { player1Id: userId },
          { player2Id: userId }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    
    return NextResponse.json({ battles })
  } catch (error) {
    console.error('Battle fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch battles' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, teamData, opponentStrategy, playerScore, opponentScore, result } = await request.json()
    
    if (!userId || !teamData) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 })
    }
    
    let aiUser = await prisma.user.findUnique({ where: { username: 'AI_Bot' } })
    if (!aiUser) {
      aiUser = await prisma.user.create({ data: { username: 'AI_Bot' } })
    }
    
    const playerTeam = await prisma.memeTeam.create({
      data: {
        userId,
        coin1Id: parseInt(teamData.playerTeam[0].id) || 1,
        coin2Id: parseInt(teamData.playerTeam[1].id) || 2,
        coin3Id: parseInt(teamData.playerTeam[2].id) || 3,
        coin1Name: teamData.playerTeam[0].ticker || teamData.playerTeam[0].name,
        coin2Name: teamData.playerTeam[1].ticker || teamData.playerTeam[1].name,
        coin3Name: teamData.playerTeam[2].ticker || teamData.playerTeam[2].name
      }
    })
    
    const aiTeam = await prisma.memeTeam.create({
      data: {
        userId: aiUser.id,
        coin1Id: parseInt(teamData.opponentTeam[0].id) || 4,
        coin2Id: parseInt(teamData.opponentTeam[1].id) || 5,
        coin3Id: parseInt(teamData.opponentTeam[2].id) || 6,
        coin1Name: teamData.opponentTeam[0].ticker || teamData.opponentTeam[0].name,
        coin2Name: teamData.opponentTeam[1].ticker || teamData.opponentTeam[1].name,
        coin3Name: teamData.opponentTeam[2].ticker || teamData.opponentTeam[2].name
      }
    })
    
    const battle = await prisma.memeBattle.create({
      data: {
        player1Id: userId,
        player2Id: aiUser.id,
        player1TeamId: playerTeam.id,
        player2TeamId: aiTeam.id,
        player1Score: playerScore || 0,
        player2Score: opponentScore || 0,
        winnerId: result === 'win' ? userId : result === 'loss' ? aiUser.id : null,
        strategy: opponentStrategy || 'balanced',
        battleData: JSON.stringify(teamData),
        endedAt: new Date()
      }
    })
    
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          totalBattles: user.totalBattles + 1,
          wins: result === 'win' ? user.wins + 1 : user.wins,
          losses: result === 'loss' ? user.losses + 1 : user.losses,
          winStreak: result === 'win' ? user.winStreak + 1 : 0
        }
      })
    }
    
    return NextResponse.json({ battle })
  } catch (error) {
    console.error('Battle creation error:', error)
    return NextResponse.json({ error: 'Failed to create battle' }, { status: 500 })
  }
}