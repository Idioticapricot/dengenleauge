"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { Button } from "../styled/GlobalStyles"
import { useWallet } from "@txnlab/use-wallet-react"
import { useRouter } from "next/navigation"
import { algodClient } from "../../lib/algorand-config"
import ConnectWallet from "../wallet/ConnectWallet"
import { DegenSwap } from "../swap/DegenSwap"

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
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const BalanceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--brutal-lime);
  border: 3px solid var(--border-primary);
  border-radius: 0;
  padding: 8px 12px;
  box-shadow: 3px 3px 0px 0px var(--border-primary);
  font-weight: 900;
  text-transform: uppercase;
`

const TokenIcon = styled.div`
  width: 24px;
  height: 24px;
  background: var(--brutal-yellow);
  border: 2px solid var(--border-primary);
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 900;
  font-family: var(--font-mono);
`

const Balance = styled.span`
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
`

const AddButton = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 0;
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
  transition: all 0.1s ease;
  
  &:hover {
    background: var(--brutal-cyan);
    transform: translate(1px, 1px);
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
`

const PopupContent = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  box-shadow: 8px 8px 0px 0px var(--border-primary);
  padding: 32px;
  max-width: 400px;
  width: 90%;
  font-family: var(--font-mono);
`

const PopupTitle = styled.h2`
  font-size: 24px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 2px;
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
`

const PopupButton = styled(Button)`
  flex: 1;
  font-size: 14px;
  padding: 12px;
  text-transform: uppercase;
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const ProfileButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--brutal-cyan);
  border: 3px solid var(--border-primary);
  border-radius: 0;
  padding: 8px 12px;
  font-size: 12px;
  color: var(--text-primary);
  cursor: pointer;
  font-family: var(--font-mono);
  font-weight: 900;
  text-transform: uppercase;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  transition: all 0.1s ease;
  
  &:hover {
    background: var(--brutal-lime);
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px 0px var(--border-primary);
  }
`

const NetworkIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--brutal-violet);
  border: 2px solid var(--border-primary);
  border-radius: 0;
  padding: 6px 10px;
  font-size: 10px;
  color: var(--text-primary);
  cursor: pointer;
  font-family: var(--font-mono);
  font-weight: 900;
  text-transform: uppercase;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  transition: all 0.1s ease;
  
  &:hover {
    background: var(--brutal-pink);
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px 0px var(--border-primary);
  }
`

const NetworkDot = styled.div<{ $network: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => {
    switch (props.$network) {
      case "avalanche":
        return "#E84142"
      case "avalancheFuji":
        return "#F7931A"
      default:
        return "#6B7280"
    }
  }};
`

export function Header() {
  const { activeAccount } = useWallet()
  const router = useRouter()
  const [showWamPopup, setShowWamPopup] = useState(false)
  const [showDegenSwap, setShowDegenSwap] = useState(false)
  const [degenBalance, setDegenBalance] = useState('0')
  const DEGEN_ASA_ID = 123456789 // Mock DEGEN ASA ID - replace with actual when available

  const handleWamClick = () => {
    setShowDegenSwap(true)
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
    console.log('Network switching not needed on Algorand')
  }

  const fetchDegenBalance = async () => {
    if (!activeAccount?.address) return

    try {
      // TODO: Replace with actual DEGEN ASA ID when deployed
      const accountInfo = await algodClient.accountInformation(activeAccount.address).do()

      // Find DEGEN asset in account assets
      const degenAsset = accountInfo.assets?.find((asset: any) => asset['asset-id'] === DEGEN_ASA_ID)
      setDegenBalance(degenAsset ? degenAsset.amount.toString() : '0')
    } catch (error) {
      console.error('Error fetching DEGEN balance:', error)
      setDegenBalance('0')
    }
  }

  useEffect(() => {
    fetchDegenBalance()
  }, [activeAccount?.address])

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
        <BalanceContainer onClick={handleWamClick}>
          <TokenIcon>$D</TokenIcon>
          <Balance>{degenBalance}</Balance>
          <AddButton onClick={(e) => { e.stopPropagation(); setShowDegenSwap(true); }}>+</AddButton>
        </BalanceContainer>
      </LeftSection>

      <RightSection>
        <ConnectWallet />
      </RightSection>
    </HeaderContainer>
    
    <DegenSwap 
      isOpen={showDegenSwap} 
      onClose={() => setShowDegenSwap(false)} 
    />
    </>
  )
}
