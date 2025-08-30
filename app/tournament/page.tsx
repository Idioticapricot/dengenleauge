"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@txnlab/use-wallet-react"
import { AppLayout } from "../../components/layout/AppLayout"
import styled from "styled-components"
import { Button } from "../../components/styled/GlobalStyles"
import { brutalToast } from "../../components/ui/BrutalToast"

const TournamentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const TournamentHeader = styled.div`
  text-align: center;
  background: var(--brutal-violet);
  padding: 32px;
  border: 4px solid var(--border-primary);
  box-shadow: 8px 8px 0px 0px var(--border-primary);
`

const TournamentTitle = styled.h1`
  font-size: 36px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 3px;
`

const TournamentSubtitle = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const TournamentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`

const TournamentCard = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  padding: 24px;
  box-shadow: 6px 6px 0px 0px var(--border-primary);
  cursor: pointer;
  transition: all 0.1s ease;
  
  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 4px 4px 0px 0px var(--border-primary);
  }
`

const CardTitle = styled.h3`
  font-size: 20px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const CardInfo = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 8px 0;
  font-family: var(--font-mono);
`

const PrizePool = styled.div`
  background: var(--brutal-yellow);
  border: 2px solid var(--border-primary);
  padding: 8px 12px;
  margin: 12px 0;
  text-align: center;
  font-weight: 900;
  font-family: var(--font-mono);
  color: var(--text-primary);
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`

const StatusBadge = styled.div<{ $status: string }>`
  background: ${props => {
    switch (props.$status) {
      case 'LIVE': return 'var(--brutal-lime)'
      case 'STARTING SOON': return 'var(--brutal-yellow)'
      case 'UPCOMING': return 'var(--brutal-cyan)'
      default: return 'var(--light-bg)'
    }
  }};
  border: 2px solid var(--border-primary);
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 900;
  font-family: var(--font-mono);
  color: var(--text-primary);
`

const TournamentButton = styled(Button)<{ $status: string }>`
  width: 100%;
  margin-top: 16px;
  background: ${props => {
    switch (props.$status) {
      case 'LIVE': return 'var(--brutal-lime)'
      case 'STARTING SOON': return 'var(--brutal-cyan)'
      default: return 'var(--brutal-cyan)'
    }
  }};
`

export default function TournamentPage() {
  const { activeAccount } = useWallet()
  const [tournaments, setTournaments] = useState([
    {
      id: 1,
      name: "🏆 WEEKLY MEME MADNESS",
      status: "LIVE",
      participants: 64,
      maxParticipants: 128,
      prizePool: "1,000 DEGEN",
      entryFee: "10 DEGEN",
      timeLeft: "2d 14h 32m",
      description: "Battle with your best meme coin team!"
    },
    {
      id: 2,
      name: "⚡ LIGHTNING ROUND",
      status: "STARTING SOON",
      participants: 12,
      maxParticipants: 32,
      prizePool: "250 DEGEN",
      entryFee: "5 DEGEN",
      timeLeft: "45m 12s",
      description: "Quick 30-second battles!"
    },
    {
      id: 3,
      name: "🚀 MEGA TOURNAMENT",
      status: "UPCOMING",
      participants: 0,
      maxParticipants: 256,
      prizePool: "5,000 DEGEN",
      entryFee: "25 DEGEN",
      timeLeft: "7d 0h 0m",
      description: "The biggest tournament of the month!"
    }
  ])



  const handleJoinTournament = (tournamentId: number) => {
    if (!activeAccount?.address) {
      brutalToast.error('Please connect your wallet first!')
      return
    }
    // Tournament join logic here
    const tournament = tournaments.find(t => t.id === tournamentId)
    if (tournament) {
      brutalToast.info(`Joining ${tournament.name}...`)
      // Add actual tournament join logic here
    }
  }

  if (!activeAccount?.address) {
    return (
      <AppLayout>
        <TournamentContainer>
          <TournamentHeader>
            <TournamentTitle>🔗 CONNECT WALLET</TournamentTitle>
            <TournamentSubtitle>Connect your wallet to join tournaments</TournamentSubtitle>
          </TournamentHeader>
        </TournamentContainer>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <TournamentContainer>
        <TournamentHeader>
          <TournamentTitle>🏆 TOURNAMENTS</TournamentTitle>
          <TournamentSubtitle>Compete in epic meme coin battles</TournamentSubtitle>
        </TournamentHeader>

        <TournamentGrid>
          {tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} onClick={() => handleJoinTournament(tournament.id)}>
              <CardHeader>
                <CardTitle>{tournament.name}</CardTitle>
                <StatusBadge $status={tournament.status}>
                  {tournament.status}
                </StatusBadge>
              </CardHeader>
              
              <CardInfo>{tournament.description}</CardInfo>
              
              <PrizePool>💰 {tournament.prizePool}</PrizePool>
              
              <CardInfo>👥 {tournament.participants}/{tournament.maxParticipants} Players</CardInfo>
              <CardInfo>💳 Entry Fee: {tournament.entryFee}</CardInfo>
              <CardInfo>⏰ {tournament.timeLeft}</CardInfo>
              
              <TournamentButton $status={tournament.status}>
                {tournament.status === 'LIVE' ? 'JOIN NOW' : tournament.status === 'STARTING SOON' ? 'REGISTER' : 'COMING SOON'}
              </TournamentButton>
            </TournamentCard>
          ))}
        </TournamentGrid>
      </TournamentContainer>
    </AppLayout>
  )
}