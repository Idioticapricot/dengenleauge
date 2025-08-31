"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "../../components/layout/AppLayout"
import styled from "styled-components"
import { Card, Button } from "../../components/styled/GlobalStyles"
import { MemeCard } from "../../components/meme/MemeCard"
import { useWallet } from "@txnlab/use-wallet-react"
import { CoinGridSkeleton } from "../../components/ui/skeleton"
import { useSimpleApi } from "../../hooks/useApi"

import { useSwipe } from "../../hooks/useSwipe"
import { useRouter } from "next/navigation"
import { PullToRefresh } from "../../components/ui/PullToRefresh"

const TeamContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--mobile-gap);
  padding-bottom: 120px; /* Account for bottom navigation */

  @media (max-width: 768px) {
    gap: var(--mobile-gap);
    padding-bottom: 100px;
  }

  @media (max-width: 480px) {
    gap: var(--mobile-gap);
    padding-bottom: 80px;
  }
`

const TeamHeader = styled.div`
  text-align: center;
  background: var(--brutal-violet);
  padding: 20px 16px;
  border: 3px solid var(--border-primary);
  box-shadow: 3px 3px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
  
  @media (max-width: 768px) {
    padding: 16px 12px;
    border-width: 2px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 8px;
    border-width: 2px;
  }
`

const TeamTitle = styled.h1`
  font-size: 24px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    font-size: 20px;
    letter-spacing: 0.5px;
  }
  
  @media (max-width: 480px) {
    font-size: 18px;
    margin: 0 0 6px 0;
  }
`

const TeamSubtitle = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    font-size: 13px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    letter-spacing: 0.3px;
  }
`

const CurrentTeamSection = styled.div`
  background: var(--brutal-orange);
  border: 3px solid var(--border-primary);
  padding: 20px;
  box-shadow: 3px 3px 0px 0px var(--border-primary);
  
  @media (max-width: 768px) {
    padding: 16px;
    border-width: 2px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    border-width: 2px;
  }
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
  gap: 8px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    gap: 6px;
  }

  @media (max-width: 480px) {
    gap: 4px;
  }
`

const TeamSlot = styled.div<{ $filled?: boolean }>`
  background: ${props => props.$filled ? "var(--brutal-lime)" : "var(--light-bg)"};
  border: 2px solid var(--border-primary);
  padding: 8px;
  text-align: center;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.$filled ? "pointer" : "default"};
  transition: all 0.1s ease;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  
  @media (max-width: 768px) {
    min-height: 90px;
    padding: 6px;
  }
  
  @media (max-width: 480px) {
    min-height: 80px;
    padding: 4px;
    border-width: 1px;
  }
  
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
  background: var(--brutal-cyan);
  border: 3px solid var(--border-primary);
  padding: 20px;
  box-shadow: 3px 3px 0px 0px var(--border-primary);
  
  @media (max-width: 768px) {
    padding: 16px;
    border-width: 2px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    border-width: 2px;
  }
`

const BeastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 6px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 4px;
  }
`

const SaveTeamButton = styled(Button)`
  background: var(--brutal-lime);
  font-size: 16px;
  padding: 12px 20px;
  margin-top: 16px;
  
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 8px 12px;
  }
  
  &:hover {
    background: var(--brutal-cyan);
  }
`

const SelectableCoinCard = styled.div<{ $selected: boolean }>`
  cursor: pointer;
  border: ${props => props.$selected ? '4px solid #00ff41' : '2px solid transparent'};
  background: ${props => props.$selected ? 'rgba(0, 255, 65, 0.1)' : 'transparent'};
  padding: ${props => props.$selected ? '4px' : '6px'};
  transition: all 0.2s ease;
  border-radius: 12px;
  position: relative;
  
  ${props => props.$selected && `
    box-shadow: 0 0 20px rgba(0, 255, 65, 0.3), inset 0 0 20px rgba(0, 255, 65, 0.1);
    
    &::before {
      content: '✓';
      position: absolute;
      top: 8px;
      left: 8px;
      background: #00ff41;
      color: #000;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 14px;
      z-index: 10;
      box-shadow: 0 0 10px #00ff41;
    }
  `}
  
  &:hover {
    background: ${props => props.$selected ? 'rgba(0, 255, 65, 0.15)' : 'rgba(0, 255, 65, 0.05)'};
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 255, 65, 0.2);
  }
`

export default function TeamPage() {
  const [currentTeam, setCurrentTeam] = useState<any[]>([null, null, null])
  const [selectedCoins, setSelectedCoins] = useState<number[]>([])
  const [memeCoins, setMemeCoins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [favoriteCoins, setFavoriteCoins] = useState<number[]>([])
  const [teamPresets, setTeamPresets] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { activeAccount } = useWallet()
  const { loading: apiLoading, error: apiError, call: apiCall } = useSimpleApi()
  const router = useRouter()

  // Swipe gesture handlers for page navigation
  const swipeRef = useSwipe<HTMLDivElement>({
    onSwipeLeft: () => {
      // Navigate to next page (tournament)
      router.push('/tournament')
    },
    onSwipeRight: () => {
      // Navigate to previous page (profile)
      router.push('/profile')
    }
  })

  const fetchMemeCoins = async (search = '') => {
    const url = search ? `/api/meme-coins?search=${encodeURIComponent(search)}` : '/api/meme-coins'
    const result = await apiCall(async () => {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch meme coins')
      }
      const data = await response.json()
      return data.coins || []
    })

    if (result && Array.isArray(result)) {
      setMemeCoins(result)
    }
  }

  useEffect(() => {
    fetchMemeCoins()
    // Load saved team on component mount
    const savedTeam = localStorage.getItem('selectedTeam')
    if (savedTeam) {
      try {
        const team = JSON.parse(savedTeam)
        if (Array.isArray(team) && team.length <= 3) {
          const fullTeam = [null, null, null]
          team.forEach((coin, index) => {
            if (index < 3) fullTeam[index] = coin
          })
          setCurrentTeam(fullTeam)
          setSelectedCoins(team.map(coin => coin.id))
        }
      } catch (error) {
        console.error('Failed to load saved team:', error)
      }
    }
  }, [])
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMemeCoins(searchTerm)
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [searchTerm])
  
  useEffect(() => {
    if (activeAccount?.address) {
      initializeUser()
    }
  }, [activeAccount?.address])
  
  const initializeUser = async () => {
    try {
      if (!activeAccount?.address) return
      
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: activeAccount.address, walletAddress: activeAccount.address })
      })
      
      const data = await response.json()
      const user = data.data || data.user
      if (user) {
        setCurrentUser(user)
        setFavoriteCoins(user.favorites?.map((f: any) => f.coinId) || [])
        setTeamPresets(user.presets || [])
      }
    } catch (error) {
      console.error('Failed to initialize user:', error)
    }
  }

  const handleCoinSelect = (coinId: number) => {
    const coin = memeCoins.find(c => c.id === coinId)
    if (!coin) return
    
    if (selectedCoins.includes(coinId)) {
      const newTeam = currentTeam.map(slot => slot?.id === coinId ? null : slot)
      setCurrentTeam(newTeam)
      setSelectedCoins(prev => prev.filter(id => id !== coinId))
      // Auto-save when removing
      localStorage.setItem('selectedTeam', JSON.stringify(newTeam.filter(Boolean)))
    } else if (selectedCoins.length < 3) {
      const emptySlotIndex = currentTeam.findIndex(slot => slot === null)
      if (emptySlotIndex !== -1) {
        const newTeam = [...currentTeam]
        newTeam[emptySlotIndex] = coin
        setCurrentTeam(newTeam)
        setSelectedCoins(prev => [...prev, coinId])
        // Auto-save when adding
        localStorage.setItem('selectedTeam', JSON.stringify(newTeam.filter(Boolean)))
      }
    }
  }

  const handleSlotClick = (index: number) => {
    if (currentTeam[index]) {
      const coinId = currentTeam[index].id
      const newTeam = [...currentTeam]
      newTeam[index] = null
      setCurrentTeam(newTeam)
      setSelectedCoins(prev => prev.filter(id => id !== coinId))
      // Auto-save when removing from slot
      localStorage.setItem('selectedTeam', JSON.stringify(newTeam.filter(Boolean)))
    }
  }

  const handleSaveTeam = () => {
    if (currentTeam.filter(Boolean).length !== 3) return
    localStorage.setItem('selectedTeam', JSON.stringify(currentTeam.filter(Boolean)))
    // Show success message before redirecting
    alert('✅ Team saved successfully! Redirecting to battle...')
    window.location.href = '/battle'
  }
  
  const toggleFavorite = async (coinId: number, coinName: string) => {
    if (!currentUser) return
    
    try {
      if (favoriteCoins.includes(coinId)) {
        await fetch('/api/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser.id, coinId })
        })
        setFavoriteCoins(favoriteCoins.filter(id => id !== coinId))
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser.id, coinId, coinName })
        })
        setFavoriteCoins([...favoriteCoins, coinId])
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }
  
  const saveTeamPreset = async () => {
    if (!currentUser || currentTeam.filter(Boolean).length !== 3) return
    
    try {
      const response = await fetch('/api/presets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          name: `Team ${teamPresets.length + 1}`,
          coins: currentTeam.filter(Boolean)
        })
      })
      
      const data = await response.json()
      if (data.preset) {
        setTeamPresets([...teamPresets, data.preset])
      }
    } catch (error) {
      console.error('Failed to save preset:', error)
    }
  }
  
  const loadTeamPreset = (preset: any) => {
    const coins = [
      { id: preset.coin1Id, ticker: preset.coin1Name },
      { id: preset.coin2Id, ticker: preset.coin2Name },
      { id: preset.coin3Id, ticker: preset.coin3Name }
    ]
    setCurrentTeam(coins)
    setSelectedCoins([preset.coin1Id, preset.coin2Id, preset.coin3Id])
    // Auto-save when loading preset
    localStorage.setItem('selectedTeam', JSON.stringify(coins))
  }

  const handleRefresh = async () => {
    await fetchMemeCoins(searchTerm)
  }

  if (!activeAccount?.address) {
    return (
      <AppLayout>
        <TeamContainer>
          <TeamHeader>
            <TeamTitle>🔗 CONNECT WALLET</TeamTitle>
            <TeamSubtitle>Connect your wallet to build your team</TeamSubtitle>
          </TeamHeader>
        </TeamContainer>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <PullToRefresh onRefresh={handleRefresh} className="flex-1">
        <TeamContainer ref={swipeRef}>
        <TeamHeader>
          <TeamTitle>⚔️ MEME COIN BATTLE</TeamTitle>
          <TeamSubtitle>Select 3 meme coins and battle other players</TeamSubtitle>
        </TeamHeader>

        <CurrentTeamSection>
          <SectionTitle>CURRENT TEAM</SectionTitle>
          <TeamSlots>
            {currentTeam.map((coin, index) => (
              <TeamSlot 
                key={index} 
                $filled={!!currentTeam[index]}
                onClick={() => handleSlotClick(index)}
              >
                {currentTeam[index] ? (
                  <>
                    <SlotIcon>
                      {coin.image ? (
                        <img
                          src={coin.image}
                          alt={coin.name}
                          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        '🪙'
                      )}
                    </SlotIcon>
                    <div>
                      <BeastName>{coin.ticker}</BeastName>
                      <BeastLevel>${coin.price?.toFixed(6) || '0'}</BeastLevel>
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
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <SaveTeamButton
              style={{ flex: 1 }}
              disabled={currentTeam.filter(Boolean).length !== 3}
              onClick={handleSaveTeam}
            >
              ⚔️ START BATTLE ({currentTeam.filter(Boolean).length}/3)
            </SaveTeamButton>
          </div>
          
          {teamPresets.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: '900', marginBottom: '8px', color: 'var(--text-primary)' }}>SAVED TEAMS:</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {teamPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => loadTeamPreset(preset)}
                    style={{
                      background: 'var(--brutal-cyan)',
                      border: '2px solid var(--border-primary)',
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: '900',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CurrentTeamSection>

        <MyBeastsSection>
          <SectionTitle>AVAILABLE MEME COINS</SectionTitle>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search coins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '3px solid var(--border-primary)',
                background: 'var(--light-bg)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontWeight: '700',
                fontSize: '14px',
                textTransform: 'uppercase',
                boxShadow: '3px 3px 0px 0px var(--border-primary)'
              }}
            />
          </div>
          <BeastGrid>
            {apiLoading ? (
              <CoinGridSkeleton />
            ) : apiError ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-primary)' }}>
                <h3>⚠️ Failed to Load Coins</h3>
                <p>{apiError}</p>
                <Button onClick={() => fetchMemeCoins(searchTerm)} style={{ marginTop: '10px' }}>
                  🔄 RETRY
                </Button>
              </div>
            ) : memeCoins.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-primary)' }}>
                <h3>🪙 No Meme Coins Found</h3>
                <p>No meme coins available at the moment. Check back later!</p>
              </div>
            ) : (
              memeCoins.map((coin, index) => (
                <SelectableCoinCard 
                  key={`${coin.id}-${index}`}
                  $selected={selectedCoins.includes(coin.id)}
                  onClick={() => handleCoinSelect(coin.id)}
                >
                  <MemeCard asset={coin} />
                </SelectableCoinCard>
              ))
            )}
          </BeastGrid>
        </MyBeastsSection>
        </TeamContainer>
      </PullToRefresh>
    </AppLayout>
  )
}
