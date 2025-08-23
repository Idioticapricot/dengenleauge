// Fixed API tests with proper UUID handling
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

async function runFixedTests() {
  console.log('🧪 Starting Fixed API Tests...\n')
  
  // Test 1: Create User and get valid UUID
  console.log('1. Testing User Creation')
  const userResult = await testAPI('/api/users', 'POST', {
    walletAddress: '0x1234567890abcdef',
    username: 'TestUser'
  })
  
  const userId = userResult.data?.id
  
  if (userId) {
    // Test 2: Get Beasts with valid UUID
    console.log('\n2. Testing Beasts Fetch with valid UUID')
    await testAPI(`/api/beasts?userId=${userId}`)
    
    // Test 3: Get Teams with valid UUID
    console.log('\n3. Testing Teams Fetch')
    await testAPI(`/api/teams?userId=${userId}`)
  }
  
  // Test 4: Test invalid UUID handling
  console.log('\n4. Testing Invalid UUID Handling')
  await testAPI('/api/beasts?userId=invalid-id')
  
  // Test 5: Get Moves
  console.log('\n5. Testing Moves Fetch')
  await testAPI('/api/moves?elementType=fire&tier=basic')
  
  console.log('\n🏁 Fixed Tests Complete!')
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runFixedTests()
}

module.exports = { testAPI, runFixedTests }