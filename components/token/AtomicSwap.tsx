'use client'

import { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import styled from 'styled-components'
import { Button } from '../styled/GlobalStyles'

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
  const [algoAmount, setAlgoAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleAtomicSwap = async () => {
    // Enhanced validation
    if (!activeAddress) {
      setResult({ error: 'Please connect your wallet first' })
      return
    }

    if (!algoAmount || parseFloat(algoAmount) <= 0) {
      setResult({ error: 'Please enter a valid ALGO amount' })
      return
    }

    const amount = parseFloat(algoAmount)
    if (amount < 0.1 || amount > 100) {
      setResult({ error: 'Amount must be between 0.1 and 100 ALGO' })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      // Step 1: Create atomic transaction group
      const response = await fetch('/api/atomic-swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerAddress: activeAddress,
          algoAmount: amount
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to create swap transaction')
      }

      // Step 2: Sign transaction (wallet handles decoding)
      const unsignedTxnArray = data.data.unsignedTransaction
      const unsignedTxn = new Uint8Array(unsignedTxnArray)

      // Pass as array of transactions
      const signedTxns = await signTransactions([unsignedTxn])

      // Step 3: Submit atomic transaction group
      if (!signedTxns[0]) {
        throw new Error('Failed to sign transaction')
      }

      const submitResponse = await fetch('/api/atomic-swap', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signedUserTransaction: Array.from(signedTxns[0]),
          signedCreatorTransaction: data.data.signedCreatorTransaction,
          buyerAddress: activeAddress,
          degenAmount: data.data.degenAmount
        })
      })

      const submitResult = await submitResponse.json()
      
      if (submitResult.success) {
        setResult({
          success: true,
          txId: submitResult.data.txId,
          explorerUrl: submitResult.data.explorerUrl,
          degenAmount: data.data.degenAmount
        })
        setAlgoAmount('')
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
    return parseFloat(algoAmount) * 1000 // Updated to match new rate: 1 ALGO = 1,000 DEGEN
  }

  return (
    <SwapCard>
      <CardTitle>⚡ ATOMIC SWAP</CardTitle>
      
      <RateDisplay>
        <RateText>1 ALGO = 1,000 DEGEN</RateText>
      </RateDisplay>

      <InfoBox>
        🔄 Atomic Transaction - Instant & Safe!<br/>
        Both transactions execute together or both fail
      </InfoBox>

      <InputLabel>ALGO Amount</InputLabel>
      <Input
        type="number"
        placeholder="Enter ALGO amount"
        value={algoAmount}
        onChange={(e) => setAlgoAmount(e.target.value)}
        min="0.1"
        max="100"
        step="0.1"
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