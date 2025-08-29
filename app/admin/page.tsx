"use client"

import { useState } from 'react'
import { AppLayout } from '../../components/layout/AppLayout'
import styled from 'styled-components'
import { Button } from '../../components/styled/GlobalStyles'

const AdminContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
`

const AdminCard = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  padding: 24px;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const CardTitle = styled.h2`
  font-size: 20px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 3px solid var(--border-primary);
  background: var(--light-bg);
  color: var(--text-primary);
  font-family: var(--font-mono);
  margin-bottom: 16px;
`

const ResultBox = styled.div`
  background: var(--brutal-lime);
  border: 3px solid var(--border-primary);
  padding: 16px;
  margin-top: 16px;
  font-family: var(--font-mono);
  font-size: 14px;
  word-break: break-all;
`

export default function AdminPage() {
  const [address, setAddress] = useState('')
  const [mnemonic, setMnemonic] = useState('')
  const [deployResult, setDeployResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const deployToken = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/token/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorMnemonic: mnemonic })
      })

      const result = await response.json()
      setDeployResult(result)
    } catch (error) {
      console.error('Deployment failed:', error)
      setDeployResult({ success: false, error: 'Deployment failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <AdminContainer>
        <AdminCard>
          <CardTitle>🪙 Deploy DEGEN MVP Token</CardTitle>
          <Input
            type="password"
            placeholder="Enter creator account mnemonic (25 words)"
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
          />
          <Button onClick={deployToken} disabled={loading}>
            {loading ? 'Deploying...' : 'Deploy DEGEN ASA'}
          </Button>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
            💡 Only mnemonic required - address will be derived automatically
          </div>
          
          {deployResult && (
            <ResultBox>
              {deployResult.success ? (
                <>
                  <div>✅ Token deployed successfully!</div>
                  <div>Asset ID: {deployResult.data.assetId}</div>
                  <div>Creator: {deployResult.data.creatorAddress}</div>
                  <div>Total Supply: {deployResult.data.config.total.toLocaleString()}</div>
                </>
              ) : (
                <div>❌ Error: {deployResult.error}</div>
              )}
            </ResultBox>
          )}
        </AdminCard>

        <AdminCard>
          <CardTitle>📊 Token Information</CardTitle>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px' }}>
            <div><strong>Name:</strong> DengenLeague Token</div>
            <div><strong>Symbol:</strong> DEGEN</div>
            <div><strong>Decimals:</strong> 6</div>
            <div><strong>Total Supply:</strong> 1,000,000,000</div>
            <div><strong>Network:</strong> Algorand Testnet</div>
          </div>
        </AdminCard>

        <AdminCard>
          <CardTitle>🔧 Setup Instructions</CardTitle>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: '1.6' }}>
            <div>1. Create Algorand testnet account</div>
            <div>2. Fund account with testnet ALGO</div>
            <div>3. Deploy DEGEN token using mnemonic above</div>
            <div>4. Update .env with DEGEN_ASSET_ID</div>
            <div>5. Test token transfers and staking</div>
          </div>
        </AdminCard>
      </AdminContainer>
    </AppLayout>
  )
}