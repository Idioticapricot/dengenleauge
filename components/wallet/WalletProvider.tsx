"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { WagmiProvider, useAccount, useBalance, useDisconnect, useConnect, useSwitchChain } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '../../lib/wallet-config'
import { avalancheFuji } from 'wagmi/chains'

interface WalletState {
  isConnected: boolean
  address: string | null
  balance: string
  connecting: boolean
  chainId: number | null
  network: "avalanche" | "avalancheFuji" | "unknown"
}

interface WalletContextType {
  wallet: WalletState
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  switchNetwork: (chainId: number) => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

function WalletProviderInner({ children }: WalletProviderProps) {
  const { address, isConnected, chainId } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const { data: balanceData } = useBalance({
    address,
  })

  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: "0",
    connecting: false,
    chainId: null,
    network: "unknown",
  })

  // Update wallet state when wagmi state changes
  useEffect(() => {
    if (isConnected && address) {
      setWallet(prev => ({
        ...prev,
        isConnected: true,
        address: address,
        chainId: chainId || null,
        network: chainId === 43114 ? "avalanche" : chainId === 43113 ? "avalancheFuji" : "unknown",
        connecting: false,
      }))
    } else {
      setWallet({
        isConnected: false,
        address: null,
        balance: "0",
        connecting: false,
        chainId: null,
        network: "unknown",
      })
    }
  }, [isConnected, address, chainId])

  // Update balance when balance data changes
  useEffect(() => {
    if (balanceData) {
      const balanceInEth = (parseFloat(balanceData.formatted)).toFixed(4)
      setWallet(prev => ({ ...prev, balance: balanceInEth }))
    }
  }, [balanceData])

  const connectWallet = async () => {
    setWallet(prev => ({ ...prev, connecting: true }))
    
    try {
      console.log('Available connectors:', connectors)
      
      // Try to connect with available connectors
      if (connectors.length > 0) {
        // Prefer Core Wallet if available
        const coreWallet = connectors.find(c => c.id === 'CoreWallet')
        const connector = coreWallet || connectors[0]
        
        console.log('Using connector:', connector)
        
        await connect({ connector })
        
        // After connection, try to switch to Fuji testnet if not already on it
        if (chainId && chainId !== avalancheFuji.id) {
          try {
            console.log('Switching to Avalanche Fuji testnet...')
            await switchChain({ chainId: avalancheFuji.id })
          } catch (switchError) {
            console.log('User rejected network switch or already on correct network')
          }
        }
      } else {
        throw new Error("No connectors available")
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      setWallet(prev => ({ ...prev, connecting: false }))
      throw error
    }
  }

  const disconnectWallet = async () => {
    try {
      disconnect()
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    }
  }

  const switchNetwork = async (targetChainId: number) => {
    try {
      await switchChain({ chainId: targetChainId })
    } catch (error) {
      console.error("Failed to switch network:", error)
      throw error
    }
  }

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connectWallet,
        disconnectWallet,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletProviderInner>
          {children}
        </WalletProviderInner>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
