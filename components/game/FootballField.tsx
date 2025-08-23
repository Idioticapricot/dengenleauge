"use client"

import styled from "styled-components"
import { Card } from "../styled/GlobalStyles"

const FieldContainer = styled(Card)`
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border: 3px solid white;
  border-radius: 20px;
  padding: 20px;
  position: relative;
  min-height: 300px;
  margin: 20px 0;
`

const FieldLines = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 17px;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: white;
    transform: translateY(-50%);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80px;
    height: 80px;
    border: 2px solid white;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
`

const CenterDot = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
`

const GoalArea = styled.div<{ $top?: boolean }>`
  position: absolute;
  ${(props) => (props.$top ? "top: 0" : "bottom: 0")};
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 40px;
  border: 2px solid white;
  ${(props) => (props.$top ? "border-top: none" : "border-bottom: none")};
  border-radius: ${(props) => (props.$top ? "0 0 8px 8px" : "8px 8px 0 0")};
`

const PlayerPosition = styled.div<{ $top?: number; $left?: number; $hasPlayer?: boolean }>`
  position: absolute;
  top: ${(props) => props.$top}%;
  left: ${(props) => props.$left}%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`

const PlayerSlot = styled.div<{ $hasPlayer?: boolean; $position?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${(props) => (props.$hasPlayer ? "rgba(30, 41, 59, 0.9)" : "rgba(255, 255, 255, 0.3)")};
  border: 2px solid ${(props) => (props.$hasPlayer ? "var(--primary-green)" : "white")};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(30, 41, 59, 0.8);
    border-color: var(--primary-green);
  }
`

const AddTokenButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: white;
  font-size: 10px;
  font-weight: bold;
  text-align: center;
`

const PositionLabel = styled.div<{ $position?: string }>`
  background: ${(props) => {
    switch (props.$position) {
      case "ST":
        return "#ef4444"
      case "MF":
        return "#3b82f6"
      case "CB":
        return "#8b5cf6"
      default:
        return "#64748b"
    }
  }};
  color: white;
  font-size: 8px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 2px;
`

const PlayerAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`

interface Player {
  id: string
  name: string
  avatar: string
  position: string
}

interface FootballFieldProps {
  formation: string
  players: Player[]
  onAddPlayer: (position: string) => void
}

const formations = {
  "2-2-1": [
    { position: "ST", top: 15, left: 50 },
    { position: "MF", top: 35, left: 30 },
    { position: "MF", top: 35, left: 70 },
    { position: "CB", top: 65, left: 30 },
    { position: "CB", top: 65, left: 70 },
  ],
  "0-2-3": [
    { position: "ST", top: 15, left: 30 },
    { position: "ST", top: 15, left: 50 },
    { position: "ST", top: 15, left: 70 },
    { position: "MF", top: 45, left: 35 },
    { position: "MF", top: 45, left: 65 },
  ],
  "3-2-0": [
    { position: "MF", top: 35, left: 35 },
    { position: "MF", top: 35, left: 65 },
    { position: "CB", top: 65, left: 25 },
    { position: "CB", top: 65, left: 50 },
    { position: "CB", top: 65, left: 75 },
  ],
  "0-0-5": [
    { position: "ST", top: 15, left: 20 },
    { position: "ST", top: 15, left: 35 },
    { position: "ST", top: 15, left: 50 },
    { position: "ST", top: 15, left: 65 },
    { position: "ST", top: 15, left: 80 },
  ],
}

export function FootballField({ formation, players, onAddPlayer }: FootballFieldProps) {
  const positions = formations[formation as keyof typeof formations] || formations["2-2-1"]

  return (
    <FieldContainer>
      <FieldLines />
      <CenterDot />
      <GoalArea $top />
      <GoalArea />

      {positions.map((pos, index) => {
        const player = players.find((p) => p.position === pos.position)

        return (
          <PlayerPosition key={index} $top={pos.top} $left={pos.left}>
            <PlayerSlot $hasPlayer={!!player} $position={pos.position} onClick={() => onAddPlayer(pos.position)}>
              {player ? (
                <PlayerAvatar>{player.avatar}</PlayerAvatar>
              ) : (
                <AddTokenButton>
                  <div style={{ fontSize: "16px" }}>+</div>
                  <div>ADD</div>
                  <div>TOKEN</div>
                </AddTokenButton>
              )}
            </PlayerSlot>
            <PositionLabel $position={pos.position}>{pos.position}</PositionLabel>
          </PlayerPosition>
        )
      })}
    </FieldContainer>
  )
}
