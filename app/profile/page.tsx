"use client"

import { useState } from "react"
import { AppLayout } from "../../components/layout/AppLayout"
import styled from "styled-components"
import { Card, Button } from "../../components/styled/GlobalStyles"
import { useWallet } from "../../components/wallet/WalletProvider"

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
  padding: 24px;
  background: var(--light-bg);
  border-radius: 0;
  border: 4px solid var(--border-primary);
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
`

const ProfileAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 0;
  background: var(--brutal-pink);
  border: 4px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 900;
  color: var(--text-primary);
  box-shadow: 3px 3px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
`

const ProfileInfo = styled.div`
  flex: 1;
`

const ProfileName = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`

const Username = styled.h2`
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 900;
  font-family: var(--font-mono);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`

const EditIcon = styled.button`
  background: var(--brutal-yellow);
  border: 3px solid var(--border-primary);
  color: var(--text-primary);
  cursor: pointer;
  padding: 6px 8px;
  font-weight: 900;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  transition: all 0.1s ease;
  
  &:hover {
    background: var(--brutal-cyan);
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px 0px var(--border-primary);
  }
`

const WalletAddress = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-primary);
  font-size: 14px;
  font-family: var(--font-mono);
  font-weight: 900;
  background: var(--brutal-lime);
  padding: 6px 12px;
  border: 2px solid var(--border-primary);
  margin-top: 8px;
`

const CopyButton = styled.button`
  background: var(--brutal-orange);
  border: 2px solid var(--border-primary);
  color: var(--text-primary);
  cursor: pointer;
  padding: 4px 6px;
  font-weight: 900;
  transition: all 0.1s ease;
  
  &:hover {
    background: var(--brutal-red);
    transform: translate(1px, 1px);
  }
`

const SocialIcons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`

const SocialIcon = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: rgba(51, 65, 85, 0.5);
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  
  &:hover {
    background: rgba(34, 197, 94, 0.2);
    color: var(--primary-green);
  }
`

const BalanceSection = styled.div`
  text-align: center;
  margin-bottom: 28px;
  padding: 28px;
  background: var(--light-bg);
  border-radius: 0;
  border: 4px solid var(--border-primary);
  box-shadow: 6px 6px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
`

const BalanceAmount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
`

const BalanceValue = styled.h1`
  color: var(--text-primary);
  font-size: 52px;
  font-weight: 900;
  font-family: var(--font-mono);
  margin: 0;
  background: var(--brutal-cyan);
  padding: 16px 32px;
  border: 4px solid var(--border-primary);
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 2px;
`

const TokenIcon = styled.div`
  width: 36px;
  height: 36px;
  background: var(--brutal-yellow);
  border-radius: 0;
  border: 3px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 900;
  color: var(--text-primary);
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
`

const USDValue = styled.div`
  color: var(--text-primary);
  font-size: 18px;
  margin-bottom: 28px;
  font-family: var(--font-mono);
  font-weight: 900;
  background: var(--brutal-lime);
  padding: 8px 16px;
  border: 3px solid var(--border-primary);
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 1px;
`

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
`

const ActionButton = styled(Button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  background: var(--brutal-violet);
  border: 4px solid var(--border-primary);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    background: var(--brutal-pink);
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px var(--border-primary);
  }
`

const ActionIcon = styled.div`
  font-size: 20px;
`

const ActionLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-exo2);
`

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
  background: var(--brutal-cyan);
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

const MatchCard = styled(Card)`
  margin-bottom: 12px;
  padding: 16px;
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
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  background: ${(props) => {
    switch (props.$status) {
      case "live":
        return "rgba(34, 197, 94, 0.2)"
      case "ended":
        return "rgba(239, 68, 68, 0.2)"
      case "upcoming":
        return "rgba(251, 191, 36, 0.2)"
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case "live":
        return "var(--primary-green)"
      case "ended":
        return "var(--red-primary)"
      case "upcoming":
        return "var(--accent-yellow)"
    }
  }};
`

const StatusDot = styled.div<{ $status: "live" | "ended" | "upcoming" }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(props) => {
    switch (props.$status) {
      case "live":
        return "var(--primary-green)"
      case "ended":
        return "var(--red-primary)"
      case "upcoming":
        return "var(--accent-yellow)"
    }
  }};
  ${(props) =>
    props.$status === "live" &&
    `
    animation: pulse 2s infinite;
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `}
`

const ConnectWalletButton = styled(Button)`
  margin-top: 20px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: var(--brutal-violet);
  border: 4px solid var(--border-primary);
  color: var(--text-primary);
  transition: all 0.1s ease;

  &:hover {
    background: var(--brutal-pink);
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px var(--border-primary);
  }
`


export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Live")
  const { wallet, connectWallet } = useWallet()

  const handleDeposit = () => {
    console.log("Deposit clicked")
    // TODO: Implement deposit functionality
  }

  const handleWithdraw = () => {
    console.log("Withdraw clicked")
    // TODO: Implement withdraw functionality
  }

  const handleExportPK = () => {
    console.log("Export PK clicked")
    // TODO: Implement export private key functionality
  }

  const handleCopyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address)
      // TODO: Show toast notification
    }
  }

  // If wallet is not connected, show connect prompt
  if (!wallet.isConnected) {
    return (
      <AppLayout>
        <EmptyState>
          <EmptyIcon>🔗</EmptyIcon>
          <EmptyTitle>Wallet Not Connected</EmptyTitle>
          <EmptyDescription>
            Connect your wallet to view your profile and manage your assets.
          </EmptyDescription>
          <ConnectWalletButton onClick={connectWallet} disabled={wallet.connecting}>
            {wallet.connecting ? "Connecting..." : "Connect Wallet"}
          </ConnectWalletButton>
        </EmptyState>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <ProfileHeader>
        <ProfileAvatar>T</ProfileAvatar>
        <ProfileInfo>
          <ProfileName>
            <Username>testingtesla7</Username>
            <EditIcon>✏️</EditIcon>
          </ProfileName>
          <WalletAddress>
            {wallet.address ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : "Connecting..."}
            <CopyButton onClick={handleCopyAddress}>📋</CopyButton>
          </WalletAddress>
          <SocialIcons>
            <SocialIcon>🔗</SocialIcon>
            <SocialIcon>🌐</SocialIcon>
            <SocialIcon>🔒</SocialIcon>
          </SocialIcons>
        </ProfileInfo>
      </ProfileHeader>

      <BalanceSection>
        <BalanceAmount>
          <BalanceValue>{parseFloat(wallet.balance).toFixed(2)}</BalanceValue>
          <TokenIcon>AVAX</TokenIcon>
        </BalanceAmount>
        <USDValue>{parseFloat(wallet.balance).toFixed(2)} AVAX</USDValue>

        <ActionButtons>
          <ActionButton onClick={handleDeposit}>
            <ActionIcon>💰</ActionIcon>
            <ActionLabel>Deposit</ActionLabel>
          </ActionButton>
          <ActionButton onClick={handleWithdraw}>
            <ActionIcon>💸</ActionIcon>
            <ActionLabel>Withdraw</ActionLabel>
          </ActionButton>
          <ActionButton onClick={handleExportPK}>
            <ActionIcon>🔑</ActionIcon>
            <ActionLabel>Export PK</ActionLabel>
          </ActionButton>
        </ActionButtons>
      </BalanceSection>

      <TabContainer>
        <Tab $active={activeTab === "Live"} onClick={() => setActiveTab("Live")}>
          Live Battles
        </Tab>
        <Tab $active={activeTab === "Tournaments"} onClick={() => setActiveTab("Tournaments")}>
          My Beasts
        </Tab>
        <Tab $active={activeTab === "Ended"} onClick={() => setActiveTab("Ended")}>
          Battle History
        </Tab>
      </TabContainer>

      {activeTab === "Live" && (
        <EmptyState>
          <EmptyIcon>⚔️</EmptyIcon>
          <EmptyTitle>No Active Battles</EmptyTitle>
          <EmptyDescription>
            You're not in any battles right now. Select a beast and challenge other trainers to start battling.
          </EmptyDescription>
        </EmptyState>
      )}

      {activeTab === "Tournaments" && (
        <EmptyState>
          <EmptyIcon>🐲</EmptyIcon>
          <EmptyTitle>No Beasts Owned</EmptyTitle>
          <EmptyDescription>
            You don't own any battle beasts yet. Visit the marketplace or mint new beasts to start your collection.
          </EmptyDescription>
        </EmptyState>
      )}

      {activeTab === "Ended" && (
        <EmptyState>
          <EmptyIcon>📈</EmptyIcon>
          <EmptyTitle>No Battle History</EmptyTitle>
          <EmptyDescription>
            Your completed battles will appear here. Start battling to build your history and track your beast's performance.
          </EmptyDescription>
        </EmptyState>
      )}


    </AppLayout>
  )
}
