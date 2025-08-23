"use client"

import styled from "styled-components"
import { Beast } from '../../types/beast'

interface BattleArenaProps {
  playerBeast: Beast
  opponentBeast: Beast
  isPlayerTurn: boolean
}

const ArenaContainer = styled.div`
  background: var(--brutal-violet);
  border: 4px solid var(--border-primary);
  padding: 32px;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  position: relative;
  min-height: 300px;
`

const ArenaTitle = styled.h2`
  font-size: 20px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 24px 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: var(--font-mono);
`

const BeastBattleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
`

const BeastBattleCard = styled.div<{ $isPlayer?: boolean; $isActive?: boolean }>`
  background: ${props => props.$isActive ? 'var(--brutal-lime)' : 'var(--light-bg)'};
  border: 4px solid var(--border-primary);
  padding: 20px;
  text-align: center;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  transition: all 0.3s ease;
  
  ${props => props.$isActive && `
    transform: scale(1.05);
    box-shadow: 6px 6px 0px 0px var(--border-primary);
  `}
`

const BeastIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`

const BeastName = styled.h3`
  font-size: 18px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: var(--font-mono);
`

const BeastLevel = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: var(--text-primary);
  background: var(--brutal-pink);
  padding: 4px 8px;
  border: 2px solid var(--border-primary);
  display: inline-block;
  margin-bottom: 12px;
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const HealthBar = styled.div`
  background: var(--light-bg);
  border: 3px solid var(--border-primary);
  height: 20px;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;
`

const HealthFill = styled.div<{ $percentage: number }>`
  height: 100%;
  background: ${props => 
    props.$percentage > 60 ? 'var(--brutal-lime)' :
    props.$percentage > 30 ? 'var(--brutal-yellow)' :
    'var(--brutal-red)'
  };
  width: ${props => props.$percentage}%;
  transition: width 0.5s ease;
`

const HealthText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-shadow: 1px 1px 0px var(--border-primary);
`

const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`

const StatBadge = styled.div`
  background: var(--brutal-orange);
  border: 2px solid var(--border-primary);
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  flex: 1;
  text-align: center;
`

const TurnIndicator = styled.div<{ $isPlayerTurn: boolean }>`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.$isPlayerTurn ? 'var(--brutal-lime)' : 'var(--brutal-red)'};
  border: 3px solid var(--border-primary);
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 3px 3px 0px 0px var(--border-primary);
`

const VsIndicator = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--brutal-yellow);
  border: 4px solid var(--border-primary);
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  z-index: 10;
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

export function BattleArena({ playerBeast, opponentBeast, isPlayerTurn }: BattleArenaProps) {
  // Mock health percentages (in real game, this would come from battle state)
  const playerHealth = 85
  const opponentHealth = 72

  return (
    <ArenaContainer>
      <TurnIndicator $isPlayerTurn={isPlayerTurn}>
        {isPlayerTurn ? 'YOUR TURN' : 'OPPONENT TURN'}
      </TurnIndicator>
      
      <ArenaTitle>BATTLE ARENA</ArenaTitle>
      
      <BeastBattleGrid>
        <BeastBattleCard $isPlayer={true} $isActive={isPlayerTurn}>
          <BeastIcon>{getElementIcon(playerBeast.elementType)}</BeastIcon>
          <BeastName>{playerBeast.name}</BeastName>
          <BeastLevel>LV {playerBeast.level}</BeastLevel>
          
          <HealthBar>
            <HealthFill $percentage={playerHealth} />
            <HealthText>{playerHealth}%</HealthText>
          </HealthBar>
          
          <StatsRow>
            <StatBadge>HP {playerBeast.stats.health}</StatBadge>
            <StatBadge>STA {playerBeast.stats.stamina}</StatBadge>
            <StatBadge>PWR {playerBeast.stats.power}</StatBadge>
          </StatsRow>
        </BeastBattleCard>

        <BeastBattleCard $isPlayer={false} $isActive={!isPlayerTurn}>
          <BeastIcon>{getElementIcon(opponentBeast.elementType)}</BeastIcon>
          <BeastName>{opponentBeast.name}</BeastName>
          <BeastLevel>LV {opponentBeast.level}</BeastLevel>
          
          <HealthBar>
            <HealthFill $percentage={opponentHealth} />
            <HealthText>{opponentHealth}%</HealthText>
          </HealthBar>
          
          <StatsRow>
            <StatBadge>HP {opponentBeast.stats.health}</StatBadge>
            <StatBadge>STA {opponentBeast.stats.stamina}</StatBadge>
            <StatBadge>PWR {opponentBeast.stats.power}</StatBadge>
          </StatsRow>
        </BeastBattleCard>
      </BeastBattleGrid>

      <VsIndicator>VS</VsIndicator>
    </ArenaContainer>
  )
}