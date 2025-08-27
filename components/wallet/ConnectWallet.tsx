"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@txnlab/use-wallet-react"
import { algodClient } from "../../lib/algorand-config"
import ConnectWalletModal from "./ConnectWalletModal"
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

export function ConnectWallet() {
  const { wallets, activeAccount } = useWallet()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [degenBalance, setDegenBalance] = useState('0')

  const DEGEN_ASA_ID = 123456789 // Mock DEGEN ASA ID - replace with actual when available

  useEffect(() => {
    if (activeAccount?.address) {
      fetchDegenBalance(activeAccount.address)
    }
  }, [activeAccount])

  const fetchDegenBalance = async (address: string) => {
    try {
      const accountInfo = await algodClient.accountInformation(address).do()

      // Find DEGEN asset in account assets
      const degenAsset = accountInfo.assets?.find((asset: any) => asset['asset-id'] === DEGEN_ASA_ID)
      setDegenBalance(degenAsset ? degenAsset.amount.toString() : '0')
    } catch (error) {
      console.error('Error fetching DEGEN balance:', error)
      setDegenBalance('0')
    }
  }

  const handleConnectClick = () => {
    console.log('Connect button clicked, opening modal')
    setIsModalOpen(true)
  }

  const handleAddressClick = () => {
    setIsModalOpen(true)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!activeAccount) {
    return (
      <>
        <ConnectButton onClick={handleConnectClick}>
          🔗 Connect Wallet
        </ConnectButton>
        <ConnectWalletModal
          wallets={wallets}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    )
  }

  return (
    <>
      <AddressDisplay onClick={handleAddressClick}>
        {formatAddress(activeAccount.address)}
      </AddressDisplay>
      <ConnectWalletModal
        wallets={wallets}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

export default ConnectWallet