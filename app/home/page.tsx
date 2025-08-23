"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "../../components/layout/AppLayout"
import styled from "styled-components"
import { Card, Button } from "../../components/styled/GlobalStyles"
import { useWallet } from "../../components/wallet/WalletProvider"
import { TokenGrid } from "../../components/token/TokenGrid"
import { ConnectWalletButton } from "../../components/wallet/ConnectWalletButton"
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

const BattleSection = styled.div`
  background: var(--brutal-red);
  border: 6px solid var(--border-primary);
  border-radius: 0;
  padding: 32px;
  position: relative;
  overflow: visible;
  box-shadow: 8px 8px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
  margin-bottom: 32px;
`

const BattleHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
`

const BattleTitle = styled.h1`
  font-size: 36px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 4px;
  text-shadow: 3px 3px 0px var(--border-primary);
`

const BattleSubtitle = styled.p`
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
`

const CurrentTeamDisplay = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  padding: 24px;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const TeamTitle = styled.h2`
  font-size: 20px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: var(--brutal-cyan);
  padding: 8px 16px;
  border: 3px solid var(--border-primary);
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
`

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`

const TeamSlot = styled.div`
  background: var(--brutal-lime);
  border: 4px solid var(--border-primary);
  padding: 20px;
  text-align: center;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
`

const BeastIcon = styled.div`
  font-size: 32px;
  margin-bottom: 8px;
`

const BeastName = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  margin-bottom: 4px;
`

const BeastLevel = styled.div`
  font-size: 10px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  background: var(--brutal-pink);
  padding: 2px 6px;
  border: 2px solid var(--border-primary);
`

const EmptyIcon = styled.div`
  font-size: 32px;
  margin-bottom: 8px;
  opacity: 0.5;
`

const EmptyText = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  opacity: 0.5;
`

const BattleButton = styled(Button)`
  background: var(--brutal-orange);
  font-size: 24px;
  font-weight: 900;
  padding: 20px;
  text-transform: uppercase;
  letter-spacing: 3px;
  border: 4px solid var(--border-primary);
  box-shadow: 6px 6px 0px 0px var(--border-primary);
  
  &:hover {
    transform: translate(3px, 3px);
    box-shadow: 3px 3px 0px 0px var(--border-primary);
    background: var(--brutal-yellow);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: 6px 6px 0px 0px var(--border-primary);
  }
`

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`

const ActionCard = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.1s ease;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  text-decoration: none;
  
  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px var(--border-primary);
    background: var(--brutal-cyan);
  }
`

const ActionIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`

const ActionTitle = styled.h3`
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
`

const ActionDesc = styled.p`
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
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

const ConnectWalletSection = styled.div`
  background: var(--brutal-violet);
  border: 6px solid var(--border-primary);
  border-radius: 0;
  padding: 40px;
  text-align: center;
  margin-bottom: 32px;
  box-shadow: 8px 8px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
`

const ConnectWalletTitle = styled.h1`
  font-size: 32px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 3px 3px 0px var(--border-primary);
`

const ConnectWalletSubtitle = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 24px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`

// Mock beast data
const mockBeasts = [
  { id: 1, name: "Fire Dragon", type: "fire", icon: "🔥", level: 5, hp: 100, attack: 80, defense: 60 },
  { id: 2, name: "Water Serpent", type: "water", icon: "🌊", level: 3, hp: 90, attack: 70, defense: 70 },
  { id: 3, name: "Earth Golem", type: "earth", icon: "🌍", level: 7, hp: 120, attack: 60, defense: 90 },
]

const mockCurrentTeam = [
  { id: 1, name: "Fire Dragon", type: "fire", icon: "🔥", level: 5 },
  { id: 2, name: "Water Serpent", type: "water", icon: "🌊", level: 3 },
  null
]

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

        {!wallet.isConnected && (
          <ConnectWalletSection>
            <ConnectWalletTitle>🔗 CONNECT WALLET</ConnectWalletTitle>
            <ConnectWalletSubtitle>
              Connect your Avalanche wallet to start battling, minting beasts, and earning rewards
            </ConnectWalletSubtitle>
            <ConnectWalletButton variant="primary">
              Connect Wallet
            </ConnectWalletButton>
          </ConnectWalletSection>
        )}

        <BattleSection>
          <BattleHeader>
            <BattleTitle>⚔️ BATTLE ARENA</BattleTitle>
            <BattleSubtitle>Challenge other trainers</BattleSubtitle>
          </BattleHeader>
          
          <CurrentTeamDisplay>
            <TeamTitle>MY TEAM</TeamTitle>
            <TeamGrid>
              {mockCurrentTeam.map((beast, index) => (
                <TeamSlot key={index}>
                  {beast ? (
                    <>
                      <BeastIcon>{beast.icon}</BeastIcon>
                      <BeastName>{beast.name}</BeastName>
                      <BeastLevel>LVL {beast.level}</BeastLevel>
                    </>
                  ) : (
                    <>
                      <EmptyIcon>❓</EmptyIcon>
                      <EmptyText>EMPTY</EmptyText>
                    </>
                  )}
                </TeamSlot>
              ))}
            </TeamGrid>
            
            <BattleButton 
              $fullWidth 
              disabled={mockCurrentTeam.filter(Boolean).length !== 3}
            >
              ⚔️ BATTLE (20 $WAM)
            </BattleButton>
          </CurrentTeamDisplay>
        </BattleSection>
        
        <QuickActions>
          <Link href="/team">
            <ActionCard>
              <ActionIcon>👥</ActionIcon>
              <ActionTitle>MANAGE TEAM</ActionTitle>
              <ActionDesc>Select your 3 battle beasts</ActionDesc>
            </ActionCard>
          </Link>
          
          <Link href="/create">
            <ActionCard>
              <ActionIcon>🐲</ActionIcon>
              <ActionTitle>MINT BEAST</ActionTitle>
              <ActionDesc>Create new battle beasts</ActionDesc>
            </ActionCard>
          </Link>
          
          <Link href="/marketplace">
            <ActionCard>
              <ActionIcon>🏪</ActionIcon>
              <ActionTitle>MARKETPLACE</ActionTitle>
              <ActionDesc>Buy and sell beasts</ActionDesc>
            </ActionCard>
          </Link>
        </QuickActions>
      </TradingContainer>
    </AppLayout>
  )
}
