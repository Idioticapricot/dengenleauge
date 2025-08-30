'use client'

import { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import algosdk from 'algosdk'
import styled from 'styled-components'
import { Button } from '../styled/GlobalStyles'
import { useAlgorandWallet } from '../wallet/AlgorandWalletProvider'

const SwapCard = styled.div`
  background: var(--brutal-yellow);
  border: 4px solid var(--border-primary);
  padding: 32px;
  box-shadow: 8px 8px 0px 0px var(--border-primary);
  max-width: 400px;
  width: 100%;
`

const CardTitle = styled.h2`
  font-size: 24px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 20px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
`

const RateDisplay = styled.div`
  background: var(--light-bg);
  border: 3px solid var(--border-primary);
  padding: 12px;
  text-align: center;
  margin-bottom: 20px;
  box-shadow: 3px 3px 0px 0px var(--border-primary);
`

const RateText = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
`

const InputLabel = styled.label`
  font-size: 14px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  display: block;
  margin-bottom: 8px;
`

const PresetButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
`

const PresetButton = styled.button<{ $active?: boolean }>`
  padding: 8px 12px;
  border: 2px solid var(--border-primary);
  background: ${props => props.$active ? 'var(--brutal-cyan)' : 'var(--light-bg)'};
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--brutal-cyan);
    transform: translate(-1px, -1px);
  }

  &:active {
    transform: translate(0px, 0px);
  }
`

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 3px solid var(--border-primary);
  background: var(--light-bg);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 12px;
  box-shadow: 3px 3px 0px 0px var(--border-primary);
  
  &:focus {
    outline: none;
    background: var(--brutal-cyan);
  }
`

const PreviewText = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--primary-green);
  font-family: var(--font-mono);
  margin-bottom: 20px;
  text-align: center;
`

const InfoBox = styled.div`
  background: var(--brutal-cyan);
  border: 2px solid var(--border-primary);
  padding: 12px;
  margin-bottom: 16px;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-align: center;
`

const ResultBox = styled.div<{ $success?: boolean }>`
  background: ${props => props.$success ? 'var(--primary-green)' : 'var(--brutal-red)'};
  border: 3px solid var(--border-primary);
  padding: 16px;
  margin-top: 16px;
  box-shadow: 3px 3px 0px 0px var(--border-primary);
`

const ResultText = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
`

const ExplorerLink = styled.a`
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-decoration: underline;
  margin-top: 8px;
  display: block;
  
  &:hover {
    color: var(--brutal-cyan);
  }
`

export default function AtomicSwap() {
  const { activeAddress, signTransactions } = useWallet()
  const { fetchBalance } = useAlgorandWallet()
  const [algoAmount, setAlgoAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleAtomicSwap = async () => {
    if (!activeAddress || !algoAmount) return

    setLoading(true)
    setResult(null)

    try {
      // Step 1: Call POST endpoint to create atomic swap
      const response = await fetch('/api/atomic-swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerAddress: activeAddress,
          algoAmount: parseFloat(algoAmount)
        })
      })

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error)
      }

      // Step 2: Handle complete transaction group for wallet
      let signedUserTransaction: number[] = []
      let signedCreatorTransaction: number[] = []

      if (data.data.transactions) {
        // New format: Complete transaction group (3 transactions: opt-in, payment, transfer)
        const txnGroup = data.data.transactions.map((txnData: any) => {
          return new Uint8Array(txnData.txn)
        })

        // Step 3: Pass complete transaction group to wallet
        const signedTxns = await signTransactions(txnGroup)

        // Step 4: Extract signed transactions
        console.log('Signed transactions received:', signedTxns)
        console.log('Number of signed transactions:', signedTxns ? signedTxns.length : 0)

        // Handle the case where wallet might return different number of transactions
        let signedUserTransactions: number[][] = []
        let signedCreatorTransaction: number[] = []

        if (signedTxns && signedTxns.length > 0) {
          // If we have multiple transactions, separate user and creator transactions
          if (signedTxns.length === 3 && signedTxns[0] && signedTxns[1] && signedTxns[2]) {
            // Full atomic group: opt-in, payment, creator
            signedUserTransactions = [
              Array.from(signedTxns[0]), // Opt-in
              Array.from(signedTxns[1])  // Payment
            ]
            signedCreatorTransaction = Array.from(signedTxns[2])
          } else if (signedTxns.length === 2 && signedTxns[0] && signedTxns[1]) {
            // Partial group: payment, creator (no opt-in needed)
            signedUserTransactions = [Array.from(signedTxns[0])] // Payment only
            signedCreatorTransaction = Array.from(signedTxns[1])
          } else if (signedTxns.length === 1 && signedTxns[0]) {
            // Only creator transaction (user didn't sign anything)
            signedUserTransactions = []
            signedCreatorTransaction = Array.from(signedTxns[0])
          }
        } else {
          // Fallback to original format
          signedCreatorTransaction = data.data.signedCreatorTransaction
        }

        console.log('Processed transactions:', {
          signedUserTransactions,
          signedCreatorTransaction
        })

        // Step 5: Send signed transactions to PUT endpoint
        const submitResponse = await fetch('/api/atomic-swap', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            signedUserTransaction: signedUserTransactions,
            signedCreatorTransaction
          })
        })
      } else {
        // Fallback to old format for backward compatibility
        const unsignedTransactionBytes = new Uint8Array(data.data.unsignedTransaction)
        const unsignedTxn = algosdk.decodeUnsignedTransaction(unsignedTransactionBytes)
        const signedTxns = await signTransactions([unsignedTxn])
        signedUserTransaction = signedTxns && signedTxns[0] ? Array.from(signedTxns[0]) : []
        signedCreatorTransaction = data.data.signedCreatorTransaction
      }

      // Step 5: Send both to PUT endpoint to finalize swap
      const submitResponse = await fetch('/api/atomic-swap', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signedUserTransaction,
          signedCreatorTransaction
        })
      })

      const submitResult = await submitResponse.json()
      
      if (submitResult.success) {
        setResult({
          success: true,
          txId: submitResult.data.txId,
          explorerUrl: submitResult.data.explorerUrl,
          degenAmount: parseFloat(algoAmount) * 100
        })
        setAlgoAmount('')

        // Refresh wallet balance after successful transaction
        if (activeAddress) {
          setTimeout(() => {
            fetchBalance(activeAddress)
          }, 2000) // Wait 2 seconds for transaction to be confirmed
        }
      } else {
        throw new Error(submitResult.error)
      }

    } catch (error: any) {
      console.error('Atomic swap failed:', error)
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const calculateDegenAmount = () => {
    if (!algoAmount) return 0
    return parseFloat(algoAmount) * 100
  }

  const handlePresetClick = (degenAmount: number) => {
    const requiredAlgo = degenAmount / 100 // Since 1 ALGO = 100 DEGEN
    setAlgoAmount(requiredAlgo.toString())
  }

  const presetOptions = [
    { degen: 10, algo: 0.1 },
    { degen: 25, algo: 0.25 },
    { degen: 50, algo: 0.5 }
  ]

  return (
    <SwapCard>
      <CardTitle>⚡ ATOMIC SWAP</CardTitle>
      
      <RateDisplay>
        <RateText>1 ALGO = 100 DEGEN</RateText>
      </RateDisplay>

      <InfoBox>
        🔄 Atomic Transaction - Instant & Safe!<br/>
        Both transactions execute together or both fail
      </InfoBox>

      <InputLabel>Quick Buy Options</InputLabel>
      <PresetButtons>
        {presetOptions.map((option) => (
          <PresetButton
            key={option.degen}
            $active={parseFloat(algoAmount) === option.algo}
            onClick={() => handlePresetClick(option.degen)}
          >
            {option.degen} DEGEN<br/>
            <small>{option.algo} ALGO</small>
          </PresetButton>
        ))}
      </PresetButtons>

      <InputLabel>Or Enter ALGO Amount</InputLabel>
      <Input
        type="number"
        placeholder="Enter ALGO amount"
        value={algoAmount}
        onChange={(e) => setAlgoAmount(e.target.value)}
        min="0.01"
        max="1"
        step="0.01"
      />

      {algoAmount && (
        <PreviewText>
          You will receive: {calculateDegenAmount().toLocaleString()} DEGEN
        </PreviewText>
      )}

      <Button 
        onClick={handleAtomicSwap}
        disabled={!activeAddress || !algoAmount || loading}
        style={{ width: '100%', fontSize: '16px' }}
      >
        {loading ? '🔄 SWAPPING...' : '⚡ ATOMIC SWAP'}
      </Button>

      {!activeAddress && (
        <div style={{ 
          fontSize: '14px', 
          fontWeight: '700', 
          color: 'var(--brutal-red)', 
          fontFamily: 'var(--font-mono)', 
          textAlign: 'center', 
          marginTop: '16px' 
        }}>
          Connect your wallet to swap
        </div>
      )}

      {result && (
        <ResultBox $success={!result.error}>
          {result.error ? (
            <ResultText>❌ Error: {result.error}</ResultText>
          ) : (
            <>
              <ResultText>
                ✅ Atomic swap successful!<br/>
                Received: {result.degenAmount.toLocaleString()} DEGEN
              </ResultText>
              <ExplorerLink 
                href={result.explorerUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View transaction on explorer
              </ExplorerLink>
            </>
          )}
        </ResultBox>
      )}
    </SwapCard>
  )
}