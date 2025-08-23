"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import algosdk from "algosdk"

interface WalletState {
  isConnected: boolean
  address: string | null
  balance: number
  connecting: boolean
  algoBalance: number
  network: "testnet" | "mainnet"
}

interface WalletContextType {
  wallet: WalletState
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  deposit: (amount: number) => Promise<void>
  withdraw: (amount: number) => Promise<void>
  createMatch: (opponent: string, amount: number, duration: number) => Promise<string>
  joinTournament: (tournamentId: string, entryFee: number) => Promise<void>
  getTransactionHistory: () => Promise<any[]>
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

const ALGORAND_CONFIG = {
  testnet: {
    server: "https://testnet-api.algonode.cloud",
    port: 443,
    token: "",
    indexer: "https://testnet-idx.algonode.cloud",
  },
  mainnet: {
    server: "https://mainnet-api.algonode.cloud",
    port: 443,
    token: "",
    indexer: "https://mainnet-idx.algonode.cloud",
  },
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: 0,
    connecting: false,
    algoBalance: 0,
    network: "testnet",
  })

  const [algodClient, setAlgodClient] = useState<algosdk.Algodv2 | null>(null)
  const [indexerClient, setIndexerClient] = useState<algosdk.Indexer | null>(null)

  useEffect(() => {
    const config = ALGORAND_CONFIG[wallet.network]
    const algod = new algosdk.Algodv2(config.token, config.server, config.port)
    const indexer = new algosdk.Indexer(config.token, config.indexer, config.port)

    setAlgodClient(algod)
    setIndexerClient(indexer)
  }, [wallet.network])

  const connectWallet = async () => {
    setWallet((prev) => ({ ...prev, connecting: true }))

    try {
      // Check if PeraWallet is available
      if (typeof window !== "undefined" && (window as any).PeraWallet) {
        const PeraWallet = (window as any).PeraWallet
        const peraWallet = new PeraWallet.PeraWalletConnect()

        const accounts = await peraWallet.connect()
        const address = accounts[0]

        // Get account balance
        if (algodClient) {
          const accountInfo = await algodClient.accountInformation(address).do()
          const algoBalance = accountInfo.amount / 1000000 // Convert microAlgos to Algos

          setWallet({
            isConnected: true,
            address: address,
            balance: 0.0, // Game balance (separate from ALGO balance)
            connecting: false,
            algoBalance: algoBalance,
            network: "testnet",
          })
        }
      } else {
        // Fallback simulation for development
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setWallet({
          isConnected: true,
          address: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567890ABCDEFGHIJKLMNOPQR",
          balance: 0.0,
          connecting: false,
          algoBalance: 10.5,
          network: "testnet",
        })
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      setWallet((prev) => ({ ...prev, connecting: false }))
      throw error
    }
  }

  const disconnectWallet = () => {
    setWallet({
      isConnected: false,
      address: null,
      balance: 0,
      connecting: false,
      algoBalance: 0,
      network: "testnet",
    })
  }

  const deposit = async (amount: number) => {
    if (!wallet.address || !algodClient) {
      throw new Error("Wallet not connected")
    }

    try {
      // Create payment transaction to game contract
      const suggestedParams = await algodClient.getTransactionParams().do()
      const gameContractAddress = "GAMECONTRACTADDRESSHERE" // Replace with actual contract address

      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: wallet.address,
        to: gameContractAddress,
        amount: amount * 1000000, // Convert Algos to microAlgos
        suggestedParams,
        note: new Uint8Array(Buffer.from("CFL_DEPOSIT")),
      })

      // For now, simulate the transaction
      console.log("Depositing:", amount, "ALGO")
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setWallet((prev) => ({
        ...prev,
        balance: prev.balance + amount,
        algoBalance: prev.algoBalance - amount,
      }))
    } catch (error) {
      console.error("Deposit failed:", error)
      throw error
    }
  }

  const withdraw = async (amount: number) => {
    if (!wallet.address || !algodClient) {
      throw new Error("Wallet not connected")
    }

    try {
      if (amount > wallet.balance) {
        throw new Error("Insufficient game balance")
      }

      // Create withdrawal transaction from game contract
      console.log("Withdrawing:", amount, "ALGO")
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setWallet((prev) => ({
        ...prev,
        balance: prev.balance - amount,
        algoBalance: prev.algoBalance + amount,
      }))
    } catch (error) {
      console.error("Withdraw failed:", error)
      throw error
    }
  }

  const createMatch = async (opponent: string, amount: number, duration: number): Promise<string> => {
    if (!wallet.address || !algodClient) {
      throw new Error("Wallet not connected")
    }

    try {
      // Create match smart contract transaction
      const suggestedParams = await algodClient.getTransactionParams().do()

      // Simulate match creation
      console.log("Creating match:", { opponent, amount, duration })
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const matchId = `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Deduct entry fee from balance
      setWallet((prev) => ({ ...prev, balance: prev.balance - amount }))

      return matchId
    } catch (error) {
      console.error("Failed to create match:", error)
      throw error
    }
  }

  const joinTournament = async (tournamentId: string, entryFee: number): Promise<void> => {
    if (!wallet.address || !algodClient) {
      throw new Error("Wallet not connected")
    }

    try {
      if (entryFee > wallet.balance) {
        throw new Error("Insufficient balance for tournament entry")
      }

      // Create tournament join transaction
      console.log("Joining tournament:", tournamentId, "Entry fee:", entryFee)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Deduct entry fee from balance
      setWallet((prev) => ({ ...prev, balance: prev.balance - entryFee }))
    } catch (error) {
      console.error("Failed to join tournament:", error)
      throw error
    }
  }

  const getTransactionHistory = async (): Promise<any[]> => {
    if (!wallet.address || !indexerClient) {
      return []
    }

    try {
      // Get transaction history from Algorand indexer
      const transactions = await indexerClient.lookupAccountTransactions(wallet.address).limit(50).do()

      return transactions.transactions.map((tx: any) => ({
        id: tx.id,
        type: tx["tx-type"],
        amount: tx["payment-transaction"]?.amount || 0,
        timestamp: tx["round-time"],
        sender: tx.sender,
        receiver: tx["payment-transaction"]?.receiver,
      }))
    } catch (error) {
      console.error("Failed to get transaction history:", error)
      return []
    }
  }

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connectWallet,
        disconnectWallet,
        deposit,
        withdraw,
        createMatch,
        joinTournament,
        getTransactionHistory,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
