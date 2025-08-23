"use client"

import styled from "styled-components"
import { Card } from "../styled/GlobalStyles"

const MatchCard = styled(Card)`
  margin-bottom: 12px;
  padding: 12px;
`

const MatchHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`

const LiveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--accent-yellow);
  font-size: 12px;
  font-weight: 500;
`

const LiveDot = styled.div`
  width: 6px;
  height: 6px;
  background: var(--accent-yellow);
  border-radius: 50%;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`

const MatchContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const PlayerSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
`

const PlayerAvatar = styled.div<{ $variant?: "green" | "purple" | "orange" }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${(props) => {
    switch (props.$variant) {
      case "green":
        return "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
      case "purple":
        return "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
      case "orange":
        return "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
      default:
        return "linear-gradient(135deg, #64748b 0%, #475569 100%)"
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  position: relative;
`

const PlayerName = styled.div`
  font-size: 11px;
  color: var(--text-secondary);
  text-align: center;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const LeadingBadge = styled.div`
  background: var(--primary-green);
  color: white;
  font-size: 8px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  position: absolute;
  top: -6px;
  right: -6px;
`

const MatchStats = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
`

const PercentageDisplay = styled.div<{ $positive?: boolean }>`
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => (props.$positive ? "var(--primary-green)" : "var(--red-primary)")};
`

const TimeDisplay = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: var(--text-primary);
`

const DurationBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--text-muted);
`

interface LiveMatchCardProps {
  player1: {
    name: string
    avatar: string
    isLeading?: boolean
    variant?: "green" | "purple" | "orange"
  }
  player2: {
    name: string
    avatar: string
    isLeading?: boolean
    variant?: "green" | "purple" | "orange"
  }
  percentages: {
    player1: number
    player2: number
  }
  timeRemaining: string
  duration: string
}

export function LiveMatchCard({ player1, player2, percentages, timeRemaining, duration }: LiveMatchCardProps) {
  return (
    <MatchCard>
      <MatchHeader>
        <LiveIndicator>
          <LiveDot />
          Live match
        </LiveIndicator>
      </MatchHeader>

      <MatchContent>
        <PlayerSection>
          <PlayerAvatar $variant={player1.variant}>
            {player1.avatar}
            {player1.isLeading && <LeadingBadge>Leading</LeadingBadge>}
          </PlayerAvatar>
          <PlayerName>{player1.name}</PlayerName>
        </PlayerSection>

        <MatchStats>
          <PercentageDisplay $positive={percentages.player1 > 0}>
            {percentages.player1 > 0 ? "+" : ""}
            {percentages.player1.toFixed(2)}% : {percentages.player2 > 0 ? "+" : ""}
            {percentages.player2.toFixed(2)}%
          </PercentageDisplay>
          <TimeDisplay>{timeRemaining}</TimeDisplay>
          <DurationBadge>🕐 {duration}</DurationBadge>
        </MatchStats>

        <PlayerSection>
          <PlayerAvatar $variant={player2.variant}>
            {player2.avatar}
            {player2.isLeading && <LeadingBadge>Leading</LeadingBadge>}
          </PlayerAvatar>
          <PlayerName>{player2.name}</PlayerName>
        </PlayerSection>
      </MatchContent>
    </MatchCard>
  )
}
