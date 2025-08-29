'use client'

import { AppLayout } from '../../components/layout/AppLayout'
import TokenSale from '../../components/token/TokenSale'
import styled from 'styled-components'

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

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`

const InfoCard = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  padding: 24px;
  box-shadow: 6px 6px 0px 0px var(--border-primary);
`

const InfoTitle = styled.h3`
  font-size: 20px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
`

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const InfoItem = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
`

const HowItWorksSection = styled.div`
  background: var(--brutal-cyan);
  border: 4px solid var(--border-primary);
  padding: 24px;
  box-shadow: 6px 6px 0px 0px var(--border-primary);
`

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 20px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 2px;
`

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`

const StepCard = styled.div`
  background: var(--light-bg);
  border: 3px solid var(--border-primary);
  padding: 20px;
  text-align: center;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const StepNumber = styled.div`
  font-size: 32px;
  font-weight: 900;
  color: var(--brutal-red);
  font-family: var(--font-mono);
  margin-bottom: 12px;
`

const StepTitle = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  margin-bottom: 8px;
  text-transform: uppercase;
`

const StepDescription = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
`

export default function BuyTokensPage() {
  return (
    <AppLayout>
      <BuyTokensContainer>
        
        <PageHeader>
          <PageTitle>🪙 BUY DEGEN TOKENS</PageTitle>
          <PageDescription>
            Purchase DEGEN tokens to participate in battles, staking, and DeFi features
          </PageDescription>
        </PageHeader>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <TokenSale />
        </div>

        <InfoGrid>
          <InfoCard>
            <InfoTitle>🎯 Use Cases</InfoTitle>
            <InfoList>
              <InfoItem>• Battle stakes and rewards</InfoItem>
              <InfoItem>• DeFi staking and farming</InfoItem>
              <InfoItem>• Tournament entry fees</InfoItem>
              <InfoItem>• Premium features access</InfoItem>
              <InfoItem>• Governance voting power</InfoItem>
            </InfoList>
          </InfoCard>

          <InfoCard>
            <InfoTitle>📊 Token Details</InfoTitle>
            <InfoList>
              <InfoItem>• Symbol: DEGEN</InfoItem>
              <InfoItem>• Decimals: 6</InfoItem>
              <InfoItem>• Total Supply: 1B tokens</InfoItem>
              <InfoItem>• Network: Algorand Testnet</InfoItem>
              <InfoItem>• Asset ID: 745007115</InfoItem>
            </InfoList>
          </InfoCard>
        </InfoGrid>

        <HowItWorksSection>
          <SectionTitle>🔄 How Token Purchase Works</SectionTitle>
          <StepsGrid>
            <StepCard>
              <StepNumber>1️⃣</StepNumber>
              <StepTitle>Send ALGO</StepTitle>
              <StepDescription>
                Send ALGO from your wallet to our treasury
              </StepDescription>
            </StepCard>
            <StepCard>
              <StepNumber>2️⃣</StepNumber>
              <StepTitle>Automatic Processing</StepTitle>
              <StepDescription>
                Our system processes your payment instantly
              </StepDescription>
            </StepCard>
            <StepCard>
              <StepNumber>3️⃣</StepNumber>
              <StepTitle>Receive DEGEN</StepTitle>
              <StepDescription>
                DEGEN tokens are sent to your wallet
              </StepDescription>
            </StepCard>
          </StepsGrid>
        </HowItWorksSection>

      </BuyTokensContainer>
    </AppLayout>
  )
}