"use client"

import styled from "styled-components"
import { Move } from '../../types/beast'

interface MoveSlotsProps {
  moves: Move[]
  onMoveClick?: (move: Move) => void
  showEmpty?: boolean
}

const MoveSlotsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 12px;
`

const MoveSlot = styled.div<{ $empty?: boolean; $clickable?: boolean }>`
  background: ${props => props.$empty ? 'var(--light-bg)' : 'var(--brutal-orange)'};
  border: 2px solid var(--border-primary);
  padding: 8px 6px;
  text-align: center;
  min-height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  transition: all 0.1s ease;
  opacity: ${props => props.$empty ? 0.5 : 1};
  
  &:hover {
    ${props => props.$clickable && `
      background: var(--brutal-yellow);
      transform: translate(1px, 1px);
    `}
  }
`

const MoveName = styled.div`
  font-size: 10px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
`

const MoveType = styled.div<{ $type: string }>`
  font-size: 8px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  background: ${props => {
    switch (props.$type) {
      case 'fire': return 'var(--brutal-red)'
      case 'water': return 'var(--brutal-cyan)'
      case 'earth': return 'var(--brutal-lime)'
      case 'electric': return 'var(--brutal-yellow)'
      default: return 'var(--brutal-pink)'
    }
  }};
  padding: 1px 4px;
  border: 1px solid var(--border-primary);
  text-transform: uppercase;
`

const MoveDamage = styled.div`
  font-size: 8px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  background: var(--brutal-violet);
  padding: 1px 4px;
  border: 1px solid var(--border-primary);
  margin-top: 2px;
`

const EmptySlotText = styled.div`
  font-size: 8px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  opacity: 0.7;
`

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'fire': return '🔥'
    case 'water': return '🌊'
    case 'earth': return '🌍'
    case 'electric': return '⚡'
    default: return '❓'
  }
}

export function MoveSlots({ moves, onMoveClick, showEmpty = true }: MoveSlotsProps) {
  // Always show 4 slots
  const slots = Array(4).fill(null).map((_, index) => moves[index] || null)

  return (
    <MoveSlotsContainer>
      {slots.map((move, index) => (
        <MoveSlot
          key={index}
          $empty={!move}
          $clickable={!!move && !!onMoveClick}
          onClick={() => move && onMoveClick && onMoveClick(move)}
        >
          {move ? (
            <>
              <MoveName>{move.name}</MoveName>
              <MoveType $type={move.elementType}>
                {getTypeIcon(move.elementType)} {move.elementType}
              </MoveType>
              <MoveDamage>{move.damage} DMG</MoveDamage>
            </>
          ) : showEmpty ? (
            <EmptySlotText>EMPTY</EmptySlotText>
          ) : null}
        </MoveSlot>
      ))}
    </MoveSlotsContainer>
  )
}