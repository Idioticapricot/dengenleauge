"use client"

import { useState } from "react"
import { AppLayout } from "../../components/layout/AppLayout"
import styled from "styled-components"
import { Card, Button } from "../../components/styled/GlobalStyles"

const ReferralHeader = styled(Card)`
  background: linear-gradient(135deg, var(--primary-green) 0%, var(--secondary-green) 100%);
  color: white;
  text-align: center;
  margin-bottom: 20px;
`

const HeaderIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`

const HeaderTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 8px 0;
`

const HeaderSubtitle = styled.p`
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
`

const ReferralCode = styled(Card)`
  text-align: center;
  margin-bottom: 20px;
`

const CodeLabel = styled.div`
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 12px;
`

const CodeDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(51, 65, 85, 0.5);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
`

const Code = styled.div`
  color: var(--primary-green);
  font-size: 20px;
  font-weight: bold;
  font-family: monospace;
  letter-spacing: 2px;
`

const CopyButton = styled(Button)`
  padding: 8px 16px;
  font-size: 12px;
`

const ShareButton = styled(Button)`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  margin-top: 12px;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
`

const StatCard = styled(Card)`
  text-align: center;
  padding: 20px 16px;
`

const StatValue = styled.div`
  color: var(--primary-green);
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
`

const StatLabel = styled.div`
  color: var(--text-secondary);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
`

const RewardsSection = styled(Card)`
  margin-bottom: 20px;
`

const SectionTitle = styled.h3`
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
`

const RewardItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(51, 65, 85, 0.3);
  
  &:last-child {
    border-bottom: none;
  }
`

const RewardInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const RewardIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--accent-yellow) 0%, #f59e0b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`

const RewardDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const RewardTitle = styled.div`
  color: var(--text-primary);
  font-weight: 600;
  font-size: 14px;
`

const RewardDescription = styled.div`
  color: var(--text-secondary);
  font-size: 12px;
`

const RewardAmount = styled.div`
  color: var(--primary-green);
  font-weight: bold;
  font-size: 16px;
`

const ReferralList = styled(Card)`
  margin-bottom: 20px;
`

const ReferralItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(51, 65, 85, 0.3);
  
  &:last-child {
    border-bottom: none;
  }
`

const ReferralInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const ReferralAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`

const ReferralDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const ReferralName = styled.div`
  color: var(--text-primary);
  font-weight: 600;
  font-size: 14px;
`

const ReferralDate = styled.div`
  color: var(--text-secondary);
  font-size: 12px;
`

const ReferralReward = styled.div`
  color: var(--primary-green);
  font-weight: bold;
  font-size: 14px;
`

export default function ReferralPage() {
  const [referralCode] = useState("CFL2025XYZ")
  const [totalReferrals] = useState(12)
  const [totalEarnings] = useState(156.75)

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode)
    // TODO: Show toast notification
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join CFL - Crypto Fantasy League",
        text: `Use my referral code ${referralCode} to get bonus rewards!`,
        url: `https://cfl.fun/ref/${referralCode}`,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      handleCopyCode()
    }
  }

  const rewards = [
    {
      icon: "🎁",
      title: "Welcome Bonus",
      description: "Get 10% bonus on first deposit",
      amount: "+10%",
    },
    {
      icon: "💰",
      title: "Referral Reward",
      description: "Earn 5% of friend's winnings",
      amount: "5%",
    },
    {
      icon: "🏆",
      title: "Milestone Bonus",
      description: "Extra rewards for 10+ referrals",
      amount: "$50",
    },
  ]

  const referralHistory = [
    {
      name: "CryptoNewbie",
      avatar: "🆕",
      joinDate: "2 days ago",
      reward: "+$12.50",
    },
    {
      name: "TokenHunter",
      avatar: "🎯",
      joinDate: "1 week ago",
      reward: "+$8.75",
    },
    {
      name: "DeFiExplorer",
      avatar: "🔍",
      joinDate: "2 weeks ago",
      reward: "+$15.25",
    },
    {
      name: "BlockchainFan",
      avatar: "⛓️",
      joinDate: "3 weeks ago",
      reward: "+$6.80",
    },
  ]

  return (
    <AppLayout>
      <ReferralHeader>
        <HeaderIcon>🤝</HeaderIcon>
        <HeaderTitle>Invite Friends</HeaderTitle>
        <HeaderSubtitle>Earn rewards for every friend you bring to CFL</HeaderSubtitle>
      </ReferralHeader>

      <ReferralCode>
        <CodeLabel>Your Referral Code</CodeLabel>
        <CodeDisplay>
          <Code>{referralCode}</Code>
          <CopyButton $size="sm" onClick={handleCopyCode}>
            📋 Copy
          </CopyButton>
        </CodeDisplay>
        <ShareButton $fullWidth onClick={handleShare}>
          📤 Share Invite Link
        </ShareButton>
      </ReferralCode>

      <StatsGrid>
        <StatCard>
          <StatValue>{totalReferrals}</StatValue>
          <StatLabel>Total Referrals</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>${totalEarnings.toFixed(2)}</StatValue>
          <StatLabel>Total Earned</StatLabel>
        </StatCard>
      </StatsGrid>

      <RewardsSection>
        <SectionTitle>🎁 Referral Rewards</SectionTitle>
        {rewards.map((reward, index) => (
          <RewardItem key={index}>
            <RewardInfo>
              <RewardIcon>{reward.icon}</RewardIcon>
              <RewardDetails>
                <RewardTitle>{reward.title}</RewardTitle>
                <RewardDescription>{reward.description}</RewardDescription>
              </RewardDetails>
            </RewardInfo>
            <RewardAmount>{reward.amount}</RewardAmount>
          </RewardItem>
        ))}
      </RewardsSection>

      <ReferralList>
        <SectionTitle>👥 Your Referrals</SectionTitle>
        {referralHistory.length > 0 ? (
          referralHistory.map((referral, index) => (
            <ReferralItem key={index}>
              <ReferralInfo>
                <ReferralAvatar>{referral.avatar}</ReferralAvatar>
                <ReferralDetails>
                  <ReferralName>{referral.name}</ReferralName>
                  <ReferralDate>Joined {referral.joinDate}</ReferralDate>
                </ReferralDetails>
              </ReferralInfo>
              <ReferralReward>{referral.reward}</ReferralReward>
            </ReferralItem>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-secondary)" }}>
            No referrals yet. Share your code to start earning!
          </div>
        )}
      </ReferralList>
    </AppLayout>
  )
}
