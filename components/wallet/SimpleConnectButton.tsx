"use client"

import { useState } from "react"
import { useWallet } from "@txnlab/use-wallet-react"
import styled from "styled-components"
import { Button } from "../styled/GlobalStyles"

const ConnectButton = styled(Button)`
  background: var(--brutal-cyan);
  border: 3px solid var(--border-primary);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-weight: 900;
  text-transform: uppercase;
  padding: 12px 24px;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  transition: all 0.1s ease;

  &:hover {
    background: var(--brutal-lime);
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px var(--border-primary);
  }
`

const AddressDisplay = styled.div`
  background: var(--brutal-lime);
  border: 3px solid var(--border-primary);
  padding: 12px 16px;
  font-family: var(--font-mono);
  font-weight: 900;
  text-transform: uppercase;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  cursor: pointer;
  transition: all 0.1s ease;

  &:hover {
    background: var(--brutal-cyan);
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px var(--border-primary);
  }
`

const WalletModal = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  padding: 32px;
  max-width: 400px;
  width: 90%;
  box-shadow: 8px 8px 0px 0px var(--border-primary);
`

const ModalTitle = styled.h2`
  font-family: var(--font-mono);
  font-weight: 900;
  text-transform: uppercase;
  color: var(--text-primary);
  margin: 0 0 24px 0;
  text-align: center;
`

const WalletButton = styled(Button)`
  width: 100%;
  margin-bottom: 12px;
  background: var(--brutal-yellow);
  
  &:hover {
    background: var(--brutal-orange);
  }
  
  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`

export function SimpleConnectButton() {
  const { wallets, activeAccount } = useWallet()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [connecting, setConnecting] = useState(false)

  const handleConnect = async (walletId: string) => {
    setConnecting(true)
    try {
      const wallet = wallets?.find(w => w.id === walletId)
      if (wallet && !wallet.isConnected) {
        await wallet.connect()
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      if (wallets) {
        for (const wallet of wallets) {
          if (wallet.isConnected) {
            await wallet.disconnect()
          }
        }
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!activeAccount) {
    return (
      <>
        <ConnectButton onClick={() => setIsModalOpen(true)}>
          🔗 Connect Wallet
        </ConnectButton>
        
        <WalletModal $isOpen={isModalOpen}>
          <ModalContent>
            <ModalTitle>Connect Wallet</ModalTitle>
            {wallets?.map((wallet) => (
              <WalletButton
                key={wallet.id}
                onClick={() => handleConnect(wallet.id)}
                disabled={connecting}
              >
                {connecting ? 'Connecting...' : `Connect ${wallet.metadata.name}`}
              </WalletButton>
            ))}
            <Button 
              onClick={() => setIsModalOpen(false)}
              style={{ width: '100%', background: 'var(--brutal-red)' }}
            >
              Cancel
            </Button>
          </ModalContent>
        </WalletModal>
      </>
    )
  }

  return (
    <>
      <AddressDisplay onClick={() => setIsModalOpen(true)}>
        {formatAddress(activeAccount.address)}
      </AddressDisplay>
      
      <WalletModal $isOpen={isModalOpen}>
        <ModalContent>
          <ModalTitle>Wallet Connected</ModalTitle>
          <div style={{ 
            padding: '16px', 
            background: 'var(--brutal-lime)', 
            border: '2px solid var(--border-primary)',
            marginBottom: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            wordBreak: 'break-all'
          }}>
            {activeAccount.address}
          </div>
          <Button 
            onClick={handleDisconnect}
            style={{ width: '100%', background: 'var(--brutal-red)', marginBottom: '12px' }}
          >
            Disconnect
          </Button>
          <Button 
            onClick={() => setIsModalOpen(false)}
            style={{ width: '100%', background: 'var(--brutal-cyan)' }}
          >
            Close
          </Button>
        </ModalContent>
      </WalletModal>
    </>
  )
}