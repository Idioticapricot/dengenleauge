import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Battle room management with Supabase Realtime
export class SupabaseBattleServer {
  private rooms: Map<string, any> = new Map()
  private matchmakingQueue: Map<string, any> = new Map()

  constructor() {
    this.setupRealtimeSubscriptions()
  }

  private setupRealtimeSubscriptions() {
    // Listen for matchmaking events
    supabase
      .channel('matchmaking-updates')
      .on('broadcast', { event: 'join-queue' }, ({ payload }) => {
        this.handleJoinQueue(payload)
      })
      .on('broadcast', { event: 'leave-queue' }, ({ payload }) => {
        this.handleLeaveQueue(payload)
      })
      .on('broadcast', { event: 'ping' }, ({ payload }) => {
        // Respond to ping to confirm connection is alive
        console.log('🏓 Ping received:', payload.timestamp)
      })
      .subscribe()

    // Listen for battle events
    supabase
      .channel('battle-rooms')
      .on('broadcast', { event: 'battle-action' }, ({ payload }) => {
        console.log('Battle action received:', payload)
      })
      .subscribe()
  }

  private async handleJoinQueue(payload: any) {
    console.log('Player joined queue:', payload)

    // Add to matchmaking queue
    this.matchmakingQueue.set(payload.id, {
      ...payload,
      joinedAt: Date.now()
    })

    // Update queue size for all clients
    await this.broadcastQueueUpdate()

    // Try to find a match
    await this.tryMatchmaking()
  }

  private async handleLeaveQueue(payload: any) {
    console.log('Player left queue:', payload)

    // Remove from matchmaking queue
    this.matchmakingQueue.delete(payload.id)

    // Update queue size for all clients
    await this.broadcastQueueUpdate()
  }

  private async broadcastQueueUpdate() {
    const queueSize = this.matchmakingQueue.size

    await supabase
      .channel('matchmaking-updates')
      .send({
        type: 'broadcast',
        event: 'queue-update',
        payload: { queueSize }
      })

    console.log('Broadcasted queue update:', queueSize)
  }

  private async tryMatchmaking() {
    if (this.matchmakingQueue.size < 2) {
      console.log('Not enough players for matchmaking')
      return
    }

    // Get all players in queue
    const players = Array.from(this.matchmakingQueue.values())

    // Find players with same battle type
    const pvpPlayers = players.filter(p => p.battleType === 'pvp')

    if (pvpPlayers.length >= 2) {
      // Create match with first 2 PVP players
      const player1 = pvpPlayers[0]
      const player2 = pvpPlayers[1]

      await this.createMatch(player1, player2)
    }
  }

  private async createMatch(player1: any, player2: any) {
    console.log('Creating match between:', player1.id, 'and', player2.id)
    console.log('Player 1 team:', player1.team)
    console.log('Player 2 team:', player2.team)

    // Remove players from queue
    this.matchmakingQueue.delete(player1.id)
    this.matchmakingQueue.delete(player2.id)

    // Create room ID
    const roomId = `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create battle room in database
    try {
      const player1TeamJson = JSON.stringify(player1.team || [])
      const player2TeamJson = JSON.stringify(player2.team || [])

      console.log('Storing player 1 team JSON:', player1TeamJson)
      console.log('Storing player 2 team JSON:', player2TeamJson)

      const { error } = await supabase
        .from('BattleRoom')
        .insert([{
          id: roomId,
          player1_id: player1.id,
          player2_id: player2.id,
          player1_team: player1TeamJson,
          player2_team: player2TeamJson,
          battle_type: player1.battleType,
          status: 'waiting'
        }])

      if (error) {
        console.error('Error creating battle room:', error)
        // Continue without database persistence for now
      } else {
        console.log('Battle room created successfully in database')
      }
    } catch (dbError) {
      console.error('Database operation failed:', dbError)
      // Continue without database persistence for now
    }

    // Store room data in memory for immediate access
    this.rooms.set(roomId, {
      id: roomId,
      players: [player1, player2],
      battleType: player1.battleType,
      status: 'waiting',
      createdAt: Date.now()
    })

    // Broadcast match found to both players
    await supabase
      .channel('matchmaking-updates')
      .send({
        type: 'broadcast',
        event: 'match-found',
        payload: {
          roomId,
          players: [
            {
              id: player1.id,
              username: player1.username,
              team: player1.team || []
            },
            {
              id: player2.id,
              username: player2.username,
              team: player2.team || []
            }
          ],
          battleType: player1.battleType
        }
      })

    console.log('Match created successfully:', roomId)

    // Start battle after delay
    setTimeout(() => {
      this.startBattle(roomId)
    }, 3000)
  }

  private async startBattle(roomId: string) {
    console.log('Starting battle for room:', roomId)

    const room = this.rooms.get(roomId)
    if (!room) {
      console.error('Room not found:', roomId)
      return
    }

    // Update room status to active
    try {
      const { error } = await supabase
        .from('BattleRoom')
        .update({
          status: 'active',
          started_at: new Date().toISOString()
        })
        .eq('id', roomId)

      if (error) {
        console.error('Error updating battle room status:', error)
      }
    } catch (dbError) {
      console.error('Database operation failed:', dbError)
    }

    // Broadcast battle start to room
    await supabase
      .channel(`battle-${roomId}`)
      .send({
        type: 'broadcast',
        event: 'battle-start',
        payload: {
          roomId,
          timestamp: Date.now(),
          players: room.players
        }
      })

    console.log('Battle started for room:', roomId)

    // Start sending price updates
    this.startPriceUpdates(roomId)
  }

  private async startPriceUpdates(roomId: string) {
    const room = this.rooms.get(roomId)
    if (!room) {
      console.error('Room not found for price updates:', roomId)
      return
    }

    console.log('Starting price updates for room:', roomId)

    const startTime = Date.now()
    const duration = 60000 // 60 seconds
    const updateInterval = 1000 // 1 second updates

    const priceUpdateInterval = setInterval(async () => {
      const elapsed = Date.now() - startTime

      if (elapsed >= duration) {
        clearInterval(priceUpdateInterval)
        await this.endBattle(roomId)
        return
      }

      // Generate mock price data for demonstration
      // In production, this would fetch real price data from an API
      const mockPrices = this.generateMockPrices(room.players)

      // Send price update to battle room
      await supabase
        .channel(`battle-${roomId}`)
        .send({
          type: 'broadcast',
          event: 'price-update',
          payload: {
            timestamp: Date.now(),
            prices: mockPrices,
            timeLeft: Math.max(0, duration - elapsed)
          }
        })

      console.log('Sent price update for room:', roomId, 'at', elapsed, 'ms')

    }, updateInterval)
  }

  private generateMockPrices(players: any[]) {
    const prices: any = {}

    // Generate mock prices for each player's team coins
    players.forEach((player, playerIndex) => {
      if (player.team && player.team.length > 0) {
        player.team.forEach((coin: any) => {
          if (coin.symbol) {
            // Generate realistic price movements
            const basePrice = 1 + Math.random() * 10
            const volatility = 0.1 // 10% volatility
            const change = (Math.random() - 0.5) * volatility
            const currentPrice = basePrice * (1 + change)

            prices[coin.symbol] = parseFloat(currentPrice.toFixed(4))
          }
        })
      }
    })

    // If no team data, generate some default coins
    if (Object.keys(prices).length === 0) {
      const defaultCoins = ['BTC', 'ETH', 'DOGE', 'SHIB', 'PEPE']
      defaultCoins.forEach(coin => {
        const basePrice = 1 + Math.random() * 10
        const volatility = 0.1
        const change = (Math.random() - 0.5) * volatility
        prices[coin] = parseFloat((basePrice * (1 + change)).toFixed(4))
      })
    }

    return prices
  }

  private async endBattle(roomId: string) {
    console.log('Ending battle for room:', roomId)

    const room = this.rooms.get(roomId)
    if (!room) {
      console.error('Room not found for battle end:', roomId)
      return
    }

    // Calculate battle results based on price movements
    const results = this.calculateBattleResults(room)

    // Update room status to finished
    try {
      const { error } = await supabase
        .from('BattleRoom')
        .update({
          status: 'finished',
          ended_at: new Date().toISOString(),
          results: JSON.stringify(results)
        })
        .eq('id', roomId)

      if (error) {
        console.error('Error updating battle room status:', error)
      }
    } catch (dbError) {
      console.error('Database operation failed:', dbError)
    }

    // Determine winner
    let winner = null
    if (results.player1Score > results.player2Score) {
      winner = room.players[0].id
    } else if (results.player2Score > results.player1Score) {
      winner = room.players[1].id
    }

    // Broadcast battle end to room
    await supabase
      .channel(`battle-${roomId}`)
      .send({
        type: 'broadcast',
        event: 'battle-end',
        payload: {
          roomId,
          winner,
          results,
          tie: results.player1Score === results.player2Score
        }
      })

    console.log('Battle ended for room:', roomId, 'Results:', results)
  }

  private calculateBattleResults(room: any) {
    // This is a simplified calculation
    // In a real implementation, you'd track price data throughout the battle
    // and calculate based on actual price movements

    // For now, generate realistic scores based on team performance
    const player1Score = Math.floor(Math.random() * 50) + 25 // 25-75 range
    const player2Score = Math.floor(Math.random() * 50) + 25 // 25-75 range

    return {
      player1Score: parseFloat(player1Score.toFixed(2)),
      player2Score: parseFloat(player2Score.toFixed(2)),
      battleDuration: 60, // seconds
      totalPriceUpdates: 60 // number of price updates sent
    }
  }

}

// Initialize battle server
export const battleServer = new SupabaseBattleServer()