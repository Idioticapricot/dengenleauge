import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbols = searchParams.get('symbols')
  
  try {
    const apiKey = process.env.CMC_API_KEY || 'ab2105f9-5414-4f94-82a9-356e7ced0cb2'
    const symbolList = symbols || 'DOGE,SHIB,PEPE,FLOKI,BONK,WIF,BABYDOGE,ELON,KISHU,SAFEMOON'
    
    const url = new URL('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest')
    url.searchParams.append('symbol', symbolList)
    url.searchParams.append('convert', 'USD')
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`CMC API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    const coins: any[] = []
    Object.keys(data.data).forEach(symbol => {
      const coinData = data.data[symbol][0] // Take first coin for each symbol
      coins.push({
        id: coinData.id,
        name: coinData.name,
        ticker: coinData.symbol,
        price: coinData.quote.USD.price,
        market_cap: coinData.quote.USD.market_cap,
        rank: coinData.cmc_rank,
        percent_change_1h: coinData.quote.USD.percent_change_1h,
        percent_change_24h: coinData.quote.USD.percent_change_24h,
        last_updated: coinData.last_updated
      })
    })
    
    return NextResponse.json({ coins, timestamp: new Date().toISOString() })
    
  } catch (error) {
    console.error('CMC API Error:', error)
    const mockCoins = [
      { id: 74, name: 'Dogecoin', ticker: 'DOGE', price: 0.2113, market_cap: 31840669923, rank: 9, percent_change_1h: -0.79, percent_change_24h: -3.68 },
      { id: 5994, name: 'Shiba Inu', ticker: 'SHIB', price: 0.00001219, market_cap: 7185614504, rank: 22, percent_change_1h: -0.83, percent_change_24h: -1.80 },
      { id: 24478, name: 'Pepe', ticker: 'PEPE', price: 0.00000994, market_cap: 4180528695, rank: 30, percent_change_1h: -0.24, percent_change_24h: -3.17 },
      { id: 28301, name: 'Floki Inu', ticker: 'FLOKI', price: 0.00015, market_cap: 1500000000, rank: 50, percent_change_1h: 0.5, percent_change_24h: -2.1 },
      { id: 23095, name: 'Bonk', ticker: 'BONK', price: 0.000025, market_cap: 1800000000, rank: 45, percent_change_1h: -1.2, percent_change_24h: -4.5 },
      { id: 26933, name: 'dogwifhat', ticker: 'WIF', price: 2.45, market_cap: 2450000000, rank: 35, percent_change_1h: 0.8, percent_change_24h: -1.9 }
    ]
    return NextResponse.json({ coins: mockCoins, error: 'Using fallback data' })
  }
}