// Test beast creation with all required fields
const BASE_URL = 'http://localhost:3000'

async function testBeastCreation() {
  console.log('🐲 Testing Beast Creation...\n')
  
  // First create a user
  const walletAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8e1'
  console.log('1. Creating user...')
  
  const userResponse = await fetch(`${BASE_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      walletAddress,
      username: `User_${walletAddress.slice(-6)}`
    })
  })
  
  if (!userResponse.ok) {
    console.error('❌ Failed to create user')
    return
  }
  
  const user = await userResponse.json()
  console.log(`✅ User created: ${user.username} (${user.id})`)
  
  // Test beast creation
  console.log('\n2. Creating beast...')
  
  const beastData = {
    userId: user.id,
    name: 'Test Fire Dragon',
    description: 'A fierce dragon with blazing flames',
    tier: 'basic',
    elementType: 'fire',
    rarity: 'common',
    stats: {
      health: 10,
      stamina: 8,
      power: 12
    }
  }
  
  const createResponse = await fetch(`${BASE_URL}/api/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(beastData)
  })
  
  if (createResponse.ok) {
    const result = await createResponse.json()
    console.log('✅ Beast created successfully!')
    console.log(`   Name: ${result.beast.name}`)
    console.log(`   Level: ${result.beast.level}`)
    console.log(`   Element: ${result.beast.elementType}`)
    console.log(`   Health: ${result.beast.health}`)
    console.log(`   Image URL: ${result.imageUrl ? 'Generated' : 'None'}`)
    console.log(`   Abilities: ${result.abilities.length} assigned`)
    
    // Test fetching the beast
    console.log('\n3. Fetching user beasts...')
    const beastsResponse = await fetch(`${BASE_URL}/api/beasts?userId=${user.id}`)
    if (beastsResponse.ok) {
      const beasts = await beastsResponse.json()
      console.log(`✅ Beasts fetched: ${beasts.length} beast(s) found`)
      if (beasts.length > 0) {
        console.log(`   First beast: ${beasts[0].name} (Level ${beasts[0].level})`)
      }
    }
  } else {
    const error = await createResponse.json()
    console.error('❌ Beast creation failed:', error)
  }
  
  console.log('\n🏁 Beast Creation Test Complete!')
}

// Run test
if (typeof window === 'undefined') {
  testBeastCreation()
}

module.exports = { testBeastCreation }