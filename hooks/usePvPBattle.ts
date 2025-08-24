"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "../components/wallet/WalletProvider"
import { api } from "../lib/api"
import { useWebSocket } from "./useWebSocket"

export interface Beast {
  id: string
  name: string
  type: "fire" | "water" | "earth" | "electric"
  icon: string
  stats: {
    health: number
    stamina: number
    power: number
  }
  currentHealth: number
}

export interface BattleAction {
  id: string
  playerId: string
  type: "attack" | "defend" | "special"
  beastId: string
  targetBeastId?: string
  damage?: number
  timestamp: number
}

export interface BattleState {
  id: string
  roomCode: string
  mode: "1v1" | "2v2"
  status: "waiting" | "active" | "finished"
  teams: {
    team1: {
      players: {
        [playerId: string]: {
          id: string
          address: string
          name: string
          beasts: Beast[]
          ready: boolean
        }
      }
    }
    team2: {
      players: {
        [playerId: string]: {
          id: string
          address: string
          name: string
          beasts: Beast[]
          ready: boolean
        }
      }
    }
  }
  currentTurn: string
  turnTimeLeft: number
  actions: BattleAction[]
  winner?: "team1" | "team2"
  createdAt: number
}

const TURN_DURATION = 30 // seconds

export function usePvPBattle() {
  const { wallet } = useWallet()
  const [battles, setBattles] = useState<{ [battleId: string]: BattleState }>({})
  const [currentBattle, setCurrentBattle] = useState<string | null>(null)
  const [onlinePlayers, setOnlinePlayers] = useState<string[]>([])
  
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'
  const { isConnected: wsConnected, lastMessage, sendMessage } = useWebSocket(wsUrl)

  // Handle WebSocket messages
  useEffect(() => {
    if (!lastMessage) return

    switch (lastMessage.type) {
      case 'battle_update':
        setBattles(prev => ({
          ...prev,
          [lastMessage.data.id]: lastMessage.data
        }))
        break
      case 'players_online':
        setOnlinePlayers(lastMessage.data.filter((p: string) => p !== wallet.address))
        break
      case 'battle_action':
        if (currentBattle === lastMessage.data.battleId) {
          syncBattle(lastMessage.data.battleId)
        }
        break
    }
  }, [lastMessage, wallet.address, currentBattle])

  // Join WebSocket room when wallet connects
  useEffect(() => {
    if (wsConnected && wallet.address) {
      sendMessage({
        type: 'join_lobby',
        data: { address: wallet.address }
      })
    }
  }, [wsConnected, wallet.address, sendMessage])

  // Battle timer
  useEffect(() => {
    if (!currentBattle) return

    const battle = battles[currentBattle]
    if (!battle || battle.status !== "active") return

    const interval = setInterval(() => {
      setBattles(prev => {
        const updated = { ...prev }
        const battleState = updated[currentBattle]
        
        if (battleState.turnTimeLeft > 0) {
          battleState.turnTimeLeft -= 1
        } else {
          // Auto-skip turn
          const allPlayers = [
            ...Object.keys(battleState.teams.team1.players),
            ...Object.keys(battleState.teams.team2.players)
          ]
          const currentIndex = allPlayers.indexOf(battleState.currentTurn)
          const nextIndex = (currentIndex + 1) % allPlayers.length
          battleState.currentTurn = allPlayers[nextIndex]
          battleState.turnTimeLeft = TURN_DURATION
        }

        return updated
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentBattle, battles])

  const createBattle = useCallback(async (playerBeasts: Beast[], mode: "1v1" | "2v2" = "1v1") => {
    if (!wallet.address) throw new Error("Wallet not connected")

    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const battleData = {
      roomCode,
      mode,
      creatorAddress: wallet.address,
      beasts: playerBeasts.map(beast => ({
        ...beast,
        currentHealth: beast.stats.health
      }))
    }

    const battle = await api.createBattle(battleData)
    setBattles(prev => ({ ...prev, [battle.id]: battle }))
    setCurrentBattle(battle.id)

    return battle.roomCode
  }, [wallet.address])

  const joinBattle = useCallback(async (roomCode: string, playerBeasts: Beast[]) => {
    if (!wallet.address) throw new Error("Wallet not connected")

    const playerData = {
      address: wallet.address,
      beasts: playerBeasts.map(beast => ({
        ...beast,
        currentHealth: beast.stats.health
      }))
    }

    try {
      const battle = await api.joinBattle(roomCode, playerData)
      setBattles(prev => ({ ...prev, [battle.id]: battle }))
      setCurrentBattle(battle.id)
      return battle
    } catch (error: any) {
      if (error.message.includes('not found')) {
        throw new Error('Room does not exist. Please check the room code or create a new room.')
      }
      throw error
    }
  }, [wallet.address])

  const performAction = useCallback(async (action: Omit<BattleAction, "id" | "timestamp">) => {
    if (!currentBattle || !wallet.address) return

    const battle = battles[currentBattle]
    if (!battle || battle.status !== "active") return
    if (battle.currentTurn !== wallet.address) return

    const updatedBattle = await api.performAction(currentBattle, action)
    setBattles(prev => ({ ...prev, [currentBattle]: updatedBattle }))
    
    // Notify other players via WebSocket
    sendMessage({
      type: 'battle_action',
      data: { battleId: currentBattle, action }
    })
  }, [currentBattle, wallet.address, battles, sendMessage])

  const leaveBattle = useCallback(() => {
    setCurrentBattle(null)
  }, [])

  const getBattle = useCallback((battleId: string) => {
    return battles[battleId]
  }, [battles])

  const getCurrentBattle = useCallback(() => {
    return currentBattle ? battles[currentBattle] : null
  }, [currentBattle, battles])

  const syncBattle = useCallback(async (battleId: string) => {
    try {
      const battleData = await api.getBattle(battleId)
      setBattles(prev => ({ ...prev, [battleId]: battleData }))
    } catch (error) {
      console.error('Failed to sync battle:', error)
    }
  }, [])

  // Auto-sync current battle
  useEffect(() => {
    if (!currentBattle) return

    const interval = setInterval(() => {
      syncBattle(currentBattle)
    }, 5000)

    return () => clearInterval(interval)
  }, [currentBattle, syncBattle])

  return {
    battles,
    currentBattle,
    onlinePlayers,
    createBattle,
    joinBattle,
    performAction,
    leaveBattle,
    getBattle,
    getCurrentBattle,
    syncBattle
  }
}