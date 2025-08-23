// Test wallet integration with user creation
const BASE_URL = 'http://localhost:3000'

async function testWalletIntegration() {
  console.log('🔗 Testing Wallet Integration...\n')
  
  // Test wallet addresses
  const testWallets = [
    '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8e1',
    '0x8ba1f109551bD432803012645Hac136c5c8b4d8e2',
    '0x9cb2f209551bD432803012645Hac136c5c8b4d8e3'
  ]
  
  for (const walletAddress of testWallets) {
    console.log(`\n👛 Testing wallet: ${walletAddress}`)
    
    // Test user creation/fetch
    const userResponse = await fetch(`${BASE_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        walletAddress,
        username: `User_${walletAddress.slice(-6)}`
      })
    })
    
    if (userResponse.ok) {
      const user = await userResponse.json()
      console.log(`✅ User created/found: ${user.username} (${user.id})`)
      
      // Test fetching beasts for this user
      const beastsResponse = await fetch(`${BASE_URL}/api/beasts?userId=${user.id}`)
      if (beastsResponse.ok) {
        const beasts = await beastsResponse.json()
        console.log(`✅ Beasts fetched: ${beasts.length} beasts found`)
      } else {
        console.log(`❌ Failed to fetch beasts: ${beastsResponse.status}`)
      }
      
      // Test team creation
      const teamResponse = await fetch(`${BASE_URL}/api/teams?userId=${user.id}`)
      if (teamResponse.ok) {
        const team = await teamResponse.json()
        console.log(`✅ Team found: ${team ? 'Team exists' : 'No team'}`)
      } else {
        console.log(`❌ Failed to fetch team: ${teamResponse.status}`)
      }
    } else {
      console.log(`❌ Failed to create user: ${userResponse.status}`)
    }
  }
  
  console.log('\n🏁 Wallet Integration Test Complete!')
}

// Run test
if (typeof window === 'undefined') {
  testWalletIntegration()
}

module.exports = { testWalletIntegration }