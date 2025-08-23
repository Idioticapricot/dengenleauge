"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "../../components/layout/AppLayout"
import styled from "styled-components"
import { Card, Button } from "../../components/styled/GlobalStyles"
import { useRouter } from "next/navigation"
import { useWallet } from "../../components/wallet/WalletProvider"
import MyNFTABI from "../../abi/MyNFT.json"

// Import ethers
import { ethers } from 'ethers'

const BackButton = styled(Button)`
  background: var(--brutal-red);
  margin-bottom: 24px;
  
  &:hover {
    background: var(--brutal-orange);
  }
`

const CreateContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const CreateHeader = styled.div`
  text-align: center;
  background: var(--brutal-cyan);
  padding: 24px;
  border: 4px solid var(--border-primary);
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
`

const CreateTitle = styled.h1`
  font-size: 32px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 3px;
`

const CreateSubtitle = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 2px;
  background: var(--brutal-violet);
  padding: 8px 16px;
  border: 3px solid var(--border-primary);
  display: inline-block;
`

const BeastTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`

const BeastTypeCard = styled(Card)<{ $selected?: boolean }>`
  cursor: pointer;
  text-align: center;
  padding: 24px;
  background: ${props => props.$selected ? "var(--brutal-yellow)" : "var(--light-bg)"};
  transition: all 0.1s ease;
  
  &:hover {
    background: var(--brutal-lime);
    transform: translate(2px, 2px);
    box-shadow: 4px 4px 0px 0px var(--border-primary);
  }
`

const BeastIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`

const BeastTypeName = styled.h3`
  font-size: 20px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
`

const BeastTypeDescription = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  font-family: var(--font-mono);
`

const BeastStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
`

const StatItem = styled.div`
  background: var(--brutal-pink);
  padding: 8px;
  border: 2px solid var(--border-primary);
  text-align: center;
`

const StatLabel = styled.div`
  font-size: 10px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
`

const MintCost = styled.div`
  background: var(--brutal-violet);
  padding: 8px 12px;
  border: 2px solid var(--border-primary);
  font-size: 14px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
`

const MintButton = styled(Button)`
  background: var(--brutal-lime);
  font-size: 18px;
  padding: 16px 32px;
  margin-top: 24px;
  
  &:hover {
    background: var(--brutal-cyan);
  }
  
  &:disabled {
    background: var(--brutal-red);
    opacity: 0.7;
  }
`

const TransactionStatus = styled.div`
  background: var(--brutal-cyan);
  padding: 16px;
  border: 3px solid var(--border-primary);
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  margin: 16px 0;
  text-align: center;
  font-family: var(--font-mono);
`

const TransactionHash = styled.div`
  background: var(--brutal-lime);
  padding: 8px 12px;
  border: 2px solid var(--border-primary);
  font-size: 12px;
  font-weight: 900;
  color: var(--text-primary);
  margin-top: 8px;
  word-break: break-all;
`

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid var(--border-primary);
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

const tiers = [
  {
    id: "basic",
    name: "Basic Tier",
    cost: 50,
    multiplier: 1,
    abilities: ["Standard Stats"],
    color: "var(--brutal-lime)"
  },
  {
    id: "advanced",
    name: "Advanced Tier",
    cost: 100,
    multiplier: 1.3,
    abilities: ["Enhanced Stats", "Regeneration"],
    color: "var(--brutal-cyan)"
  },
  {
    id: "legendary",
    name: "Legendary Tier",
    cost: 200,
    multiplier: 1.6,
    abilities: ["Superior Stats", "Regeneration", "Critical Strike"],
    color: "var(--brutal-yellow)"
  }
]

const beastTypes = [
  {
    id: "fire",
    name: "Fire Beast",
    icon: "🔥",
    description: "High attack, low defense",
    baseStats: { hp: 80, attack: 120, defense: 60 }
  },
  {
    id: "water",
    name: "Water Beast",
    icon: "🌊",
    description: "Balanced stats",
    baseStats: { hp: 100, attack: 90, defense: 90 }
  },
  {
    id: "earth",
    name: "Earth Beast",
    icon: "🌍",
    description: "High defense, low speed",
    baseStats: { hp: 120, attack: 80, defense: 120 }
  },
  {
    id: "electric",
    name: "Electric Beast",
    icon: "⚡",
    description: "Fast and deadly",
    baseStats: { hp: 70, attack: 110, defense: 70 }
  }
]

const TierSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`

const TierCard = styled.div<{ $selected?: boolean; $color?: string }>`
  background: ${props => props.$selected ? props.$color : "var(--light-bg)"};
  border: 4px solid var(--border-primary);
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.1s ease;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  
  &:hover {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px 0px var(--border-primary);
  }
`

const TierName = styled.h3`
  font-size: 18px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
`

const TierCost = styled.div`
  background: var(--brutal-red);
  padding: 8px 12px;
  border: 2px solid var(--border-primary);
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  margin-bottom: 12px;
`

const TierAbilities = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Ability = styled.div`
  background: var(--brutal-pink);
  padding: 4px 8px;
  border: 2px solid var(--border-primary);
  font-size: 10px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const DescriptionInput = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 16px;
  border: 4px solid var(--border-primary);
  background: var(--light-bg);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 700;
  resize: vertical;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    background: var(--brutal-lime);
  }
  
  &::placeholder {
    color: var(--text-primary);
    opacity: 0.7;
  }
`

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const StatControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--brutal-cyan);
  border: 3px solid var(--border-primary);
  box-shadow: 2px 2px 0px 0px var(--border-primary);
`

const StatName = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
`

const StatButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const StatButton = styled.button`
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-primary);
  background: var(--brutal-yellow);
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 900;
  cursor: pointer;
  font-family: var(--font-mono);
  transition: all 0.1s ease;
  
  &:hover:not(:disabled) {
    background: var(--brutal-orange);
    transform: translate(1px, 1px);
  }
  
  &:disabled {
    background: var(--brutal-red);
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const StatDisplay = styled.div`
  width: 40px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--light-bg);
  border: 3px solid var(--border-primary);
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
`

const OverviewSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const OverviewItem = styled.div`
  padding: 16px;
  background: var(--brutal-violet);
  border: 3px solid var(--border-primary);
  box-shadow: 2px 2px 0px 0px var(--border-primary);
`

const OverviewLabel = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
`

const OverviewValue = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
`

const OverviewStats = styled.div`
  display: flex;
  gap: 12px;
`

const OverviewStat = styled.div`
  background: var(--brutal-lime);
  padding: 8px 12px;
  border: 2px solid var(--border-primary);
  font-size: 12px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const ConnectWalletButton = styled(Button)`
  background: var(--brutal-lime);
  font-size: 18px;
  padding: 16px 32px;
  margin: 24px 0;
  
  &:hover {
    background: var(--brutal-cyan);
  }
`

const WalletStatus = styled.div`
  background: var(--brutal-violet);
  padding: 16px;
  border: 3px solid var(--border-primary);
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  margin-bottom: 24px;
  text-align: center;
`

const ContractAddressInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 2px solid var(--border-primary);
  background: var(--light-bg);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 12px;
  margin-top: 8px;
  text-align: center;
  
  &:focus {
    outline: none;
    background: var(--brutal-lime);
  }
`

const WalletAddress = styled.div`
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
`

const NetworkStatus = styled.div`
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
`

const TestWalletButton = styled(Button)`
  background: var(--brutal-orange);
  font-size: 14px;
  padding: 8px 16px;
  margin: 8px;
  
  &:hover {
    background: var(--brutal-red);
  }
`

type Step = 'tier' | 'design' | 'stats' | 'final'

interface BeastData {
  tier: string | null
  description: string
  stats: {
    health: number
    stamina: number
    power: number
  }
}

const NFT_CONTRACT_ADDRESS = "0xb8433deCc52A3a08600d6A13CfA161849C7a27Ee" // Add your deployed contract address here

// Add a way to test with different contract addresses
const CONTRACT_ADDRESSES = {
  fuji: "0xb8433deCc52A3a08600d6A13CfA161849C7a27Ee", // Your Fuji contract
  mainnet: "0x...", // Your mainnet contract (if any)
}

export default function CreatePage() {
  const router = useRouter()
  const { wallet, connectWallet } = useWallet()
  
  const [currentStep, setCurrentStep] = useState<Step>('tier')
  const [beastData, setBeastData] = useState<BeastData>({
    tier: null,
    description: '',
    stats: { health: 5, stamina: 5, power: 5 }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [contractAddress, setContractAddress] = useState(CONTRACT_ADDRESSES.fuji)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)

  // Check if Core Wallet is available
  const isCoreWalletAvailable = typeof window !== 'undefined' && window.avalanche
  const isMetaMaskAvailable = typeof window !== 'undefined' && window.ethereum
  const currentProvider = window.avalanche || window.ethereum

  const handleNext = () => {
    if (currentStep === 'tier' && beastData.tier) {
      setBeastData({...beastData, description: '', stats: { health: 5, stamina: 5, power: 5 }})
      setCurrentStep('design')
    } else if (currentStep === 'design' && beastData.description.trim()) {
      setBeastData({...beastData, stats: { health: 5, stamina: 5, power: 5 }})
      setCurrentStep('stats')
    } else if (currentStep === 'stats') {
      setCurrentStep('final')
    }
  }

  const handleBack = () => {
    if (currentStep === 'design') {
      setBeastData({...beastData, tier: null, stats: { health: 5, stamina: 5, power: 5 }})
      setCurrentStep('tier')
    } else if (currentStep === 'stats') {
      setBeastData({...beastData, description: '', stats: { health: 5, stamina: 5, power: 5 }})
      setCurrentStep('design')
    } else if (currentStep === 'final') {
      setBeastData({...beastData, stats: { health: 5, stamina: 5, power: 5 }})
      setCurrentStep('stats')
    } else {
      router.back()
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: beastData.description,
          tier: beastData.tier,
          stats: beastData.stats
        })
      })
      
      if (response.ok) {
        const { imageUrl } = await response.json()
        setGeneratedImage(imageUrl)
      }
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCreate = async () => {
    if (!currentProvider) {
      setError("Please connect your wallet first")
      return
    }
    
    if (!generatedImage) {
      setError("Please generate an image first")
      return
    }
    
    if (!contractAddress || contractAddress === "0x...") {
      setError("Please set a valid contract address")
      return
    }
    
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    setTransactionHash(null)
    setIsConfirming(false)
    
    try {
      console.log('=== STARTING NFT MINT ===')
      console.log('Provider available:', !!currentProvider)
      console.log('Contract address:', contractAddress)
      console.log('Generated image:', generatedImage)
      
      // Validate contract ABI
      if (!MyNFTABI.abi || !Array.isArray(MyNFTABI.abi)) {
        throw new Error("Invalid contract ABI")
      }
      
      // Check if mint function exists in ABI
      const mintFunction = MyNFTABI.abi.find((item: any) => 
        item.type === 'function' && item.name === 'mint'
      )
      
      if (!mintFunction) {
        throw new Error("mint function not found in contract ABI")
      }
      
      console.log('Contract ABI validation passed')
      console.log('mint function found:', mintFunction)
      console.log('Calling mint function...')
      
      // Create ethers provider and signer
      const provider = new ethers.BrowserProvider(currentProvider)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      
      // Get the connected account
      const address = await signer.getAddress()
      console.log('Connected account:', address)
      
      // Create contract instance
      const contract = new ethers.Contract(contractAddress, MyNFTABI.abi, signer)
      
      // Try to read contract name (optional test)
      try {
        const name = await contract.name()
        console.log('Contract name:', name)
      } catch (readError) {
        console.log('Could not read contract name, but continuing...')
      }
      
      // Estimate gas for the mint function
      console.log('Estimating gas for mint function...')
      let gasEstimate
      try {
        gasEstimate = await contract.mint.estimateGas(generatedImage)
        console.log('Gas estimate:', gasEstimate.toString())
      } catch (gasError) {
        console.log('Gas estimation failed, using default gas limit')
        gasEstimate = 500000 // Default gas limit
      }
      
      // Call mint function
      console.log('Sending mint transaction...')
      const tx = await contract.mint(generatedImage, { 
        gasLimit: Math.ceil(Number(gasEstimate) * 1.2) // Add 20% buffer
      })
      
      setTransactionHash(tx.hash)
      console.log('Transaction submitted successfully:', tx.hash)
      setSuccess("Transaction submitted! Waiting for confirmation...")
      
      // Wait for confirmation
      setIsConfirming(true)
      const receipt = await tx.wait()
      setIsConfirming(false)
      console.log('Transaction confirmed!')
      setSuccess("🎉 NFT minted successfully! Redirecting to home...")
      setIsLoading(false)
      
      // Only redirect after confirmation
      setTimeout(() => {
        router.push("/home")
      }, 2000)
      
    } catch (error) {
      console.error('=== NFT MINT ERROR ===')
      console.error('Error details:', error)
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
      
      if (error instanceof Error) {
        if (error.message.includes('user rejected')) {
          setError("Transaction was rejected by user")
        } else if (error.message.includes('insufficient funds')) {
          setError("Insufficient AVAX for gas fees")
        } else if (error.message.includes('contract')) {
          setError("Contract error - check contract address and ABI")
        } else if (error.message.includes('estimateGas')) {
          setError("Gas estimation failed - contract may not be deployed or function may not exist")
        } else if (error.message.includes('CALL_EXCEPTION')) {
          setError("Contract call failed - check if contract is deployed and function exists")
        } else if (error.message.includes('execution reverted')) {
          setError("Transaction reverted - check contract logic and parameters")
        } else {
          setError(`Transaction failed: ${error.message}`)
        }
      } else {
        setError('Failed to mint NFT - check console for details')
      }
      
      setIsLoading(false)
    }
  }

  // Watch for transaction hash and confirmation
  useEffect(() => {
    if (transactionHash) {
      console.log('Transaction hash received:', transactionHash)
      setSuccess(`Transaction submitted! Hash: ${transactionHash.slice(0, 6)}...${transactionHash.slice(-4)}`)
    }
  }, [transactionHash])

  // Watch for transaction confirmation
  useEffect(() => {
    if (transactionHash && !isConfirming) {
      console.log('Transaction confirmed!')
      setSuccess("🎉 NFT minted successfully! Redirecting to home...")
      setIsLoading(false)
      
      // Only redirect after confirmation
      setTimeout(() => {
        router.push("/home")
      }, 2000)
    }
  }, [transactionHash, isConfirming, router])

  // Handle transaction errors
  const handleTransactionError = () => {
    setError("Transaction failed or was rejected. Please try again.")
    setIsLoading(false)
  }

  // Add a timeout for transaction confirmation
  useEffect(() => {
    if (transactionHash && isConfirming) {
      const timeout = setTimeout(() => {
        if (isConfirming) {
          console.log('Transaction taking longer than expected...')
          setSuccess("Transaction submitted! Taking longer than expected to confirm. You can check the status using the explorer link below.")
        }
      }, 30000) // 30 seconds timeout
      
      return () => clearTimeout(timeout)
    }
  }, [transactionHash, isConfirming])
  
  const selectedTierData = tiers.find(t => t.id === beastData.tier)
  const getMaxPoints = () => {
    if (beastData.tier === 'basic') return 20
    if (beastData.tier === 'advanced') return 30
    if (beastData.tier === 'legendary') return 40
    return 20
  }
  
  const getTotalUsedPoints = () => {
    return beastData.stats.health + beastData.stats.stamina + beastData.stats.power
  }
  
  const getRemainingPoints = () => {
    return getMaxPoints() - getTotalUsedPoints()
  }

  // Test contract deployment
  const testContractDeployment = async () => {
    try {
      console.log('=== TESTING CONTRACT DEPLOYMENT ===')
      console.log('Contract address:', contractAddress)
      
      if (!contractAddress || contractAddress === "0x...") {
        setError("Please enter a valid contract address")
        return
      }
      
      // Try to read from the contract to see if it exists
      const response = await fetch(`https://api.avax-test.network/ext/bc/C/rpc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getCode',
          params: [contractAddress, 'latest'],
          id: 1
        })
      })
      
      const data = await response.json()
      console.log('Contract code response:', data)
      
      if (data.result && data.result !== '0x') {
        setSuccess("Contract found on blockchain! Ready to mint.")
      } else {
        setError("Contract not found at this address. Make sure it's deployed on Fuji testnet.")
      }
      
    } catch (error) {
      console.error('Contract test failed:', error)
      setError(`Contract test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }



  // Test wallet connection and signing
  const testWalletConnection = async () => {
    try {
      console.log('=== TESTING WALLET CONNECTION ===')
      console.log('Provider available:', !!currentProvider)
      console.log('Core Wallet available:', isCoreWalletAvailable)
      console.log('MetaMask available:', isMetaMaskAvailable)
      
      if (!currentProvider) {
        setError("No wallet provider detected")
        return
      }
      
      // Test connection
      const provider = new ethers.BrowserProvider(currentProvider)
      const accounts = await provider.send('eth_requestAccounts', [])
      console.log('Connected accounts:', accounts)
      
      if (accounts.length === 0) {
        setError("No accounts found")
        return
      }
      
      setSuccess("Wallet connection test passed! Ready to mint.")
      
    } catch (error) {
      console.error('Wallet test failed:', error)
      setError(`Wallet test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Test contract call
  const testContractCall = async () => {
    try {
      console.log('=== TESTING CONTRACT CALL ===')
      
      if (!currentProvider) {
        setError("No wallet provider detected")
        return
      }
      
      if (!contractAddress || contractAddress === "0x...") {
        setError("Please enter a valid contract address")
        return
      }
      
      // Test contract interaction
      const provider = new ethers.BrowserProvider(currentProvider)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      
      const contract = new ethers.Contract(contractAddress, MyNFTABI.abi, signer)
      
      // Try to read contract name
      try {
        const name = await contract.name()
        console.log('Contract name:', name)
        setSuccess(`Contract accessible! Name: ${name}`)
      } catch (error) {
        console.log('Could not read name, trying to estimate gas...')
        
        // Try to estimate gas for mint function
        try {
          const gasEstimate = await contract.mint.estimateGas("test-uri")
          console.log('Gas estimate for mint:', gasEstimate.toString())
          setSuccess("Contract accessible! Mint function is callable.")
        } catch (gasError) {
          throw new Error("Contract not accessible or mint function not found")
        }
      }
      
    } catch (error) {
      console.error('Contract call test failed:', error)
      setError(`Contract test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'tier':
        return (
          <Card>
            <SectionTitle>SELECT TIER</SectionTitle>
            <TierSelector>
              {tiers.map((tier) => (
                <TierCard
                  key={tier.id}
                  $selected={beastData.tier === tier.id}
                  $color={tier.color}
                  onClick={() => setBeastData({...beastData, tier: tier.id})}
                >
                  <TierName>{tier.name}</TierName>
                  <TierCost>{tier.cost} $WAM</TierCost>
                  <TierAbilities>
                    {tier.abilities.map((ability, index) => (
                      <Ability key={index}>{ability}</Ability>
                    ))}
                  </TierAbilities>
                </TierCard>
              ))}
            </TierSelector>
          </Card>
        )
      
      case 'design':
        return (
          <Card>
            <SectionTitle>DESCRIBE YOUR BEAST</SectionTitle>
            <DescriptionInput
              placeholder="Describe your beast's appearance, personality, and abilities..."
              value={beastData.description}
              onChange={(e) => setBeastData({...beastData, description: e.target.value})}
            />
          </Card>
        )
      
      case 'stats':
        return (
          <Card>
            <SectionTitle>DISTRIBUTE STATS ({getRemainingPoints()} POINTS LEFT)</SectionTitle>
            <StatsContainer>
              {Object.entries(beastData.stats).map(([stat, value]) => (
                <StatControl key={stat}>
                  <StatName>{stat.toUpperCase()}</StatName>
                  <StatButtons>
                    <StatButton 
                      onClick={() => {
                        if (value > 5) {
                          setBeastData({
                            ...beastData,
                            stats: {...beastData.stats, [stat]: value - 1}
                          })
                        }
                      }}
                      disabled={value <= 5}
                    >
                      -
                    </StatButton>
                    <StatDisplay>{value}</StatDisplay>
                    <StatButton 
                      onClick={() => {
                        if (getRemainingPoints() > 0) {
                          setBeastData({
                            ...beastData,
                            stats: {...beastData.stats, [stat]: value + 1}
                          })
                        }
                      }}
                      disabled={getRemainingPoints() <= 0}
                    >
                      +
                    </StatButton>
                  </StatButtons>
                </StatControl>
              ))}
            </StatsContainer>
          </Card>
        )
      
      case 'final':
        return (
          <Card>
            <SectionTitle>BEAST OVERVIEW</SectionTitle>
            <OverviewSection>
              <OverviewItem>
                <OverviewLabel>TIER:</OverviewLabel>
                <OverviewValue>{selectedTierData?.name}</OverviewValue>
              </OverviewItem>
              <OverviewItem>
                <OverviewLabel>DESCRIPTION:</OverviewLabel>
                <OverviewValue>{beastData.description}</OverviewValue>
              </OverviewItem>
              <OverviewItem>
                <OverviewLabel>STATS:</OverviewLabel>
                <OverviewStats>
                  <OverviewStat>Health: {beastData.stats.health}</OverviewStat>
                  <OverviewStat>Stamina: {beastData.stats.stamina}</OverviewStat>
                  <OverviewStat>Power: {beastData.stats.power}</OverviewStat>
                </OverviewStats>
              </OverviewItem>
              {(generatedImage || isGenerating) && (
                <OverviewItem>
                  <OverviewLabel>GENERATED BEAST:</OverviewLabel>
                  {isGenerating ? (
                    <div style={{width: '300px', height: '300px', background: 'var(--brutal-lime)', border: '4px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', animation: 'pulse 2s infinite'}}>
                      🎨
                    </div>
                  ) : generatedImage ? (
                    <img src={generatedImage} alt="Generated Beast" style={{width: '100%', maxWidth: '300px', border: '4px solid var(--border-primary)'}} />
                  ) : null}
                </OverviewItem>
              )}
            </OverviewSection>
            <MintButton
              $fullWidth
              disabled={isGenerating}
              onClick={handleGenerate}
              style={{marginBottom: '16px', background: 'var(--brutal-cyan)'}}
            >
              {isGenerating ? "GENERATING..." : "🎨 GENERATE IMAGE"}
            </MintButton>
          </Card>
        )
    }
  }

  // Add wallet connection section at the top
  const renderWalletSection = () => {
    if (!currentProvider) {
      return (
        <WalletStatus>
          <div style={{marginBottom: '16px'}}>
            <div style={{fontSize: '18px', fontWeight: '900', marginBottom: '8px'}}>🔗 CONNECT WALLET</div>
            <div style={{fontSize: '14px', marginBottom: '16px'}}>Connect your Core Wallet to create beasts</div>
            <div style={{fontSize: '12px', marginBottom: '16px', opacity: 0.8}}>
              Don't have Core Wallet? <a href="https://core.app" target="_blank" rel="noopener noreferrer" style={{color: 'var(--brutal-lime)', textDecoration: 'underline'}}>Download it here</a>
            </div>
            <div style={{fontSize: '12px', marginBottom: '16px', opacity: 0.8}}>
              Make sure Core Wallet is installed and unlocked, then refresh the page
            </div>
          </div>
          <ConnectWalletButton onClick={connectWallet}>
            🚀 CONNECT CORE WALLET
          </ConnectWalletButton>
        </WalletStatus>
      )
    }

    return (
      <WalletStatus>
        <WalletAddress>Wallet: Connected to Core Wallet</WalletAddress>
        <NetworkStatus>
          Network: Avalanche Fuji Testnet
        </NetworkStatus>
        <ContractAddressInput
          type="text"
          placeholder="Enter contract address (e.g., 0x...)"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          style={{marginTop: '16px'}}
        />
        <div style={{fontSize: '10px', marginTop: '4px', opacity: 0.7, textAlign: 'center'}}>
          Make sure this contract is deployed on Avalanche Fuji testnet (chain ID: 43113)
        </div>
      </WalletStatus>
    )
  }

  return (
    <AppLayout>
      <BackButton onClick={handleBack}>
        ← BACK
      </BackButton>
      
      <CreateContainer>
        <CreateHeader>
          <CreateTitle>🐲 CREATE BEAST</CreateTitle>
          <CreateSubtitle>
            {currentStep === 'tier' && 'Choose your beast tier'}
            {currentStep === 'design' && 'Design your beast'}
            {currentStep === 'stats' && 'Distribute stat points'}
            {currentStep === 'final' && 'Review and create'}
          </CreateSubtitle>
        </CreateHeader>
        
        {renderWalletSection()}
        
        {/* Test Wallet Button */}
        {currentProvider && (
          <div style={{textAlign: 'center', marginBottom: '16px'}}>
            <TestWalletButton onClick={testWalletConnection}>
              🧪 Test Wallet Connection
            </TestWalletButton>
            <TestWalletButton onClick={testContractDeployment}>
              🔍 Test Contract Deployment
            </TestWalletButton>
            <TestWalletButton onClick={testContractCall}>
              🔗 Test Contract Call
            </TestWalletButton>
          </div>
        )}
        
        {error && (
          <div style={{
            background: 'var(--brutal-red)',
            padding: '16px',
            border: '3px solid var(--border-primary)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            fontWeight: '900',
            textAlign: 'center'
          }}>
            ⚠️ {error}
            <div style={{marginTop: '8px'}}>
              <Button 
                onClick={() => {
                  setError(null)
                  setIsLoading(false)
                }}
                style={{
                  background: 'var(--brutal-yellow)',
                  fontSize: '12px',
                  padding: '8px 16px'
                }}
              >
                🔄 Try Again
              </Button>
            </div>
          </div>
        )}
        
        {success && (
          <div style={{
            background: 'var(--brutal-lime)',
            padding: '16px',
            border: '3px solid var(--border-primary)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            fontWeight: '900',
            textAlign: 'center'
          }}>
            ✅ {success}
          </div>
        )}
        
        {renderStep()}

        {/* Transaction Status Display */}
        {transactionHash && (
          <TransactionStatus>
            <div style={{fontSize: '16px', fontWeight: '900', marginBottom: '8px'}}>
              {isConfirming ? '⏳ CONFIRMING TRANSACTION...' : '✅ TRANSACTION CONFIRMED!'}
            </div>
            <div style={{fontSize: '14px', marginBottom: '8px'}}>
              {isConfirming ? 'Waiting for blockchain confirmation...' : 'Your NFT has been minted successfully!'}
            </div>
            <TransactionHash>
              Hash: {transactionHash}
            </TransactionHash>
            <div style={{marginTop: '8px'}}>
              <a 
                href={`https://testnet.snowtrace.io/tx/${transactionHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  color: 'var(--brutal-lime)', 
                  textDecoration: 'underline',
                  fontSize: '12px',
                  fontWeight: '700'
                }}
              >
                🔍 View on Snowtrace Explorer
              </a>
            </div>
            {!isConfirming && (
              <div style={{marginTop: '8px', fontSize: '12px', opacity: 0.8}}>
                Redirecting to home in 2 seconds...
              </div>
            )}
            {!isConfirming && (
              <div style={{marginTop: '16px'}}>
                <Button 
                  onClick={() => {
                    setGeneratedImage(null)
                    setCurrentStep('tier')
                    setSuccess(null)
                    setError(null)
                  }}
                  style={{
                    background: 'var(--brutal-lime)',
                    fontSize: '12px',
                    padding: '8px 16px'
                  }}
                >
                  🆕 Create Another Beast
                </Button>
              </div>
            )}
            {isConfirming && (
              <div style={{marginTop: '16px'}}>
                <Button 
                  onClick={() => window.open(`https://testnet.snowtrace.io/tx/${transactionHash}`, '_blank')}
                  style={{
                    background: 'var(--brutal-yellow)',
                    fontSize: '12px',
                    padding: '8px 16px'
                  }}
                >
                  🔄 Check Status on Explorer
                </Button>
              </div>
            )}
          </TransactionStatus>
        )}

        {currentStep !== 'final' ? (
          <MintButton
            $fullWidth
            disabled={
              (currentStep === 'tier' && !beastData.tier) ||
              (currentStep === 'design' && !beastData.description.trim()) ||
              (currentStep === 'stats' && getRemainingPoints() !== 0)
            }
            onClick={handleNext}
          >
            NEXT
          </MintButton>
        ) : (
          <MintButton
            $fullWidth
            disabled={isLoading || isConfirming || !generatedImage || !currentProvider || !!transactionHash}
            onClick={handleCreate}
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                SUBMITTING TRANSACTION...
              </>
            ) : isConfirming ? (
              <>
                <LoadingSpinner />
                CONFIRMING TRANSACTION...
              </>
            ) : transactionHash ? (
              "✅ NFT MINTED SUCCESSFULLY!"
            ) : (
              "🔗 MINT BEAST NFT"
            )}
          </MintButton>
        )}
      </CreateContainer>
    </AppLayout>
  )
}