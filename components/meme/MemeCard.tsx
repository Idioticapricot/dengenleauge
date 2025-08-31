"use client"

import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins } from '@fortawesome/free-solid-svg-icons'

const CardContainer = styled.div`
  background: var(--brutal-pink);
  border: 2px solid var(--border-primary);
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  padding: 8px;
  font-family: var(--font-mono);
  transition: all 0.1s ease;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 6px;
  }
  
  @media (max-width: 480px) {
    padding: 4px;
    border-width: 1px;
  }
  
  &:hover {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px 0px var(--border-primary);
    background: var(--brutal-orange);
  }
`

const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
  height: 100%;
  justify-content: center;
`

const TokenIcon = styled.div`
  width: 32px;
  height: 32px;
  background: var(--brutal-yellow);
  border: 1px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 900;
  color: var(--text-primary);
  border-radius: 50%;
  flex-shrink: 0;
  margin-bottom: 4px;
  
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 10px;
  }
  
  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
    font-size: 8px;
  }
`



const TokenName = styled.h3`
  color: var(--text-primary);
  font-size: 10px;
  font-weight: 900;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  line-height: 1.1;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  
  @media (max-width: 768px) {
    font-size: 9px;
  }
  
  @media (max-width: 480px) {
    font-size: 8px;
    letter-spacing: 0.2px;
  }
`

const TokenSymbol = styled.div`
  color: var(--text-primary);
  font-size: 8px;
  font-weight: 700;
  background: var(--brutal-cyan);
  padding: 1px 4px;
  border: 1px solid var(--border-primary);
  display: inline-block;
  border-radius: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  
  @media (max-width: 480px) {
    font-size: 7px;
    padding: 1px 3px;
  }
`



interface MemeCardProps {
  asset: {
    id: number
    name: string
    ticker: string
    price: number
    image: string
    market_cap: number
    total_supply: number
    rank: number
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
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.parentElement!.innerHTML = '🪙'
              }}
            />
          ) : (
            '🪙'
          )}
        </TokenIcon>
        <TokenName>{asset.name || 'Unknown Token'}</TokenName>
        <TokenSymbol>{asset.ticker || 'N/A'}</TokenSymbol>
      </CardHeader>
    </CardContainer>
  )
}