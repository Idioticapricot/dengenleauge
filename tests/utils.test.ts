import { describe, it, expect } from '@jest/globals'

// Mock utility functions to test
const calculateTeamScore = (team: any[]) => {
  if (!team || team.length === 0) return 0
  return team.reduce((total, coin) => {
    if (!coin.initialPrice || !coin.currentPrice) return total
    const change = ((coin.currentPrice - coin.initialPrice) / coin.initialPrice) * 100
    return total + change
  }, 0) / team.length
}

const formatWalletAddress = (address: string) => {
  if (!address) return 'No Address'
  return `${address.slice(0, 8)}...${address.slice(-8)}`
}

const validateTeam = (team: any[]) => {
  return team.length === 3 && team.every(coin => coin && coin.id && coin.ticker)
}

describe('Utility Functions', () => {
  describe('calculateTeamScore', () => {
    it('should return 0 for empty team', () => {
      expect(calculateTeamScore([])).toBe(0)
    })

    it('should calculate correct average score', () => {
      const team = [
        { initialPrice: 100, currentPrice: 110 }, // +10%
        { initialPrice: 50, currentPrice: 45 },   // -10%
        { initialPrice: 200, currentPrice: 200 }  // 0%
      ]
      expect(calculateTeamScore(team)).toBe(0) // (10 - 10 + 0) / 3 = 0
    })

    it('should handle missing price data', () => {
      const team = [
        { initialPrice: 100, currentPrice: null },
        { initialPrice: null, currentPrice: 110 }
      ]
      expect(calculateTeamScore(team)).toBe(0)
    })
  })

  describe('formatWalletAddress', () => {
    it('should format valid address correctly', () => {
      const address = 'CAKAMXJBMMNPGU3VCMK7PIJQQ2O7AMVQM24QSFWYHZ2PP5YAPYHSZT2NGI'
      expect(formatWalletAddress(address)).toBe('CAKAMXJB...SZT2NGI')
    })

    it('should handle empty address', () => {
      expect(formatWalletAddress('')).toBe('No Address')
    })
  })

  describe('validateTeam', () => {
    it('should validate correct team', () => {
      const team = [
        { id: 1, ticker: 'DOGE' },
        { id: 2, ticker: 'SHIB' },
        { id: 3, ticker: 'PEPE' }
      ]
      expect(validateTeam(team)).toBe(true)
    })

    it('should reject incomplete team', () => {
      const team = [
        { id: 1, ticker: 'DOGE' },
        { id: 2, ticker: 'SHIB' }
      ]
      expect(validateTeam(team)).toBe(false)
    })

    it('should reject team with invalid coins', () => {
      const team = [
        { id: 1, ticker: 'DOGE' },
        { id: null, ticker: 'SHIB' },
        { id: 3, ticker: null }
      ]
      expect(validateTeam(team)).toBe(false)
    })
  })
})