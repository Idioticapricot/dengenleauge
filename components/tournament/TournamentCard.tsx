"use client"

import styled from "styled-components"
import { Card, Button } from "../styled/GlobalStyles"

const TournamentCardContainer = styled(Card)`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  position: relative;
  overflow: visible;
  margin-bottom: 20px;
  box-shadow: 6px 6px 0px 0px var(--border-primary);
  transition: all 0.1s ease;
  
  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 4px 4px 0px 0px var(--border-primary);
  }
`

const TournamentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`

const TournamentTitle = styled.h3`
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 900;
  margin: 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
`

const TournamentStatus = styled.div<{ $status: "upcoming" | "live" | "ended" }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 0;
  font-size: 12px;
  font-weight: 900;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 3px solid var(--border-primary);
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  background: ${(props) => {
    switch (props.$status) {
      case "live":
        return "var(--brutal-lime)"
      case "ended":
        return "var(--brutal-red)"
      case "upcoming":
        return "var(--brutal-yellow)"
    }
  }};
  color: var(--text-primary);
`

const StatusDot = styled.div<{ $status: "upcoming" | "live" | "ended" }>`
  width: 8px;
  height: 8px;
  border-radius: 0;
  border: 2px solid var(--border-primary);
  background: ${(props) => {
    switch (props.$status) {
      case "live":
        return "var(--brutal-cyan)"
      case "ended":
        return "var(--brutal-orange)"
      case "upcoming":
        return "var(--brutal-pink)"
    }
  }};
  ${(props) =>
    props.$status === "live" &&
    `
    animation: pulse 1s infinite;
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }
  `}
`

const TournamentInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const InfoLabel = styled.span`
  color: var(--text-primary);
  font-size: 12px;
  font-family: var(--font-mono);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const InfoValue = styled.span`
  color: var(--text-primary);
  font-weight: 900;
  font-size: 16px;
  font-family: var(--font-mono);
`

const PrizePool = styled.div`
  text-align: center;
  margin-bottom: 16px;
`

const PrizeAmount = styled.div`
  color: var(--text-primary);
  font-size: 28px;
  font-weight: 900;
  margin-bottom: 4px;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 2px;
  background: var(--brutal-yellow);
  padding: 8px 16px;
  border: 3px solid var(--border-primary);
  box-shadow: 3px 3px 0px 0px var(--border-primary);
  display: inline-block;
`

const PrizeLabel = styled.div`
  color: var(--text-primary);
  font-size: 12px;
  font-family: var(--font-mono);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 8px;
`

const JoinButton = styled(Button)`
  background: var(--brutal-lime);
  
  &:hover {
    background: var(--brutal-cyan);
  }
`

interface TournamentCardProps {
  tournament: {
    id: string
    title: string
    status: "upcoming" | "live" | "ended"
    prizePool: number
    entryFee: number
    playersJoined: number
    maxPlayers: number
    duration: string
    startTime: string
  }
  onJoin: (tournamentId: string) => void
}

export function TournamentCard({ tournament, onJoin }: TournamentCardProps) {
  const getStatusText = (status: string) => {
    switch (status) {
      case "live":
        return "Live"
      case "ended":
        return "Ended"
      case "upcoming":
        return "Upcoming"
      default:
        return status
    }
  }

  return (
    <TournamentCardContainer>
      <TournamentHeader>
        <TournamentTitle>{tournament.title}</TournamentTitle>
        <TournamentStatus $status={tournament.status}>
          <StatusDot $status={tournament.status} />
          {getStatusText(tournament.status)}
        </TournamentStatus>
      </TournamentHeader>

      <PrizePool>
        <PrizeAmount>${tournament.prizePool.toFixed(2)}</PrizeAmount>
        <PrizeLabel>Total Prize Pool</PrizeLabel>
      </PrizePool>

      <TournamentInfo>
        <InfoItem>
          <InfoLabel>Entry Fee</InfoLabel>
          <InfoValue>${tournament.entryFee.toFixed(2)}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Duration</InfoLabel>
          <InfoValue>{tournament.duration}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Players</InfoLabel>
          <InfoValue>
            {tournament.playersJoined}/{tournament.maxPlayers}
          </InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Starts</InfoLabel>
          <InfoValue>{tournament.startTime}</InfoValue>
        </InfoItem>
      </TournamentInfo>

      <JoinButton
        $fullWidth
        onClick={() => onJoin(tournament.id)}
        disabled={tournament.status === "ended" || tournament.playersJoined >= tournament.maxPlayers}
      >
        {tournament.status === "ended"
          ? "Tournament Ended"
          : tournament.playersJoined >= tournament.maxPlayers
            ? "Tournament Full"
            : "Join Tournament"}
      </JoinButton>
    </TournamentCardContainer>
  )
}
