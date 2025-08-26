"use client"

import styled from "styled-components"

const CardContainer = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  padding: 16px;
  margin-bottom: 12px;
  font-family: var(--font-mono);
  transition: all 0.1s ease;
  
  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px var(--border-primary);
  }
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`

const TokenIcon = styled.div`
  width: 48px;
  height: 48px;
  background: var(--brutal-cyan);
  border: 3px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 900;
  color: var(--text-primary);
  box-shadow: 2px 2px 0px 0px var(--border-primary);
`

const TokenInfo = styled.div`
  flex: 1;
`

const TokenName = styled.h3`
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 900;
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`

const TokenSymbol = styled.div`
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 700;
  background: var(--brutal-yellow);
  padding: 2px 8px;
  border: 2px solid var(--border-primary);
  display: inline-block;
`

const TokenStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`

const StatItem = styled.div`
  background: var(--brutal-lime);
  border: 2px solid var(--border-primary);
  padding: 8px;
  text-align: center;
`

const StatLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2px;
  text-transform: uppercase;
`

const StatValue = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: var(--text-primary);
`

interface MemeCardProps {
  asset: {
    asset_id: number
    name: string
    unit_name: string
    total: number
    decimals: number
    creator: string
    url?: string
    metadata_hash?: string
    default_frozen: boolean
    manager?: string
    reserve?: string
    freeze?: string
    clawback?: string
    price: number
    image: string
  }
}

export function MemeCard({ asset }: MemeCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
    return num.toString()
  }

  return (
    <CardContainer>
      <CardHeader>
        <TokenIcon>
          {asset.image ? (
        <img
          src={asset.image}
          alt={asset.name || 'Token'}
          style={{ width: 40, height: 40, borderRadius: '50%' }}
        />
      ) : (
        '🪙'
      )}
        </TokenIcon>
        <TokenInfo>
          <TokenName>{asset.name || 'Unknown Token'}</TokenName>
        </TokenInfo>
      </CardHeader>
      
      <TokenStats>
        <StatItem>
          <StatLabel>Total price</StatLabel>
          <StatValue>{formatNumber(asset.price)}$</StatValue>
        </StatItem>
      </TokenStats>
    </CardContainer>
  )
}