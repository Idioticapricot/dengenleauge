"use client"

import styled from "styled-components"
interface BattleBeast {
  id: string
  name: string
  maxHP: number
  currentHP: number
  power: number
  stamina: number
  elementType: string
  imageUrl: string | null
}

interface BattleArenaProps {
  playerBeast: BattleBeast
  opponentBeast: BattleBeast
  isPlayerTurn: boolean
  winner?: string | null
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

const BeastImageContainer = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  border: 3px solid var(--border-primary);
  overflow: hidden;
  position: relative;
`

const BeastImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
`

const BeastIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  border: 3px solid var(--border-primary);
  background: ${props => {
    switch (props.elementType) {
      case 'fire': return 'var(--brutal-red)'
      case 'water': return 'var(--brutal-cyan)'
      case 'earth': return 'var(--brutal-lime)'
      case 'electric': return 'var(--brutal-yellow)'
      default: return 'var(--brutal-pink)'
    }
  }};
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

export function BattleArena({ playerBeast, opponentBeast, isPlayerTurn, winner }: BattleArenaProps) {
  const playerHealthPercentage = (playerBeast.currentHP / playerBeast.maxHP) * 100
  const opponentHealthPercentage = (opponentBeast.currentHP / opponentBeast.maxHP) * 100

  return (
    <ArenaContainer>
      {!winner && (
        <TurnIndicator $isPlayerTurn={isPlayerTurn}>
          {isPlayerTurn ? 'YOUR TURN' : 'OPPONENT TURN'}
        </TurnIndicator>
      )}
      
      {winner && (
        <TurnIndicator $isPlayerTurn={winner === 'player1'}>
          {winner === 'player1' ? 'YOU WIN!' : 'YOU LOSE!'}
        </TurnIndicator>
      )}
      
      <ArenaTitle>BATTLE ARENA</ArenaTitle>
      
      <BeastBattleGrid>
        <BeastBattleCard $isPlayer={true} $isActive={isPlayerTurn}>
          {playerBeast.imageUrl ? (
            <BeastImageContainer>
              <BeastImage 
                src={playerBeast.imageUrl} 
                alt={playerBeast.name}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.setAttribute('style', 'display: flex')
                }}
              />
              <BeastIcon 
                elementType={playerBeast.elementType}
                style={{ display: 'none' }}
              >
                {getElementIcon(playerBeast.elementType)}
              </BeastIcon>
            </BeastImageContainer>
          ) : (
            <BeastIcon elementType={playerBeast.elementType}>
              {getElementIcon(playerBeast.elementType)}
            </BeastIcon>
          )}
          <BeastName>{playerBeast.name}</BeastName>
          <BeastLevel>HP {playerBeast.currentHP}/{playerBeast.maxHP}</BeastLevel>
          
          <HealthBar>
            <HealthFill $percentage={playerHealthPercentage} />
            <HealthText>{Math.round(playerHealthPercentage)}%</HealthText>
          </HealthBar>
          
          <StatsRow>
            <StatBadge>HP {playerBeast.maxHP}</StatBadge>
            <StatBadge>STA {playerBeast.stamina}</StatBadge>
            <StatBadge>PWR {playerBeast.power}</StatBadge>
          </StatsRow>
        </BeastBattleCard>

        <BeastBattleCard $isPlayer={false} $isActive={!isPlayerTurn}>
          {opponentBeast.imageUrl ? (
            <BeastImageContainer>
              <BeastImage 
                src={opponentBeast.imageUrl} 
                alt={opponentBeast.name}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.setAttribute('style', 'display: flex')
                }}
              />
              <BeastIcon 
                elementType={opponentBeast.elementType}
                style={{ display: 'none' }}
              >
                {getElementIcon(opponentBeast.elementType)}
              </BeastIcon>
            </BeastImageContainer>
          ) : (
            <BeastIcon elementType={opponentBeast.elementType}>
              {getElementIcon(opponentBeast.elementType)}
            </BeastIcon>
          )}
          <BeastName>{opponentBeast.name}</BeastName>
          <BeastLevel>HP {opponentBeast.currentHP}/{opponentBeast.maxHP}</BeastLevel>
          
          <HealthBar>
            <HealthFill $percentage={opponentHealthPercentage} />
            <HealthText>{Math.round(opponentHealthPercentage)}%</HealthText>
          </HealthBar>
          
          <StatsRow>
            <StatBadge>HP {opponentBeast.maxHP}</StatBadge>
            <StatBadge>STA {opponentBeast.stamina}</StatBadge>
            <StatBadge>PWR {opponentBeast.power}</StatBadge>
          </StatsRow>
        </BeastBattleCard>
      </BeastBattleGrid>

      <VsIndicator>VS</VsIndicator>
    </ArenaContainer>
  )
}