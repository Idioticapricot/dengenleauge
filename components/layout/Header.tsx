"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { Button } from "../styled/GlobalStyles"
import { useWallet } from "@txnlab/use-wallet-react"
import { useRouter } from "next/navigation"
import { SimpleConnectButton } from "../wallet/SimpleConnectButton"
import Image from "next/image"

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--light-bg);
  border-bottom: 4px solid var(--border-primary);
  position: sticky;
  top: 0;
  z-index: 100;
  font-family: var(--font-mono);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 12px;
    border-bottom-width: 3px;
  }

  @media (max-width: 480px) {
    padding: 8px;
    border-bottom-width: 2px;
  }
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    gap: 8px;
  }

  @media (max-width: 480px) {
    gap: 6px;
  }
`

const BalanceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--brutal-lime) 0%, var(--brutal-cyan) 100%);
  border: 3px solid var(--border-primary);
  padding: 8px 12px;
  box-shadow: 3px 3px 0px 0px var(--border-primary);
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 4px;
    height: 100%;
    background: var(--brutal-yellow);
    animation: balancePulse 2s ease-in-out infinite;
  }
  
  @keyframes balancePulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  
  &:hover {
    transform: translate(1px, 1px) scale(1.05);
    box-shadow: 2px 2px 0px 0px var(--border-primary);
  }
  
  @media (max-width: 768px) {
    border-width: 2px;
    padding: 6px 10px;
    font-size: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: 11px;
  }
`

const TokenIcon = styled.div`
  width: 24px;
  height: 24px;
  background: var(--brutal-yellow);
  border: 2px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 900;
  font-family: var(--font-mono);
  transition: all 0.2s ease;
  animation: tokenSpin 3s linear infinite;
  
  @keyframes tokenSpin {
    0% { transform: rotateY(0deg); }
    50% { transform: rotateY(180deg); }
    100% { transform: rotateY(360deg); }
  }
  
  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
    font-size: 10px;
  }
`

const Balance = styled.span`
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
`

const AddButton = styled.button`
  width: 24px;
  height: 24px;
  background: var(--brutal-yellow);
  border: 2px solid var(--border-primary);
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--brutal-cyan);
    transform: translate(1px, 1px) rotate(90deg);
    box-shadow: 0 0 10px var(--brutal-cyan);
  }
  
  &:active {
    transform: translate(2px, 2px) rotate(90deg) scale(0.95);
  }
  
  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
    font-size: 14px;
  }
`

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`

const PopupContent = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  box-shadow: 8px 8px 0px 0px var(--border-primary);
  padding: 32px;
  max-width: 400px;
  width: 90%;
  font-family: var(--font-mono);
  
  @media (max-width: 768px) {
    border-width: 3px;
    padding: 24px;
  }
`

const PopupTitle = styled.h2`
  font-size: 24px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  text-transform: uppercase;
  text-align: center;
`

const PopupText = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 24px 0;
  text-align: center;
`

const PopupButtons = styled.div`
  display: flex;
  gap: 12px;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`

const PopupButton = styled(Button)`
  flex: 1;
  font-size: 14px;
  padding: 12px;
  text-transform: uppercase;
`

const LogoNameBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, var(--brutal-lime) 0%, var(--brutal-yellow) 100%);
  border: 3px solid var(--border-primary);
  padding: 8px 16px;
  box-shadow: 3px 3px 0px 0px var(--border-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translate(1px, 1px) scale(1.02);
    box-shadow: 2px 2px 0px 0px var(--border-primary);
    
    &::before {
      left: 100%;
    }
  }

  @media (max-width: 768px) {
    border-width: 2px;
    padding: 6px 12px;
  }
`

const AppName = styled.span`
  font-size: 24px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 2px;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`


export function Header() {
  const { activeAccount } = useWallet()
  const router = useRouter()
  const [showWamPopup, setShowWamPopup] = useState(false)
  const [degenBalance, setDegenBalance] = useState('0')
  const [isDark, setIsDark] = useState(false)
  const DEGEN_ASA_ID = parseInt(process.env.DEGEN_ASSET_ID || '745007115')

  const handleWamClick = () => {
    router.push('/buy-tokens')
  }

  const handleGoToDeposit = () => {
    setShowWamPopup(false)
    router.push('/profile')
  }

  const handleProfileClick = () => {
    router.push('/profile')
  }

  const handleNetworkSwitch = () => {
    // Algorand doesn't need network switching like EVM chains
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const fetchDegenBalance = async () => {
    if (!activeAccount?.address) return

    try {
      const response = await fetch(`/api/user-degen-balance?walletAddress=${activeAccount.address}`)
      const data = await response.json()

      if (data.success) {
        const balance = Number(data.data.degenBalance || 0)
        setDegenBalance(balance.toFixed(2))
      } else {
        setDegenBalance('0')
      }
    } catch (error) {
      console.error('Error fetching DEGEN balance:', error)
      setDegenBalance('0')
    }
  }

  useEffect(() => {
    fetchDegenBalance()
  }, [activeAccount?.address])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const getNetworkName = () => {
    return "ALGO" // Algorand network
  }

  return (
    <>
      {showWamPopup && (
        <PopupOverlay onClick={() => setShowWamPopup(false)}>
          <PopupContent onClick={(e) => e.stopPropagation()}>
            <PopupTitle>💰 BUY $DEGEN</PopupTitle>
            <PopupText>
              Get more $DEGEN tokens to create beasts and battle other trainers!
            </PopupText>
            <PopupButtons>
              <PopupButton onClick={() => setShowWamPopup(false)}>
                Cancel
              </PopupButton>
              <PopupButton onClick={handleGoToDeposit}>
                Go to Deposit
              </PopupButton>
            </PopupButtons>
          </PopupContent>
        </PopupOverlay>
      )}

      <HeaderContainer>
        <LeftSection>
          <LogoNameBox onClick={() => router.push('/')}>
            <Image
              src="/wolf-removebg-preview.png"
              alt="Degen League Logo"
              width={40}
              height={40}
              priority
            />
            <AppName>DEGEN LEAGUE</AppName>
          </LogoNameBox>
        </LeftSection>

        <RightSection>
          {activeAccount?.address && (
            <BalanceContainer onClick={handleWamClick}>
              <TokenIcon>$D</TokenIcon>
              <Balance>{degenBalance}</Balance>
              <AddButton onClick={(e) => { e.stopPropagation(); router.push('/buy-tokens'); }}>+</AddButton>
            </BalanceContainer>
          )}
          <SimpleConnectButton />
        </RightSection>
      </HeaderContainer>
    </>
  )
}
