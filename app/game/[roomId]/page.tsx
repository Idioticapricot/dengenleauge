"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useWallet } from "@txnlab/use-wallet-react"
import { supabase } from "../../../lib/supabase"
import { AppLayout } from "../../../components/layout/AppLayout"
import styled from "styled-components"
import { Button } from "../../../components/styled/GlobalStyles"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'

const BattleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const BattleHeader = styled.div`
  text-align: center;
  background: var(--brutal-red);
  padding: 20px;
  border: 4px solid var(--border-primary);
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const BattleTitle = styled.h1`
  font-size: 28px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
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
`

const PlayersContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`

const PlayerSection = styled.div<{ $isWinning?: boolean }>`
  background: ${props => props.$isWinning ? 'var(--brutal-lime)' : 'var(--light-bg)'};
  border: 4px solid var(--border-primary);
  padding: 20px;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const PlayerTitle = styled.h3`
  font-size: 18px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const ScoreDisplay = styled.div<{ $color: string }>`
  font-size: 24px;
  font-weight: 900;
  color: ${props => props.$color};
  font-family: var(--font-mono);
  text-shadow: 0 0 10px ${props => props.$color};
`

const WinnerSection = styled.div<{ $winner?: boolean }>`
  background: ${props => props.$winner ? 'var(--brutal-lime)' : 'var(--brutal-red)'};
  border: 4px solid var(--border-primary);
  padding: 20px;
  text-align: center;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const WinnerText = styled.h2`
  font-size: 32px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const GraphContainer = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  padding: 20px;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const TeamSection = styled.div`
  background: var(--brutal-cyan);
  border: 4px solid var(--border-primary);
  padding: 20px;
  box-shadow: 6px 6px 0px 0px var(--border-primary);
`

const TeamTitle = styled.h4`
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 15px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
`

const TeamCard = styled.div`
  background: var(--light-bg);
  border: 2px solid var(--border-primary);
  padding: 10px;
  text-align: center;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
`

const CoinSymbol = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: var(--brutal-yellow);
  font-family: var(--font-mono);
  margin-bottom: 5px;
`

const CoinName = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
`

interface Player {
  id: string
  username: string
  team: any[]
}

export default function PVPBattlePage() {
  const { roomId } = useParams()
  const { activeAccount } = useWallet()
  const router = useRouter()
  const [battleState, setBattleState] = useState('team-preview') // Start with team preview
  const [players, setPlayers] = useState<Player[]>([])
  const [priceData, setPriceData] = useState<any[]>([])
  const [timeLeft, setTimeLeft] = useState(60)
  const [countdown, setCountdown] = useState(3)
  const [results, setResults] = useState<any>(null)
  const [matchData, setMatchData] = useState<any>(null) // Store match data as fallback
  const channelRef = useRef<any>(null)

  // Add team preview phase
  const handleStartBattle = () => {
    setBattleState('countdown')
    let count = 3
    setCountdown(count)
    const countdownInterval = setInterval(() => {
      count--
      setCountdown(count)
      if (count <= 0) {
        clearInterval(countdownInterval)
        setBattleState('active')
      }
    }, 1000)
  }

  useEffect(() => {
    if (!activeAccount?.address || !roomId) {
      router.push('/')
      return
    }

    initializeBattle()
  }, [activeAccount, roomId])

  const initializeBattle = async () => {
    try {
      // Join the battle room channel
      const channel = supabase.channel(`battle-${roomId}`)
      channelRef.current = channel

      channel
        .on('broadcast', { event: 'match-found' }, ({ payload }) => {
          console.log('Match found event received:', payload)
          setMatchData(payload)
          // Set players from match data as fallback
          if (payload.players) {
            const matchPlayers = payload.players.map((player: any) => ({
              ...player,
              username: player.id === activeAccount?.address
                ? `${activeAccount?.address.slice(0, 6)}...${activeAccount?.address.slice(-4)}`
                : player.username || 'Opponent'
            }))
            console.log('Setting players from match-found event:', matchPlayers)
            setPlayers(matchPlayers)
          }
        })
        .on('broadcast', { event: 'battle-start' }, ({ payload }) => {
          console.log('Battle started:', payload)
          console.log('Players from battle-start event:', payload.players)

          // Start countdown before battle begins
          setBattleState('countdown')
          if (payload.players) {
            // Update players with fresh data from battle-start event
            const updatedPlayers = payload.players.map((player: any) => ({
              ...player,
              username: player.id === activeAccount?.address
                ? `${activeAccount?.address.slice(0, 6)}...${activeAccount?.address.slice(-4)}`
                : player.username || 'Opponent'
            }))
            console.log('Updated players for battle:', updatedPlayers)
            setPlayers(updatedPlayers)
          }

          // Start 3-second countdown
          let count = 3
          setCountdown(count)
          const countdownInterval = setInterval(() => {
            count--
            setCountdown(count)
            if (count <= 0) {
              clearInterval(countdownInterval)
              setBattleState('active')
            }
          }, 1000)
        })
        .on('broadcast', { event: 'price-update' }, ({ payload }) => {
          console.log('Price update received:', payload)
          setPriceData(prev => [...prev, payload])
          if (payload.timeLeft) {
            setTimeLeft(Math.ceil(payload.timeLeft / 1000))
          } else {
            setTimeLeft(prev => Math.max(0, prev - 1))
          }
        })
        .on('broadcast', { event: 'battle-end' }, ({ payload }) => {
          console.log('Battle ended:', payload)
          setBattleState('finished')
          setResults(payload)
        })
        .subscribe((status) => {
          console.log('Channel subscription status:', status)
        })

      // Try to get room data from SupabaseBattleServer
      const { data: roomData, error } = await supabase
        .from('BattleRoom')
        .select('*')
        .eq('id', roomId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching room data:', error)
        router.push('/game')
        return
      }

      console.log('Room data fetched:', roomData)

      if (roomData) {
        let player1Team = []
        let player2Team = []

        try {
          player1Team = JSON.parse(roomData.player1_team || '[]')
          console.log('Player 1 team parsed:', player1Team)
        } catch (e) {
          console.error('Error parsing player 1 team:', e)
        }

        try {
          player2Team = JSON.parse(roomData.player2_team || '[]')
          console.log('Player 2 team parsed:', player2Team)
        } catch (e) {
          console.error('Error parsing player 2 team:', e)
        }

        const formatWalletAddress = (address: string) => {
          if (!address) return 'Unknown Player'
          if (address.length < 10) return address
          return `${address.slice(0, 6)}...${address.slice(-4)}`
        }

        // Determine which player is the current user and which is the opponent
        const isCurrentUserPlayer1 = roomData.player1_id === activeAccount?.address
        const currentUserId = activeAccount?.address || ''

        const currentPlayer = {
          id: currentUserId,
          username: formatWalletAddress(currentUserId),
          team: isCurrentUserPlayer1 ? player1Team : player2Team
        }

        const opponent = {
          id: isCurrentUserPlayer1 ? roomData.player2_id : roomData.player1_id,
          username: `Opponent (${formatWalletAddress(isCurrentUserPlayer1 ? roomData.player2_id : roomData.player1_id)})`,
          team: isCurrentUserPlayer1 ? player2Team : player1Team
        }

        console.log('Current user is player:', isCurrentUserPlayer1 ? '1' : '2')
        console.log('Current player team:', currentPlayer.team)
        console.log('Opponent team:', opponent.team)
        console.log('Setting players:', [currentPlayer, opponent])

        setPlayers([currentPlayer, opponent])
      } else {
        console.log('No room data found, trying fallback sources')

        // Fallback 1: Use match data if available
        if (matchData && matchData.players) {
          const matchPlayers = matchData.players.map((player: any) => ({
            ...player,
            username: player.id === activeAccount?.address
              ? `${activeAccount?.address.slice(0, 6)}...${activeAccount?.address.slice(-4)}`
              : player.username || 'Opponent'
          }))
          console.log('Using match data fallback:', matchPlayers)
          setPlayers(matchPlayers)
        } else {
          // Fallback 2: try to get team data from localStorage
          const savedTeam = localStorage.getItem('selectedTeam')
          if (savedTeam) {
            try {
              const teamData = JSON.parse(savedTeam)
              const fallbackPlayer = {
                id: activeAccount?.address || 'unknown',
                username: activeAccount?.address ? `${activeAccount.address.slice(0, 6)}...${activeAccount.address.slice(-4)}` : 'Unknown Player',
                team: teamData
              }
              setPlayers([fallbackPlayer, { id: 'opponent', username: 'Opponent', team: [] }])
              console.log('Using localStorage fallback team data:', teamData)
            } catch (e) {
              console.error('Error parsing fallback team data:', e)
            }
          }
        }
      }

    } catch (error) {
      console.error('Failed to initialize battle:', error)
    }
  }

  const formatChartData = () => {
    return priceData.map((entry, index) => ({
      time: index,
      ...entry.prices
    }))
  }

  const getTeamScore = (playerIndex: number) => {
    if (priceData.length < 2) return 0

    const startPrices = priceData[0].prices
    const currentPrices = priceData[priceData.length - 1].prices
    const team = players[playerIndex]?.team || []

    return team.reduce((score: number, coin: any) => {
      const start = startPrices[coin.symbol] || 0
      const current = currentPrices[coin.symbol] || 0
      const change = start > 0 ? ((current - start) / start) * 100 : 0
      return score + change
    }, 0)
  }

  // Team Preview Phase
  if (battleState === 'team-preview') {
    return (
      <AppLayout>
        <BattleContainer>
          <BattleHeader>
            <BattleTitle>⚔️ TEAM PREVIEW</BattleTitle>
            <div style={{ fontSize: '16px', color: 'var(--text-primary)', marginTop: '10px' }}>
              Review your teams before battle begins
            </div>
          </BattleHeader>

          <PlayersContainer>
            <TeamSection>
              <TeamTitle>⚔️ {players[0]?.username}'s Team</TeamTitle>
              <TeamGrid>
                {players[0]?.team && players[0].team.length > 0 ? (
                  players[0].team.map((coin: any, index: number) => (
                    <TeamCard key={index}>
                      <CoinSymbol>{coin.symbol || 'COIN'}</CoinSymbol>
                      <CoinName>{coin.name || 'Unknown'}</CoinName>
                    </TeamCard>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-primary)' }}>
                    No team selected
                  </div>
                )}
              </TeamGrid>
            </TeamSection>

            <TeamSection>
              <TeamTitle>⚔️ {players[1]?.username}'s Team</TeamTitle>
              <TeamGrid>
                {players[1]?.team && players[1].team.length > 0 ? (
                  players[1].team.map((coin: any, index: number) => (
                    <TeamCard key={index}>
                      <CoinSymbol>{coin.symbol || 'COIN'}</CoinSymbol>
                      <CoinName>{coin.name || 'Unknown'}</CoinName>
                    </TeamCard>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-primary)' }}>
                    No team selected
                  </div>
                )}
              </TeamGrid>
            </TeamSection>
          </PlayersContainer>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button
              onClick={handleStartBattle}
              style={{ fontSize: '20px', padding: '16px 32px' }}
            >
              ⚔️ START BATTLE
            </Button>
          </div>
        </BattleContainer>
      </AppLayout>
    )
  }

  // Countdown Phase
  if (battleState === 'countdown') {
    return (
      <AppLayout>
        <BattleContainer>
          <BattleHeader>
            <BattleTitle>⚔️ GET READY!</BattleTitle>
            <div style={{
              fontSize: '120px',
              fontWeight: '900',
              color: 'var(--brutal-yellow)',
              fontFamily: 'var(--font-mono)',
              textShadow: '0 0 30px var(--brutal-yellow)',
              margin: '20px 0'
            }}>
              {countdown}
            </div>
            <div style={{ fontSize: '18px', color: 'var(--text-primary)' }}>
              Battle starting...
            </div>
          </BattleHeader>
        </BattleContainer>
      </AppLayout>
    )
  }

  if (battleState === 'waiting') {
    return (
      <AppLayout>
        <BattleContainer>
          <BattleHeader>
            <BattleTitle>⏳ WAITING FOR BATTLE...</BattleTitle>
            <div style={{
              width: '60px',
              height: '60px',
              border: '6px solid var(--border-primary)',
              borderTop: '6px solid var(--brutal-red)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '20px auto'
            }}></div>
          </BattleHeader>
        </BattleContainer>
      </AppLayout>
    )
  }

  if (battleState === 'finished') {
    return (
      <AppLayout>
        <BattleContainer>
          <WinnerSection $winner={results?.winner?.id === players.find(p => p.id === results?.winner?.id)?.id}>
            <WinnerText>🏆 BATTLE COMPLETE!</WinnerText>
          </WinnerSection>

          <PlayersContainer>
            <PlayerSection $isWinning={results?.winner?.id === players[0]?.id}>
              <PlayerTitle>{players[0]?.username}</PlayerTitle>
              <ScoreDisplay $color={results?.winner?.id === players[0]?.id ? 'var(--primary-green)' : 'var(--text-primary)'}>
                {results?.player1Score}%
              </ScoreDisplay>
            </PlayerSection>
            <PlayerSection $isWinning={results?.winner?.id === players[1]?.id}>
              <PlayerTitle>{players[1]?.username}</PlayerTitle>
              <ScoreDisplay $color={results?.winner?.id === players[1]?.id ? 'var(--primary-green)' : 'var(--text-primary)'}>
                {results?.player2Score}%
              </ScoreDisplay>
            </PlayerSection>
          </PlayersContainer>

          <div style={{ textAlign: 'center', background: 'var(--brutal-yellow)', border: '4px solid var(--border-primary)', padding: '20px' }}>
            {results?.tie ? (
              <div style={{ fontSize: '24px', fontWeight: '900', fontFamily: 'var(--font-mono)' }}>🤝 IT'S A TIE!</div>
            ) : (
              <div style={{ fontSize: '24px', fontWeight: '900', fontFamily: 'var(--font-mono)' }}>
                🎉 Winner: {results?.winner?.username}
              </div>
            )}
          </div>

          <Button
            onClick={() => router.push('/matchmaking')}
            style={{ fontSize: '18px', padding: '16px 32px' }}
          >
            🔄 PLAY AGAIN
          </Button>
        </BattleContainer>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <BattleContainer>
        <BattleHeader>
          <BattleTitle>⚔️ LIVE PVP BATTLE</BattleTitle>
          <Timer>⏱️ {timeLeft}s</Timer>
        </BattleHeader>

        <PlayersContainer>
          <PlayerSection $isWinning={getTeamScore(0) >= getTeamScore(1)}>
            <PlayerTitle>👤 {players[0]?.username}</PlayerTitle>
            <ScoreDisplay $color="#00ff41">
              {getTeamScore(0).toFixed(4)}%
            </ScoreDisplay>
          </PlayerSection>
          <PlayerSection $isWinning={getTeamScore(1) >= getTeamScore(0)}>
            <PlayerTitle>👤 {players[1]?.username}</PlayerTitle>
            <ScoreDisplay $color="#ff1493">
              {getTeamScore(1).toFixed(4)}%
            </ScoreDisplay>
          </PlayerSection>
        </PlayersContainer>

        <PlayersContainer>
          <TeamSection>
            <TeamTitle>⚔️ {players[0]?.username}'s Team</TeamTitle>
            <TeamGrid>
              {players[0]?.team && players[0].team.length > 0 ? (
                players[0].team.map((coin: any, index: number) => (
                  <TeamCard key={index}>
                    <CoinSymbol>{coin.symbol || 'COIN'}</CoinSymbol>
                    <CoinName>{coin.name || 'Unknown'}</CoinName>
                  </TeamCard>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-primary)' }}>
                  No team selected
                </div>
              )}
            </TeamGrid>
          </TeamSection>

          <TeamSection>
            <TeamTitle>⚔️ {players[1]?.username}'s Team</TeamTitle>
            <TeamGrid>
              {players[1]?.team && players[1].team.length > 0 ? (
                players[1].team.map((coin: any, index: number) => (
                  <TeamCard key={index}>
                    <CoinSymbol>{coin.symbol || 'COIN'}</CoinSymbol>
                    <CoinName>{coin.name || 'Unknown'}</CoinName>
                  </TeamCard>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-primary)' }}>
                  No team selected
                </div>
              )}
            </TeamGrid>
          </TeamSection>
        </PlayersContainer>

        {priceData.length > 0 && (
          <GraphContainer>
            <div style={{
              background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
              padding: '16px',
              borderRadius: '20px',
              border: '4px solid var(--border-primary)',
              boxShadow: '0 0 30px rgba(0, 255, 65, 0.1)'
            }}>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={formatChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#444" opacity={0.3} />
                  <XAxis
                    dataKey="time"
                    stroke="#00ff41"
                    fontSize={14}
                    fontFamily="var(--font-mono)"
                  />
                  <YAxis
                    stroke="#ff1493"
                    fontSize={14}
                    fontFamily="var(--font-mono)"
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(26, 26, 46, 0.95)',
                      border: '3px solid #00ff41',
                      borderRadius: '12px',
                      fontFamily: 'var(--font-mono)'
                    }}
                  />
                  {players[0]?.team?.map((coin: any, index: number) => (
                    <Line
                      key={`p1-${coin.symbol}`}
                      type="monotone"
                      dataKey={coin.symbol}
                      stroke="#00ff41"
                      strokeWidth={3}
                      dot={false}
                    />
                  ))}
                  {players[1]?.team?.map((coin: any, index: number) => (
                    <Line
                      key={`p2-${coin.symbol}`}
                      type="monotone"
                      dataKey={coin.symbol}
                      stroke="#ff1493"
                      strokeWidth={3}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GraphContainer>
        )}
      </BattleContainer>
    </AppLayout>
  )
}