"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "../../components/layout/AppLayout"
import styled from "styled-components"
import { Card, Button } from "../../components/styled/GlobalStyles"
import { MemeCard } from "../../components/meme/MemeCard"
import { useAlgorandWallet } from "../../components/wallet/AlgorandWalletProvider"

const TeamContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const TeamHeader = styled.div`
  text-align: center;
  background: var(--brutal-violet);
  padding: 24px;
  border: 4px solid var(--border-primary);
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
`

const TeamTitle = styled.h1`
  font-size: 32px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 3px;
`

const TeamSubtitle = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`

const CurrentTeamSection = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  padding: 24px;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 2px;
  background: var(--brutal-cyan);
  padding: 8px 16px;
  border: 3px solid var(--border-primary);
  display: inline-block;
`

const TeamSlots = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
`

const TeamSlot = styled.div<{ $filled?: boolean }>`
  background: ${props => props.$filled ? "var(--brutal-lime)" : "var(--light-bg)"};
  border: 4px solid var(--border-primary);
  padding: 12px;
  text-align: center;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  cursor: ${props => props.$filled ? "pointer" : "default"};
  transition: all 0.1s ease;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  
  &:hover {
    transform: ${props => props.$filled ? "translate(1px, 1px)" : "none"};
    box-shadow: ${props => props.$filled ? "1px 1px 0px 0px var(--border-primary)" : "2px 2px 0px 0px var(--border-primary)"};
  }
`

const SlotIcon = styled.div`
  font-size: 24px;
  margin-bottom: 4px;
`

const SlotText = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const BeastName = styled.div`
  font-size: 14px;
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

const MyBeastsSection = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  padding: 24px;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const BeastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`

const BeastCard = styled(Card)<{ $selected?: boolean }>`
  padding: 16px;
  text-align: center;
  cursor: pointer;
  background: ${props => props.$selected ? "var(--brutal-yellow)" : "var(--light-bg)"};
  transition: all 0.1s ease;
  
  &:hover {
    background: var(--brutal-cyan);
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px var(--border-primary);
  }
`

const BeastIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`

const BeastCardName = styled.h3`
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
`

const BeastStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  margin-bottom: 12px;
`

const StatItem = styled.div`
  background: var(--brutal-orange);
  padding: 4px;
  border: 2px solid var(--border-primary);
  text-align: center;
`

const StatLabel = styled.div`
  font-size: 8px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const StatValue = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
`

const SaveTeamButton = styled(Button)`
  background: var(--brutal-lime);
  font-size: 18px;
  padding: 16px 32px;
  margin-top: 20px;
  
  &:hover {
    background: var(--brutal-cyan);
  }
`



export default function TeamPage() {
  const [currentTeam, setCurrentTeam] = useState<any[]>([null, null, null])
  const [selectedCoins, setSelectedCoins] = useState<number[]>([])
  const [memeCoins, setMemeCoins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { wallet } = useAlgorandWallet()

  const fetchMemeCoins = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://api.vestigelabs.org/assets/list?network_id=0&exclude_labels=8,7&denominating_asset_id=31566704&limit=20&offset=0&order_by=rank&order_dir=asc')
      const data = await response.json()
      setMemeCoins(data.results || [])
    } catch (error) {
      console.error('Failed to fetch meme coins:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMemeCoins()
  }, [])

  const handleCoinSelect = (assetId: number) => {
    const coin = memeCoins.find(c => c.asset_id === assetId)
    if (!coin) return
    
    const emptySlotIndex = currentTeam.findIndex(slot => slot === null)
    if (emptySlotIndex !== -1 && !selectedCoins.includes(coin.asset_id)) {
      const newTeam = [...currentTeam]
      newTeam[emptySlotIndex] = coin
      setCurrentTeam(newTeam)
      setSelectedCoins([...selectedCoins, coin.asset_id])
    }
  }



  const handleSlotClick = (index: number) => {
    if (currentTeam[index]) {
      const assetId = currentTeam[index]!.asset_id
      const newTeam = [...currentTeam]
      newTeam[index] = null
      setCurrentTeam(newTeam)
      setSelectedCoins(selectedCoins.filter(id => id !== assetId))
    }
  }

  const handleSaveTeam = () => {
    if (currentTeam.filter(Boolean).length !== 3) return
    localStorage.setItem('selectedTeam', JSON.stringify(currentTeam.filter(Boolean)))
    alert('Team saved successfully!')
  }

  return (
    <AppLayout>
      <TeamContainer>
        <TeamHeader>
          <TeamTitle>⚔️ MEME COIN BATTLE</TeamTitle>
          <TeamSubtitle>Select 3 meme coins and battle other players</TeamSubtitle>
        </TeamHeader>

        <CurrentTeamSection>
          <SectionTitle>CURRENT TEAM</SectionTitle>
          <TeamSlots>
            {currentTeam.map((beast, index) => (
              <TeamSlot 
                key={index} 
                $filled={!!currentTeam[index]}
                onClick={() => handleSlotClick(index)}
              >
                {currentTeam[index] ? (
                  <>
                    <SlotIcon>🪙</SlotIcon>
                    <div>
                      <BeastName>{currentTeam[index].name || 'Unknown'}</BeastName>
                      <BeastLevel>{currentTeam[index].unit_name || 'N/A'}</BeastLevel>
                    </div>
                  </>
                ) : (
                  <>
                    <SlotIcon>➕</SlotIcon>
                    <SlotText>EMPTY SLOT</SlotText>
                  </>
                )}
              </TeamSlot>
            ))}
          </TeamSlots>
          
          <SaveTeamButton 
            $fullWidth 
            disabled={currentTeam.filter(Boolean).length !== 3}
            onClick={handleSaveTeam}
          >
            START BATTLE ({currentTeam.filter(Boolean).length}/3)
          </SaveTeamButton>
        </CurrentTeamSection>

        <MyBeastsSection>
          <SectionTitle>AVAILABLE MEME COINS</SectionTitle>
          <BeastGrid>
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-primary)' }}>Loading meme coins...</div>
            ) : memeCoins.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-primary)' }}>
                <h3>🪙 No Meme Coins Found</h3>
                <p>No meme coins available at the moment. Check back later!</p>
              </div>
            ) : (
              memeCoins.map((coin) => (
                <div key={coin.asset_id} onClick={() => handleCoinSelect(coin.asset_id)}>
                  <MemeCard asset={coin} />
                </div>
              ))
            )}
          </BeastGrid>
        </MyBeastsSection>
      </TeamContainer>


    </AppLayout>
  )
}