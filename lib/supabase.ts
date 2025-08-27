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

  constructor() {
    this.setupRealtimeSubscriptions()
  }

  private setupRealtimeSubscriptions() {
    // Listen for battle events
    supabase
      .channel('battle-rooms')
      .on('broadcast', { event: 'join-queue' }, ({ payload }) => {
        this.handleJoinQueue(payload)
      })
      .on('broadcast', { event: 'leave-queue' }, ({ payload }) => {
        this.handleLeaveQueue(payload)
      })
      .on('broadcast', { event: 'battle-action' }, ({ payload }) => {
        this.handleBattleAction(payload)
      })
      .subscribe()
  }

  private async handleJoinQueue(playerData: any) {
    // Add player to matchmaking queue
    const { data, error } = await supabase
      .from('matchmaking_queue')
      .insert([{
        user_id: playerData.id,
        team_data: JSON.stringify(playerData.team),
        battle_type: playerData.battleType || 'pvp',
        created_at: new Date().toISOString()
      }])

    if (error) {
      console.error('Error joining queue:', error)
      return
    }

    // Try to find a match
    await this.tryMatchmaking(playerData.battleType || 'pvp')
  }

  private async handleLeaveQueue(playerData: any) {
    await supabase
      .from('matchmaking_queue')
      .delete()
      .eq('user_id', playerData.id)
  }

  private async handleBattleAction(actionData: any) {
    // Broadcast battle action to room
    await supabase
      .channel(`battle-${actionData.roomId}`)
      .send({
        type: 'broadcast',
        event: 'battle-action',
        payload: actionData
      })
  }

  private async tryMatchmaking(battleType: string) {
    // Get players in queue for this battle type
    const { data: queuedPlayers, error } = await supabase
      .from('matchmaking_queue')
      .select('*')
      .eq('battle_type', battleType)
      .order('created_at', { ascending: true })

    if (error || !queuedPlayers || queuedPlayers.length < 2) {
      return
    }

    // Create battle room with first 2 players
    const player1 = queuedPlayers[0]
    const player2 = queuedPlayers[1]

    const roomId = `battle_${Date.now()}`
    const roomData = {
      id: roomId,
      player1_id: player1.user_id,
      player2_id: player2.user_id,
      player1_team: player1.team_data,
      player2_team: player2.team_data,
      battle_type: battleType,
      status: 'waiting',
      created_at: new Date().toISOString()
    }

    // Save battle room
    const { error: roomError } = await supabase
      .from('battle_rooms')
      .insert([roomData])

    if (roomError) {
      console.error('Error creating battle room:', roomError)
      return
    }

    // Remove players from queue
    await supabase
      .from('matchmaking_queue')
      .delete()
      .in('user_id', [player1.user_id, player2.user_id])

    // Notify players of match
    await supabase
      .channel('battle-rooms')
      .send({
        type: 'broadcast',
        event: 'match-found',
        payload: {
          roomId,
          players: [
            { id: player1.user_id, team: JSON.parse(player1.team_data) },
            { id: player2.user_id, team: JSON.parse(player2.team_data) }
          ],
          battleType
        }
      })

    // Start battle after delay
    setTimeout(() => {
      this.startBattle(roomId)
    }, 3000)
  }

  private async startBattle(roomId: string) {
    // Update room status
    await supabase
      .from('battle_rooms')
      .update({ status: 'active', started_at: new Date().toISOString() })
      .eq('id', roomId)

    // Notify room that battle started
    await supabase
      .channel(`battle-${roomId}`)
      .send({
        type: 'broadcast',
        event: 'battle-start',
        payload: { roomId }
      })

    // Start price updates
    this.startPriceUpdates(roomId)
  }

  private async startPriceUpdates(roomId: string) {
    const interval = setInterval(async () => {
      try {
        // Get latest price data
        const response = await fetch('/api/battle-prices')
        const priceData = await response.json()

        // Send price update to room
        await supabase
          .channel(`battle-${roomId}`)
          .send({
            type: 'broadcast',
            event: 'price-update',
            payload: {
              timestamp: Date.now(),
              prices: priceData.prices
            }
          })

        // Check if battle should end (60 seconds)
        const { data: room } = await supabase
          .from('battle_rooms')
          .select('started_at')
          .eq('id', roomId)
          .single()

        if (room && room.started_at) {
          const startTime = new Date(room.started_at).getTime()
          if (Date.now() - startTime > 60000) {
            clearInterval(interval)
            await this.endBattle(roomId)
          }
        }
      } catch (error) {
        console.error('Price update error:', error)
      }
    }, 1000)
  }

  private async endBattle(roomId: string) {
    // Get battle results
    const { data: room } = await supabase
      .from('battle_rooms')
      .select('*')
      .eq('id', roomId)
      .single()

    if (!room) return

    // Calculate results (simplified)
    const results = {
      player1Score: Math.floor(Math.random() * 100),
      player2Score: Math.floor(Math.random() * 100),
      winner: Math.random() > 0.5 ? room.player1_id : room.player2_id
    }

    // Update room status
    await supabase
      .from('battle_rooms')
      .update({
        status: 'finished',
        ended_at: new Date().toISOString(),
        results: JSON.stringify(results)
      })
      .eq('id', roomId)

    // Notify room of battle end
    await supabase
      .channel(`battle-${roomId}`)
      .send({
        type: 'broadcast',
        event: 'battle-end',
        payload: results
      })
  }
}

// Initialize battle server
export const battleServer = new SupabaseBattleServer()