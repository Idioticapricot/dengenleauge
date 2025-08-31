'use client'

import { AppLayout } from '../../components/layout/AppLayout'
import dynamic from 'next/dynamic'
import styled from 'styled-components'

const AtomicSwap = dynamic(() => import('../../components/token/AtomicSwap'), {
  loading: () => (
    <LoadingCard>
      <div>🔄 LOADING...</div>
    </LoadingCard>
  ),
  ssr: false
})


const BuyTokensContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`

const PageHeader = styled.div`
  background: var(--brutal-lime);
  border: 4px solid var(--border-primary);
  padding: 32px;
  text-align: center;
  box-shadow: 8px 8px 0px 0px var(--border-primary);
`

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 2px;
`

const PageDescription = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-mono);
`

const LoadingCard = styled.div`
  background: var(--brutal-yellow);
  border: 4px solid var(--border-primary);
  padding: 32px;
  box-shadow: 8px 8px 0px 0px var(--border-primary);
  max-width: 400px;
  width: 100%;
  text-align: center;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--text-primary);
`



export default function BuyTokensPage() {
  return (
    <AppLayout>
      <BuyTokensContainer>
        
        <PageHeader>
          <PageTitle>💰 BUY DEGEN</PageTitle>
          <PageDescription>
            Swap ALGO for DEGEN tokens
          </PageDescription>
        </PageHeader>

        <AtomicSwap />



      </BuyTokensContainer>
    </AppLayout>
  )
}