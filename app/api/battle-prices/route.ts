import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { symbols } = await request.json()
    
    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json({ error: 'Invalid symbols array' }, { status: 400 })
    }
    
    const apiKey = process.env.CMC_API_KEY || 'ab2105f9-5414-4f94-82a9-356e7ced0cb2'
    const symbolList = symbols.join(',')
    
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
    
    const prices: { [key: string]: number } = {}
    Object.keys(data.data).forEach(symbol => {
      const coinData = data.data[symbol][0]
      prices[symbol] = coinData.quote.USD.price
    })
    
    return NextResponse.json({ 
      prices, 
      timestamp: new Date().toISOString(),
      success: true 
    })
    
  } catch (error) {
    console.error('Battle prices API error:', error)
    
    // Return mock price changes for fallback
    const { symbols } = await request.json()
    const mockPrices: { [key: string]: number } = {}
    
    symbols.forEach((symbol: string) => {
      // Simulate small price movements
      const basePrice = symbol === 'DOGE' ? 0.2113 : 
                       symbol === 'SHIB' ? 0.00001219 : 
                       symbol === 'PEPE' ? 0.00000994 : 0.1
      
      const change = (Math.random() - 0.5) * 0.02 // ±1% change
      mockPrices[symbol] = basePrice * (1 + change)
    })
    
    return NextResponse.json({ 
      prices: mockPrices, 
      timestamp: new Date().toISOString(),
      success: true,
      fallback: true 
    })
  }
}