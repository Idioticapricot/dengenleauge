"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAlgorandWallet } from '@/components/wallet/AlgorandWalletProvider'
import { supabase } from '@/lib/supabase'
import styled from 'styled-components'
import { Button } from '@/components/styled/GlobalStyles'

const BattleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
`

const BattleHeader = styled.div`
  background: var(--brutal-red);
  border: 4px solid var(--border-primary);
  padding: 24px;
  text-align: center;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const BattleTitle = styled.h1`
  font-size: 28px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: var(--font-mono);
`

const BattleStatus = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const WaitingRoom = styled.div`
  background: var(--brutal-cyan);
  border: 4px solid var(--border-primary);
  padding: 40px;
  text-align: center;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const WaitingText = styled.h2`
  font-size: 24px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-primary);
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  margin: 20px 0;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

const TurnIndicator = styled.div<{ $isMyTurn: boolean }>`
  background: ${props => props.$isMyTurn ? 'var(--brutal-lime)' : 'var(--brutal-orange)'};
  border: 4px solid var(--border-primary);
  padding: 16px;
  text-align: center;
  font-size: 18px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const BattleArena = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  padding: 16px;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  min-height: 60vh;
`

const PlayerSection = styled.div<{ $isOpponent?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: ${props => props.$isOpponent ? 'var(--brutal-red)' : 'var(--brutal-lime)'};
  border: 3px solid var(--border-primary);
  border-radius: 8px;
  ${props => props.$isOpponent && 'transform: rotate(180deg);'}
`

const PlayerTitle = styled.h3`
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  text-align: center;
`

const BeastCard = styled.div<{ $isActive?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${props => props.$isActive ? 'var(--brutal-yellow)' : 'var(--brutal-pink)'};
  border: 3px solid var(--border-primary);
  padding: 16px;
  border-radius: 12px;
  box-shadow: 3px 3px 0px 0px var(--border-primary);
  min-width: 200px;
  max-width: 280px;
  width: 100%;
`

const BeastImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  border: 3px solid var(--border-primary);
  border-radius: 8px;
  margin-bottom: 12px;
  background: white;
`

const BeastName = styled.div`
  font-size: 18px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  margin-bottom: 8px;
  text-align: center;
`

const BeastHP = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  background: var(--brutal-red);
  padding: 8px 16px;
  border: 3px solid var(--border-primary);
  border-radius: 6px;
  text-align: center;
`

const HPBar = styled.div<{ $percentage: number }>`
  width: 100%;
  height: 12px;
  background: var(--brutal-red);
  border: 2px solid var(--border-primary);
  border-radius: 6px;
  margin: 8px 0;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    width: ${props => props.$percentage}%;
    height: 100%;
    background: ${props => props.$percentage > 50 ? 'var(--brutal-lime)' : props.$percentage > 25 ? 'var(--brutal-yellow)' : 'var(--brutal-red)'};
    transition: width 0.3s ease;
  }
`

const MoveSelector = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  padding: 20px;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  margin-top: 20px;
`

const MovesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  @media (min-width: 480px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
`

const MoveButton = styled(Button)`
  background: var(--brutal-cyan);
  padding: 20px 16px;
  font-size: 16px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  &:hover:not(:disabled) {
    background: var(--brutal-yellow);
    transform: translate(2px, 2px);
  }
  
  &:disabled {
    background: var(--brutal-red);
    opacity: 0.5;
  }
  
  &:active {
    transform: translate(4px, 4px);
    box-shadow: none;
  }
`

const VSIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  background: var(--brutal-orange);
  border: 4px solid var(--border-primary);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  margin: 0 auto;
  box-shadow: 3px 3px 0px 0px var(--border-primary);
`

export default function BattlePage() {
  const params = useParams()
  const battleId = params.battleId as string
  const { wallet } = useAlgorandWallet()
  
  const [battle, setBattle] = useState<any>(null)
  const [isMyTurn, setIsMyTurn] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [waitingForOpponent, setWaitingForOpponent] = useState(false)
  const [myBeasts, setMyBeasts] = useState<any[]>([])
  const [opponentBeasts, setOpponentBeasts] = useState<any[]>([])

  useEffect(() => {
    const initUser = async () => {
      if (!wallet.isConnected || !wallet.address) return

      try {
        const userResponse = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress: wallet.address,
            username: `User_${wallet.address.slice(-6)}`
          })
        })

        if (userResponse.ok) {
          const user = await userResponse.json()
          setUserId(user.id)
        }
      } catch (error) {
        console.error('Error initializing user:', error)
      }
    }

    initUser()
  }, [wallet.isConnected, wallet.address])

  useEffect(() => {
    if (!battleId || !userId) return

    const loadBattle = async () => {
      try {
        const { data: battleData } = await supabase
          .from('battles')
          .select('*')
          .eq('id', battleId)
          .single()

        if (battleData) {
          setBattle(battleData)
          
          if (!battleData.player2_id) {
            setWaitingForOpponent(true)
          } else {
            setWaitingForOpponent(false)
            
            // Load team beasts
            const isPlayer1 = battleData.player1_id === userId
            const myTeamId = isPlayer1 ? battleData.player1_team : battleData.player2_team
            const opponentTeamId = isPlayer1 ? battleData.player2_team : battleData.player1_team
            
            if (myTeamId) {
              loadTeamBeasts(myTeamId, true)
            }
            if (opponentTeamId) {
              loadTeamBeasts(opponentTeamId, false)
            }
            
            const isPlayer1Turn = battleData.current_turn % 2 === 1
            setIsMyTurn(isPlayer1 ? isPlayer1Turn : !isPlayer1Turn)
          }
        }
      } catch (error) {
        console.error('Error loading battle:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBattle()

    // Subscribe to battle updates
    const channel = supabase
      .channel(`battle:${battleId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'battles',
        filter: `id=eq.${battleId}`
      }, (payload) => {
        setBattle(payload.new)
        
        if (payload.new.player2_id && waitingForOpponent) {
          setWaitingForOpponent(false)
          
          // Load team data when opponent joins
          const isPlayer1 = payload.new.player1_id === userId
          const myTeamId = isPlayer1 ? payload.new.player1_team : payload.new.player2_team
          const opponentTeamId = isPlayer1 ? payload.new.player2_team : payload.new.player1_team
          
          if (myTeamId) loadTeamBeasts(myTeamId, true)
          if (opponentTeamId) loadTeamBeasts(opponentTeamId, false)
        }
        
        const isPlayer1 = payload.new.player1_id === userId
        const isPlayer1Turn = payload.new.current_turn % 2 === 1
        setIsMyTurn(isPlayer1 ? isPlayer1Turn : !isPlayer1Turn)
        
        // Reload team data when turn changes (to show updated HP)
        if (payload.new.current_turn !== battle?.current_turn) {
          const myTeamId = isPlayer1 ? payload.new.player1_team : payload.new.player2_team
          const opponentTeamId = isPlayer1 ? payload.new.player2_team : payload.new.player1_team
          
          if (myTeamId) loadTeamBeasts(myTeamId, true)
          if (opponentTeamId) loadTeamBeasts(opponentTeamId, false)
        }
      })
      .subscribe()

    return () => channel.unsubscribe()
  }, [battleId, userId, waitingForOpponent])

  const loadTeamBeasts = async (teamId: string, isMyTeam: boolean) => {
    try {
      const { data: team } = await supabase
        .from('teams')
        .select(`
          beast1:beasts!beast1_id(
            id, name, health, current_hp, stamina, power, element_type, nft_metadata_uri,
            moves:beast_moves(
              move:moves(id, name, damage, element_type, description)
            )
          ),
          beast2:beasts!beast2_id(
            id, name, health, current_hp, stamina, power, element_type, nft_metadata_uri,
            moves:beast_moves(
              move:moves(id, name, damage, element_type, description)
            )
          ),
          beast3:beasts!beast3_id(
            id, name, health, current_hp, stamina, power, element_type, nft_metadata_uri,
            moves:beast_moves(
              move:moves(id, name, damage, element_type, description)
            )
          )
        `)
        .eq('id', teamId)
        .single()

      if (team) {
        const beasts = [team.beast1, team.beast2, team.beast3].filter(Boolean)
        if (isMyTeam) {
          setMyBeasts(beasts)
        } else {
          setOpponentBeasts(beasts)
        }
      }
    } catch (error) {
      console.error('Error loading team beasts:', error)
    }
  }

  const makeMove = async (moveId: string, targetBeastId: string) => {
    if (!isMyTurn || !myBeasts[0] || battle?.winner_id) return

    console.log('🎯 BATTLE: Making move:', { moveId, targetBeastId })

    try {
      const response = await fetch('/api/battle/process-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          battleId,
          playerId: userId,
          moveId,
          targetBeastId
        })
      })

      const result = await response.json()
      
      if (result.success) {
        console.log('✅ BATTLE: Move processed:', {
          damage: result.damage,
          newHP: result.newHP,
          winner: result.winner
        })
        
        // Reload beast data to show updated HP
        const isPlayer1 = battle.player1_id === userId
        const myTeamId = isPlayer1 ? battle.player1_team : battle.player2_team
        const opponentTeamId = isPlayer1 ? battle.player2_team : battle.player1_team
        
        if (myTeamId) loadTeamBeasts(myTeamId, true)
        if (opponentTeamId) loadTeamBeasts(opponentTeamId, false)
      } else {
        console.error('❌ BATTLE: Move failed:', result.error)
      }
    } catch (error) {
      console.error('❌ BATTLE: Move failed:', error)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <BattleContainer>
          <BattleHeader>
            <BattleTitle>⚔️ LOADING BATTLE</BattleTitle>
            <LoadingSpinner />
          </BattleHeader>
        </BattleContainer>
      </AppLayout>
    )
  }

  if (!wallet.isConnected) {
    return (
      <AppLayout>
        <BattleContainer>
          <BattleHeader>
            <BattleTitle>⚔️ BATTLE ARENA</BattleTitle>
            <BattleStatus>Connect wallet to join battle</BattleStatus>
          </BattleHeader>
        </BattleContainer>
      </AppLayout>
    )
  }

  if (waitingForOpponent) {
    return (
      <AppLayout>
        <BattleContainer>
          <BattleHeader>
            <BattleTitle>⚔️ BATTLE ARENA</BattleTitle>
            <BattleStatus>Battle ID: {battleId}</BattleStatus>
          </BattleHeader>
          
          <WaitingRoom>
            <WaitingText>🕐 Waiting for Opponent...</WaitingText>
            <LoadingSpinner />
            <p style={{ 
              color: 'var(--text-primary)', 
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              margin: '16px 0 0 0'
            }}>
              Share this URL with your opponent to join the battle!
            </p>
          </WaitingRoom>
        </BattleContainer>
      </AppLayout>
    )
  }

  if (!battle) {
    return (
      <AppLayout>
        <BattleContainer>
          <BattleHeader>
            <BattleTitle>⚔️ BATTLE NOT FOUND</BattleTitle>
            <BattleStatus>Invalid battle ID</BattleStatus>
          </BattleHeader>
        </BattleContainer>
      </AppLayout>
    )
  }

  // Show loading if battle exists but teams aren't loaded yet
  if (battle && battle.player2_id && !waitingForOpponent && (myBeasts.length === 0 || opponentBeasts.length === 0)) {
    return (
      <AppLayout>
        <BattleContainer>
          <BattleHeader>
            <BattleTitle>⚔️ LOADING TEAMS</BattleTitle>
            <LoadingSpinner />
          </BattleHeader>
        </BattleContainer>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <BattleContainer>
        <BattleHeader>
          <BattleTitle>⚔️ PVP BATTLE</BattleTitle>
          <BattleStatus>Turn {battle.current_turn}</BattleStatus>
        </BattleHeader>

        <TurnIndicator $isMyTurn={isMyTurn}>
          {isMyTurn ? '🎯 YOUR TURN' : '⏳ OPPONENT\'S TURN'}
        </TurnIndicator>

        <BattleArena>
          {/* Opponent Beast (Top) */}
          <PlayerSection $isOpponent>
            <PlayerTitle>⚔️ OPPONENT</PlayerTitle>
            {opponentBeasts[0] && (
              <BeastCard $isActive>
                {opponentBeasts[0].nft_metadata_uri ? (
                  <BeastImage 
                    src={opponentBeasts[0].nft_metadata_uri} 
                    alt={opponentBeasts[0].name}
                  />
                ) : (
                  <div style={{
                    width: '120px',
                    height: '120px',
                    background: 'var(--brutal-pink)',
                    border: '3px solid var(--border-primary)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    marginBottom: '12px'
                  }}>
                    {opponentBeasts[0].element_type === 'FIRE' ? '🔥' : 
                     opponentBeasts[0].element_type === 'WATER' ? '🌊' : 
                     opponentBeasts[0].element_type === 'EARTH' ? '🌍' : '⚡'}
                  </div>
                )}
                <BeastName>{opponentBeasts[0].name}</BeastName>
                <HPBar $percentage={((opponentBeasts[0].current_hp || opponentBeasts[0].health) / opponentBeasts[0].health) * 100} />
                <BeastHP>{opponentBeasts[0].current_hp || opponentBeasts[0].health}/{opponentBeasts[0].health} HP</BeastHP>
              </BeastCard>
            )}
          </PlayerSection>

          <VSIndicator>VS</VSIndicator>

          {/* Your Beast (Bottom) */}
          <PlayerSection>
            <PlayerTitle>🛡️ YOUR BEAST</PlayerTitle>
            {myBeasts[0] && (
              <BeastCard $isActive>
                {myBeasts[0].nft_metadata_uri ? (
                  <BeastImage 
                    src={myBeasts[0].nft_metadata_uri} 
                    alt={myBeasts[0].name}
                  />
                ) : (
                  <div style={{
                    width: '120px',
                    height: '120px',
                    background: 'var(--brutal-lime)',
                    border: '3px solid var(--border-primary)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    marginBottom: '12px'
                  }}>
                    {myBeasts[0].element_type === 'FIRE' ? '🔥' : 
                     myBeasts[0].element_type === 'WATER' ? '🌊' : 
                     myBeasts[0].element_type === 'EARTH' ? '🌍' : '⚡'}
                  </div>
                )}
                <BeastName>{myBeasts[0].name}</BeastName>
                <HPBar $percentage={((myBeasts[0].current_hp || myBeasts[0].health) / myBeasts[0].health) * 100} />
                <BeastHP>{myBeasts[0].current_hp || myBeasts[0].health}/{myBeasts[0].health} HP</BeastHP>
              </BeastCard>
            )}
          </PlayerSection>
        </BattleArena>

        {battle?.winner_id && (
          <BattleHeader>
            <BattleTitle>
              {battle.winner_id === userId ? '🏆 VICTORY!' : '😔 DEFEAT!'}
            </BattleTitle>
            <BattleStatus>
              {battle.winner_id === userId ? 'You won the battle!' : 'Better luck next time!'}
            </BattleStatus>
          </BattleHeader>
        )}

        {isMyTurn && myBeasts[0] && !battle?.winner_id && (
          <MoveSelector>
            <h3 style={{ 
              color: 'var(--text-primary)', 
              fontFamily: 'var(--font-mono)',
              textAlign: 'center',
              margin: '0 0 20px 0',
              fontSize: '18px'
            }}>
              🎯 SELECT MOVE
            </h3>
            <MovesGrid>
              {myBeasts[0].moves?.map((beastMove: any) => (
                <MoveButton
                  key={beastMove.move.id}
                  onClick={() => makeMove(beastMove.move.id, opponentBeasts[0]?.id)}
                  disabled={!opponentBeasts[0]}
                >
                  <div>{beastMove.move.name}</div>
                  <small style={{ marginTop: '4px', opacity: 0.8 }}>DMG: {beastMove.move.damage}</small>
                </MoveButton>
              )) || (
                <div style={{ 
                  textAlign: 'center',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  padding: '20px'
                }}>
                  No moves available
                </div>
              )}
            </MovesGrid>
          </MoveSelector>
        )}
      </BattleContainer>
    </AppLayout>
  )
}