import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  
  try {
    const response = await fetch("https://api.vestigelabs.org/assets/list?network_id=0&exclude_labels=8,7&denominating_asset_id=31566704&limit=50&offset=0&order_by=rank&order_dir=asc", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.5",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "sec-ch-ua": '"Not;A=Brand";v="99", "Brave";v="139", "Chromium";v="139"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "sec-gpc": "1",
        "Referer": "https://vestige.fi/"
      },
      "method": "GET"
    })
    
    if (!response.ok) {
      throw new Error(`Vestige API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Skip first item and filter by search if provided
    let filteredResults = data.results.slice(1)
    
    if (search) {
      filteredResults = filteredResults.filter((coin: any) => 
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.ticker.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    const coins = filteredResults.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      ticker: coin.ticker,
      price: coin.price,
      market_cap: coin.market_cap,
      rank: coin.rank,
      percent_change_1h: ((coin.price - coin.price1h) / coin.price1h * 100),
      percent_change_24h: ((coin.price - coin.price1d) / coin.price1d * 100),
      image: coin.image,
      last_updated: new Date().toISOString()
    }))
    
    return NextResponse.json({ coins, timestamp: new Date().toISOString() })
    
  } catch (error) {
    console.error('Vestige API Error:', error)
    let mockCoins = [
      { id: 31566704, name: 'USDC', ticker: 'USDC', price: 1.0001, market_cap: 1000000000, rank: 2, percent_change_1h: 0.01, percent_change_24h: 0.02, image: 'https://asa-list.tinyman.org/assets/31566704/icon.png' },
      { id: 386192725, name: 'goBTC', ticker: 'goBTC', price: 95000, market_cap: 500000000, rank: 3, percent_change_1h: 0.5, percent_change_24h: -2.1, image: 'https://asa-list.tinyman.org/assets/386192725/icon.png' },
      { id: 386195940, name: 'goETH', ticker: 'goETH', price: 3500, market_cap: 300000000, rank: 4, percent_change_1h: -1.2, percent_change_24h: -4.5, image: 'https://asa-list.tinyman.org/assets/386195940/icon.png' },
      { id: 27165954, name: 'PLANET', ticker: 'PLANETS', price: 0.000025, market_cap: 180000000, rank: 5, percent_change_1h: 0.8, percent_change_24h: -1.9, image: 'https://asa-list.tinyman.org/assets/27165954/icon.png' },
      { id: 163650, name: 'Asia Reserve Currency Coin', ticker: 'ARCC', price: 0.45, market_cap: 150000000, rank: 6, percent_change_1h: 0.3, percent_change_24h: 1.2, image: 'https://asa-list.tinyman.org/assets/163650/icon.png' }
    ]
    
    if (search) {
      mockCoins = mockCoins.filter(coin => 
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.ticker.toLowerCase().includes(search.toLowerCase())
      )
    }
    return NextResponse.json({ coins: mockCoins, error: 'Using fallback data' })
  }
}