import { NextResponse } from 'next/server'
import { getAggregatedPrice } from '../../../lib/price-feeds'
import { rateLimiter } from '../../../lib/cache'

export async function POST(request: Request) {
  try {
    const { symbols } = await request.json()

    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json({ error: 'Invalid symbols array' }, { status: 400 })
    }

    // Rate limiting
    const clientId = request.headers.get('x-client-id') || 'default'
    if (!rateLimiter.isAllowed(`battle-prices-${clientId}`, 20, 60000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const prices: { [key: string]: number } = {}

    // Use the aggregated price feeds instead of direct CMC API
    for (const symbol of symbols) {
      try {
        const price = await getAggregatedPrice(symbol)
        if (price > 0) {
          prices[symbol] = price
        } else {
          throw new Error(`Invalid price received for ${symbol}`)
        }
      } catch (error) {
        console.error(`Error fetching price for ${symbol}:`, error)
        throw new Error(`Failed to fetch real-time price for ${symbol}`)
      }
    }

    return NextResponse.json({
      prices,
      timestamp: new Date().toISOString(),
      success: true
    })

  } catch (error) {
    console.error('Battle prices API error:', error)

    // Return error response without mock data
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString(),
      success: false
    }, { status: 500 })
  }
}