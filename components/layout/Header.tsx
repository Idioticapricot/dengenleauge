"use client"

import styled from "styled-components"
import { Button } from "../styled/GlobalStyles"
import { useWallet } from "../wallet/WalletProvider"

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

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const DocsButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--brutal-orange);
  border: 3px solid var(--border-primary);
  border-radius: 0;
  padding: 8px 12px;
  color: var(--text-primary);
  font-weight: 900;
  font-size: 12px;
  cursor: pointer;
  font-family: var(--font-mono);
  text-transform: uppercase;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  transition: all 0.1s ease;
  
  &:hover {
    background: var(--brutal-pink);
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px 0px var(--border-primary);
  }
`

const ConnectWalletButton = styled(Button)`
  font-size: 12px;
  padding: 8px 16px;
  text-transform: uppercase;
`

const WalletInfo = styled.div`
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
  const { wallet, connectWallet, disconnectWallet } = useWallet()

  return (
    <HeaderContainer>
      <LeftSection>
        <BalanceContainer>
          <TokenIcon>₳</TokenIcon>
          <Balance>{wallet.balance.toFixed(2)}</Balance>
          <AddButton>+</AddButton>
        </BalanceContainer>
      </LeftSection>

      <RightSection>
        <DocsButton>📚 Docs</DocsButton>
        {wallet.isConnected ? (
          <WalletInfo onClick={disconnectWallet}>
            {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
          </WalletInfo>
        ) : (
          <ConnectWalletButton $size="sm" onClick={connectWallet} disabled={wallet.connecting}>
            {wallet.connecting ? "Connecting..." : "Connect Wallet"}
          </ConnectWalletButton>
        )}
      </RightSection>
    </HeaderContainer>
  )
}
