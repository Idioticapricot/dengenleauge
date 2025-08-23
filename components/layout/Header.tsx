"use client"

import { useState } from "react"
import styled from "styled-components"
import { Button } from "../styled/GlobalStyles"
import { useWallet } from "../wallet/WalletProvider"
import { useRouter } from "next/navigation"

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

export function Header() {
  const { wallet } = useWallet()
  const router = useRouter()
  const [showWamPopup, setShowWamPopup] = useState(false)

  const handleWamClick = () => {
    setShowWamPopup(true)
  }

  const handleGoToDeposit = () => {
    setShowWamPopup(false)
    router.push('/profile')
  }

  const handleProfileClick = () => {
    router.push('/profile')
  }

  return (
    <>
      {showWamPopup && (
        <PopupOverlay onClick={() => setShowWamPopup(false)}>
          <PopupContent onClick={(e) => e.stopPropagation()}>
            <PopupTitle>💰 BUY $WAM</PopupTitle>
            <PopupText>
              Get more $WAM tokens to create beasts and battle other trainers!
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
        <BalanceContainer>
          <TokenIcon>$WAM</TokenIcon>
          <Balance>{wallet.balance.toFixed(0)}</Balance>
          <AddButton onClick={handleWamClick}>+</AddButton>
        </BalanceContainer>
      </LeftSection>

      <RightSection>
        <ProfileButton onClick={handleProfileClick}>
          testingtesla7
        </ProfileButton>
      </RightSection>
    </HeaderContainer>
    </>
  )
}
