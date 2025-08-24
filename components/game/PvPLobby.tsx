"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { Button, Card } from "../styled/GlobalStyles"
import { usePvPBattle, Beast } from "../../hooks/usePvPBattle"
import { useWallet } from "../wallet/WalletProvider"
import { api } from "../../lib/api"

const LobbyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 2px;
  background: var(--brutal-cyan);
  padding: 8px 16px;
  border: 3px solid var(--border-primary);
  display: inline-block;
`

const PlayerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`

const PlayerCard = styled(Card)`
  padding: 16px;
  cursor: pointer;
  transition: all 0.1s ease;
  
  &:hover {
    background: var(--brutal-lime);
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px var(--border-primary);
  }
`

const PlayerAddress = styled.div`
  font-family: var(--font-mono);
  font-weight: 900;
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 8px;
  text-transform: uppercase;
`

const PlayerStatus = styled.div<{ $online: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
`

const StatusDot = styled.div<{ $online: boolean }>`
  width: 8px;
  height: 8px;
  border: 2px solid var(--border-primary);
  background: ${props => props.$online ? "var(--brutal-lime)" : "var(--brutal-red)"};
`

const BattleIdSection = styled.div`
  background: var(--brutal-yellow);
  border: 4px solid var(--border-primary);
  padding: 20px;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const BattleIdInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 3px solid var(--border-primary);
  background: var(--light-bg);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 12px;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    background: var(--brutal-lime);
  }
`

const BattleIdDisplay = styled.div`
  background: var(--brutal-violet);
  border: 3px solid var(--border-primary);
  padding: 12px;
  font-family: var(--font-mono);
  font-weight: 900;
  color: var(--text-primary);
  margin-bottom: 12px;
  word-break: break-all;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`

const ActionButton = styled(Button)`
  flex: 1;
  min-width: 120px;
`

const TeamSelection = styled.div`
  background: var(--brutal-pink);
  border: 4px solid var(--border-primary);
  padding: 20px;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  margin-bottom: 20px;
`

const BeastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`

const BeastCard = styled.div<{ $selected: boolean }>`
  background: ${props => props.$selected ? "var(--brutal-lime)" : "var(--light-bg)"};
  border: 3px solid var(--border-primary);
  padding: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.1s ease;
  
  &:hover {
    background: var(--brutal-cyan);
    transform: translate(1px, 1px);
  }
`

const BeastIcon = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
`

const BeastName = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const BeastStats = styled.div`
  font-size: 10px;
  color: var(--text-primary);
  font-family: var(--font-mono);
  margin-top: 4px;
`

interface PvPLobbyProps {
  onBattleStart: (battleId: string) => void
}



export function PvPLobby({ onBattleStart }: PvPLobbyProps) {
  const { wallet } = useWallet()
  const { onlinePlayers, createBattle, joinBattle } = usePvPBattle()
  const [roomCodeInput, setRoomCodeInput] = useState("")
  const [selectedBeasts, setSelectedBeasts] = useState<string[]>([])
  const [createdRoomCode, setCreatedRoomCode] = useState<string | null>(null)
  const [battleMode, setBattleMode] = useState<"1v1" | "2v2">("1v1")
  const [userBeasts, setUserBeasts] = useState<Beast[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch user's beasts
  useEffect(() => {
    const fetchUserBeasts = async () => {
      if (!wallet.address) return
      
      try {
        const beasts = await api.getUserBeasts(wallet.address)
        setUserBeasts(beasts)
      } catch (error) {
        console.error('Failed to fetch user beasts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserBeasts()
  }, [wallet.address])

  const handleBeastSelect = (beastId: string) => {
    setSelectedBeasts(prev => {
      if (prev.includes(beastId)) {
        return prev.filter(id => id !== beastId)
      } else if (prev.length < 3) {
        return [...prev, beastId]
      }
      return prev
    })
  }

  const handleCreateBattle = async () => {
    if (selectedBeasts.length !== 3) {
      alert("Please select exactly 3 beasts")
      return
    }

    const playerBeasts = userBeasts.filter(beast => selectedBeasts.includes(beast.id))
    const roomCode = await createBattle(playerBeasts, battleMode)
    setCreatedRoomCode(roomCode)
  }

  const handleJoinBattle = async () => {
    if (!roomCodeInput.trim()) {
      alert("Please enter a room code")
      return
    }

    if (selectedBeasts.length !== 3) {
      alert("Please select exactly 3 beasts")
      return
    }

    try {
      const playerBeasts = userBeasts.filter(beast => selectedBeasts.includes(beast.id))
      const battle = await joinBattle(roomCodeInput.trim().toUpperCase(), playerBeasts)
      onBattleStart(battle.id)
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to join room")
    }
  }

  const handleChallengePlayer = async (playerAddress: string) => {
    if (selectedBeasts.length !== 3) {
      alert("Please select exactly 3 beasts first")
      return
    }

    const playerBeasts = userBeasts.filter(beast => selectedBeasts.includes(beast.id))
    const roomCode = await createBattle(playerBeasts, battleMode)
    
    // Send challenge invitation via API
    try {
      await api.sendChallenge(roomCode, playerAddress)
    } catch (error) {
      console.error('Failed to send challenge:', error)
    }
    
    setCreatedRoomCode(roomCode)
  }

  const copyRoomCode = () => {
    if (createdRoomCode) {
      navigator.clipboard.writeText(createdRoomCode)
      alert("Room code copied to clipboard!")
    }
  }

  if (!wallet.isConnected) {
    return (
      <Card>
        <SectionTitle>Connect Wallet</SectionTitle>
        <p>Please connect your wallet to access PvP battles.</p>
      </Card>
    )
  }

  return (
    <LobbyContainer>
      <TeamSelection>
        <SectionTitle>Select Your Team (3 Beasts)</SectionTitle>
        <BeastGrid>
          {loading ? (
            <div>Loading beasts...</div>
          ) : userBeasts.length === 0 ? (
            <div>No beasts found. Create some beasts first!</div>
          ) : (
            userBeasts.map(beast => (
              <BeastCard
                key={beast.id}
                $selected={selectedBeasts.includes(beast.id)}
                onClick={() => handleBeastSelect(beast.id)}
              >
                <BeastIcon>{beast.icon}</BeastIcon>
                <BeastName>{beast.name}</BeastName>
                <BeastStats>
                  HP: {beast.stats.health} | PWR: {beast.stats.power}
                </BeastStats>
              </BeastCard>
            ))
          )}
        </BeastGrid>
        <p style={{ marginTop: "12px", fontSize: "12px", color: "var(--text-primary)" }}>
          Selected: {selectedBeasts.length}/3
        </p>
      </TeamSelection>

      <BattleIdSection>
        <SectionTitle>Battle Mode</SectionTitle>
        <ActionButtons>
          <ActionButton 
            onClick={() => setBattleMode("1v1")}
            style={{ background: battleMode === "1v1" ? "var(--brutal-lime)" : "var(--light-bg)" }}
          >
            1v1 Mode
          </ActionButton>
          <ActionButton 
            onClick={() => setBattleMode("2v2")}
            style={{ background: battleMode === "2v2" ? "var(--brutal-lime)" : "var(--light-bg)" }}
          >
            2v2 Mode
          </ActionButton>
        </ActionButtons>
        
        <SectionTitle style={{ marginTop: "20px" }}>Join Room</SectionTitle>
        <BattleIdInput
          placeholder="Enter Room Code (e.g. ABC123)..."
          value={roomCodeInput}
          onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
          maxLength={6}
        />
        <ActionButtons>
          <ActionButton onClick={handleJoinBattle}>
            Join Room
          </ActionButton>
          <ActionButton onClick={handleCreateBattle}>
            Create Room
          </ActionButton>
        </ActionButtons>
        
        {createdRoomCode && (
          <>
            <SectionTitle style={{ marginTop: "20px" }}>Your Room Code</SectionTitle>
            <BattleIdDisplay>{createdRoomCode}</BattleIdDisplay>
            <p style={{ fontSize: "12px", color: "var(--text-primary)", margin: "8px 0" }}>
              Share this code with {battleMode === "1v1" ? "1 player" : "3 players"} to start the battle
            </p>
            <ActionButtons>
              <ActionButton onClick={copyRoomCode}>
                Copy Room Code
              </ActionButton>
              <ActionButton onClick={() => onBattleStart(createdRoomCode)}>
                Enter Room
              </ActionButton>
            </ActionButtons>
          </>
        )}
      </BattleIdSection>

      <Card>
        <SectionTitle>Online Players ({onlinePlayers.length})</SectionTitle>
        {onlinePlayers.length > 0 ? (
          <PlayerGrid>
            {onlinePlayers.map(player => (
              <PlayerCard key={player} onClick={() => handleChallengePlayer(player)}>
                <PlayerAddress>{player}</PlayerAddress>
                <PlayerStatus $online={true}>
                  <StatusDot $online={true} />
                  ONLINE
                </PlayerStatus>
              </PlayerCard>
            ))}
          </PlayerGrid>
        ) : (
          <p>No players online. Share battle IDs to play with friends!</p>
        )}
      </Card>
    </LobbyContainer>
  )
}