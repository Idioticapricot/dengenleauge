"use client"

import styled from "styled-components"
import { Move } from '../../types/beast'

interface BattleBeast {
  id: string
  name: string
  maxHP: number
  currentHP: number
  power: number
  stamina: number
  elementType: string
  imageUrl: string | null
  moves: Move[]
}

interface ActionPanelProps {
  beast: BattleBeast
  isMyTurn: boolean
  onAttack: (moveId: string) => void
  onSwitch: () => void
  canSwitch: boolean
}

const PanelContainer = styled.div<{ $disabled?: boolean }>`
  background: ${props => props.$disabled ? 'var(--brutal-red)' : 'var(--light-bg)'};
  border: 4px solid var(--border-primary);
  padding: 24px;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  opacity: ${props => props.$disabled ? 0.7 : 1};
`

const PanelTitle = styled.h3`
  font-size: 18px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: var(--font-mono);
`

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
`

const ActionButton = styled.button<{ $type: 'attack' | 'switch'; $disabled?: boolean }>`
  background: ${props => {
    if (props.$disabled) return 'var(--brutal-red)'
    return props.$type === 'attack' ? 'var(--brutal-orange)' : 'var(--brutal-cyan)'
  }};
  border: 4px solid var(--border-primary);
  padding: 16px 12px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.1s ease;
  box-shadow: 3px 3px 0px 0px var(--border-primary);
  font-size: 14px;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: var(--font-mono);
  
  &:hover:not(:disabled) {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px 0px var(--border-primary);
    background: var(--brutal-yellow);
  }
`

const MovesList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
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
  border: 3px solid var(--border-primary);
  padding: 12px 8px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.1s ease;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  font-size: 12px;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  font-family: var(--font-mono);
  
  &:hover:not(:disabled) {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px 0px var(--border-primary);
  }
`

export function ActionPanel({ beast, isMyTurn, onAttack, onSwitch, canSwitch }: ActionPanelProps) {
  const disabled = !isMyTurn

  return (
    <PanelContainer $disabled={disabled}>
      <PanelTitle>{isMyTurn ? 'YOUR TURN' : 'OPPONENT TURN'}</PanelTitle>
      
      <ActionsGrid>
        <ActionButton
          $type="attack"
          $disabled={disabled}
          disabled={disabled}
          onClick={() => !disabled && onAttack(beast.moves[0]?.id)}
        >
          ⚔️ ATTACK
        </ActionButton>
        
        <ActionButton
          $type="switch"
          $disabled={disabled || !canSwitch}
          disabled={disabled || !canSwitch}
          onClick={() => !disabled && canSwitch && onSwitch()}
        >
          🔄 SWITCH
        </ActionButton>
      </ActionsGrid>

      {!disabled && (
        <MovesList>
          {beast.moves.map((move) => (
            <MoveButton
              key={move.id}
              $elementType={move.elementType}
              $disabled={disabled}
              disabled={disabled}
              onClick={() => !disabled && onAttack(move.id)}
            >
              {move.name} ({move.damage})
            </MoveButton>
          ))}
        </MovesList>
      )}
    </PanelContainer>
  )
}