interface PriceFeed {
  name: string
  fetchPrice: (symbol: string) => Promise<number>
  weight: number
}

const priceFeeds: PriceFeed[] = [
  {
    name: 'coingecko',
    fetchPrice: async (symbol: string) => {
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`)
      const data = await response.json()
      return data[symbol]?.usd || 0
    },
    weight: 0.4
  },
  {
    name: 'coinmarketcap',
    fetchPrice: async (symbol: string) => {
      // Mock implementation - replace with actual CMC API
      return Math.random() * 0.1
    },
    weight: 0.3
  },
  {
    name: 'dexscreener',
    fetchPrice: async (symbol: string) => {
      // Mock implementation - replace with actual DEX API
      return Math.random() * 0.1
    },
    weight: 0.3
  }
]

export async function getAggregatedPrice(symbol: string): Promise<number> {
  const prices = await Promise.allSettled(
    priceFeeds.map(feed => feed.fetchPrice(symbol))
  )
  
  let totalWeight = 0
  let weightedSum = 0
  
  prices.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value > 0) {
      const feed = priceFeeds[index]
      weightedSum += result.value * feed.weight
      totalWeight += feed.weight
    }
  })
  
  return totalWeight > 0 ? weightedSum / totalWeight : 0
}

export function simulatePriceMovement(basePrice: number, volatility: number = 0.05): number {
  const change = (Math.random() - 0.5) * 2 * volatility
  return basePrice * (1 + change)
}

export function calculateMarketSentiment(priceHistory: number[]): 'bullish' | 'bearish' | 'neutral' {
  if (priceHistory.length < 3) return 'neutral'
  
  const recent = priceHistory.slice(-3)
  const trend = recent[2] - recent[0]
  
  if (trend > 0.02) return 'bullish'
  if (trend < -0.02) return 'bearish'
  return 'neutral'
}