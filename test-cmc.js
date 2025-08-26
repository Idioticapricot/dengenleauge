// Test CoinMarketCap sandbox API for price changes
let previousPrices = {}
let callCount = 0

async function testCMC() {
  try {
    const response = await fetch('https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=5&convert=USD', {
      headers: {
        'X-CMC_PRO_API_KEY': 'ab2105f9-5414-4f94-82a9-356e7ced0cb2',
        'Accept': 'application/json'
      }
    })
    const data = await response.json()
    
    callCount++
    console.log(`\n=== CMC API Call ${callCount} at ${new Date().toLocaleTimeString()} ===`)
    
    let changedCoins = 0
    
    data.data.forEach(coin => {
      const currentPrice = coin.quote.USD.price
      const previousPrice = previousPrices[coin.id]
      
      if (previousPrice && currentPrice !== previousPrice) {
        const change = ((currentPrice - previousPrice) / previousPrice * 100).toFixed(6)
        const status = change > 0 ? '📈 UP' : '📉 DOWN'
        console.log(`${coin.name}: $${currentPrice.toFixed(8)} (${change}%) ${status}`)
        changedCoins++
      } else if (previousPrice) {
        console.log(`${coin.name}: $${currentPrice.toFixed(8)} (0.000000%) 🔄 SAME`)
      } else {
        console.log(`${coin.name}: $${currentPrice.toFixed(8)} (INITIAL)`)
      }
      
      previousPrices[coin.id] = currentPrice
    })
    
    if (changedCoins > 0) {
      console.log(`✨ ${changedCoins} coins changed!`)
    }
    
  } catch (error) {
    console.error('CMC API Error:', error.message)
  }
}

console.log('🧪 Testing CoinMarketCap sandbox API...')
testCMC()

const interval = setInterval(testCMC, 2000)

setTimeout(() => {
  clearInterval(interval)
  console.log('\n✅ CMC Test completed!')
}, 20000)