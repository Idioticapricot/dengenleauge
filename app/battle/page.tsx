"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "../../components/layout/AppLayout"
import { useWallet } from "@txnlab/use-wallet-react"
import styled from "styled-components"
import { Button, ResponsiveGrid, ResponsiveFlex, MobileHidden, DesktopHidden } from "../../components/styled/GlobalStyles"
import { EnhancedBattleChart } from "../../components/ui/EnhancedBattleChart"

const BattleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  @media (max-width: 768px) {
    gap: 16px;
  }
  
  @media (max-width: 480px) {
    gap: 12px;
  }
`

const BattleHeader = styled.div`
  text-align: center;
  background: var(--brutal-red);
  padding: 20px;
  border: 4px solid var(--border-primary);
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  
  @media (max-width: 768px) {
    padding: 16px;
    border-width: 3px;
    box-shadow: 3px 3px 0px 0px var(--border-primary);
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    border-width: 2px;
    box-shadow: 2px 2px 0px 0px var(--border-primary);
  }
`

const BattleTitle = styled.h1`
  font-size: 28px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
  }
`

const BattleStats = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 12px;
  font-size: 14px;
  font-family: var(--font-mono);
  
  @media (max-width: 768px) {
    gap: 16px;
    font-size: 13px;
    flex-wrap: wrap;
  }
  
  @media (max-width: 480px) {
    gap: 12px;
    font-size: 12px;
    flex-direction: column;
    align-items: center;
  }
`

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid var(--border-primary);
  border-radius: 8px;
  
  @media (max-width: 768px) {
    padding: 6px 10px;
    border-width: 1px;
  }
  
  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: 11px;
  }
`

const ScoreDisplay = styled.div`
  margin-top: 16px;
  text-align: center;
  font-family: var(--font-mono);
  font-weight: 900;
  padding: 12px;
  background: var(--brutal-yellow);
  border: 2px solid var(--border-primary);
  border-radius: 8px;
  
  @media (max-width: 768px) {
    margin-top: 12px;
    padding: 10px;
    border-width: 1px;
  }
  
  @media (max-width: 480px) {
    margin-top: 8px;
    padding: 8px;
    font-size: 12px;
  }
`

const FinalScore = styled.div`
  margin-top: 16px;
  font-size: 18px;
  font-family: var(--font-mono);
  
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    margin-top: 8px;
    font-size: 14px;
  }
`

const StrategyIndicator = styled.div<{ $intensity: number }>`
  font-size: 12px;
  margin-top: 4px;
  color: #888;
  display: flex;
  align-items: center;
  gap: 4px;
  
  @media (max-width: 480px) {
    font-size: 10px;
    gap: 3px;
  }
`

const IntensityText = styled.span<{ $intensity: number }>`
  color: ${props => {
    if (props.$intensity === 3) return '#ff4444'
    if (props.$intensity === 2) return '#ff8844'
    return '#44ff44'
  }};
  font-weight: 900;
`

const StartBattleButton = styled(Button)`
  margin-top: 16px;
  font-size: 18px;
  
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    margin-top: 8px;
    font-size: 14px;
  }
`

const ShareResultsButton = styled(Button)`
  margin-top: 16px;
  font-size: 18px;
  
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    margin-top: 8px;
    font-size: 14px;
  }
`

const Timer = styled.div`
  font-size: 48px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  background: var(--brutal-yellow);
  padding: 16px;
  border: 4px solid var(--border-primary);
  margin: 20px 0;
  
  @media (max-width: 768px) {
    font-size: 36px;
    padding: 12px;
    border-width: 3px;
    margin: 16px 0;
  }
  
  @media (max-width: 480px) {
    font-size: 28px;
    padding: 8px;
    border-width: 2px;
    margin: 12px 0;
  }
`



const TeamSection = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  padding: 20px;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  
  @media (max-width: 768px) {
    border-width: 3px;
    padding: 16px;
    box-shadow: 3px 3px 0px 0px var(--border-primary);
  }
  
  @media (max-width: 480px) {
    border-width: 2px;
    padding: 12px;
    box-shadow: 2px 2px 0px 0px var(--border-primary);
  }
`

const TeamTitle = styled.h2`
  font-size: 20px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  background: var(--brutal-cyan);
  padding: 8px;
  border: 2px solid var(--border-primary);
  
  @media (max-width: 768px) {
    font-size: 18px;
    padding: 6px;
    border-width: 1px;
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
    padding: 4px;
    margin-bottom: 10px;
  }
`

const CoinItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background: var(--brutal-lime);
  border: 2px solid var(--border-primary);
  
  @media (max-width: 768px) {
    padding: 10px;
    margin-bottom: 6px;
    border-width: 1px;
  }
  
  @media (max-width: 480px) {
    padding: 8px;
    margin-bottom: 4px;
    font-size: 12px;
  }
`

const CoinName = styled.span`
  font-weight: 900;
  font-family: var(--font-mono);
  color: var(--text-primary);
`

const PriceChange = styled.span<{ $positive: boolean }>`
  font-weight: 900;
  font-family: var(--font-mono);
  color: ${props => props.$positive ? '#00ff41' : '#ff4444'};
`



const WinnerSection = styled.div<{ $winner?: boolean }>`
  background: ${props => props.$winner ? 'var(--brutal-lime)' : 'var(--brutal-red)'};
  border: 4px solid var(--border-primary);
  padding: 20px;
  text-align: center;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  
  @media (max-width: 768px) {
    border-width: 3px;
    padding: 16px;
    box-shadow: 3px 3px 0px 0px var(--border-primary);
  }
  
  @media (max-width: 480px) {
    border-width: 2px;
    padding: 12px;
    box-shadow: 2px 2px 0px 0px var(--border-primary);
  }
`

const WinnerText = styled.h2`
  font-size: 24px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 18px;
  }
`

export default function BattleMemePage() {
  const [timeLeft, setTimeLeft] = useState(60) // 1 minute battle
  const [battleActive, setBattleActive] = useState(false)
  const [playerTeam, setPlayerTeam] = useState<any[]>([])
  const [opponentTeam, setOpponentTeam] = useState<any[]>([])
  const [playerScore, setPlayerScore] = useState(0)
  const [opponentScore, setOpponentScore] = useState(0)
  const [winner, setWinner] = useState<string | null>(null)
  const [priceHistory, setPriceHistory] = useState<{time: number, you: number, opponent: number}[]>([])
  const [opponentStrategy, setOpponentStrategy] = useState<string>('aggressive')
  const [battleIntensity, setBattleIntensity] = useState(1)
  const [winStreak, setWinStreak] = useState(0)
  const [totalBattles, setTotalBattles] = useState(0)
  const [totalWins, setTotalWins] = useState(0)
  const { activeAccount } = useWallet()

  useEffect(() => {
    const savedTeam = localStorage.getItem('selectedTeam')
    if (savedTeam) {
      const team = JSON.parse(savedTeam)
      setPlayerTeam(team)
      generateOpponentTeam()
    }
    
    // Load battle stats
    const streak = localStorage.getItem('winStreak')
    const battles = localStorage.getItem('totalBattles')
    const wins = localStorage.getItem('totalWins')
    if (streak) setWinStreak(parseInt(streak))
    if (battles) setTotalBattles(parseInt(battles))
    if (wins) setTotalWins(parseInt(wins))
  }, [])

  useEffect(() => {
    if (battleActive && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
        // Simulate price changes
        updatePrices()
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      endBattle()
    }
  }, [battleActive, timeLeft])

  const generateOpponentTeam = async () => {
    try {
      const response = await fetch('/api/meme-coins')
      const data = await response.json()
      const coins = data.coins || []
      
      // Smart opponent selection based on market cap and recent performance
      const strategies = ['conservative', 'aggressive', 'balanced']
      const strategy = strategies[Math.floor(Math.random() * strategies.length)]
      setOpponentStrategy(strategy)
      
      let selectedCoins: any[] = []
      if (strategy === 'conservative') {
        // Pick top market cap coins
        selectedCoins = coins.filter((c: any) => c.rank <= 30).slice(0, 3)
      } else if (strategy === 'aggressive') {
        // Pick smaller cap, more volatile coins
        selectedCoins = coins.filter((c: any) => c.rank > 30).slice(0, 3)
      } else {
        // Balanced mix
        const topCoin = coins.find((c: any) => c.rank <= 20)
        const midCoin = coins.find((c: any) => c.rank > 20 && c.rank <= 50)
        const smallCoin = coins.find((c: any) => c.rank > 50)
        selectedCoins = [topCoin, midCoin, smallCoin].filter(Boolean)
      }
      
      const randomTeam = selectedCoins.map((coin: any) => ({
        ...coin,
        initialPrice: coin.price,
        currentPrice: coin.price
      }))
      
      setOpponentTeam(randomTeam)
    } catch (error) {
      console.error('Failed to generate opponent team:', error)
    }
  }

  const updatePrices = async () => {
    try {
      const allCoins = [...playerTeam, ...opponentTeam]
      const symbols = [...new Set(allCoins.map(coin => coin.ticker))]
      
      const response = await fetch('/api/battle/enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols, battleId: `battle_${Date.now()}` })
      })
      
      const data = await response.json()
      const prices = data.data?.prices || data.prices || {}
      
      let updatedPlayerTeam: any[] = []
      let updatedOpponentTeam: any[] = []
      
      setPlayerTeam(prev => {
        updatedPlayerTeam = prev.map(coin => ({
          ...coin,
          currentPrice: prices[coin.ticker] || coin.currentPrice
        }))
        return updatedPlayerTeam
      })
      
      setOpponentTeam(prev => {
        updatedOpponentTeam = prev.map(coin => ({
          ...coin,
          currentPrice: prices[coin.ticker] || coin.currentPrice
        }))
        return updatedOpponentTeam
      })
      
      setTimeout(() => {
        if (updatedPlayerTeam.length > 0 && updatedOpponentTeam.length > 0) {
          const playerCurrentScore = calculateTeamScore(updatedPlayerTeam)
          const opponentCurrentScore = calculateTeamScore(updatedOpponentTeam)
          
          setPlayerScore(playerCurrentScore)
          setOpponentScore(opponentCurrentScore)
          
          setPriceHistory(prev => [...prev, {
            time: 60 - timeLeft,
            you: Number(playerCurrentScore.toFixed(4)),
            opponent: Number(opponentCurrentScore.toFixed(4))
          }])
          
          // Dynamic battle intensity based on score difference
          const scoreDiff = Math.abs(playerCurrentScore - opponentCurrentScore)
          setBattleIntensity(scoreDiff > 2 ? 3 : scoreDiff > 1 ? 2 : 1)
        }
      }, 100)
      
    } catch (error) {
      console.error('Price update failed:', error)
    }
  }

  const calculateTeamScore = (team: any[]) => {
    if (!team || team.length === 0) return 0
    return team.reduce((total, coin) => {
      if (!coin.initialPrice || !coin.currentPrice) return total
      const change = ((coin.currentPrice - coin.initialPrice) / coin.initialPrice) * 100
      return total + change
    }, 0) / team.length
  }

  const startBattle = async () => {
    if (playerTeam.length !== 3 || !activeAccount?.address) return
    
    try {
      // Initialize battle without saving to DB first
      setBattleActive(true)
      setTimeLeft(60)
      setWinner(null)
      setPriceHistory([])
      setPlayerScore(0)
      setOpponentScore(0)
      
      // Initialize with current API prices
      setPlayerTeam(prev => prev.map(coin => ({
        ...coin,
        initialPrice: coin.price || 0.1,
        currentPrice: coin.price || 0.1
      })))
      
      setOpponentTeam(prev => prev.map(coin => ({
        ...coin,
        initialPrice: coin.price || 0.1,
        currentPrice: coin.price || 0.1
      })))
      
      setTimeout(() => {
        const initialPlayerScore = calculateTeamScore(playerTeam)
        const initialOpponentScore = calculateTeamScore(opponentTeam)
        setPriceHistory([{time: 0, you: Number(initialPlayerScore.toFixed(4)), opponent: Number(initialOpponentScore.toFixed(4))}])
      }, 100)

    } catch (error) {
      console.error('Failed to start battle:', error)
    }
  }

  const endBattle = async () => {
    setBattleActive(false)
    const playerFinalScore = calculateTeamScore(playerTeam)
    const opponentFinalScore = calculateTeamScore(opponentTeam)
    
    setPlayerScore(playerFinalScore)
    setOpponentScore(opponentFinalScore)
    
    const newTotalBattles = totalBattles + 1
    setTotalBattles(newTotalBattles)
    localStorage.setItem('totalBattles', newTotalBattles.toString())
    
    if (playerFinalScore > opponentFinalScore) {
      setWinner('player')
      const newStreak = winStreak + 1
      const newWins = totalWins + 1
      setWinStreak(newStreak)
      setTotalWins(newWins)
      localStorage.setItem('winStreak', newStreak.toString())
      localStorage.setItem('totalWins', newWins.toString())
    } else if (opponentFinalScore > playerFinalScore) {
      setWinner('opponent')
      setWinStreak(0)
      localStorage.setItem('winStreak', '0')
    } else {
      setWinner('tie')
    }
    
    // Save battle to database
    try {
      if (activeAccount?.address) {
        const userResponse = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: activeAccount.address, walletAddress: activeAccount.address })
        })
        
        const userData = await userResponse.json()
        const user = userData.data || userData.user
        if (user) {
          await fetch('/api/meme-battles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              teamData: { playerTeam, opponentTeam },
              opponentStrategy,
              playerScore: playerFinalScore,
              opponentScore: opponentFinalScore,
              result: playerFinalScore > opponentFinalScore ? 'win' : opponentFinalScore > playerFinalScore ? 'loss' : 'tie'
            })
          })
        }
      }
    } catch (error) {
      console.error('Failed to save battle:', error)
    }
  }

  if (!activeAccount?.address) {
    return (
      <AppLayout>
        <BattleContainer>
          <BattleHeader>
            <BattleTitle>🔗 CONNECT WALLET</BattleTitle>
            <p style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', margin: '10px 0 0 0' }}>
              Connect your wallet to start battling!
            </p>
          </BattleHeader>
        </BattleContainer>
      </AppLayout>
    )
  }

  if (playerTeam.length !== 3) {
    return (
      <AppLayout>
        <BattleContainer>
          <BattleHeader>
            <BattleTitle>⚠️ NO TEAM SELECTED</BattleTitle>
            <p style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', margin: '10px 0 0 0' }}>
              Go to Team page and select 3 meme coins first!
            </p>
          </BattleHeader>
        </BattleContainer>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <BattleContainer>
        <BattleHeader>
          <BattleTitle>⚔️ MEME COIN BATTLE</BattleTitle>
          <BattleStats>
            <StatItem>🏆 Streak: {winStreak}</StatItem>
            <StatItem>📊 Battles: {totalBattles}</StatItem>
            <StatItem>📈 Win Rate: {totalBattles > 0 ? ((totalWins / totalBattles) * 100).toFixed(1) : 0}%</StatItem>
          </BattleStats>
          {battleActive ? (
            <Timer>{Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}</Timer>
          ) : (
            <StartBattleButton onClick={startBattle}>
              START BATTLE
            </StartBattleButton>
          )}
        </BattleHeader>

                 <ResponsiveGrid $columns={2}>
          <TeamSection>
            <TeamTitle>👤 YOUR TEAM</TeamTitle>
            {playerTeam.map((coin, index) => (
              <CoinItem key={index}>
                <CoinName>{coin.name || coin.ticker}</CoinName>
                {battleActive && (
                  <PriceChange $positive={(coin.currentPrice - coin.initialPrice) >= 0}>
                    {((coin.currentPrice - coin.initialPrice) / coin.initialPrice * 100).toFixed(4)}%
                  </PriceChange>
                )}
              </CoinItem>
            ))}
            {winner && (
              <ScoreDisplay>
                Score: {playerScore.toFixed(4)}%
              </ScoreDisplay>
            )}
          </TeamSection>

          <TeamSection>
            <TeamTitle>
              🤖 OPPONENT ({opponentStrategy.toUpperCase()})
              {battleActive && (
                <StrategyIndicator $intensity={battleIntensity}>
                  <IntensityText $intensity={battleIntensity}>
                    {battleIntensity === 3 ? '🔥 INTENSE' : battleIntensity === 2 ? '⚡ HEATED' : '📊 STEADY'}
                  </IntensityText>
                </StrategyIndicator>
              )}
            </TeamTitle>
            {opponentTeam.map((coin, index) => (
              <CoinItem key={index}>
                <CoinName>{coin.name || coin.ticker}</CoinName>
                {battleActive && (
                  <PriceChange $positive={(coin.currentPrice - coin.initialPrice) >= 0}>
                    {((coin.currentPrice - coin.initialPrice) / coin.initialPrice * 100).toFixed(4)}%
                  </PriceChange>
                )}
              </CoinItem>
            ))}
            {winner && (
              <ScoreDisplay>
                Score: {opponentScore.toFixed(4)}%
              </ScoreDisplay>
            )}
          </TeamSection>
                 </ResponsiveGrid>

        {winner && (
          <>
            <WinnerSection $winner={winner === 'player'}>
              <WinnerText>
                {winner === 'player' ? '🎉 YOU WIN!' : winner === 'opponent' ? '😢 YOU LOSE!' : '🤝 TIE!'}
              </WinnerText>
              <FinalScore>
                Final Score: {playerScore.toFixed(4)}% vs {opponentScore.toFixed(4)}%
              </FinalScore>
            </WinnerSection>
            <ShareResultsButton 
              onClick={() => navigator.share ? navigator.share({title: 'Meme Coin Battle Result', text: `I ${winner === 'player' ? 'won' : 'lost'} with ${playerScore.toFixed(4)}% vs ${opponentScore.toFixed(4)}%!`}) : null}
            >
              📤 SHARE RESULTS
            </ShareResultsButton>
          </>
        )}

                 <EnhancedBattleChart
           data={priceHistory}
           battleIntensity={battleIntensity}
           opponentStrategy={opponentStrategy}
           playerScore={playerScore}
           opponentScore={opponentScore}
           isActive={battleActive}
         />
      </BattleContainer>
    </AppLayout>
  )
}