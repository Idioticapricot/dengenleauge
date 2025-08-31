import { NextResponse } from 'next/server'

async function fetchWithRetry(url: string, options: RequestInit, maxRetries: number = 3): Promise<Response> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options)
      if (response.ok) {
        return response
      }
      if (attempt === maxRetries) {
        throw new Error(`API request failed after ${maxRetries} attempts: ${response.status}`)
      }
    } catch (error) {
      if (attempt === maxRetries) {
        throw error
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }
  throw new Error('Unexpected error in fetchWithRetry')
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''

  try {
    const response = await fetchWithRetry(
      "https://api.vestigelabs.org/assets/list?network_id=0&exclude_labels=8,7&denominating_asset_id=31566704&limit=20&offset=0&order_by=rank&order_dir=asc",
      {
        headers: {
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
        method: "GET"
      },
      3
    )

    const data = await response.json()

    if (!data.results || !Array.isArray(data.results)) {
      throw new Error('Invalid API response structure')
    }

    // Skip first item and filter by search if provided
    let filteredResults = data.results.slice(1)

    if (search) {
      filteredResults = filteredResults.filter((coin: any) =>
        coin.name?.toLowerCase().includes(search.toLowerCase()) ||
        coin.ticker?.toLowerCase().includes(search.toLowerCase())
      )
    }

    const coins = filteredResults.map((coin: any) => ({
      id: coin.id,
      name: coin.name || 'Unknown',
      ticker: coin.ticker || 'UNK',
      price: coin.price || 0,
      market_cap: coin.market_cap || 0,
      rank: coin.rank || 0,
      percent_change_1h: coin.price1h ? ((coin.price - coin.price1h) / coin.price1h * 100) : 0,
      percent_change_24h: coin.price1d ? ((coin.price - coin.price1d) / coin.price1d * 100) : 0,
      image: coin.image || '',
      last_updated: new Date().toISOString()
    }))

    return NextResponse.json({
      coins,
      timestamp: new Date().toISOString(),
      source: 'vestige-api'
    })

  } catch (error) {
    console.error('Vestige API Error:', error)

    // Return error response without mock data
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString(),
      source: 'error'
    }, { status: 500 })
  }
}