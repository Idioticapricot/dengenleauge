"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "../../components/layout/AppLayout"
import styled from "styled-components"
import { Card, Button } from "../../components/styled/GlobalStyles"
import { useTournamentLogic } from "../../components/game/GameLogic"
import { useWallet } from "../../components/wallet/WalletProvider"

const CalendarContainer = styled.div`
  background: var(--light-bg);
  border-radius: 0;
  border: 4px solid var(--border-primary);
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
`

const CalendarHeader = styled.div`
  text-align: center;
  color: var(--text-primary);
  font-weight: 900;
  font-size: 16px;
  margin-bottom: 20px;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 2px;
  background: var(--brutal-yellow);
  padding: 8px 16px;
  border: 3px solid var(--border-primary);
  box-shadow: 2px 2px 0px 0px var(--border-primary);
`

const CalendarGrid = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`

const CalendarDay = styled.div<{ $active?: boolean; $today?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.1s ease;
  border: 3px solid var(--border-primary);
  font-family: var(--font-mono);
  font-weight: 900;
  background: ${(props) => {
    if (props.$active) return "var(--brutal-lime)"
    if (props.$today) return "var(--brutal-cyan)"
    return "var(--light-bg)"
  }};
  color: var(--text-primary);
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  
  &:hover {
    background: var(--brutal-yellow);
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px 0px var(--border-primary);
  }
`

const DayNumber = styled.div`
  font-size: 20px;
  font-weight: 900;
  font-family: var(--font-mono);
`

const DayName = styled.div`
  font-size: 10px;
  font-weight: 900;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
`

const TournamentCard = styled(Card)`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  position: relative;
  overflow: visible;
  margin-bottom: 24px;
  box-shadow: 6px 6px 0px 0px var(--border-primary);
  transition: all 0.1s ease;
  
  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 4px 4px 0px 0px var(--border-primary);
  }
`

const TournamentContent = styled.div`
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 20px;
`

const TournamentBadge = styled.div`
  display: inline-block;
  background: var(--brutal-lime);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 900;
  padding: 8px 16px;
  border-radius: 0;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
  border: 3px solid var(--border-primary);
  box-shadow: 3px 3px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
`

const TournamentTitle = styled.h1`
  color: var(--text-primary);
  font-size: 28px;
  font-weight: 900;
  margin: 0 0 24px 0;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-family: var(--font-mono);
  background: var(--brutal-cyan);
  padding: 12px 24px;
  border: 4px solid var(--border-primary);
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const PrizeSection = styled.div`
  margin-bottom: 20px;
`

const PrizeText = styled.div`
  color: var(--text-primary);
  font-size: 16px;
  margin-bottom: 8px;
  font-family: var(--font-mono);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
`

const PrizeAmount = styled.div`
  color: var(--text-primary);
  font-size: 40px;
  font-weight: 900;
  margin-bottom: 20px;
  font-family: var(--font-mono);
  background: var(--brutal-yellow);
  padding: 16px 32px;
  border: 4px solid var(--border-primary);
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  text-transform: uppercase;
  letter-spacing: 2px;
`

const CountdownTimer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: var(--brutal-red);
  border-radius: 0;
  padding: 12px 20px;
  margin-bottom: 24px;
  border: 3px solid var(--border-primary);
  box-shadow: 3px 3px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
`

const TimerIcon = styled.div`
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 900;
`

const TimerValue = styled.div`
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 900;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
`

const PrizesButton = styled(Button)`
  background: var(--brutal-orange);
  color: var(--text-primary);
  font-weight: 900;
  margin-bottom: 20px;
  position: relative;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &::after {
    content: '+10% BONUS';
    position: absolute;
    top: -8px;
    right: -8px;
    background: var(--brutal-pink);
    color: var(--text-primary);
    font-size: 10px;
    padding: 4px 8px;
    border-radius: 0;
    font-weight: 900;
    border: 2px solid var(--border-primary);
    font-family: var(--font-mono);
  }
`

const BonusText = styled.div`
  color: var(--text-muted);
  font-size: 12px;
  margin-bottom: 20px;
`

const TournamentDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
`

const DetailLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 14px;
`

const DetailValue = styled.div`
  color: var(--text-primary);
  font-weight: 600;
  font-size: 14px;
`

const ViewAllButton = styled.button`
  background: none;
  border: none;
  color: var(--primary-green);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`

const JoinButton = styled(Button)`
  background: var(--brutal-lime);
  font-size: 18px;
  font-weight: 900;
  padding: 16px 24px;
  margin-top: 24px;
  position: relative;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 2px;
  
  &:hover {
    background: var(--brutal-cyan);
  }
`

const EntryFeeDisplay = styled.div`
  position: absolute;
  top: -12px;
  right: 16px;
  background: rgba(0, 0, 0, 0.8);
  color: var(--accent-yellow);
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
`

const HowToPlayButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 20px;
  padding: 8px 12px;
  color: var(--accent-yellow);
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background: rgba(251, 191, 36, 0.2);
  }
`

const NotificationCard = styled.div<{ $type: "success" | "error" | "info" }>`
  background: ${(props) => {
    switch (props.$type) {
      case "success":
        return "var(--brutal-lime)"
      case "error":
        return "var(--brutal-red)"
      case "info":
        return "var(--brutal-yellow)"
      default:
        return "var(--light-bg)"
    }
  }};
  color: var(--text-primary);
  font-size: 16px;
  padding: 16px 20px;
  border-radius: 0;
  margin-bottom: 24px;
  text-align: center;
  border: 4px solid var(--border-primary);
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
`

export default function TournamentPage() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 32,
    seconds: 23,
  })
  const [notification, setNotification] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null)

  const { wallet } = useWallet()
  const { joinTournament } = useTournamentLogic()

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        }

        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (value: number) => value.toString().padStart(2, "0")

  const calendarDays = [
    { number: 14, name: "Thu", today: false, active: false },
    { number: 15, name: "Fri", today: false, active: false },
    { number: 16, name: "Sat", today: false, active: false },
    { number: 17, name: "Sun", today: true, active: true },
    { number: 18, name: "Mon", today: false, active: false },
    { number: 19, name: "Tue", today: false, active: false },
    { number: 20, name: "Wed", today: false, active: false },
  ]

  const handleJoinTournament = async () => {
    if (!wallet.isConnected) {
      setNotification({ type: "error", message: "Please connect your wallet first" })
      return
    }

    const entryFee = 9 // $9 entry fee
    if (wallet.balance < entryFee) {
      setNotification({ type: "error", message: "Insufficient balance for tournament entry" })
      return
    }

    try {
      setNotification({ type: "info", message: "Joining tournament..." })
      await joinTournament("crypto_fantasy_league_001", entryFee)
      setNotification({ type: "success", message: "Successfully joined tournament!" })
    } catch (error) {
      setNotification({ type: "error", message: "Failed to join tournament. Please try again." })
    }
  }

  return (
    <AppLayout>
      <HowToPlayButton>💡 How To Play</HowToPlayButton>

      {notification && <NotificationCard $type={notification.type}>{notification.message}</NotificationCard>}

      <CalendarContainer>
        <CalendarHeader>AUGUST 2025</CalendarHeader>
        <CalendarGrid>
          {calendarDays.map((day) => (
            <CalendarDay key={day.number} $active={day.active} $today={day.today}>
              <DayNumber>{day.number}</DayNumber>
              <DayName>{day.name}</DayName>
            </CalendarDay>
          ))}
        </CalendarGrid>
      </CalendarContainer>

      <TournamentCard>
        <TournamentContent>
          <TournamentBadge>Crypto</TournamentBadge>
          <TournamentTitle>Fantasy League</TournamentTitle>

          <PrizeSection>
            <PrizeText>JOIN WITH $9 AND</PrizeText>
            <PrizeText>WIN TOTAL PRIZES OF</PrizeText>
            <PrizeAmount>$500.00</PrizeAmount>
          </PrizeSection>

          <CountdownTimer>
            <TimerIcon>⏰</TimerIcon>
            <TimerValue>
              {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
            </TimerValue>
          </CountdownTimer>

          <PrizesButton $fullWidth>Prizes Detail</PrizesButton>

          <BonusText>Read more about share bonus</BonusText>

          <TournamentDetails>
            <DetailRow>
              <DetailLabel>⏱️ Duration</DetailLabel>
              <DetailValue>4h Match</DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>👥 Players Joined</DetailLabel>
              <DetailValue>
                <ViewAllButton>View All</ViewAllButton> 32/50
              </DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>⚙️ Entry Options</DetailLabel>
              <DetailValue></DetailValue>
            </DetailRow>

            <DetailRow>
              <DetailLabel>👥 Squad Limit ℹ️</DetailLabel>
              <DetailValue>0/3</DetailValue>
            </DetailRow>
          </TournamentDetails>

          <JoinButton $fullWidth onClick={handleJoinTournament}>
            Join with SOL
            <EntryFeeDisplay>🎴 0.05</EntryFeeDisplay>
          </JoinButton>
        </TournamentContent>
      </TournamentCard>
    </AppLayout>
  )
}
