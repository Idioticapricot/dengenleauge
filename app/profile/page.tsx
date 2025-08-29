"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@txnlab/use-wallet-react"
import { AppLayout } from "../../components/layout/AppLayout"
import styled from "styled-components"
import { Button } from "../../components/styled/GlobalStyles"
import { useRouter } from "next/navigation"
import { useUser, useTokenBalances } from "../../hooks/api"
import { LoadingSpinner } from "../../components/ui/LoadingSpinner"
import { DeFiDashboard } from "../../components/defi/DeFiDashboard"

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`

const ProfileHeader = styled.div`
  background: var(--brutal-lime);
  border: 4px solid var(--border-primary);
  padding: 32px;
  text-align: center;
  box-shadow: 8px 8px 0px 0px var(--border-primary);
`

const ProfileTitle = styled.h1`
  font-size: 32px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 2px;
`

const WalletAddress = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-mono);
  background: var(--light-bg);
  padding: 8px 16px;
  border: 2px solid var(--border-primary);
  display: inline-block;
  border-radius: 0;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`

const StatCard = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  padding: 24px;
  text-align: center;
  box-shadow: 6px 6px 0px 0px var(--border-primary);
`

const StatValue = styled.div`
  font-size: 36px;
  font-weight: 900;
  color: var(--brutal-red);
  font-family: var(--font-mono);
  margin-bottom: 8px;
`

const StatLabel = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
`

const TokenSection = styled.div`
  background: var(--brutal-cyan);
  border: 4px solid var(--border-primary);
  padding: 24px;
  box-shadow: 6px 6px 0px 0px var(--border-primary);
`

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 20px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 2px;
`

const TokenGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
`

const TokenCard = styled.div`
  background: var(--light-bg);
  border: 3px solid var(--border-primary);
  padding: 16px;
  text-align: center;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const TokenSymbol = styled.div`
  font-size: 18px;
  font-weight: 900;
  color: var(--brutal-yellow);
  font-family: var(--font-mono);
  margin-bottom: 8px;
`

const TokenBalance = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
`

const BattleHistorySection = styled.div`
  background: var(--brutal-pink);
  border: 4px solid var(--border-primary);
  padding: 24px;
  box-shadow: 6px 6px 0px 0px var(--border-primary);
`

const BattleHistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
`

const BattleItem = styled.div`
  background: var(--light-bg);
  border: 2px solid var(--border-primary);
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
`

const BattleInfo = styled.div`
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--text-primary);
`

const BattleResult = styled.div<{ $won: boolean }>`
  font-weight: 900;
  color: ${props => props.$won ? 'var(--primary-green)' : 'var(--brutal-red)'};
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const LoadingText = styled.div`
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
  padding: 40px;
`

export default function ProfilePage() {
  const { activeAccount } = useWallet()
  const router = useRouter()
  
  const { data: userData, isLoading: userLoading, error: userError } = useUser(activeAccount?.address)
  const { data: balanceData, isLoading: balanceLoading } = useTokenBalances(activeAccount?.address)
  
  const userStats = userData?.user
  const battleHistory = userData?.user?.battleHistory || []
  const tokenBalances = balanceData?.balances || {}
  const loading = userLoading || balanceLoading

  if (!activeAccount?.address) {
    return (
      <AppLayout>
        <ProfileContainer>
          <LoadingText>🔗 Please connect your wallet to view profile</LoadingText>
          <div style={{ textAlign: 'center' }}>
            <Button onClick={() => router.push('/')}>Go Home</Button>
          </div>
        </ProfileContainer>
      </AppLayout>
    )
  }

  if (loading) {
    return (
      <AppLayout>
        <ProfileContainer>
          <LoadingSpinner text="Loading profile..." size="large" />
        </ProfileContainer>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <ProfileContainer>
        <ProfileHeader>
          <ProfileTitle>👤 PLAYER PROFILE</ProfileTitle>
          <WalletAddress>
            {activeAccount?.address ? `${activeAccount.address.slice(0, 8)}...${activeAccount.address.slice(-8)}` : 'No Address'}
          </WalletAddress>
        </ProfileHeader>

        <StatsGrid>
          <StatCard>
            <StatValue>{userStats?.wins || 0}</StatValue>
            <StatLabel>Wins</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{userStats?.losses || 0}</StatValue>
            <StatLabel>Losses</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{userStats?.totalBattles || 0}</StatValue>
            <StatLabel>Total Battles</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{userStats?.winStreak || 0}</StatValue>
            <StatLabel>Win Streak</StatLabel>
          </StatCard>
        </StatsGrid>

        <TokenSection>
          <SectionTitle>💰 Token Balances</SectionTitle>
          <TokenGrid>
            {Object.entries(tokenBalances).map(([symbol, balance]) => (
              <TokenCard key={symbol}>
                <TokenSymbol>{symbol}</TokenSymbol>
                <TokenBalance>{balance as string}</TokenBalance>
              </TokenCard>
            ))}
          </TokenGrid>
        </TokenSection>

        <BattleHistorySection>
          <SectionTitle>⚔️ Recent Battles</SectionTitle>
          <BattleHistoryList>
            {battleHistory.length > 0 ? (
              battleHistory.slice(0, 10).map((battle: any) => (
                <BattleItem key={battle.id}>
                  <BattleInfo>
                    vs {battle.player1Id === activeAccount?.address ? 
                        (battle.player2?.username || 'Anonymous') : 
                        (battle.player1?.username || 'Anonymous')}
                  </BattleInfo>
                  <BattleResult $won={battle.winnerId === activeAccount?.address}>
                    {battle.winnerId === activeAccount?.address ? 'WIN' : 'LOSS'}
                  </BattleResult>
                </BattleItem>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-primary)' }}>
                No battles played yet!
              </div>
            )}
          </BattleHistoryList>
        </BattleHistorySection>

        <TokenSection>
          <SectionTitle>💱 Swap to $DEGEN</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ 
              background: 'var(--light-bg)', 
              border: '3px solid var(--border-primary)', 
              padding: '20px', 
              textAlign: 'center',
              boxShadow: '4px 4px 0px 0px var(--border-primary)'
            }}>
              <div style={{ fontSize: '18px', fontWeight: '900', marginBottom: '12px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                🪙 ALGO → $DEGEN
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <input 
                  type="number" 
                  placeholder="0.0" 
                  style={{
                    padding: '12px',
                    border: '3px solid var(--border-primary)',
                    background: 'var(--light-bg)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '700',
                    fontSize: '16px',
                    width: '120px',
                    textAlign: 'center'
                  }}
                />
                <span style={{ fontSize: '24px' }}>→</span>
                <div style={{
                  padding: '12px',
                  border: '3px solid var(--border-primary)',
                  background: 'var(--brutal-yellow)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '900',
                  fontSize: '16px',
                  width: '120px',
                  textAlign: 'center'
                }}>
                  0.0 DEGEN
                </div>
              </div>
              <Button style={{ background: 'var(--brutal-orange)', fontSize: '14px', padding: '12px 24px' }}>
                💱 SWAP NOW
              </Button>
            </div>
            <div style={{ 
              background: 'var(--brutal-cyan)', 
              border: '3px solid var(--border-primary)', 
              padding: '16px', 
              textAlign: 'center',
              boxShadow: '3px 3px 0px 0px var(--border-primary)'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                📈 Current Rate: 1 ALGO = 1,000 DEGEN
              </div>
            </div>
          </div>
        </TokenSection>

        <div style={{ textAlign: 'center' }}>
          <Button onClick={() => router.push('/game')}>
            ⚔️ Find Battle
          </Button>
        </div>
      </ProfileContainer>
    </AppLayout>
  )
}