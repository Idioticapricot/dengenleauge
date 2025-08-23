import { NextRequest, NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'
import { prisma } from '@/lib/prisma'

const BASE_PROMPT = "Create a high-detail pixel art dragon with no background. Render a perfect, symmetric side view of the entire dragon, showcasing its elongated body, detailed scales, and vibrant colors in crisp pixel style. The image should capture the dragon in full profile with clean lines and a balanced composition, emphasizing its majestic form without any additional elements."

fal.config({
  credentials: process.env.FAL_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { description, tier, stats, userId, name, elementType, rarity } = await request.json()

    if (!description || !tier || !stats || !userId || !name || !elementType || !rarity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate image with fal.ai
    const enhancedPrompt = `${BASE_PROMPT} ${description}`
    const result = await fal.subscribe("fal-ai/flux-1/schnell", {
      input: {
        prompt: enhancedPrompt
      }
    })

    // Get random abilities based on rarity
    const abilities = await prisma.ability.findMany({
      where: {
        rarity: rarity === 'legendary' ? 'LEGENDARY' : rarity === 'rare' ? 'RARE' : 'COMMON'
      },
      take: rarity === 'legendary' ? 3 : rarity === 'rare' ? 2 : 1
    })

    // Create beast in database
    const beast = await prisma.beast.create({
      data: {
        ownerId: userId,
        name,
        tier: tier.toUpperCase(),
        elementType: elementType.toUpperCase(),
        rarity: rarity.toUpperCase(),
        health: stats.health,
        stamina: stats.stamina,
        power: stats.power,
        description,
        aiPrompt: enhancedPrompt,
        nftMetadataUri: result.data.images[0].url, // Temporary - should be IPFS URI
        abilities: abilities.map(a => a.id)
      }
    })

    // Assign basic moves based on element and level
    const basicMoves = await prisma.move.findMany({
      where: {
        elementType: elementType.toUpperCase(),
        tier: 'BASIC',
        minLevel: { lte: 5 }
      },
      take: 2
    })

    // Create beast moves
    for (let i = 0; i < basicMoves.length; i++) {
      await prisma.beastMove.create({
        data: {
          beastId: beast.id,
          moveId: basicMoves[i].id,
          slotIndex: i
        }
      })
    }

    return NextResponse.json({ 
      beast,
      imageUrl: result.data.images[0].url,
      abilities
    })
  } catch (error) {
    console.error('Beast creation error:', error)
    return NextResponse.json({ error: 'Failed to create beast' }, { status: 500 })
  }
}