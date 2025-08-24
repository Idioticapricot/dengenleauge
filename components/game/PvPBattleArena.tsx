"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { Button, Card } from "../styled/GlobalStyles"
import { usePvPBattle, Beast, BattleAction } from "../../hooks/usePvPBattle"
import { useWallet } from "../wallet/WalletProvider"

const ArenaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const BattleHeader = styled.div`
  background: var(--brutal-red);
  border: 4px solid var(--border-primary);
  padding: 20px;
  text-align: center;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const BattleTitle = styled.h1`
  font-size: 24px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 2px;
`

const TurnInfo = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const Timer = styled.div`
  font-size: 20px;
  font-weight: 900;
  color: var(--text-primary);
  background: var(--brutal-yellow);
  padding: 8px 16px;
  border: 3px solid var(--border-primary);
  margin-top: 8px;
  display: inline-block;
`

const PlayersContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`

const PlayerSection = styled.div<{ $isCurrentPlayer: boolean; $isCurrentTurn: boolean }>`
  background: ${props => 
    props.$isCurrentTurn ? "var(--brutal-lime)" : 
    props.$isCurrentPlayer ? "var(--brutal-cyan)" : "var(--light-bg)"
  };
  border: 4px solid var(--border-primary);
  padding: 16px;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const PlayerName = styled.h3`
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  text-align: center;
`

const BeastsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`

const BeastCard = styled.div<{ $alive: boolean; $selectable?: boolean }>`
  background: ${props => props.$alive ? "var(--brutal-pink)" : "var(--brutal-red)"};
  border: 3px solid var(--border-primary);
  padding: 8px;
  text-align: center;
  opacity: ${props => props.$alive ? 1 : 0.5};
  cursor: ${props => props.$selectable ? "pointer" : "default"};
  transition: all 0.1s ease;
  
  ${props => props.$selectable && `
    &:hover {
      background: var(--brutal-yellow);
      transform: translate(1px, 1px);
    }
  `}
`

const BeastIcon = styled.div`
  font-size: 20px;
  margin-bottom: 4px;
`

const BeastName = styled.div`
  font-size: 10px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  margin-bottom: 4px;
`

const HealthBar = styled.div`
  background: var(--brutal-red);
  border: 2px solid var(--border-primary);
  height: 8px;
  position: relative;
  margin-bottom: 4px;
`

const HealthFill = styled.div<{ $percentage: number }>`
  background: var(--brutal-lime);
  height: 100%;
  width: ${props => props.$percentage}%;
  transition: width 0.3s ease;
`

const ActionPanel = styled.div`
  background: var(--brutal-violet);
  border: 4px solid var(--border-primary);
  padding: 20px;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
`

const ActionButton = styled(Button)<{ $selected?: boolean }>`
  background: ${props => props.$selected ? "var(--brutal-yellow)" : "var(--brutal-orange)"};
  
  &:hover {
    background: var(--brutal-lime);
  }
  
  &:disabled {
    background: var(--brutal-red);
    opacity: 0.5;
  }
`

const BattleLog = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  padding: 16px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const LogEntry = styled.div`
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--text-primary);
  margin-bottom: 8px;
  padding: 4px 8px;
  background: var(--brutal-cyan);
  border: 2px solid var(--border-primary);
`

const WaitingMessage = styled.div`
  text-align: center;
  padding: 40px;
  background: var(--brutal-yellow);
  border: 4px solid var(--border-primary);
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
`

const WinnerAnnouncement = styled.div`
  text-align: center;
  padding: 40px;
  background: var(--brutal-lime);
  border: 4px solid var(--border-primary);
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 24px;
`

interface PvPBattleArenaProps {
  roomCode: string
  onExit: () => void
}

export function PvPBattleArena({ roomCode, onExit }: PvPBattleArenaProps) {
  const { wallet } = useWallet()
  const { battles, performAction, leaveBattle } = usePvPBattle()
  const [selectedAction, setSelectedAction] = useState<"attack" | "defend" | "special" | null>(null)
  const [selectedBeast, setSelectedBeast] = useState<string | null>(null)
  const [targetBeast, setTargetBeast] = useState<string | null>(null)

  const battle = Object.values(battles).find(b => b.roomCode === roomCode)

  const myTeam = battle?.teams.team1.players[wallet.address || ""] ? "team1" : "team2"
  const currentPlayer = battle?.teams[myTeam]?.players[wallet.address || ""]
  const isMyTurn = battle?.currentTurn === wallet.address
  const opponentTeam = myTeam === "team1" ? "team2" : "team1"
  const opponents = Object.values(battle?.teams[opponentTeam]?.players || {})

  const handleAction = () => {
    if (!selectedAction || !selectedBeast || !battle) return

    performAction({
      playerId: wallet.address || "",
      type: selectedAction,
      beastId: selectedBeast,
      targetBeastId: selectedAction === "attack" ? targetBeast : undefined
    })

    // Reset selections
    setSelectedAction(null)
    setSelectedBeast(null)
    setTargetBeast(null)
  }

  const handleExit = () => {
    leaveBattle()
    onExit()
  }

  const formatLogEntry = (action: BattleAction) => {
    const allPlayers = {
      ...battle?.teams.team1.players,
      ...battle?.teams.team2.players
    }
    const player = allPlayers[action.playerId]
    const playerName = player?.name || "Unknown"
    
    if (action.type === "attack") {
      return `${playerName} attacked for ${action.damage} damage!`
    } else if (action.type === "defend") {
      return `${playerName} defended!`
    } else if (action.type === "special") {
      return `${playerName} used special ability!`
    }
    return `${playerName} performed an action`
  }

  if (!battle) {
    return (
      <Card>
        <h2>Battle not found</h2>
        <Button onClick={onExit}>Back to Lobby</Button>
      </Card>
    )
  }

  if (battle.status === "waiting") {
    return (
      <ArenaContainer>
        <WaitingMessage>
          Waiting for {battle.mode === "1v1" ? "1 player" : "3 players"} to join...
          <br />
          Room Code: {roomCode}
          <br />
          Mode: {battle.mode.toUpperCase()}
          <br />
          <Button onClick={handleExit} style={{ marginTop: "16px" }}>
            Exit Room
          </Button>
        </WaitingMessage>
      </ArenaContainer>
    )
  }

  if (battle.status === "finished") {
    const isWinner = battle.winner === myTeam
    return (
      <ArenaContainer>
        <WinnerAnnouncement>
          {isWinner ? "🎉 YOUR TEAM WINS! 🎉" : "💀 YOUR TEAM LOSES 💀"}
          <br />
          <Button onClick={handleExit} style={{ marginTop: "20px" }}>
            Back to Lobby
          </Button>
        </WinnerAnnouncement>
      </ArenaContainer>
    )
  }

  return (
    <ArenaContainer>
      <BattleHeader>
        <BattleTitle>⚔️ PVP BATTLE</BattleTitle>
        <TurnInfo>
          {isMyTurn ? "YOUR TURN" : "OPPONENT'S TURN"}
        </TurnInfo>
        <Timer>{battle.turnTimeLeft}s</Timer>
      </BattleHeader>

      <PlayersContainer>
        <PlayerSection $isCurrentPlayer={true} $isCurrentTurn={isMyTurn}>
          <PlayerName>YOU ({currentPlayer?.name})</PlayerName>
          <BeastsGrid>
            {currentPlayer?.beasts.map(beast => (
              <BeastCard
                key={beast.id}
                $alive={beast.currentHealth > 0}
                $selectable={isMyTurn && selectedAction !== null}
                onClick={() => isMyTurn && selectedAction && setSelectedBeast(beast.id)}
              >
                <BeastIcon>{beast.icon}</BeastIcon>
                <BeastName>{beast.name}</BeastName>
                <HealthBar>
                  <HealthFill $percentage={(beast.currentHealth / beast.stats.health) * 100} />
                </HealthBar>
                <div style={{ fontSize: "8px", color: "var(--text-primary)" }}>
                  {beast.currentHealth}/{beast.stats.health}
                </div>
              </BeastCard>
            ))}
          </BeastsGrid>
        </PlayerSection>

        <PlayerSection $isCurrentPlayer={false} $isCurrentTurn={!isMyTurn}>
          <PlayerName>OPPONENT TEAM</PlayerName>
          <BeastsGrid>
            {opponents.flatMap(opponent => opponent.beasts).slice(0, 6).map(beast => (
              <BeastCard
                key={beast.id}
                $alive={beast.currentHealth > 0}
                $selectable={isMyTurn && selectedAction === "attack"}
                onClick={() => isMyTurn && selectedAction === "attack" && setTargetBeast(beast.id)}
              >
                <BeastIcon>{beast.icon}</BeastIcon>
                <BeastName>{beast.name}</BeastName>
                <HealthBar>
                  <HealthFill $percentage={(beast.currentHealth / beast.stats.health) * 100} />
                </HealthBar>
                <div style={{ fontSize: "8px", color: "var(--text-primary)" }}>
                  {beast.currentHealth}/{beast.stats.health}
                </div>
              </BeastCard>
            ))}
          </BeastsGrid>
        </PlayerSection>
      </PlayersContainer>

      {isMyTurn && (
        <ActionPanel>
          <h3 style={{ margin: "0 0 16px 0", color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
            CHOOSE ACTION
          </h3>
          <ActionButtons>
            <ActionButton
              $selected={selectedAction === "attack"}
              onClick={() => setSelectedAction("attack")}
            >
              ATTACK
            </ActionButton>
            <ActionButton
              $selected={selectedAction === "defend"}
              onClick={() => setSelectedAction("defend")}
            >
              DEFEND
            </ActionButton>
            <ActionButton
              $selected={selectedAction === "special"}
              onClick={() => setSelectedAction("special")}
            >
              SPECIAL
            </ActionButton>
          </ActionButtons>
          
          <Button
            onClick={handleAction}
            disabled={!selectedAction || !selectedBeast || (selectedAction === "attack" && !targetBeast)}
            $fullWidth
          >
            EXECUTE ACTION
          </Button>
          
          <div style={{ marginTop: "12px", fontSize: "12px", color: "var(--text-primary)" }}>
            {selectedAction && `Action: ${selectedAction.toUpperCase()}`}
            {selectedBeast && ` | Beast: Selected`}
            {selectedAction === "attack" && targetBeast && ` | Target: Selected`}
          </div>
        </ActionPanel>
      )}

      <BattleLog>
        <h3 style={{ margin: "0 0 12px 0", color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
          BATTLE LOG
        </h3>
        {battle.actions.length === 0 ? (
          <div style={{ color: "var(--text-primary)", fontStyle: "italic" }}>
            Battle started! Make your first move.
          </div>
        ) : (
          battle.actions.slice(-10).map(action => (
            <LogEntry key={action.id}>
              {formatLogEntry(action)}
            </LogEntry>
          ))
        )}
      </BattleLog>

      <Button onClick={handleExit} style={{ background: "var(--brutal-red)" }}>
        Exit Battle
      </Button>
    </ArenaContainer>
  )
}