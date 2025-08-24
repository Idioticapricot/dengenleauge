// API endpoints for real PvP functionality

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const api = {
  // Player discovery
  getOnlinePlayers: async (): Promise<string[]> => {
    const response = await fetch(`${API_BASE}/api/players/online`)
    if (!response.ok) throw new Error('Failed to fetch online players')
    return response.json()
  },

  // Beast management
  getUserBeasts: async (address: string) => {
    const response = await fetch(`${API_BASE}/api/beasts/user/${address}`)
    if (!response.ok) throw new Error('Failed to fetch user beasts')
    return response.json()
  },

  // Battle management
  createBattle: async (battleData: any) => {
    const response = await fetch(`${API_BASE}/api/battles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(battleData)
    })
    if (!response.ok) throw new Error('Failed to create battle')
    return response.json()
  },

  getBattle: async (roomCode: string) => {
    const response = await fetch(`${API_BASE}/api/battles/room/${roomCode}`)
    if (!response.ok) throw new Error('Failed to fetch battle')
    return response.json()
  },

  joinBattle: async (roomCode: string, playerData: any) => {
    const response = await fetch(`${API_BASE}/api/battles/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomCode, ...playerData })
    })
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Room not found')
      }
      throw new Error('Failed to join battle')
    }
    return response.json()
  },

  performAction: async (battleId: string, action: any) => {
    const response = await fetch(`${API_BASE}/api/battles/${battleId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action)
    })
    if (!response.ok) throw new Error('Failed to perform action')
    return response.json()
  },

  sendChallenge: async (roomCode: string, targetPlayer: string) => {
    const response = await fetch(`${API_BASE}/api/battles/challenge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomCode, targetPlayer })
    })
    if (!response.ok) throw new Error('Failed to send challenge')
    return response.json()
  }
}