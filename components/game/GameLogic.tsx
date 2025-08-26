"use client"

import { useState, useEffect, useCallback } from "react"
import { useAlgorandWallet } from "../wallet/AlgorandWalletProvider"

interface GameState {
  isActive: boolean
  timeRemaining: number
  currentPrice: number
  startPrice: number
  position: "long" | "short" | null
  entryAmount: number
  pnl: number
  duration: number
}

interface Player {
  id: string
  name: string
  avatar: string
  position: string
  performance: number
}

interface LiveMatch {
  id: string
  player1: {
    name: string
    avatar: string
    isLeading?: boolean
    variant?: "green" | "purple" | "orange" | "blue"
  }
  player2: {
    name: string
    avatar: string
    isLeading?: boolean
    variant?: "green" | "purple" | "orange" | "blue"
  }
  percentages: {
    player1: number
    player2: number
  }
  timeRemaining: string
  duration: string
}

export function useGameLogic() {
  const { wallet } = useAlgorandWallet()
  // TODO: Implement createMatch for Algorand
  const createMatch = async (opponent: string, amount: number, duration: number) => {
    console.log('Creating match on Algorand:', { opponent, amount, duration })
    return `match_${Date.now()}`
  }
  const [gameState, setGameState] = useState<GameState>({
    isActive: false,
    timeRemaining: 0,
    currentPrice: 0,
    startPrice: 0,
    position: null,
    entryAmount: 0,
    pnl: 0,
    duration: 60, // 1 minute default
  })

  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
  const [formation, setFormation] = useState("2-2-1")

  const simulatePrice = useCallback((basePrice: number, volatility = 0.001) => {
    // Use more realistic price movement simulation
    const randomWalk = (Math.random() - 0.5) * 2 // -1 to 1
    const change = randomWalk * volatility
    const newPrice = basePrice * (1 + change)

    // Add some momentum and mean reversion
    const momentum = Math.sin(Date.now() / 10000) * 0.0005
    return newPrice * (1 + momentum)
  }, [])

  const startGame = async (position: "long" | "short", amount: number, duration: number) => {
    if (!wallet.isConnected || wallet.balance < amount) {
      throw new Error("Insufficient balance or wallet not connected")
    }

    try {
      // Simulate realistic token price based on selected token
      const basePrices = {
        ALGO: 0.25 + Math.random() * 0.1,
        BTC: 45000 + Math.random() * 5000,
        ETH: 2500 + Math.random() * 500,
        SOL: 100 + Math.random() * 50,
      }

      const startPrice = basePrices.ALGO // Default to ALGO for now

      setGameState({
        isActive: true,
        timeRemaining: duration,
        currentPrice: startPrice,
        startPrice,
        position,
        entryAmount: amount,
        pnl: 0,
        duration,
      })

      // Create match on blockchain
      const matchId = await createMatch("AI_OPPONENT", amount, duration)
      console.log("Match created:", matchId)

      return matchId
    } catch (error) {
      console.error("Failed to start game:", error)
      throw error
    }
  }

  useEffect(() => {
    if (!gameState.isActive || gameState.timeRemaining <= 0) return

    const interval = setInterval(() => {
      setGameState((prev) => {
        const newTimeRemaining = prev.timeRemaining - 1
        const newPrice = simulatePrice(prev.currentPrice)

        // Calculate P&L with leverage effect
        const priceChange = (newPrice - prev.startPrice) / prev.startPrice
        const leverage = 2 // 2x leverage
        const pnl =
          prev.position === "long"
            ? prev.entryAmount * priceChange * leverage
            : prev.entryAmount * -priceChange * leverage

        if (newTimeRemaining <= 0) {
          // Game ended - settle the match
          console.log(`Game ended. Final P&L: ${pnl.toFixed(4)} ALGO`)
          return {
            ...prev,
            isActive: false,
            timeRemaining: 0,
            currentPrice: newPrice,
            pnl,
          }
        }

        return {
          ...prev,
          timeRemaining: newTimeRemaining,
          currentPrice: newPrice,
          pnl,
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState.isActive, gameState.timeRemaining, simulatePrice])

  const addPlayerToSquad = (player: Player) => {
    if (selectedPlayers.length < 5) {
      setSelectedPlayers((prev) => [...prev, player])
    }
  }

  const removePlayerFromSquad = (playerId: string) => {
    setSelectedPlayers((prev) => prev.filter((p) => p.id !== playerId))
  }

  const updateFormation = (newFormation: string) => {
    setFormation(newFormation)
  }

  const calculateSquadPerformance = () => {
    if (selectedPlayers.length === 0) return 0

    const totalPerformance = selectedPlayers.reduce((sum, player) => sum + player.performance, 0)
    return totalPerformance / selectedPlayers.length
  }

  return {
    gameState,
    selectedPlayers,
    formation,
    startGame,
    addPlayerToSquad,
    removePlayerFromSquad,
    updateFormation,
    calculateSquadPerformance,
  }
}

export function useRealTimeMatches() {
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMatches((prev) =>
        prev.map((match) => {
          const timeRemaining = match.timeRemaining
          const [minutes, seconds] = timeRemaining.split(":").map(Number)
          const totalSeconds = minutes * 60 + seconds

          if (totalSeconds <= 0) {
            return match // Don't update finished matches
          }

          const newTotalSeconds = Math.max(0, totalSeconds - 1)
          const newMinutes = Math.floor(newTotalSeconds / 60)
          const newSeconds = newTotalSeconds % 60
          const newTimeRemaining = `${newMinutes.toString().padStart(2, "0")}:${newSeconds.toString().padStart(2, "0")}`

          // Simulate more realistic percentage changes
          const volatility = 0.05
          const player1Change = (Math.random() - 0.5) * volatility
          const player2Change = (Math.random() - 0.5) * volatility

          const newPercentages = {
            player1: Math.max(-10, Math.min(10, match.percentages.player1 + player1Change)),
            player2: Math.max(-10, Math.min(10, match.percentages.player2 + player2Change)),
          }

          // Update leading status
          const player1Leading = newPercentages.player1 > newPercentages.player2
          const player2Leading = newPercentages.player2 > newPercentages.player1

          return {
            ...match,
            percentages: newPercentages,
            timeRemaining: newTimeRemaining,
            player1: { ...match.player1, isLeading: player1Leading },
            player2: { ...match.player2, isLeading: player2Leading },
          }
        }),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const addLiveMatch = (match: LiveMatch) => {
    setLiveMatches((prev) => [...prev, match])
  }

  const removeLiveMatch = (matchId: string) => {
    setLiveMatches((prev) => prev.filter((m) => m.id !== matchId))
  }

  return {
    liveMatches,
    addLiveMatch,
    removeLiveMatch,
  }
}

export function useTournamentLogic() {
  const { wallet } = useAlgorandWallet()
  // TODO: Implement joinTournament for Algorand
  const joinTournament = async (tournamentId: string, entryFee: number) => {
    console.log('Joining tournament on Algorand:', { tournamentId, entryFee })
  }
  const [activeTournaments, setActiveTournaments] = useState<any[]>([])

  const joinTournamentHandler = async (tournamentId: string, entryFee: number) => {
    if (!wallet.isConnected) {
      throw new Error("Wallet not connected")
    }

    if (wallet.balance < entryFee) {
      throw new Error("Insufficient balance")
    }

    try {
      await joinTournament(tournamentId, entryFee)
      console.log(`Joined tournament ${tournamentId} with entry fee ${entryFee} ALGO`)

      // Update local state
      setActiveTournaments((prev) => [...prev, { id: tournamentId, entryFee, joinedAt: Date.now() }])
    } catch (error) {
      console.error("Failed to join tournament:", error)
      throw error
    }
  }

  return {
    activeTournaments,
    joinTournament: joinTournamentHandler,
  }
}
