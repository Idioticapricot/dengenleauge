"use client"

import { useState } from "react"
import { AppLayout } from "../../components/layout/AppLayout"
import styled from "styled-components"
import { Button } from "../../components/styled/GlobalStyles"
import { mockBeasts } from "../../data/mockBeasts"
import { Beast, Move } from "../../types/beast"
import { BattleArena } from "../../components/battle/BattleArena"
import { MoveSelector } from "../../components/battle/MoveSelector"
import { BattleLog } from "../../components/battle/BattleLog"

const BattleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100vh;
`

const BattleHeader = styled.div`
  background: var(--brutal-red);
  border: 4px solid var(--border-primary);
  padding: 20px;
  text-align: center;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const BattleTitle = styled.h1`
  font-size: 28px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: var(--font-mono);
`

const BattleStatus = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  margin-top: 8px;
  text-transform: uppercase;
  font-family: var(--font-mono);
`

const BattleContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`

const StartBattleButton = styled(Button)`
  background: var(--brutal-orange);
  font-size: 18px;
  padding: 16px 32px;
  text-transform: uppercase;
  letter-spacing: 2px;
  
  &:hover {
    background: var(--brutal-yellow);
  }
`

const BattleModeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
`

const ModeCard = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.1s ease;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  
  &:hover {
    background: var(--brutal-lime);
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px var(--border-primary);
  }
`

const ModeIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`

const ModeTitle = styled.h2`
  font-size: 24px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: var(--font-mono);
`

const ModeDesc = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  font-family: var(--font-mono);
`

const ModeReward = styled.div`
  background: var(--brutal-yellow);
  border: 3px solid var(--border-primary);
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-block;
`

const ArenaSetup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 40px;
`

const BackButton = styled(Button)`
  background: var(--brutal-red);
  align-self: flex-start;
  
  &:hover {
    background: var(--brutal-orange);
  }
`

const TeamDisplay = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  padding: 24px;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const TeamTitle = styled.h2`
  font-size: 20px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: var(--font-mono);
  background: var(--brutal-cyan);
  padding: 8px 16px;
  border: 3px solid var(--border-primary);
`

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`

const TeamSlot = styled.div`
  background: var(--brutal-lime);
  border: 4px solid var(--border-primary);
  padding: 20px;
  text-align: center;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
`

const BeastIcon = styled.div`
  font-size: 32px;
  margin-bottom: 8px;
`

const BeastName = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  margin-bottom: 4px;
`

const BeastLevel = styled.div`
  font-size: 10px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  background: var(--brutal-pink);
  padding: 2px 6px;
  border: 2px solid var(--border-primary);
`

interface BattleState {
  id: string
  player1Team: Beast[]
  player2Team: Beast[]
  currentTurn: number
  phase: 'setup' | 'battle' | 'ended'
  winner?: string
  activeBeast1: Beast
  activeBeast2: Beast
  log: string[]
}

export default function BattlePage() {
  const [battleMode, setBattleMode] = useState<'select' | 'arena' | 'combat'>('select')
  const [selectedMode, setSelectedMode] = useState<'pvp' | 'pve' | null>(null)
  const [battleState, setBattleState] = useState<BattleState | null>(null)
  const [selectedMove, setSelectedMove] = useState<Move | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const player1Team = mockBeasts.slice(0, 3)
  const player2Team = mockBeasts.slice(3, 6)

  const selectMode = (mode: 'pvp' | 'pve') => {
    setSelectedMode(mode)
    setBattleMode('arena')
  }

  const startBattle = () => {
    if (!selectedMode) return
    
    const opponentName = selectedMode === 'pve' ? 'Wild ' + player2Team[0].name : player2Team[0].name
    const newBattle: BattleState = {
      id: 'battle_' + Date.now(),
      player1Team,
      player2Team,
      currentTurn: 1,
      phase: 'battle',
      activeBeast1: player1Team[0],
      activeBeast2: player2Team[0],
      log: [
        selectedMode === 'pve' ? 'PvE Battle started!' : 'PvP Battle started!',
        `${player1Team[0].name} vs ${opponentName}`
      ]
    }
    setBattleState(newBattle)
    setBattleMode('combat')
  }

  const handleMoveSelect = async (move: Move) => {
    if (!battleState || isProcessing) return
    
    setIsProcessing(true)
    setSelectedMove(move)

    await new Promise(resolve => setTimeout(resolve, 1000))

    const damage = Math.floor(move.damage * (0.8 + Math.random() * 0.4))
    const newLog = [
      ...battleState.log,
      `${battleState.activeBeast1.name} used ${move.name}!`,
      `Dealt ${damage} damage to ${battleState.activeBeast2.name}!`
    ]

    const aiMove = battleState.activeBeast2.moves[Math.floor(Math.random() * battleState.activeBeast2.moves.length)]
    const aiDamage = Math.floor(aiMove.damage * (0.8 + Math.random() * 0.4))
    
    newLog.push(`${battleState.activeBeast2.name} used ${aiMove.name}!`)
    newLog.push(`Dealt ${aiDamage} damage to ${battleState.activeBeast1.name}!`)

    setBattleState({
      ...battleState,
      currentTurn: battleState.currentTurn + 1,
      log: newLog
    })

    setIsProcessing(false)
    setSelectedMove(null)
  }

  const handleEndBattle = () => {
    setBattleState(null)
    setSelectedMove(null)
    setBattleMode('select')
    setSelectedMode(null)
  }

  const handleBackToModeSelect = () => {
    setBattleMode('select')
    setSelectedMode(null)
  }

  if (battleMode === 'select') {
    return (
      <AppLayout>
        <BattleContainer>
          <BattleHeader>
            <BattleTitle>⚔️ BATTLE ARENA</BattleTitle>
            <BattleStatus>Choose battle mode</BattleStatus>
          </BattleHeader>
          
          <BattleModeSelector>
            <ModeCard onClick={() => selectMode('pvp')}>
              <ModeIcon>👥</ModeIcon>
              <ModeTitle>PvP BATTLE</ModeTitle>
              <ModeDesc>Fight against other players</ModeDesc>
              <ModeReward>Stake: 20 $WAM</ModeReward>
            </ModeCard>
            
            <ModeCard onClick={() => selectMode('pve')}>
              <ModeIcon>🐲</ModeIcon>
              <ModeTitle>PvE BATTLE</ModeTitle>
              <ModeDesc>Fight wild beasts</ModeDesc>
              <ModeReward>Earn EXP & Loot</ModeReward>
            </ModeCard>
          </BattleModeSelector>
        </BattleContainer>
      </AppLayout>
    )
  }

  if (battleMode === 'arena') {
    return (
      <AppLayout>
        <BattleContainer>
          <BattleHeader>
            <BattleTitle>⚔️ BATTLE ARENA</BattleTitle>
            <BattleStatus>Challenge other trainers</BattleStatus>
          </BattleHeader>
          
          <ArenaSetup>
            <BackButton onClick={handleBackToModeSelect}>
              ← BACK TO MODE SELECT
            </BackButton>
            
            <TeamDisplay>
              <TeamTitle>MY TEAM ({selectedMode?.toUpperCase()})</TeamTitle>
              <TeamGrid>
                {player1Team.map((beast, index) => (
                  <TeamSlot key={index}>
                    <BeastIcon>{beast.elementType === 'fire' ? '🔥' : beast.elementType === 'water' ? '🌊' : beast.elementType === 'earth' ? '🌍' : '⚡'}</BeastIcon>
                    <BeastName>{beast.name}</BeastName>
                    <BeastLevel>LVL {beast.level}</BeastLevel>
                  </TeamSlot>
                ))}
              </TeamGrid>
            </TeamDisplay>
            
            <StartBattleButton onClick={startBattle}>
              ⚔️ START {selectedMode?.toUpperCase()} BATTLE
            </StartBattleButton>
          </ArenaSetup>
        </BattleContainer>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <BattleContainer>
        <BattleHeader>
          <BattleTitle>
            ⚔️ {selectedMode === 'pve' ? 'PvE' : 'PvP'} BATTLE IN PROGRESS
          </BattleTitle>
          <BattleStatus>Turn {battleState.currentTurn}</BattleStatus>
        </BattleHeader>

        <BattleContent>
          <BattleArena
            playerBeast={battleState.activeBeast1}
            opponentBeast={battleState.activeBeast2}
            isPlayerTurn={!isProcessing}
          />
          
          <MoveSelector
            moves={battleState.activeBeast1.moves}
            onMoveSelect={handleMoveSelect}
            disabled={isProcessing}
          />
          
          <BattleLog 
            log={battleState.log}
            maxEntries={10}
          />
          
          <Button onClick={handleEndBattle}>
            END BATTLE
          </Button>
        </BattleContent>
      </BattleContainer>
    </AppLayout>
  )
}