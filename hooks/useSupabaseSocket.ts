import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface Player {
  id: string
  username: string
  walletAddress: string
  team: any[]
}

interface BattleRoom {
  id: string
  players: [Player, Player]
  status: 'waiting' | 'active' | 'finished'
  battleType: 'pvp' | 'pve'
}

export function useSupabaseSocket() {
  const [isConnected, setIsConnected] = useState(true) // Default to connected
  const [currentRoom, setCurrentRoom] = useState<BattleRoom | null>(null)
  const [queueSize, setQueueSize] = useState(0)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const matchmakingChannelRef = useRef<RealtimeChannel | null>(null)
  const connectionCheckInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Subscribe to matchmaking channel for real-time updates
    const matchmakingChannel = supabase.channel('matchmaking-updates')
    matchmakingChannelRef.current = matchmakingChannel

    matchmakingChannel
      .on('system', { event: 'CHANNEL_JOIN' }, () => {
        setIsConnected(true)
        console.log('✅ Connected to matchmaking channel')
      })
      .on('system', { event: 'CHANNEL_ERROR' }, (error) => {
        setIsConnected(false)
        console.error('❌ Channel error:', error)
      })
      .on('system', { event: 'CHANNEL_LEAVE' }, () => {
        setIsConnected(false)
        console.log('❌ Disconnected from matchmaking channel')
      })
      .on('broadcast', { event: 'queue-update' }, ({ payload }) => {
        setQueueSize(payload.queueSize || 0)
        console.log('📊 Queue size updated:', payload.queueSize)
      })
      .on('broadcast', { event: 'match-found' }, ({ payload }) => {
        console.log('🎯 Match found:', payload)
        handleMatchFound(payload)
      })
      .subscribe((status) => {
        console.log('📡 Subscription status:', status)
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setIsConnected(false)
        }
      })

    // Periodic connection check
    connectionCheckInterval.current = setInterval(() => {
      if (matchmakingChannelRef.current) {
        // Try to send a ping to check connection
        matchmakingChannelRef.current.send({
          type: 'broadcast',
          event: 'ping',
          payload: { timestamp: Date.now() }
        }).catch(() => {
          setIsConnected(false)
        })
      }
    }, 10000) // Check every 10 seconds

    return () => {
      if (connectionCheckInterval.current) {
        clearInterval(connectionCheckInterval.current)
      }
      matchmakingChannel.unsubscribe()
    }
  }, [])

  const handleMatchFound = (payload: any) => {
    const room: BattleRoom = {
      id: payload.roomId,
      players: payload.players,
      status: 'waiting',
      battleType: payload.battleType
    }
    setCurrentRoom(room)

    // Join the specific battle room channel
    joinBattleRoom(payload.roomId)
  }

  const joinBattleRoom = (roomId: string) => {
    if (channelRef.current) {
      channelRef.current.unsubscribe()
    }

    const battleChannel = supabase.channel(`battle-${roomId}`)
    channelRef.current = battleChannel

    battleChannel
      .on('broadcast', { event: 'battle-start' }, ({ payload }) => {
        if (currentRoom) {
          setCurrentRoom({ ...currentRoom, status: 'active' })
        }
      })
      .on('broadcast', { event: 'price-update' }, ({ payload }) => {
        // Handle price updates
        console.log('Price update:', payload)
      })
      .on('broadcast', { event: 'battle-end' }, ({ payload }) => {
        if (currentRoom) {
          setCurrentRoom({ ...currentRoom, status: 'finished' })
        }
      })
      .subscribe()
  }

  const joinQueue = async (player: Player, battleType: 'pvp' | 'pve' = 'pvp') => {
    try {
      // Send join queue event to matchmaking channel
      const matchmakingChannel = supabase.channel('matchmaking-updates')
      await matchmakingChannel.send({
        type: 'broadcast',
        event: 'join-queue',
        payload: {
          ...player,
          battleType,
          timestamp: Date.now()
        }
      })

      // Try to add to database queue for persistence (optional)
      try {
        // Try with snake_case table and column names (Supabase convention)
        const { error } = await supabase
          .from('MatchmakingQueue')
          .insert([{
            user_id: player.id,
            team_data: JSON.stringify(player.team || []),
            battle_type: battleType,
            queued_at: new Date().toISOString()
          }])

        if (error) {
          console.log('Database persistence not available (table might not exist yet)')
          console.log('Continuing with WebSocket-only matchmaking...')
        } else {
          console.log('✅ Player added to database queue')
        }
      } catch (dbError) {
        console.log('Database persistence not available, using WebSocket-only mode')
        // Continue without database persistence - WebSocket matchmaking still works
      }

      console.log('Joined matchmaking queue:', player.id, battleType)
    } catch (error) {
      console.error('Failed to join queue:', error)
      throw error
    }
  }

  const leaveQueue = (playerId: string) => {
    const channel = supabase.channel('battle-rooms')
    channel.send({
      type: 'broadcast',
      event: 'leave-queue',
      payload: { id: playerId }
    })
  }

  const sendBattleAction = (roomId: string, action: any) => {
    const channel = supabase.channel(`battle-${roomId}`)
    channel.send({
      type: 'broadcast',
      event: 'battle-action',
      payload: {
        roomId,
        ...action
      }
    })
  }

  const testConnection = async () => {
    try {
      const testChannel = supabase.channel('connection-test')
      await testChannel.send({
        type: 'broadcast',
        event: 'test',
        payload: { message: 'Connection test', timestamp: Date.now() }
      })
      setIsConnected(true)
      console.log('✅ Connection test successful')
      return true
    } catch (error) {
      setIsConnected(false)
      console.error('❌ Connection test failed:', error)
      return false
    }
  }

  // Test connection on mount
  useEffect(() => {
    testConnection()
  }, [])

  return {
    isConnected,
    currentRoom,
    joinQueue,
    leaveQueue,
    sendBattleAction,
    joinBattleRoom,
    queueSize,
    testConnection
  }
}