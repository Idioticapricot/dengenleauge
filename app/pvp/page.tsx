"use client"

import { useState } from "react"
import { AppLayout } from "../../components/layout/AppLayout"
import { PvPLobby } from "../../components/game/PvPLobby"
import { PvPBattleArena } from "../../components/game/PvPBattleArena"
import styled from "styled-components"
import { Button } from "../../components/styled/GlobalStyles"

const PvPContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const PvPHeader = styled.div`
  text-align: center;
  background: var(--brutal-red);
  padding: 24px;
  border: 4px solid var(--border-primary);
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
`

const PvPTitle = styled.h1`
  font-size: 32px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 3px 3px 0px var(--border-primary);
`

const PvPSubtitle = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`

const BackButton = styled(Button)`
  background: var(--brutal-orange);
  margin-bottom: 20px;
  
  &:hover {
    background: var(--brutal-yellow);
  }
`

type PvPState = "lobby" | "battle"

export default function PvPPage() {
  const [currentState, setCurrentState] = useState<PvPState>("lobby")
  const [currentRoomCode, setCurrentRoomCode] = useState<string | null>(null)

  const handleBattleStart = (roomCode: string) => {
    setCurrentRoomCode(roomCode)
    setCurrentState("battle")
  }

  const handleBattleExit = () => {
    setCurrentRoomCode(null)
    setCurrentState("lobby")
  }

  return (
    <AppLayout>
      <PvPContainer>
        {currentState === "battle" && (
          <BackButton onClick={handleBattleExit}>
            ← BACK TO LOBBY
          </BackButton>
        )}

        <PvPHeader>
          <PvPTitle>⚔️ PVP BATTLES</PvPTitle>
          <PvPSubtitle>
            {currentState === "lobby" 
              ? "Challenge players or join battles"
              : "Battle in progress"
            }
          </PvPSubtitle>
        </PvPHeader>

        {currentState === "lobby" && (
          <PvPLobby onBattleStart={handleBattleStart} />
        )}

        {currentState === "battle" && currentRoomCode && (
          <PvPBattleArena 
            roomCode={currentRoomCode} 
            onExit={handleBattleExit}
          />
        )}
      </PvPContainer>
    </AppLayout>
  )
}