import { NextResponse } from 'next/server'
import { getAggregatedPrice, simulatePriceMovement } from '../../../../lib/price-feeds'
import { getRandomPowerUp, getRandomModifier } from '../../../../lib/powerups'
import { checkAchievements } from '../../../../lib/achievements'

export async function POST(request: Request) {
  try {
    const { symbols, battleId } = await request.json()
    
    const prices: Record<string, number> = {}
    
    for (const symbol of symbols) {
      try {
        const basePrice = await getAggregatedPrice(symbol)
        prices[symbol] = simulatePriceMovement(basePrice, 0.05)
      } catch (error) {
        prices[symbol] = simulatePriceMovement(Math.random() * 0.1, 0.05)
      }
    }
    
    const powerUpChance = Math.random()
    const newPowerUp = powerUpChance < 0.1 ? getRandomPowerUp() : null
    
    const modifierChance = Math.random()
    const newModifier = modifierChance < 0.05 ? getRandomModifier() : null
    
    return NextResponse.json({
      success: true,
      data: {
        prices,
        timestamp: Date.now(),
        powerUp: newPowerUp,
        modifier: newModifier,
        battleId
      }
    })
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch enhanced battle data' },
      { status: 500 }
    )
  }
}