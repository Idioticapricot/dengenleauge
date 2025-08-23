"use client"

import { useState } from "react"
import styled from "styled-components"
import { Button } from "../styled/GlobalStyles"
import { Move } from '../../types/beast'

interface LearnMoveModalProps {
  beastId: string
  beastName: string
  currentLevel: number
  currentMoves: Move[]
  availableMoves: Move[]
  onConfirm: (beastId: string, moveId: string, slotIndex: number) => void
  onClose: () => void
}

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const PopupContent = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  box-shadow: 8px 8px 0px 0px var(--border-primary);
  padding: 32px;
  max-width: 600px;
  width: 90%;
  font-family: var(--font-mono);
  max-height: 80vh;
  overflow-y: auto;
`

const PopupTitle = styled.h2`
  font-size: 24px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
`

const BeastInfo = styled.div`
  background: var(--brutal-cyan);
  border: 3px solid var(--border-primary);
  padding: 16px;
  margin-bottom: 24px;
  text-align: center;
`

const BeastName = styled.div`
  font-size: 18px;
  font-weight: 900;
  color: var(--text-primary);
  margin-bottom: 8px;
  text-transform: uppercase;
`

const LevelInfo = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
`

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: var(--brutal-violet);
  padding: 8px 16px;
  border: 3px solid var(--border-primary);
  display: inline-block;
`

const CurrentMovesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
`

const MoveSlot = styled.div<{ $empty?: boolean; $selected?: boolean }>`
  background: ${props => 
    props.$selected ? 'var(--brutal-yellow)' : 
    props.$empty ? 'var(--light-bg)' : 'var(--brutal-orange)'
  };
  border: 3px solid var(--border-primary);
  padding: 12px;
  text-align: center;
  cursor: ${props => props.$empty ? 'pointer' : 'default'};
  transition: all 0.1s ease;
  opacity: ${props => props.$empty ? 0.7 : 1};
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  
  &:hover {
    ${props => props.$empty && `
      background: var(--brutal-lime);
      transform: translate(1px, 1px);
      box-shadow: 1px 1px 0px 0px var(--border-primary);
    `}
  }
`

const MoveName = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: var(--text-primary);
  margin-bottom: 8px;
  text-transform: uppercase;
`

const MoveDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`

const MoveType = styled.div<{ $type: string }>`
  font-size: 10px;
  font-weight: 900;
  color: var(--text-primary);
  background: ${props => {
    switch (props.$type) {
      case 'fire': return 'var(--brutal-red)'
      case 'water': return 'var(--brutal-cyan)'
      case 'earth': return 'var(--brutal-lime)'
      case 'electric': return 'var(--brutal-yellow)'
      default: return 'var(--brutal-pink)'
    }
  }};
  padding: 4px 6px;
  border: 2px solid var(--border-primary);
  text-transform: uppercase;
`

const MoveDamage = styled.div`
  font-size: 10px;
  font-weight: 900;
  color: var(--text-primary);
  background: var(--brutal-violet);
  padding: 4px 6px;
  border: 2px solid var(--border-primary);
  text-transform: uppercase;
`

const EmptySlotText = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  opacity: 0.7;
`

const AvailableMovesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
`

const AvailableMoveCard = styled.div<{ $selected?: boolean }>`
  background: ${props => props.$selected ? 'var(--brutal-yellow)' : 'var(--brutal-lime)'};
  border: 3px solid var(--border-primary);
  padding: 16px;
  cursor: pointer;
  transition: all 0.1s ease;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  
  &:hover {
    background: var(--brutal-cyan);
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px 0px var(--border-primary);
  }
`

const MoveDescription = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  margin-top: 8px;
  line-height: 1.4;
`

const PopupButtons = styled.div`
  display: flex;
  gap: 12px;
`

const PopupButton = styled(Button)`
  flex: 1;
  font-size: 14px;
  padding: 12px;
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

export function LearnMoveModal({ 
  beastId, 
  beastName, 
  currentLevel, 
  currentMoves, 
  availableMoves, 
  onConfirm, 
  onClose 
}: LearnMoveModalProps) {
  const [selectedMove, setSelectedMove] = useState<Move | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)

  // Create 4 slots, fill with current moves
  const moveSlots = Array(4).fill(null).map((_, index) => currentMoves[index] || null)

  const handleSlotClick = (index: number) => {
    if (!moveSlots[index]) { // Only allow selecting empty slots
      setSelectedSlot(index)
    }
  }

  const handleMoveSelect = (move: Move) => {
    setSelectedMove(move)
  }

  const handleConfirm = () => {
    if (selectedMove && selectedSlot !== null) {
      onConfirm(beastId, selectedMove.id, selectedSlot)
    }
  }

  const canConfirm = selectedMove && selectedSlot !== null

  return (
    <PopupOverlay onClick={onClose}>
      <PopupContent onClick={(e) => e.stopPropagation()}>
        <PopupTitle>📚 LEARN NEW MOVE</PopupTitle>
        
        <BeastInfo>
          <BeastName>{beastName}</BeastName>
          <LevelInfo>Level {currentLevel} - New Move Available!</LevelInfo>
        </BeastInfo>

        <SectionTitle>Current Moves</SectionTitle>
        <CurrentMovesGrid>
          {moveSlots.map((move, index) => (
            <MoveSlot
              key={index}
              $empty={!move}
              $selected={selectedSlot === index}
              onClick={() => handleSlotClick(index)}
            >
              {move ? (
                <>
                  <MoveName>{move.name}</MoveName>
                  <MoveDetails>
                    <MoveType $type={move.elementType}>
                      {getTypeIcon(move.elementType)} {move.elementType}
                    </MoveType>
                    <MoveDamage>{move.damage} DMG</MoveDamage>
                  </MoveDetails>
                </>
              ) : (
                <EmptySlotText>
                  {selectedSlot === index ? 'SELECTED SLOT' : 'EMPTY SLOT'}
                </EmptySlotText>
              )}
            </MoveSlot>
          ))}
        </CurrentMovesGrid>

        <SectionTitle>Available Moves</SectionTitle>
        <AvailableMovesGrid>
          {availableMoves.map((move) => (
            <AvailableMoveCard
              key={move.id}
              $selected={selectedMove?.id === move.id}
              onClick={() => handleMoveSelect(move)}
            >
              <MoveName>{move.name}</MoveName>
              <MoveDetails>
                <MoveType $type={move.elementType}>
                  {getTypeIcon(move.elementType)} {move.elementType}
                </MoveType>
                <MoveDamage>{move.damage} DMG</MoveDamage>
              </MoveDetails>
              <MoveDescription>
                A powerful {move.elementType} type attack that deals {move.damage} damage to enemies.
              </MoveDescription>
            </AvailableMoveCard>
          ))}
        </AvailableMovesGrid>

        <PopupButtons>
          <PopupButton onClick={onClose}>
            Cancel
          </PopupButton>
          <PopupButton 
            onClick={handleConfirm}
            disabled={!canConfirm}
          >
            Learn Move
          </PopupButton>
        </PopupButtons>
      </PopupContent>
    </PopupOverlay>
  )
}