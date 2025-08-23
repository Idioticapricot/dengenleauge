"use client"

import styled from "styled-components"
import { Move } from '../../types/beast'

interface MoveSelectorProps {
  moves: Move[]
  onMoveSelect: (move: Move) => void
  disabled?: boolean
}

const MoveSelectorContainer = styled.div<{ $disabled?: boolean }>`
  background: ${props => props.$disabled ? 'var(--brutal-red)' : 'var(--light-bg)'};
  border: 4px solid var(--border-primary);
  padding: 24px;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  opacity: ${props => props.$disabled ? 0.7 : 1};
  transition: all 0.3s ease;
`

const SelectorTitle = styled.h3<{ $disabled?: boolean }>`
  font-size: 18px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: var(--font-mono);
  
  &::after {
    content: '${props => props.$disabled ? ' - OPPONENT TURN' : ''}';
    font-size: 14px;
    color: var(--text-primary);
  }
`

const MovesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`

const MoveButton = styled.button<{ $elementType: string; $disabled?: boolean }>`
  background: ${props => {
    if (props.$disabled) return 'var(--brutal-red)'
    switch (props.$elementType) {
      case 'fire': return 'var(--brutal-red)'
      case 'water': return 'var(--brutal-cyan)'
      case 'earth': return 'var(--brutal-lime)'
      case 'electric': return 'var(--brutal-yellow)'
      default: return 'var(--brutal-pink)'
    }
  }};
  border: 4px solid var(--border-primary);
  padding: 16px 12px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.1s ease;
  box-shadow: 3px 3px 0px 0px var(--border-primary);
  opacity: ${props => props.$disabled ? 0.6 : 1};
  
  &:hover:not(:disabled) {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px 0px var(--border-primary);
    background: var(--brutal-orange);
  }
  
  &:disabled {
    cursor: not-allowed;
  }
`

const MoveIcon = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
`

const MoveName = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: var(--text-primary);
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: var(--font-mono);
`

const MoveDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`

const MoveType = styled.div`
  font-size: 10px;
  font-weight: 900;
  color: var(--text-primary);
  background: var(--brutal-violet);
  padding: 2px 6px;
  border: 2px solid var(--border-primary);
  text-transform: uppercase;
  font-family: var(--font-mono);
`

const MoveDamage = styled.div`
  font-size: 10px;
  font-weight: 900;
  color: var(--text-primary);
  background: var(--brutal-pink);
  padding: 2px 6px;
  border: 2px solid var(--border-primary);
  text-transform: uppercase;
  font-family: var(--font-mono);
`

const MoveCooldown = styled.div`
  font-size: 8px;
  font-weight: 900;
  color: var(--text-primary);
  margin-top: 4px;
  opacity: 0.8;
  font-family: var(--font-mono);
  text-transform: uppercase;
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

export function MoveSelector({ moves, onMoveSelect, disabled = false }: MoveSelectorProps) {
  return (
    <MoveSelectorContainer $disabled={disabled}>
      <SelectorTitle $disabled={disabled}>SELECT MOVE</SelectorTitle>
      
      <MovesGrid>
        {moves.map((move) => (
          <MoveButton
            key={move.id}
            $elementType={move.elementType}
            $disabled={disabled}
            disabled={disabled}
            onClick={() => !disabled && onMoveSelect(move)}
          >
            <MoveIcon>{getTypeIcon(move.elementType)}</MoveIcon>
            <MoveName>{move.name}</MoveName>
            <MoveDetails>
              <MoveType>{move.elementType}</MoveType>
              <MoveDamage>{move.damage} DMG</MoveDamage>
            </MoveDetails>
            <MoveCooldown>Cooldown: {move.cooldown}T</MoveCooldown>
          </MoveButton>
        ))}
      </MovesGrid>
    </MoveSelectorContainer>
  )
}