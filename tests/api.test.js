// Simple API tests
const BASE_URL = 'http://localhost:3000'

async function testAPI(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    }
    
    if (body) {
      options.body = JSON.stringify(body)
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options)
    const data = await response.json()
    
    console.log(`✅ ${method} ${endpoint}:`, response.status, data)
    return { success: response.ok, data, status: response.status }
  } catch (error) {
    console.error(`❌ ${method} ${endpoint}:`, error.message)
    return { success: false, error: error.message }
  }
}

async function runTests() {
  console.log('🧪 Starting API Tests...\n')
  
  // Test 1: Create User
  console.log('1. Testing User Creation')
  await testAPI('/api/users', 'POST', {
    walletAddress: '0x1234567890abcdef',
    username: 'TestUser'
  })
  
  // Test 2: Get User
  console.log('\n2. Testing User Fetch')
  await testAPI('/api/users?walletAddress=0x1234567890abcdef')
  
  // Test 3: Get Moves
  console.log('\n3. Testing Moves Fetch')
  await testAPI('/api/moves?elementType=fire&tier=basic')
  
  // Test 4: Get Marketplace
  console.log('\n4. Testing Marketplace')
  await testAPI('/api/marketplace')
  
  // Test 5: Get Leaderboard
  console.log('\n5. Testing Leaderboard')
  await testAPI('/api/leaderboard')
  
  // Test 6: Get Beasts (will fail without valid user)
  console.log('\n6. Testing Beasts Fetch')
  await testAPI('/api/beasts?userId=invalid-id')
  
  console.log('\n🏁 Tests Complete!')
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runTests()
}

module.exports = { testAPI, runTests }