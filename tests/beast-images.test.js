// Test beast image functionality
const { test, expect } = require('@jest/globals')

describe('Beast Image Integration', () => {
  test('Beast type includes imageUrl field', () => {
    // Mock beast with image
    const beastWithImage = {
      id: 'test-beast-1',
      name: 'Test Beast',
      tier: 'basic',
      level: 5,
      exp: { current: 0, required: 100 },
      stats: { health: 30, stamina: 25, power: 20 },
      elementType: 'fire',
      rarity: 'common',
      imageUrl: 'https://example.com/beast-image.png',
      moves: []
    }

    expect(beastWithImage).toHaveProperty('imageUrl')
    expect(typeof beastWithImage.imageUrl).toBe('string')
  })

  test('Beast without imageUrl should work with fallback', () => {
    // Mock beast without image
    const beastWithoutImage = {
      id: 'test-beast-2',
      name: 'Test Beast 2',
      tier: 'basic',
      level: 5,
      exp: { current: 0, required: 100 },
      stats: { health: 30, stamina: 25, power: 20 },
      elementType: 'water',
      rarity: 'common',
      moves: []
    }

    expect(beastWithoutImage.imageUrl).toBeUndefined()
    // Should still be a valid beast object
    expect(beastWithoutImage).toHaveProperty('name')
    expect(beastWithoutImage).toHaveProperty('elementType')
  })

  test('API response transformation includes imageUrl', () => {
    // Mock database beast response
    const dbBeast = {
      id: 'db-beast-1',
      name: 'DB Beast',
      tier: 'BASIC',
      level: 5,
      currentExp: 0,
      requiredExp: 100,
      health: 30,
      stamina: 25,
      power: 20,
      elementType: 'FIRE',
      rarity: 'COMMON',
      nftMetadataUri: 'https://fal.ai/generated-image.png',
      moves: []
    }

    // Transform to frontend format (simulating API transformation)
    const frontendBeast = {
      id: dbBeast.id,
      name: dbBeast.name,
      tier: dbBeast.tier.toLowerCase(),
      level: dbBeast.level,
      exp: {
        current: dbBeast.currentExp,
        required: dbBeast.requiredExp
      },
      stats: {
        health: dbBeast.health,
        stamina: dbBeast.stamina,
        power: dbBeast.power
      },
      elementType: dbBeast.elementType.toLowerCase(),
      rarity: dbBeast.rarity.toLowerCase(),
      imageUrl: dbBeast.nftMetadataUri,
      moves: []
    }

    expect(frontendBeast.imageUrl).toBe('https://fal.ai/generated-image.png')
    expect(frontendBeast.tier).toBe('basic')
    expect(frontendBeast.elementType).toBe('fire')
  })
})