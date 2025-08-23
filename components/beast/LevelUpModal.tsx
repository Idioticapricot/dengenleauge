"use client"

import { useState } from "react"
import styled from "styled-components"
import { Button } from "../styled/GlobalStyles"

interface LevelUpModalProps {
  beastId: string
  beastName: string
  currentLevel: number
  currentStats: { health: number; stamina: number; power: number }
  onConfirm: (beastId: string, statDistribution: { health: number; stamina: number; power: number }) => void
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
  max-width: 500px;
  width: 90%;
  font-family: var(--font-mono);
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

const StatsSection = styled.div`
  margin-bottom: 24px;
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

const StatControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--brutal-lime);
  border: 3px solid var(--border-primary);
  margin-bottom: 12px;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
`

const StatName = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
  flex: 1;
`

const StatValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const CurrentStat = styled.span`
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
  background: var(--brutal-pink);
  padding: 4px 8px;
  border: 2px solid var(--border-primary);
  min-width: 40px;
  text-align: center;
`

const StatArrow = styled.span`
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
`

const NewStat = styled.span`
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
  background: var(--brutal-orange);
  padding: 4px 8px;
  border: 2px solid var(--border-primary);
  min-width: 40px;
  text-align: center;
`

const StatButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const StatButton = styled.button`
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-primary);
  background: var(--brutal-yellow);
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 900;
  cursor: pointer;
  font-family: var(--font-mono);
  transition: all 0.1s ease;
  
  &:hover:not(:disabled) {
    background: var(--brutal-red);
    transform: translate(1px, 1px);
  }
  
  &:disabled {
    background: var(--brutal-red);
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const PointsRemaining = styled.div`
  background: var(--brutal-yellow);
  border: 3px solid var(--border-primary);
  padding: 12px;
  text-align: center;
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
  margin-bottom: 24px;
  text-transform: uppercase;
  letter-spacing: 1px;
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

export function LevelUpModal({ beastId, beastName, currentLevel, currentStats, onConfirm, onClose }: LevelUpModalProps) {
  const [statPoints, setStatPoints] = useState({ health: 0, stamina: 0, power: 0 })
  const availablePoints = 1 // +1 stat point per level
  const usedPoints = statPoints.health + statPoints.stamina + statPoints.power
  const remainingPoints = availablePoints - usedPoints

  const adjustStat = (stat: keyof typeof statPoints, delta: number) => {
    const newValue = statPoints[stat] + delta
    if (newValue >= 0 && (delta < 0 || remainingPoints > 0)) {
      setStatPoints(prev => ({ ...prev, [stat]: newValue }))
    }
  }

  const handleConfirm = () => {
    if (remainingPoints === 0) {
      const newStats = {
        health: currentStats.health + statPoints.health,
        stamina: currentStats.stamina + statPoints.stamina,
        power: currentStats.power + statPoints.power
      }
      onConfirm(beastId, newStats)
    }
  }

  return (
    <PopupOverlay onClick={onClose}>
      <PopupContent onClick={(e) => e.stopPropagation()}>
        <PopupTitle>⬆️ LEVEL UP!</PopupTitle>
        
        <BeastInfo>
          <BeastName>{beastName}</BeastName>
          <LevelInfo>Level {currentLevel} → Level {currentLevel + 1}</LevelInfo>
        </BeastInfo>

        <PointsRemaining>
          Points Remaining: {remainingPoints}
        </PointsRemaining>

        <StatsSection>
          <SectionTitle>Distribute Stat Points</SectionTitle>
          
          <StatControl>
            <StatName>Health</StatName>
            <StatValue>
              <CurrentStat>{currentStats.health}</CurrentStat>
              <StatArrow>→</StatArrow>
              <NewStat>{currentStats.health + statPoints.health}</NewStat>
            </StatValue>
            <StatButtons>
              <StatButton 
                onClick={() => adjustStat('health', -1)}
                disabled={statPoints.health <= 0}
              >
                -
              </StatButton>
              <StatButton 
                onClick={() => adjustStat('health', 1)}
                disabled={remainingPoints <= 0}
              >
                +
              </StatButton>
            </StatButtons>
          </StatControl>

          <StatControl>
            <StatName>Stamina</StatName>
            <StatValue>
              <CurrentStat>{currentStats.stamina}</CurrentStat>
              <StatArrow>→</StatArrow>
              <NewStat>{currentStats.stamina + statPoints.stamina}</NewStat>
            </StatValue>
            <StatButtons>
              <StatButton 
                onClick={() => adjustStat('stamina', -1)}
                disabled={statPoints.stamina <= 0}
              >
                -
              </StatButton>
              <StatButton 
                onClick={() => adjustStat('stamina', 1)}
                disabled={remainingPoints <= 0}
              >
                +
              </StatButton>
            </StatButtons>
          </StatControl>

          <StatControl>
            <StatName>Power</StatName>
            <StatValue>
              <CurrentStat>{currentStats.power}</CurrentStat>
              <StatArrow>→</StatArrow>
              <NewStat>{currentStats.power + statPoints.power}</NewStat>
            </StatValue>
            <StatButtons>
              <StatButton 
                onClick={() => adjustStat('power', -1)}
                disabled={statPoints.power <= 0}
              >
                -
              </StatButton>
              <StatButton 
                onClick={() => adjustStat('power', 1)}
                disabled={remainingPoints <= 0}
              >
                +
              </StatButton>
            </StatButtons>
          </StatControl>
        </StatsSection>

        <PopupButtons>
          <PopupButton onClick={onClose}>
            Cancel
          </PopupButton>
          <PopupButton 
            onClick={handleConfirm}
            disabled={remainingPoints !== 0}
          >
            Confirm Level Up
          </PopupButton>
        </PopupButtons>
      </PopupContent>
    </PopupOverlay>
  )
}