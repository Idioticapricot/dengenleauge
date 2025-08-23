"use client"

import { useState } from "react"
import styled from "styled-components"
import { TournamentCard } from "./TournamentCard"

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const FilterTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`

const FilterTab = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 12px 16px;
  border-radius: 12px;
  border: none;
  background: ${(props) => (props.$active ? "var(--primary-green)" : "rgba(30, 41, 59, 0.6)")};
  color: ${(props) => (props.$active ? "white" : "var(--text-secondary)")};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${(props) => (props.$active ? "var(--primary-green-dark)" : "rgba(30, 41, 59, 0.8)")};
  }
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: rgba(30, 41, 59, 0.8);
  border-radius: 16px;
  border: 1px solid rgba(51, 65, 85, 0.5);
`

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(51, 65, 85, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 20px;
  opacity: 0.6;
`

const EmptyTitle = styled.h3`
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
`

const EmptyDescription = styled.p`
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  max-width: 280px;
`

interface Tournament {
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

const mockTournaments: Tournament[] = [
  {
    id: "1",
    title: "Crypto Fantasy League",
    status: "upcoming",
    prizePool: 500.0,
    entryFee: 9.0,
    playersJoined: 32,
    maxPlayers: 50,
    duration: "4h",
    startTime: "2h 30m",
  },
  {
    id: "2",
    title: "Weekend Warriors",
    status: "live",
    prizePool: 250.0,
    entryFee: 5.0,
    playersJoined: 24,
    maxPlayers: 30,
    duration: "6h",
    startTime: "Started",
  },
  {
    id: "3",
    title: "Daily Challenge",
    status: "ended",
    prizePool: 100.0,
    entryFee: 2.0,
    playersJoined: 20,
    maxPlayers: 20,
    duration: "2h",
    startTime: "Ended",
  },
]

export function TournamentList() {
  const [activeFilter, setActiveFilter] = useState("All")

  const filteredTournaments = mockTournaments.filter((tournament) => {
    if (activeFilter === "All") return true
    if (activeFilter === "Live") return tournament.status === "live"
    if (activeFilter === "Upcoming") return tournament.status === "upcoming"
    if (activeFilter === "Ended") return tournament.status === "ended"
    return true
  })

  const handleJoinTournament = (tournamentId: string) => {
    console.log("Joining tournament:", tournamentId)
    // TODO: Implement tournament join logic
  }

  return (
    <ListContainer>
      <FilterTabs>
        {["All", "Live", "Upcoming", "Ended"].map((filter) => (
          <FilterTab key={filter} $active={activeFilter === filter} onClick={() => setActiveFilter(filter)}>
            {filter}
          </FilterTab>
        ))}
      </FilterTabs>

      {filteredTournaments.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🏆</EmptyIcon>
          <EmptyTitle>No Tournaments Found</EmptyTitle>
          <EmptyDescription>
            There are no tournaments matching your current filter. Check back later for new tournaments.
          </EmptyDescription>
        </EmptyState>
      ) : (
        filteredTournaments.map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} onJoin={handleJoinTournament} />
        ))
      )}
    </ListContainer>
  )
}
