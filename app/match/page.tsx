"use client"

import { useState } from "react"
import { AppLayout } from "../../components/layout/AppLayout"
import styled from "styled-components"
import { Card } from "../../components/styled/GlobalStyles"
import { LiveMatchCard } from "../../components/game/LiveMatchCard"

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`

const Tab = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 14px 20px;
  border-radius: 0;
  border: 4px solid var(--border-primary);
  background: ${(props) => (props.$active ? "var(--brutal-lime)" : "var(--light-bg)")};
  color: var(--text-primary);
  font-weight: 900;
  font-family: var(--font-mono);
  cursor: pointer;
  transition: all 0.1s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: ${(props) => (props.$active ? "3px 3px 0px 0px var(--border-primary)" : "2px 2px 0px 0px var(--border-primary)")};
  
  &:hover {
    background: var(--brutal-yellow);
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px 0px var(--border-primary);
  }
`

const MatchCard = styled(Card)`
  margin-bottom: 16px;
  padding: 20px;
  border: 4px solid var(--border-primary);
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  background: var(--light-bg);
  font-family: var(--font-mono);
  
  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px var(--border-primary);
  }
`

const MatchHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`

const MatchStatus = styled.div<{ $status: "live" | "ended" | "upcoming" }>`
  display: flex;
  align-items: center;
  gap: 8px;
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

const StatusDot = styled.div<{ $status: "live" | "ended" | "upcoming" }>`
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

const MatchTime = styled.div`
  color: var(--text-primary);
  font-size: 12px;
  font-family: var(--font-mono);
  font-weight: 900;
  background: var(--brutal-cyan);
  padding: 4px 8px;
  border: 2px solid var(--border-primary);
  text-transform: uppercase;
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

const PlayerAvatar = styled.div<{ $variant?: "green" | "purple" | "orange" | "blue" }>`
  width: 44px;
  height: 44px;
  border-radius: 0;
  border: 3px solid var(--border-primary);
  background: ${(props) => {
    switch (props.$variant) {
      case "green":
        return "var(--brutal-lime)"
      case "purple":
        return "var(--brutal-violet)"
      case "orange":
        return "var(--brutal-orange)"
      case "blue":
        return "var(--brutal-cyan)"
      default:
        return "var(--brutal-pink)"
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  position: relative;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  font-weight: 900;
`

const PlayerName = styled.div`
  font-size: 12px;
  color: var(--text-primary);
  text-align: center;
  max-width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-mono);
  font-weight: 900;
  text-transform: uppercase;
`

const WinnerBadge = styled.div`
  background: var(--brutal-yellow);
  color: var(--text-primary);
  font-size: 8px;
  font-weight: 900;
  padding: 3px 6px;
  border-radius: 0;
  position: absolute;
  top: -8px;
  right: -8px;
  border: 2px solid var(--border-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const LeadingBadge = styled.div`
  background: var(--brutal-lime);
  color: var(--text-primary);
  font-size: 8px;
  font-weight: 900;
  padding: 3px 6px;
  border-radius: 0;
  position: absolute;
  top: -8px;
  right: -8px;
  border: 2px solid var(--border-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const MatchStats = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
`

const PercentageDisplay = styled.div<{ $positive?: boolean }>`
  font-size: 18px;
  font-weight: 900;
  color: var(--text-primary);
  background: ${(props) => (props.$positive ? "var(--brutal-lime)" : "var(--brutal-red)")};
  padding: 4px 8px;
  border: 2px solid var(--border-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const TimeDisplay = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
`

const ResultDisplay = styled.div<{ $winner?: boolean }>`
  font-size: 18px;
  font-weight: 900;
  color: var(--text-primary);
  background: ${(props) => (props.$winner ? "var(--brutal-lime)" : "var(--brutal-red)")};
  padding: 6px 12px;
  border: 3px solid var(--border-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  text-align: center;
  background: var(--light-bg);
  border-radius: 0;
  border: 4px solid var(--border-primary);
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
`

const EmptyIcon = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 0;
  background: var(--brutal-violet);
  border: 4px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  margin-bottom: 24px;
  box-shadow: 3px 3px 0px 0px var(--border-primary);
  font-weight: 900;
`

const EmptyTitle = styled.h3`
  color: var(--text-primary);
  font-size: 22px;
  font-weight: 900;
  font-family: var(--font-mono);
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`

const EmptyDescription = styled.p`
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.6;
  font-family: var(--font-mono);
  margin: 0;
  max-width: 300px;
  font-weight: 700;
`

export default function MatchPage() {
  const [activeTab, setActiveTab] = useState("Live")

  const liveMatches = [
    {
      player1: { name: "FCMC****5...", avatar: "🟢", isLeading: false, variant: "green" as const },
      player2: { name: "crypto_bru...", avatar: "😈", isLeading: true, variant: "purple" as const },
      percentages: { player1: -0.28, player2: 0.62 },
      timeRemaining: "00:14:41",
      duration: "4h",
    },
    {
      player1: { name: "ickee ⚙️", avatar: "🟢", isLeading: true, variant: "green" as const },
      player2: { name: "crypto_bru...", avatar: "😈", isLeading: false, variant: "purple" as const },
      percentages: { player1: 3.37, player2: 2.28 },
      timeRemaining: "00:19:21",
      duration: "1d",
    },
    {
      player1: { name: "_Demeju", avatar: "👨‍💻", isLeading: false, variant: "orange" as const },
      player2: { name: "web3pulse3", avatar: "👾", isLeading: true, variant: "purple" as const },
      percentages: { player1: -0.58, player2: -0.46 },
      timeRemaining: "01:13:51",
      duration: "4h",
    },
    {
      player1: { name: "_Demeju", avatar: "👨‍💻", isLeading: true, variant: "orange" as const },
      player2: { name: "xbit_soul", avatar: "🤖", isLeading: false, variant: "green" as const },
      percentages: { player1: -0.16, player2: -0.22 },
      timeRemaining: "01:14:23",
      duration: "4h",
    },
  ]

  const pastMatches = [
    {
      id: "1",
      player1: { name: "CryptoKing", avatar: "👑", variant: "blue" as const },
      player2: { name: "TokenMaster", avatar: "🎯", variant: "orange" as const },
      result: { player1: 2.45, player2: -1.23, winner: "player1" },
      endTime: "2 hours ago",
      duration: "4h",
      status: "ended" as const,
    },
    {
      id: "2",
      player1: { name: "AlgoTrader", avatar: "📈", variant: "green" as const },
      player2: { name: "DeFiPro", avatar: "💎", variant: "purple" as const },
      result: { player1: -0.87, player2: 1.56, winner: "player2" },
      endTime: "5 hours ago",
      duration: "2h",
      status: "ended" as const,
    },
    {
      id: "3",
      player1: { name: "BlockchainBull", avatar: "🐂", variant: "orange" as const },
      player2: { name: "SmartContract", avatar: "🤖", variant: "blue" as const },
      result: { player1: 0.34, player2: 0.12, winner: "player1" },
      endTime: "1 day ago",
      duration: "6h",
      status: "ended" as const,
    },
  ]

  return (
    <AppLayout>
      <TabContainer>
        <Tab $active={activeTab === "Live"} onClick={() => setActiveTab("Live")}>
          Live
        </Tab>
        <Tab $active={activeTab === "Past"} onClick={() => setActiveTab("Past")}>
          Past
        </Tab>
      </TabContainer>

      {activeTab === "Live" && (
        <>
          {liveMatches.length > 0 ? (
            liveMatches.map((match, index) => <LiveMatchCard key={index} {...match} />)
          ) : (
            <EmptyState>
              <EmptyIcon>⚡</EmptyIcon>
              <EmptyTitle>No Live Matches</EmptyTitle>
              <EmptyDescription>
                There are no live matches at the moment. Check back later or start a new match to see live action.
              </EmptyDescription>
            </EmptyState>
          )}
        </>
      )}

      {activeTab === "Past" && (
        <>
          {pastMatches.length > 0 ? (
            pastMatches.map((match) => (
              <MatchCard key={match.id}>
                <MatchHeader>
                  <MatchStatus $status={match.status}>
                    <StatusDot $status={match.status} />
                    Ended
                  </MatchStatus>
                  <MatchTime>{match.endTime}</MatchTime>
                </MatchHeader>

                <MatchContent>
                  <PlayerSection>
                    <PlayerAvatar $variant={match.player1.variant}>
                      {match.player1.avatar}
                      {match.result.winner === "player1" && <WinnerBadge>Winner</WinnerBadge>}
                    </PlayerAvatar>
                    <PlayerName>{match.player1.name}</PlayerName>
                  </PlayerSection>

                  <MatchStats>
                    <ResultDisplay $winner={match.result.player1 > match.result.player2}>
                      {match.result.player1 > 0 ? "+" : ""}
                      {match.result.player1.toFixed(2)}% : {match.result.player2 > 0 ? "+" : ""}
                      {match.result.player2.toFixed(2)}%
                    </ResultDisplay>
                    <TimeDisplay>{match.duration} match</TimeDisplay>
                  </MatchStats>

                  <PlayerSection>
                    <PlayerAvatar $variant={match.player2.variant}>
                      {match.player2.avatar}
                      {match.result.winner === "player2" && <WinnerBadge>Winner</WinnerBadge>}
                    </PlayerAvatar>
                    <PlayerName>{match.player2.name}</PlayerName>
                  </PlayerSection>
                </MatchContent>
              </MatchCard>
            ))
          ) : (
            <EmptyState>
              <EmptyIcon>📊</EmptyIcon>
              <EmptyTitle>No Match History</EmptyTitle>
              <EmptyDescription>
                You haven't completed any matches yet. Start playing to build your match history and track your
                performance.
              </EmptyDescription>
            </EmptyState>
          )}
        </>
      )}
    </AppLayout>
  )
}
