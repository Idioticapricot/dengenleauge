"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "../../components/layout/AppLayout"
import styled from "styled-components"
import { Card, Button } from "../../components/styled/GlobalStyles"
import { useWallet } from "../../components/wallet/WalletProvider"
import { TokenGrid } from "../../components/token/TokenGrid"
import Link from "next/link"

const TradingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const AnnouncementBanner = styled.div`
  background: var(--brutal-yellow);
  border: 4px solid var(--border-primary);
  border-radius: 0;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
`

const AnnouncementText = styled.div`
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 900;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
  
  span {
    background: var(--brutal-pink);
    padding: 2px 6px;
    border: 2px solid var(--border-primary);
    margin-left: 8px;
  }
`

const CloseButton = styled.button`
  background: var(--brutal-red);
  border: 3px solid var(--border-primary);
  color: var(--text-primary);
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  font-weight: 900;
  font-family: var(--font-mono);
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  transition: all 0.1s ease;
  
  &:hover {
    background: var(--brutal-orange);
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px 0px var(--border-primary);
  }
`

const SquadDisplay = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  border-radius: 0;
  padding: 24px;
  position: relative;
  overflow: visible;
  box-shadow: 6px 6px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
`

const SelectedSquadTitle = styled.h2`
  font-family: var(--font-mono);
  font-weight: 900;
  font-size: 24px;
  color: var(--text-primary);
  margin-bottom: 20px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: var(--brutal-cyan);
  padding: 12px 24px;
  border: 3px solid var(--border-primary);
  box-shadow: 3px 3px 0px 0px var(--border-primary);
`

const SquadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 24px;
  padding: 20px;
  background: var(--brutal-lime);
  border-radius: 0;
  border: 4px solid var(--border-primary);
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const SquadSlot = styled.div`
  background: var(--light-bg);
  border: 3px solid var(--border-primary);
  border-radius: 0;
  padding: 12px 8px;
  text-align: center;
  transition: all 0.1s ease;
  min-height: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  
  &:hover {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px 0px var(--border-primary);
    background: var(--brutal-yellow);
  }
`

const TokenLogo = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 4px;
  font-weight: 900;
`

const TokenSymbol = styled.p`
  font-family: var(--font-mono);
  font-weight: 900;
  font-size: 12px;
  color: var(--text-primary);
  margin-bottom: 2px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const TokenPrice = styled.p`
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-primary);
  margin-bottom: 2px;
  font-weight: 900;
`

const TokenChange = styled.p<{ $positive: boolean }>`
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-primary);
  background: ${(props) => (props.$positive ? "var(--brutal-lime)" : "var(--brutal-red)")};
  padding: 2px 6px;
  border: 2px solid var(--border-primary);
  font-weight: 900;
  text-transform: uppercase;
`

const CardDeckSection = styled.div`
  margin-bottom: 24px;
`

const CardDeckTitle = styled.h2`
  font-family: var(--font-space-grotesk);
  font-weight: 700;
  font-size: 20px;
  color: white;
  margin-bottom: 16px;
`

const CardDeckGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
`

const DeckCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(147, 51, 234, 0.2);
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(147, 51, 234, 0.4);
    box-shadow: 0 4px 16px rgba(147, 51, 234, 0.2);
  }
`

const DeckCardLogo = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
`

const DeckCardSymbol = styled.p`
  font-family: var(--font-space-grotesk);
  font-weight: 600;
  font-size: 12px;
  color: white;
  margin-bottom: 4px;
`

const DeckCardPoints = styled.p`
  font-family: var(--font-inter);
  font-size: 10px;
  color: #a855f7;
`

const FieldBackground = styled.div`
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.8) 0%, rgba(168, 85, 247, 0.8) 100%);
  border-radius: 12px;
  padding: 24px;
  position: relative;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const EmptySquadMessage = styled.div`
  text-align: center;
  color: white;
  font-family: var(--font-orbitron);
`

const EmptySquadTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`

const EmptySquadSubtitle = styled.p`
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 20px;
  font-family: var(--font-exo2);
`

const NewSquadButton = styled(Button)`
  width: 100%;
  margin-top: 12px;
  background: rgba(147, 51, 234, 0.2);
  border: 1px solid rgba(147, 51, 234, 0.4);
  color: white;
  font-family: var(--font-space-grotesk);
  font-weight: 600;
  
  &:hover {
    background: rgba(147, 51, 234, 0.3);
    transform: translateY(-2px);
  }
`

const TradingControls = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`

const TimerDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 16px 0;
  padding: 8px 16px;
  background: rgba(15, 23, 42, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(51, 65, 85, 0.5);
`

const TimerIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-green);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`

const TimerText = styled.span`
  color: var(--text-primary);
  font-family: var(--font-orbitron);
  font-weight: 600;
  font-size: 14px;
`

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 8px;
  margin-top: 12px;
`

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`

const StatValue = styled.span`
  color: #a855f7;
  font-family: var(--font-space-grotesk);
  font-weight: 600;
  font-size: 18px;
`

const StatLabel = styled.span`
  color: var(--text-muted);
  font-family: var(--font-exo2);
  font-size: 12px;
`

const TradingButton = styled(Button)<{ $type: "long" | "short" }>`
  flex: 1;
  font-family: var(--font-mono);
  font-weight: 900;
  font-size: 18px;
  padding: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: var(--brutal-red);
  border: 4px solid var(--border-primary);
  box-shadow: 6px 6px 0px 0px var(--border-primary);
  
  &:hover {
    transform: translate(3px, 3px);
    box-shadow: 3px 3px 0px 0px var(--border-primary);
    background: var(--brutal-orange);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: 6px 6px 0px 0px var(--border-primary);
  }
`

// Mock beast data
const mockBeasts = [
  { id: 1, name: "Fire Dragon", type: "fire", icon: "🔥", level: 5, hp: 100, attack: 80, defense: 60 },
  { id: 2, name: "Water Serpent", type: "water", icon: "🌊", level: 3, hp: 90, attack: 70, defense: 70 },
  { id: 3, name: "Earth Golem", type: "earth", icon: "🌍", level: 7, hp: 120, attack: 60, defense: 90 },
]

const mockSelectedBeast = {
  id: 1,
  name: "Fire Dragon",
  type: "fire",
  icon: "🔥",
  level: 5,
  hp: 100,
  attack: 80,
  defense: 60,
  wins: 3,
  losses: 1
}

export default function HomePage() {
  const [showAnnouncement, setShowAnnouncement] = useState(true)
  const [timeLeft, setTimeLeft] = useState("1m")
  const { wallet } = useWallet()

  useEffect(() => {
    const timer = setInterval(() => {
      // Mock timer countdown
      const times = ["1m", "59s", "58s", "57s", "56s"]
      const currentIndex = times.indexOf(timeLeft)
      if (currentIndex < times.length - 1) {
        setTimeLeft(times[currentIndex + 1])
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const [selectedBeast, setSelectedBeast] = useState(mockSelectedBeast)

  return (
    <AppLayout>
      <TradingContainer>
        {showAnnouncement && (
          <AnnouncementBanner>
            <AnnouncementText>
              <strong>BATTLE BEASTS!</strong> Mint your first beast <span>here</span>
            </AnnouncementText>
            <CloseButton onClick={() => setShowAnnouncement(false)}>×</CloseButton>
          </AnnouncementBanner>
        )}

        

        <Card>
          <SquadDisplay>
            <SelectedSquadTitle>🐲 SELECTED BEAST</SelectedSquadTitle>
            <SquadGrid>
              <SquadSlot>
                <TokenLogo>{mockSelectedBeast.icon}</TokenLogo>
                <TokenSymbol>{mockSelectedBeast.name}</TokenSymbol>
                <TokenPrice>Level {mockSelectedBeast.level}</TokenPrice>
                <TokenChange $positive={mockSelectedBeast.wins > mockSelectedBeast.losses}>
                  {mockSelectedBeast.wins}W - {mockSelectedBeast.losses}L
                </TokenChange>
              </SquadSlot>
              
              <SquadSlot>
                <TokenSymbol>HP</TokenSymbol>
                <TokenPrice>{mockSelectedBeast.hp}</TokenPrice>
              </SquadSlot>
              
              <SquadSlot>
                <TokenSymbol>ATK</TokenSymbol>
                <TokenPrice>{mockSelectedBeast.attack}</TokenPrice>
              </SquadSlot>
              
              <SquadSlot>
                <TokenSymbol>DEF</TokenSymbol>
                <TokenPrice>{mockSelectedBeast.defense}</TokenPrice>
              </SquadSlot>
              
              <SquadSlot>
                <TokenSymbol>TYPE</TokenSymbol>
                <TokenPrice>{mockSelectedBeast.type.toUpperCase()}</TokenPrice>
              </SquadSlot>
            </SquadGrid>

            <TimerDisplay>
              <TimerIcon>⏱</TimerIcon>
              <TimerText>{timeLeft}</TimerText>
            </TimerDisplay>

            <TradingControls>
              <TradingButton $type="long" $variant="primary" $size="lg" disabled={!wallet}>
                ⚔️ BATTLE (10 $WAM)
              </TradingButton>
            </TradingControls>

            <Link href="/create">
              <NewSquadButton $variant="secondary" $size="lg">
                🐲 MINT BEAST
              </NewSquadButton>
            </Link>
            
            <Link href="/marketplace">
              <NewSquadButton $variant="secondary" $size="lg">
                🏪 MARKETPLACE
              </NewSquadButton>
            </Link>

            <StatsRow>
              <StatItem>
                <StatValue>23</StatValue>
                <StatLabel>3.75%</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>+</StatValue>
                <StatLabel>Add New</StatLabel>
              </StatItem>
            </StatsRow>
          </SquadDisplay>
        </Card>
      </TradingContainer>
    </AppLayout>
  )
}
