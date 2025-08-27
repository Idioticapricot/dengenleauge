"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useWallet } from "@txnlab/use-wallet-react"
import { supabase } from "../../../lib/supabase"
import { AppLayout } from "../../../components/layout/AppLayout"
import styled from "styled-components"
import { Button } from "../../../components/styled/GlobalStyles"

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`

const GameHeader = styled.div`
  background: var(--brutal-red);
  border: 4px solid var(--border-primary);
  padding: 20px;
  text-align: center;
  box-shadow: 8px 8px 0px 0px var(--border-primary);
`

const GameTitle = styled.h1`
  font-size: 28px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 20px 0;
`

const PlayerSection = styled.div<{ $isCurrentPlayer: boolean }>`
  background: ${props => props.$isCurrentPlayer ? 'var(--brutal-lime)' : 'var(--light-bg)'};
  border: 4px solid var(--border-primary);
  padding: 20px;
  box-shadow: 6px 6px 0px 0px var(--border-primary);
`

const TeamSection = styled.div`
  background: var(--brutal-cyan);
  border: 4px solid var(--border-primary);
  padding: 20px;
  box-shadow: 6px 6px 0px 0px var(--border-primary);
`

const TeamTitle = styled.h4`
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 15px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
`

const TeamCard = styled.div`
  background: var(--light-bg);
  border: 2px solid var(--border-primary);
  padding: 10px;
  text-align: center;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
`

const CoinSymbol = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: var(--brutal-yellow);
  font-family: var(--font-mono);
  margin-bottom: 5px;
`

const CoinName = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
`

const PlayerTitle = styled.h3`
  font-size: 18px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 15px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 20px 0;
`

const GameCell = styled.button<{ $value: string; $disabled: boolean }>`
  width: 80px;
  height: 80px;
  background: ${props => {
    if (props.$value === 'X') return 'var(--brutal-red)'
    if (props.$value === 'O') return 'var(--brutal-blue)'
    return 'var(--light-bg)'
  }};
  border: 3px solid var(--border-primary);
  font-size: 32px;
  font-weight: 900;
  font-family: var(--font-mono);
  color: var(--text-primary);
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.1s ease;

  &:hover:not(:disabled) {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px var(--border-primary);
  }

  &:disabled {
    opacity: 0.6;
  }
`

const GameStatus = styled.div`
  background: var(--brutal-yellow);
  border: 4px solid var(--border-primary);
  padding: 20px;
  text-align: center;
  box-shadow: 6px 6px 0px 0px var(--border-primary);
`

const StatusText = styled.div`
  font-size: 24px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const MoveHistory = styled.div`
  background: var(--brutal-cyan);
  border: 4px solid var(--border-primary);
  padding: 20px;
  box-shadow: 6px 6px 0px 0px var(--border-primary);
`

const HistoryTitle = styled.h4`
  font-size: 18px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 15px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const MoveList = styled.div`
  max-height: 200px;
  overflow-y: auto;
`

const MoveItem = styled.div`
  background: var(--light-bg);
  border: 2px solid var(--border-primary);
  padding: 8px;
  margin-bottom: 8px;
  font-family: var(--font-mono);
  font-weight: 700;
`

interface GameState {
  board: string[]
  currentPlayer: 'X' | 'O'
  winner: string | null
  gameOver: boolean
  players: {
    X: { id: string; name: string; team?: any[] }
    O: { id: string; name: string; team?: any[] }
  }
  moves: Array<{ player: string; position: number; timestamp: number }>
}

export default function PVPGamePage() {
  const { roomId } = useParams()
  const { activeAccount } = useWallet()
  const router = useRouter()
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(''),
    currentPlayer: 'X',
    winner: null,
    gameOver: false,
    players: {
      X: { id: '', name: '' },
      O: { id: '', name: '' }
    },
    moves: []
  })
  const [isMyTurn, setIsMyTurn] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('connecting...')
  const channelRef = useRef<any>(null)

  useEffect(() => {
    if (!activeAccount?.address || !roomId) {
      router.push('/')
      return
    }

    initializeGame()
  }, [activeAccount, roomId])

  const initializeGame = async () => {
    try {
      // Check if this is a mock room (single player mode)
      const roomIdString = Array.isArray(roomId) ? roomId[0] : roomId
      const isMockRoom = roomIdString?.startsWith('mock_') || false

      if (isMockRoom) {
        // For mock rooms, set up single player mode
        setConnectionStatus('🎮 Single Player Mode')
        setGameState(prev => ({
          ...prev,
          players: {
            X: {
              id: activeAccount?.address || 'player1',
              name: activeAccount?.address ? `${activeAccount.address.slice(0, 6)}...${activeAccount.address.slice(-4)}` : 'Player 1'
            },
            O: {
              id: 'ai',
              name: 'AI Opponent'
            }
          }
        }))
        return
      }

      // Join the game room channel for real multiplayer
      const channel = supabase.channel(`game-${roomIdString}`)
      channelRef.current = channel

      channel
        .on('broadcast', { event: 'game-update' }, ({ payload }) => {
          handleGameUpdate(payload)
        })
        .on('broadcast', { event: 'player-joined' }, ({ payload }) => {
          handlePlayerJoined(payload)
        })
        .on('broadcast', { event: 'game-start' }, ({ payload }) => {
          handleGameStart(payload)
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setConnectionStatus('🟢 Connected')
            // Announce player joined
            if (activeAccount?.address) {
              channel.send({
                type: 'broadcast',
                event: 'player-joined',
                payload: {
                  playerId: activeAccount.address,
                  playerName: `${activeAccount.address.slice(0, 6)}...${activeAccount.address.slice(-4)}`
                }
              })
            }
          } else {
            setConnectionStatus('🔴 Connection failed')
          }
        })

    } catch (error) {
      console.error('Failed to initialize game:', error)
      setConnectionStatus('🔴 Connection failed')
      // Fallback to single player mode
      setGameState(prev => ({
        ...prev,
        players: {
          X: {
            id: activeAccount?.address || 'player1',
            name: activeAccount?.address ? `${activeAccount.address.slice(0, 6)}...${activeAccount.address.slice(-4)}` : 'Player 1'
          },
          O: {
            id: 'ai',
            name: 'AI Opponent'
          }
        }
      }))
    }
  }

  const handlePlayerJoined = (payload: any) => {
    setGameState(prev => {
      const newPlayers = { ...prev.players }

      if (!newPlayers.X.id) {
        newPlayers.X = { id: payload.playerId, name: payload.playerName }
      } else if (!newPlayers.O.id && payload.playerId !== newPlayers.X.id) {
        newPlayers.O = { id: payload.playerId, name: payload.playerName }

        // Start game when both players are ready
        if (channelRef.current) {
          channelRef.current.send({
            type: 'broadcast',
            event: 'game-start',
            payload: { players: newPlayers }
          })
        }
      }

      return { ...prev, players: newPlayers }
    })
  }

  const handleGameStart = (payload: any) => {
    setGameState(prev => ({
      ...prev,
      players: payload.players,
      currentPlayer: 'X'
    }))

    // Determine if it's this player's turn
    const mySymbol = payload.players.X.id === activeAccount?.address ? 'X' : 'O'
    setIsMyTurn(mySymbol === 'X')
  }

  const handleGameUpdate = (payload: any) => {
    setGameState(prev => {
      const newState = {
        ...prev,
        ...payload.gameState
      }
      return newState
    })

    // Update turn status
    if (activeAccount?.address) {
      setGameState(currentState => {
        const mySymbol = currentState.players.X.id === activeAccount.address ? 'X' : 'O'
        setIsMyTurn(payload.gameState.currentPlayer === mySymbol && !payload.gameState.gameOver)
        return currentState
      })
    }
  }

  const makeMove = (position: number) => {
    if (!isMyTurn || gameState.gameOver || gameState.board[position] !== '') return

    const newBoard = [...gameState.board]
    newBoard[position] = gameState.currentPlayer

    const winner = checkWinner(newBoard)
    const gameOver = winner !== null || newBoard.every(cell => cell !== '')

    const nextPlayer = gameState.currentPlayer === 'X' ? 'O' as const : 'X' as const
    const newGameState: GameState = {
      board: newBoard,
      currentPlayer: nextPlayer,
      winner,
      gameOver,
      players: gameState.players,
      moves: [
        ...gameState.moves,
        {
          player: gameState.players[gameState.currentPlayer].name,
          position,
          timestamp: Date.now()
        }
      ]
    }

    // Check if this is a mock room (single player)
    const roomIdString = Array.isArray(roomId) ? roomId[0] : roomId
    const isMockRoom = roomIdString?.startsWith('mock_') || false

    if (isMockRoom && !gameOver && newGameState.currentPlayer === 'O') {
      // AI move for mock rooms
      setTimeout(() => {
        makeAIMove(newGameState)
      }, 1000)
    } else if (channelRef.current && !isMockRoom) {
      // Send move to other player for real multiplayer
      channelRef.current.send({
        type: 'broadcast',
        event: 'game-update',
        payload: { gameState: newGameState }
      })
    }

    // Update local state immediately for better UX
    setGameState(newGameState)
    setIsMyTurn(!isMockRoom || newGameState.currentPlayer === 'X')
  }

  const makeAIMove = (currentState: GameState) => {
    const availableMoves = currentState.board
      .map((cell, index) => cell === '' ? index : -1)
      .filter(index => index !== -1)

    if (availableMoves.length === 0) return

    // Simple AI: random move
    const aiMove = availableMoves[Math.floor(Math.random() * availableMoves.length)]

    const newBoard = [...currentState.board]
    newBoard[aiMove] = 'O'

    const winner = checkWinner(newBoard)
    const gameOver = winner !== null || newBoard.every(cell => cell !== '')

    const newGameState: GameState = {
      ...currentState,
      board: newBoard,
      currentPlayer: 'X',
      winner,
      gameOver,
      moves: [
        ...currentState.moves,
        {
          player: 'AI Opponent',
          position: aiMove,
          timestamp: Date.now()
        }
      ]
    }

    setGameState(newGameState)
    setIsMyTurn(true)
  }

  const checkWinner = (board: string[]): string | null => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ]

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }

    return null
  }

  const resetGame = () => {
    const resetState: GameState = {
      board: Array(9).fill(''),
      currentPlayer: 'X' as const,
      winner: null,
      gameOver: false,
      players: gameState.players,
      moves: []
    }

    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'game-update',
        payload: { gameState: resetState }
      })
    }

    setGameState(resetState)
    setIsMyTurn(gameState.players.X.id === activeAccount?.address)
  }

  const getStatusMessage = () => {
    if (gameState.winner) {
      const winnerName = gameState.players[gameState.winner as keyof typeof gameState.players].name
      return `🏆 ${winnerName} Wins!`
    }
    if (gameState.gameOver) {
      return '🤝 It\'s a Tie!'
    }
    if (isMyTurn) {
      return `🎯 Your turn (${gameState.currentPlayer})`
    }
    return `⏳ Waiting for opponent...`
  }

  if (!activeAccount?.address) {
    return (
      <AppLayout>
        <GameContainer>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <StatusText>🔗 Please connect your wallet to play</StatusText>
          </div>
        </GameContainer>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <GameContainer>
        <GameHeader>
          <GameTitle>⚔️ PVP TIC-TAC-TOE BATTLE</GameTitle>
          <div style={{ marginTop: '10px', fontSize: '14px' }}>
            Room: {roomId} | Status: {connectionStatus}
          </div>
        </GameHeader>

        <GameGrid>
          <PlayerSection $isCurrentPlayer={gameState.players.X.id === activeAccount.address}>
            <PlayerTitle>👤 Player X</PlayerTitle>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
              {gameState.players.X.name || 'Waiting...'}
            </div>
          </PlayerSection>

          <PlayerSection $isCurrentPlayer={gameState.players.O.id === activeAccount.address}>
            <PlayerTitle>👤 Player O</PlayerTitle>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
              {gameState.players.O.name || 'Waiting...'}
            </div>
          </PlayerSection>
        </GameGrid>

        <GameGrid>
          <TeamSection>
            <TeamTitle>⚔️ Player X Team</TeamTitle>
            <TeamGrid>
              {gameState.players.X.team && gameState.players.X.team.length > 0 ? (
                gameState.players.X.team.map((coin: any, index: number) => (
                  <TeamCard key={index}>
                    <CoinSymbol>{coin.symbol || 'COIN'}</CoinSymbol>
                    <CoinName>{coin.name || 'Unknown'}</CoinName>
                  </TeamCard>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-primary)' }}>
                  No team selected
                </div>
              )}
            </TeamGrid>
          </TeamSection>

          <TeamSection>
            <TeamTitle>⚔️ Player O Team</TeamTitle>
            <TeamGrid>
              {gameState.players.O.team && gameState.players.O.team.length > 0 ? (
                gameState.players.O.team.map((coin: any, index: number) => (
                  <TeamCard key={index}>
                    <CoinSymbol>{coin.symbol || 'COIN'}</CoinSymbol>
                    <CoinName>{coin.name || 'Unknown'}</CoinName>
                  </TeamCard>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-primary)' }}>
                  No team selected
                </div>
              )}
            </TeamGrid>
          </TeamSection>
        </GameGrid>

        <GameBoard>
          {gameState.board.map((cell, index) => (
            <GameCell
              key={index}
              $value={cell}
              $disabled={!isMyTurn || gameState.gameOver}
              onClick={() => makeMove(index)}
            >
              {cell}
            </GameCell>
          ))}
        </GameBoard>

        <GameStatus>
          <StatusText>{getStatusMessage()}</StatusText>
          {gameState.gameOver && (
            <Button
              onClick={resetGame}
              style={{ marginTop: '15px', fontSize: '16px', padding: '12px 24px' }}
            >
              🔄 Play Again
            </Button>
          )}
        </GameStatus>

        <MoveHistory>
          <HistoryTitle>📜 Move History</HistoryTitle>
          <MoveList>
            {gameState.moves.length > 0 ? (
              gameState.moves.map((move, index) => (
                <MoveItem key={index}>
                  {move.player} played position {move.position + 1}
                </MoveItem>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-primary)' }}>
                No moves yet!
              </div>
            )}
          </MoveList>
        </MoveHistory>

        <div style={{ textAlign: 'center' }}>
          <Button
            onClick={() => router.push('/matchmaking')}
            style={{ fontSize: '16px', padding: '12px 24px' }}
          >
            🔙 Back to Matchmaking
          </Button>
        </div>
      </GameContainer>
    </AppLayout>
  )
}