"use client"

import styled from "styled-components"
import { useAlgorandWallet } from "./AlgorandWalletProvider"

const ConnectButton = styled.button<{ $variant?: "primary" | "secondary" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 0;
  border: 4px solid var(--border-primary);
  background: ${props => props.$variant === "secondary" ? "var(--brutal-orange)" : "var(--brutal-violet)"};
  color: var(--text-primary);
  font-weight: 900;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  font-family: var(--font-mono);
  transition: all 0.1s ease;
  box-shadow: 3px 3px 0px 0px var(--border-primary);
  
  &:hover:not(:disabled) {
    background: var(--brutal-pink);
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px 0px var(--border-primary);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const WalletIcon = styled.span`
  font-size: 16px;
`

interface AlgorandConnectButtonProps {
  variant?: "primary" | "secondary"
  children?: React.ReactNode
  className?: string
}

export function AlgorandConnectButton({ 
  variant = "primary", 
  children = "Connect Pera Wallet",
  className 
}: AlgorandConnectButtonProps) {
  const { wallet, connectWallet, disconnectWallet } = useAlgorandWallet()

  if (wallet.isConnected && wallet.address) {
    return (
      <ConnectButton $variant={variant} className={className} onClick={disconnectWallet}>
        <WalletIcon>🔗</WalletIcon>
        Disconnect
      </ConnectButton>
    )
  }

  return (
    <ConnectButton 
      $variant={variant} 
      onClick={connectWallet} 
      disabled={wallet.connecting}
      className={className}
    >
      <WalletIcon>🔗</WalletIcon>
      {wallet.connecting ? "Connecting..." : children}
    </ConnectButton>
  )
}