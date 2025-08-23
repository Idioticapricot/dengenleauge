"use client"

import { useState } from "react"
import { AppLayout } from "../../components/layout/AppLayout"
import styled from "styled-components"
import { Card } from "../../components/styled/GlobalStyles"

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

const LeaderboardCard = styled(Card)`
  padding: 0;
  overflow: visible;
  border: 4px solid var(--border-primary);
  box-shadow: 6px 6px 0px 0px var(--border-primary);
  background: var(--light-bg);
`

const LeaderboardHeader = styled.div`
  background: var(--brutal-cyan);
  padding: 24px;
  text-align: center;
  color: var(--text-primary);
  border-bottom: 4px solid var(--border-primary);
  font-family: var(--font-mono);
`

const HeaderTitle = styled.h2`
  font-size: 24px;
  font-weight: 900;
  margin: 0 0 12px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 2px;
`

const HeaderSubtitle = styled.p`
  font-size: 16px;
  margin: 0;
  font-family: var(--font-mono);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`

const LeaderboardList = styled.div`
  padding: 16px;
`

const LeaderboardItem = styled.div<{ $rank: number }>`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border-radius: 0;
  margin-bottom: 16px;
  background: ${(props) => {
    if (props.$rank === 1) return "var(--brutal-yellow)"
    if (props.$rank === 2) return "var(--brutal-cyan)"
    if (props.$rank === 3) return "var(--brutal-orange)"
    return "var(--light-bg)"
  }};
  border: 4px solid var(--border-primary);
  transition: all 0.1s ease;
  box-shadow: 3px 3px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
  
  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px 0px var(--border-primary);
  }
`

const RankBadge = styled.div<{ $rank: number }>`
  width: 44px;
  height: 44px;
  border-radius: 0;
  border: 3px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 18px;
  background: ${(props) => {
    if (props.$rank === 1) return "var(--brutal-lime)"
    if (props.$rank === 2) return "var(--brutal-pink)"
    if (props.$rank === 3) return "var(--brutal-violet)"
    return "var(--brutal-red)"
  }};
  color: var(--text-primary);
  font-family: var(--font-mono);
  box-shadow: 2px 2px 0px 0px var(--border-primary);
`

const PlayerInfo = styled.div`
  flex: 1;
`

const PlayerAvatar = styled.div<{ $variant?: "green" | "purple" | "orange" | "blue" | "red" }>`
  width: 52px;
  height: 52px;
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
      case "red":
        return "var(--brutal-red)"
      default:
        return "var(--brutal-pink)"
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-right: 16px;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  font-weight: 900;
`

const PlayerDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const PlayerName = styled.div`
  color: var(--text-primary);
  font-weight: 900;
  font-size: 18px;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const PlayerStats = styled.div`
  color: var(--text-primary);
  font-size: 12px;
  display: flex;
  gap: 16px;
  font-family: var(--font-mono);
  font-weight: 700;
`

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`

const PlayerScore = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`

const Score = styled.div<{ $positive?: boolean }>`
  font-size: 20px;
  font-weight: 900;
  color: var(--text-primary);
  background: ${(props) => (props.$positive ? "var(--brutal-lime)" : "var(--brutal-red)")};
  padding: 4px 8px;
  border: 2px solid var(--border-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const ScoreLabel = styled.div`
  color: var(--text-primary);
  font-size: 10px;
  text-transform: uppercase;
  font-family: var(--font-mono);
  font-weight: 900;
  letter-spacing: 0.5px;
`

const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  padding: 0 16px;
`

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 10px 16px;
  border-radius: 0;
  border: 3px solid var(--border-primary);
  background: ${(props) => (props.$active ? "var(--brutal-yellow)" : "var(--light-bg)")};
  color: var(--text-primary);
  font-weight: 900;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.1s ease;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: ${(props) => (props.$active ? "2px 2px 0px 0px var(--border-primary)" : "1px 1px 0px 0px var(--border-primary)")};
  
  &:hover {
    background: var(--brutal-cyan);
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px 0px var(--border-primary);
  }
`

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("Global")
  const [timeFilter, setTimeFilter] = useState("All Time")

  const leaderboardData = [
    {
      rank: 1,
      name: "CryptoKing",
      avatar: "👑",
      variant: "blue" as const,
      score: 15.67,
      matches: 45,
      winRate: 78,
      totalEarnings: 2340.5,
    },
    {
      rank: 2,
      name: "TokenMaster",
      avatar: "🎯",
      variant: "orange" as const,
      score: 12.34,
      matches: 38,
      winRate: 71,
      totalEarnings: 1890.25,
    },
    {
      rank: 3,
      name: "DeFiPro",
      avatar: "💎",
      variant: "purple" as const,
      score: 10.89,
      matches: 42,
      winRate: 69,
      totalEarnings: 1567.8,
    },
    {
      rank: 4,
      name: "AlgoTrader",
      avatar: "📈",
      variant: "green" as const,
      score: 9.45,
      matches: 35,
      winRate: 66,
      totalEarnings: 1234.6,
    },
    {
      rank: 5,
      name: "BlockchainBull",
      avatar: "🐂",
      variant: "red" as const,
      score: 8.76,
      matches: 29,
      winRate: 62,
      totalEarnings: 987.4,
    },
    {
      rank: 6,
      name: "SmartContract",
      avatar: "🤖",
      variant: "blue" as const,
      score: 7.23,
      matches: 31,
      winRate: 58,
      totalEarnings: 756.3,
    },
    {
      rank: 7,
      name: "web3pulse3",
      avatar: "👾",
      variant: "purple" as const,
      score: 6.89,
      matches: 27,
      winRate: 55,
      totalEarnings: 623.2,
    },
    {
      rank: 8,
      name: "_Demeju",
      avatar: "👨‍💻",
      variant: "orange" as const,
      score: 5.67,
      matches: 24,
      winRate: 52,
      totalEarnings: 498.1,
    },
  ]

  return (
    <AppLayout>
      <TabContainer>
        <Tab $active={activeTab === "Global"} onClick={() => setActiveTab("Global")}>
          Global
        </Tab>
        <Tab $active={activeTab === "Friends"} onClick={() => setActiveTab("Friends")}>
          Friends
        </Tab>
        <Tab $active={activeTab === "Tournament"} onClick={() => setActiveTab("Tournament")}>
          Tournament
        </Tab>
      </TabContainer>

      <LeaderboardCard>
        <LeaderboardHeader>
          <HeaderTitle>🏆 Leaderboard</HeaderTitle>
          <HeaderSubtitle>Top performers in Crypto Fantasy League</HeaderSubtitle>
        </LeaderboardHeader>

        <FilterContainer>
          {["All Time", "This Week", "This Month", "Today"].map((filter) => (
            <FilterButton key={filter} $active={timeFilter === filter} onClick={() => setTimeFilter(filter)}>
              {filter}
            </FilterButton>
          ))}
        </FilterContainer>

        <LeaderboardList>
          {leaderboardData.map((player) => (
            <LeaderboardItem key={player.rank} $rank={player.rank}>
              <RankBadge $rank={player.rank}>
                {player.rank <= 3 ? (player.rank === 1 ? "🥇" : player.rank === 2 ? "🥈" : "🥉") : player.rank}
              </RankBadge>

              <PlayerAvatar $variant={player.variant}>{player.avatar}</PlayerAvatar>

              <PlayerInfo>
                <PlayerDetails>
                  <PlayerName>{player.name}</PlayerName>
                  <PlayerStats>
                    <StatItem>🎮 {player.matches} matches</StatItem>
                    <StatItem>📊 {player.winRate}% win rate</StatItem>
                    <StatItem>💰 ${player.totalEarnings.toFixed(2)}</StatItem>
                  </PlayerStats>
                </PlayerDetails>
              </PlayerInfo>

              <PlayerScore>
                <Score $positive={player.score > 0}>
                  {player.score > 0 ? "+" : ""}
                  {player.score.toFixed(2)}%
                </Score>
                <ScoreLabel>Total Return</ScoreLabel>
              </PlayerScore>
            </LeaderboardItem>
          ))}
        </LeaderboardList>
      </LeaderboardCard>
    </AppLayout>
  )
}
