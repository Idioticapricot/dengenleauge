// Database connection and seeding tests
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testDatabaseConnection() {
  try {
    console.log('🔌 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    return false
  }
}

async function testSeededData() {
  try {
    console.log('\n📊 Testing seeded data...')
    
    // Test moves
    const moves = await prisma.move.count()
    console.log(`✅ Moves in database: ${moves}`)
    
    // Test abilities
    const abilities = await prisma.ability.count()
    console.log(`✅ Abilities in database: ${abilities}`)
    
    // Test specific move
    const fireMove = await prisma.move.findFirst({
      where: { elementType: 'FIRE', tier: 'BASIC' }
    })
    console.log(`✅ Sample fire move:`, fireMove?.name)
    
    return { moves, abilities, sampleMove: fireMove?.name }
  } catch (error) {
    console.error('❌ Seeded data test failed:', error.message)
    return null
  }
}

async function testUserCreation() {
  try {
    console.log('\n👤 Testing user creation...')
    
    const testWallet = '0xtest123456789'
    
    // Clean up existing test user
    await prisma.user.deleteMany({
      where: { walletAddress: testWallet }
    })
    
    // Create test user
    const user = await prisma.user.create({
      data: {
        walletAddress: testWallet,
        username: 'TestUser'
      }
    })
    
    console.log(`✅ User created:`, user.username, user.walletAddress)
    
    // Create team for user
    const team = await prisma.team.create({
      data: {
        userId: user.id
      }
    })
    
    console.log(`✅ Team created for user`)
    
    // Clean up
    await prisma.team.delete({ where: { id: team.id } })
    await prisma.user.delete({ where: { id: user.id } })
    
    return true
  } catch (error) {
    console.error('❌ User creation test failed:', error.message)
    return false
  }
}

async function runDatabaseTests() {
  console.log('🧪 Starting Database Tests...\n')
  
  const connected = await testDatabaseConnection()
  if (!connected) return
  
  await testSeededData()
  await testUserCreation()
  
  console.log('\n🏁 Database Tests Complete!')
  
  await prisma.$disconnect()
}

// Run tests if this file is executed directly
if (require.main === module) {
  runDatabaseTests()
}

module.exports = { testDatabaseConnection, testSeededData, testUserCreation }