"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@txnlab/use-wallet-react"
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

const DifficultySelector = styled.div`
  background: var(--brutal-violet);
  border: 4px solid var(--border-primary);
  padding: 20px;
  box-shadow: 6px 6px 0px 0px var(--border-primary);
`

const DifficultyButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 15px;
`

interface GameState {
  board: string[]
  currentPlayer: 'X' | 'O'
  winner: string | null
  gameOver: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  moves: Array<{ player: string; position: number; timestamp: number }>
}

export default function PVEGamingPage() {
  const { activeAccount } = useWallet()
  const router = useRouter()
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(''),
    currentPlayer: 'X',
    winner: null,
    gameOver: false,
    difficulty: 'medium',
    moves: []
  })
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [isThinking, setIsThinking] = useState(false)

  useEffect(() => {
    if (!activeAccount?.address) {
      router.push('/')
      return
    }
  }, [activeAccount, router])

  const makeMove = (position: number) => {
    if (!isPlayerTurn || gameState.gameOver || gameState.board[position] !== '') return

    const newBoard = [...gameState.board]
    newBoard[position] = gameState.currentPlayer

    const winner = checkWinner(newBoard)
    const gameOver = winner !== null || newBoard.every(cell => cell !== '')

    const newGameState: GameState = {
      ...gameState,
      board: newBoard,
      currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
      winner,
      gameOver,
      moves: [
        ...gameState.moves,
        {
          player: 'You',
          position,
          timestamp: Date.now()
        }
      ]
    }

    setGameState(newGameState)

    if (!gameOver && newGameState.currentPlayer === 'O') {
      setIsPlayerTurn(false)
      setIsThinking(true)

      // AI makes move after a delay
      setTimeout(() => {
        makeAIMove(newGameState)
      }, 1000 + Math.random() * 1000) // Random delay between 1-2 seconds
    } else {
      setIsPlayerTurn(gameState.currentPlayer === 'X')
    }
  }

  const makeAIMove = (currentState: GameState) => {
    const availableMoves = currentState.board
      .map((cell, index) => cell === '' ? index : -1)
      .filter(index => index !== -1)

    if (availableMoves.length === 0) return

    let aiMove: number

    switch (currentState.difficulty) {
      case 'easy':
        aiMove = availableMoves[Math.floor(Math.random() * availableMoves.length)]
        break
      case 'medium':
        aiMove = getMediumMove(currentState.board, availableMoves)
        break
      case 'hard':
        aiMove = getBestMove(currentState.board)
        break
      default:
        aiMove = availableMoves[Math.floor(Math.random() * availableMoves.length)]
    }

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
          player: 'AI',
          position: aiMove,
          timestamp: Date.now()
        }
      ]
    }

    setGameState(newGameState)
    setIsPlayerTurn(true)
    setIsThinking(false)
  }

  const getMediumMove = (board: string[], availableMoves: number[]): number => {
    // Check if AI can win
    for (const move of availableMoves) {
      const testBoard = [...board]
      testBoard[move] = 'O'
      if (checkWinner(testBoard) === 'O') {
        return move
      }
    }

    // Check if player can win and block
    for (const move of availableMoves) {
      const testBoard = [...board]
      testBoard[move] = 'X'
      if (checkWinner(testBoard) === 'X') {
        return move
      }
    }

    // Random move
    return availableMoves[Math.floor(Math.random() * availableMoves.length)]
  }

  const getBestMove = (board: string[]): number => {
    // Minimax algorithm for perfect play
    let bestScore = -Infinity
    let bestMove = -1

    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'O'
        const score = minimax(board, 0, false)
        board[i] = ''
        if (score > bestScore) {
          bestScore = score
          bestMove = i
        }
      }
    }

    return bestMove
  }

  const minimax = (board: string[], depth: number, isMaximizing: boolean): number => {
    const winner = checkWinner(board)
    if (winner === 'O') return 10 - depth
    if (winner === 'X') return depth - 10
    if (board.every(cell => cell !== '')) return 0

    if (isMaximizing) {
      let bestScore = -Infinity
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = 'O'
          const score = minimax(board, depth + 1, false)
          board[i] = ''
          bestScore = Math.max(score, bestScore)
        }
      }
      return bestScore
    } else {
      let bestScore = Infinity
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = 'X'
          const score = minimax(board, depth + 1, true)
          board[i] = ''
          bestScore = Math.min(score, bestScore)
        }
      }
      return bestScore
    }
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
    setGameState(prev => ({
      ...prev,
      board: Array(9).fill(''),
      currentPlayer: 'X' as const,
      winner: null,
      gameOver: false,
      moves: []
    }))
    setIsPlayerTurn(true)
    setIsThinking(false)
  }

  const setDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    setGameState(prev => ({ ...prev, difficulty }))
  }

  const getStatusMessage = () => {
    if (gameState.winner) {
      if (gameState.winner === 'X') {
        return '🏆 You Win!'
      } else {
        return '🤖 AI Wins!'
      }
    }
    if (gameState.gameOver) {
      return '🤝 It\'s a Tie!'
    }
    if (isThinking) {
      return '🤖 AI is thinking...'
    }
    if (isPlayerTurn) {
      return `🎯 Your turn (${gameState.currentPlayer})`
    }
    return '⏳ AI\'s turn...'
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
          <GameTitle>🤖 PVE TIC-TAC-TOE BATTLE</GameTitle>
          <div style={{ marginTop: '10px', fontSize: '14px' }}>
            Difficulty: {gameState.difficulty.toUpperCase()}
          </div>
        </GameHeader>

        <DifficultySelector>
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <h4 style={{ margin: '0', fontFamily: 'var(--font-mono)', fontWeight: '900', color: 'var(--text-primary)' }}>
              Choose Difficulty:
            </h4>
          </div>
          <DifficultyButtons>
            <Button
              onClick={() => setDifficulty('easy')}
              style={{
                background: gameState.difficulty === 'easy' ? 'var(--brutal-lime)' : 'var(--light-bg)',
                fontSize: '14px',
                padding: '10px 20px'
              }}
            >
              🟢 Easy
            </Button>
            <Button
              onClick={() => setDifficulty('medium')}
              style={{
                background: gameState.difficulty === 'medium' ? 'var(--brutal-lime)' : 'var(--light-bg)',
                fontSize: '14px',
                padding: '10px 20px'
              }}
            >
              🟡 Medium
            </Button>
            <Button
              onClick={() => setDifficulty('hard')}
              style={{
                background: gameState.difficulty === 'hard' ? 'var(--brutal-lime)' : 'var(--light-bg)',
                fontSize: '14px',
                padding: '10px 20px'
              }}
            >
              🔴 Hard
            </Button>
          </DifficultyButtons>
        </DifficultySelector>

        <GameGrid>
          <PlayerSection $isCurrentPlayer={isPlayerTurn}>
            <PlayerTitle>👤 You (X)</PlayerTitle>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
              {activeAccount ? `${activeAccount.address.slice(0, 6)}...${activeAccount.address.slice(-4)}` : 'Player'}
            </div>
          </PlayerSection>

          <PlayerSection $isCurrentPlayer={!isPlayerTurn}>
            <PlayerTitle>🤖 AI (O)</PlayerTitle>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
              Artificial Intelligence
            </div>
          </PlayerSection>
        </GameGrid>

        <GameBoard>
          {gameState.board.map((cell, index) => (
            <GameCell
              key={index}
              $value={cell}
              $disabled={!isPlayerTurn || gameState.gameOver || isThinking}
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