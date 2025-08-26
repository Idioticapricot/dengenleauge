# 🎮 Multiplayer Battle System Implementation Guide

## 📋 Overview
Transform the current AI battles into real-time multiplayer battles with matchmaking, lobbies, and live player vs player combat.

## 🏗️ Architecture Components

### 1. Real-Time Communication
- **WebSocket Server** - Socket.io for real-time communication
- **Battle Rooms** - Isolated battle instances for each match
- **Event System** - Real-time price updates, moves, and battle state

### 2. Matchmaking System
- **Queue Management** - Players waiting for matches
- **Random Matching** - First-come-first-served matching

### 3. Battle Flow
```
Player A creates team → Enters matchmaking queue
Player B creates team → Enters matchmaking queue
System matches players → Creates battle room
Both players join room → Battle starts
Real-time price updates → Both see same data
Battle ends → Results saved → Players return to lobby
```

## 🔧 Technical Implementation

### Phase 1: WebSocket Infrastructure

#### 1.1 Install Dependencies
```bash
npm install socket.io socket.io-client
npm install @types/socket.io @types/socket.io-client
```

#### 1.2 Create Socket Server (`/lib/socket-server.ts`)
```typescript
import { Server } from 'socket.io'
import { createServer } from 'http'

interface Player {
  id: string
  username: string
  walletAddress: string
  team: CoinTeam[]
}

interface BattleRoom {
  id: string
  players: [Player, Player]
  status: 'waiting' | 'active' | 'finished'
  startTime: number
  priceData: PriceHistory[]
}

class BattleServer {
  private io: Server
  private matchmakingQueue: Player[] = []
  private activeRooms: Map<string, BattleRoom> = new Map()
  
  constructor(server: any) {
    this.io = new Server(server, {
      cors: { origin: "*" }
    })
    this.setupEventHandlers()
  }
  
  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      socket.on('join-queue', (player: Player) => {
        this.addToQueue(socket, player)
      })
      
      socket.on('leave-queue', () => {
        this.removeFromQueue(socket)
      })
      
      socket.on('disconnect', () => {
        this.handleDisconnect(socket)
      })
    })
  }
  
  private addToQueue(socket: any, player: Player) {
    this.matchmakingQueue.push(player)
    socket.player = player
    
    // Try to find a match
    this.tryMatchmaking()
  }
  
  private tryMatchmaking() {
    // Simple FIFO matching - first 2 players in queue
    if (this.matchmakingQueue.length >= 2) {
      const player1 = this.matchmakingQueue.shift()!
      const player2 = this.matchmakingQueue.shift()!
      
      this.createBattleRoom(player1, player2)
    }
  }
  
  private createBattleRoom(player1: Player, player2: Player) {
    const roomId = `battle_${Date.now()}`
    const room: BattleRoom = {
      id: roomId,
      players: [player1, player2],
      status: 'waiting',
      startTime: Date.now(),
      priceData: []
    }
    
    this.activeRooms.set(roomId, room)
    
    // Notify players
    this.io.emit('match-found', { roomId, players: [player1, player2] })
    
    // Start battle after 3 seconds
    setTimeout(() => this.startBattle(roomId), 3000)
  }
  
  private startBattle(roomId: string) {
    const room = this.activeRooms.get(roomId)
    if (!room) return
    
    room.status = 'active'
    this.io.to(roomId).emit('battle-start', { room })
    
    // Start price updates every second
    this.startPriceUpdates(roomId)
  }
  
  private startPriceUpdates(roomId: string) {
    const interval = setInterval(async () => {
      const room = this.activeRooms.get(roomId)
      if (!room || room.status !== 'active') {
        clearInterval(interval)
        return
      }
      
      // Fetch real prices and broadcast
      const priceUpdate = await this.fetchLatestPrices(room)
      this.io.to(roomId).emit('price-update', priceUpdate)
      
      // Check if battle should end (60 seconds)
      if (Date.now() - room.startTime > 60000) {
        this.endBattle(roomId)
        clearInterval(interval)
      }
    }, 1000)
  }
  
  private async endBattle(roomId: string) {
    const room = this.activeRooms.get(roomId)
    if (!room) return
    
    room.status = 'finished'
    
    // Calculate winner and save results
    const results = this.calculateBattleResults(room)
    this.io.to(roomId).emit('battle-end', results)
    
    // Clean up room after 30 seconds
    setTimeout(() => this.activeRooms.delete(roomId), 30000)
  }
}
```

#### 1.3 Create Socket Client Hook (`/hooks/useSocket.ts`)
```typescript
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  
  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001')
    
    socketInstance.on('connect', () => {
      setConnected(true)
    })
    
    socketInstance.on('disconnect', () => {
      setConnected(false)
    })
    
    setSocket(socketInstance)
    
    return () => socketInstance.close()
  }, [])
  
  return { socket, connected }
}
```

### Phase 2: Matchmaking UI

#### 2.1 Create Matchmaking Page (`/app/matchmaking/page.tsx`)
```typescript
"use client"

import { useState, useEffect } from 'react'
import { useSocket } from '../../hooks/useSocket'
import { useAlgorandWallet } from '../../components/wallet/AlgorandWalletProvider'

export default function MatchmakingPage() {
  const { socket } = useSocket()
  const { wallet } = useAlgorandWallet()
  const [inQueue, setInQueue] = useState(false)
  const [matchFound, setMatchFound] = useState(false)
  const [opponent, setOpponent] = useState(null)
  
  const joinQueue = () => {
    if (!socket || !wallet.address) return
    
    const playerData = {
      id: wallet.address,
      username: wallet.address.slice(0, 8),
      walletAddress: wallet.address,
      team: JSON.parse(localStorage.getItem('selectedTeam') || '[]')
    }
    
    socket.emit('join-queue', playerData)
    setInQueue(true)
  }
  
  useEffect(() => {
    if (!socket) return
    
    socket.on('match-found', ({ roomId, players }) => {
      setMatchFound(true)
      setOpponent(players.find(p => p.id !== wallet.address))
      
      // Redirect to battle room after countdown
      setTimeout(() => {
        window.location.href = `/battle/room/${roomId}`
      }, 3000)
    })
    
    return () => {
      socket.off('match-found')
    }
  }, [socket, wallet.address])
  
  return (
    <div>
      {!inQueue ? (
        <button onClick={joinQueue}>
          🎯 FIND MATCH
        </button>
      ) : matchFound ? (
        <div>
          <h2>🎉 MATCH FOUND!</h2>
          <p>Opponent: {opponent?.username}</p>
          <p>Starting battle in 3 seconds...</p>
        </div>
      ) : (
        <div>
          <h2>🔍 SEARCHING FOR OPPONENT...</h2>
          <div className="loading-spinner" />
        </div>
      )}
    </div>
  )
}
```

#### 2.2 Create Battle Room Page (`/app/battle/room/[roomId]/page.tsx`)
```typescript
"use client"

import { useState, useEffect } from 'react'
import { useSocket } from '../../../../hooks/useSocket'
import { useParams } from 'next/navigation'

export default function BattleRoomPage() {
  const { roomId } = useParams()
  const { socket } = useSocket()
  const [battleState, setBattleState] = useState('waiting')
  const [players, setPlayers] = useState([])
  const [priceData, setPriceData] = useState([])
  const [timeLeft, setTimeLeft] = useState(60)
  
  useEffect(() => {
    if (!socket) return
    
    // Join the battle room
    socket.emit('join-room', roomId)
    
    socket.on('battle-start', ({ room }) => {
      setBattleState('active')
      setPlayers(room.players)
    })
    
    socket.on('price-update', (update) => {
      setPriceData(prev => [...prev, update])
      setTimeLeft(prev => prev - 1)
    })
    
    socket.on('battle-end', (results) => {
      setBattleState('finished')
      // Show results
    })
    
    return () => {
      socket.off('battle-start')
      socket.off('price-update')
      socket.off('battle-end')
    }
  }, [socket, roomId])
  
  return (
    <div>
      {battleState === 'waiting' && <div>Waiting for battle to start...</div>}
      {battleState === 'active' && (
        <div>
          <div>Time: {timeLeft}s</div>
          <div>Real-time battle in progress...</div>
          {/* Same chart component as current battle page */}
        </div>
      )}
      {battleState === 'finished' && <div>Battle finished!</div>}
    </div>
  )
}
```

### Phase 3: Database Schema Updates

#### 3.1 Add Multiplayer Tables to Prisma Schema
```prisma
model MultiplayerBattle {
  id          String @id @default(cuid())
  roomId      String @unique
  player1Id   String
  player2Id   String
  player1Team String // JSON
  player2Team String // JSON
  player1Score Float @default(0)
  player2Score Float @default(0)
  winnerId    String?
  battleData  String // JSON of price history
  status      String @default("waiting") // waiting, active, finished
  createdAt   DateTime @default(now())
  endedAt     DateTime?
  
  player1 User @relation("MultiplayerPlayer1", fields: [player1Id], references: [id])
  player2 User @relation("MultiplayerPlayer2", fields: [player2Id], references: [id])
  winner  User? @relation("MultiplayerWinner", fields: [winnerId], references: [id])
}

model MatchmakingQueue {
  id          String @id @default(cuid())
  userId      String
  teamData    String // JSON
  queuedAt    DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
}
```



## 🚀 Implementation Timeline

### Week 1: Infrastructure
- [ ] Set up Socket.io server
- [ ] Create WebSocket connection hooks
- [ ] Basic matchmaking queue system

### Week 2: Core Multiplayer
- [ ] Real-time battle rooms
- [ ] Price synchronization
- [ ] Battle state management
- [ ] Matchmaking interface
- [ ] Battle room UI
- [ ] Results and statistics

## 🎯 MVP Success Criteria

1. **Basic Matchmaking**: 2 players can find each other
2. **Real-Time Battles**: Both players see same price data
3. **Battle Completion**: Winner determined correctly
4. **Simple UI**: Clean matchmaking and battle interface

This MVP creates the core multiplayer experience - real players battling with real crypto data in real-time!