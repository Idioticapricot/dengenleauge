"use client"

import styled from "styled-components"
import { Beast } from '../../types/beast'

interface BeastSwitcherProps {
  team: Beast[]
  currentBeastId: string
  onSelect: (beastId: string) => void
  onClose: () => void
}

const ModalOverlay = styled.div`
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

const ModalContainer = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  padding: 24px;
  max-width: 500px;
  width: 90%;
  box-shadow: 8px 8px 0px 0px var(--border-primary);
`

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 20px 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: var(--font-mono);
  background: var(--brutal-cyan);
  padding: 12px;
  border: 3px solid var(--border-primary);
`

const BeastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`

const BeastCard = styled.div<{ $disabled?: boolean; $current?: boolean }>`
  background: ${props => 
    props.$current ? 'var(--brutal-red)' : 
    props.$disabled ? 'var(--brutal-red)' : 'var(--brutal-lime)'
  };
  border: 4px solid var(--border-primary);
  padding: 16px;
  text-align: center;
  cursor: ${props => props.$disabled || props.$current ? 'not-allowed' : 'pointer'};
  transition: all 0.1s ease;
  box-shadow: 3px 3px 0px 0px var(--border-primary);
  opacity: ${props => props.$disabled || props.$current ? 0.6 : 1};
  
  &:hover:not([disabled]) {
    transform: ${props => props.$disabled || props.$current ? 'none' : 'translate(2px, 2px)'};
    box-shadow: ${props => props.$disabled || props.$current ? '3px 3px 0px 0px var(--border-primary)' : '1px 1px 0px 0px var(--border-primary)'};
    background: ${props => props.$disabled || props.$current ? (props.$current ? 'var(--brutal-red)' : 'var(--brutal-red)') : 'var(--brutal-yellow)'};
  }
`

const BeastImage = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto 12px;
  border: 3px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  background: var(--brutal-pink);
`

const BeastName = styled.h3`
  font-size: 14px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: var(--font-mono);
`

const BeastStats = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 4px;
  margin-bottom: 8px;
`

const StatBadge = styled.div`
  background: var(--brutal-orange);
  border: 2px solid var(--border-primary);
  padding: 2px 4px;
  font-size: 10px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  flex: 1;
  text-align: center;
`

const BeastStatus = styled.div<{ $current?: boolean }>`
  font-size: 10px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  background: ${props => props.$current ? 'var(--brutal-red)' : 'var(--brutal-violet)'};
  padding: 4px 8px;
  border: 2px solid var(--border-primary);
`

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`

const ModalButton = styled.button<{ $type: 'cancel' | 'confirm' }>`
  background: ${props => props.$type === 'cancel' ? 'var(--brutal-red)' : 'var(--brutal-lime)'};
  border: 4px solid var(--border-primary);
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.1s ease;
  box-shadow: 3px 3px 0px 0px var(--border-primary);
  font-size: 14px;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: var(--font-mono);
  
  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px 0px var(--border-primary);
    background: var(--brutal-orange);
  }
`

const getElementIcon = (type: string) => {
  switch (type) {
    case 'fire': return '🔥'
    case 'water': return '🌊'
    case 'earth': return '🌍'
    case 'electric': return '⚡'
    default: return '❓'
  }
}

export function BeastSwitcher({ team, currentBeastId, onSelect, onClose }: BeastSwitcherProps) {
  const availableBeasts = team.filter(beast => beast.id !== currentBeastId)

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalTitle>🔄 SWITCH BEAST</ModalTitle>
        
        <BeastGrid>
          {availableBeasts.map((beast) => {
            const isDefeated = beast.stats.health <= 0 // Assuming 0 HP means defeated
            const isCurrent = beast.id === currentBeastId
            
            return (
              <BeastCard
                key={beast.id}
                $disabled={isDefeated}
                $current={isCurrent}
                onClick={() => !isDefeated && !isCurrent && onSelect(beast.id)}
              >
                <BeastImage>
                  {beast.imageUrl ? (
                    <img 
                      src={beast.imageUrl} 
                      alt={beast.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        imageRendering: 'pixelated'
                      }}
                    />
                  ) : (
                    getElementIcon(beast.elementType)
                  )}
                </BeastImage>
                
                <BeastName>{beast.name}</BeastName>
                
                <BeastStats>
                  <StatBadge>HP {beast.stats.health}</StatBadge>
                  <StatBadge>STA {beast.stats.stamina}</StatBadge>
                  <StatBadge>PWR {beast.stats.power}</StatBadge>
                </BeastStats>
                
                <BeastStatus $current={isCurrent}>
                  {isCurrent ? 'ACTIVE' : isDefeated ? 'DEFEATED' : 'READY'}
                </BeastStatus>
              </BeastCard>
            )
          })}
        </BeastGrid>
        
        <ButtonRow>
          <ModalButton $type="cancel" onClick={onClose}>
            ❌ CANCEL
          </ModalButton>
        </ButtonRow>
      </ModalContainer>
    </ModalOverlay>
  )
}