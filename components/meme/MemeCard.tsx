"use client"

import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins } from '@fortawesome/free-solid-svg-icons'

const CardContainer = styled.div`
  background: var(--light-bg);
  border: 2px solid var(--border-primary);
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  padding: 12px;
  font-family: var(--font-mono);
  transition: all 0.1s ease;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    padding: 10px;
    border-radius: 6px;
  }
  
  @media (max-width: 480px) {
    padding: 8px;
    border-radius: 4px;
    border-width: 1px;
  }
  
  &:hover {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px 0px var(--border-primary);
  }
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 480px) {
    gap: 6px;
  }
`

const TokenIcon = styled.div`
  width: 40px;
  height: 40px;
  background: var(--brutal-cyan);
  border: 2px solid var(--border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
  box-shadow: 1px 1px 0px 0px var(--border-primary);
  border-radius: 50%;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 12px;
    border-width: 1px;
  }
`

const TokenInfo = styled.div`
  flex: 1;
`

const TokenName = styled.h3`
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 900;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 13px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    letter-spacing: 0.3px;
  }
`

const TokenSymbol = styled.div`
  color: var(--text-primary);
  font-size: 10px;
  font-weight: 700;
  background: var(--brutal-yellow);
  padding: 2px 6px;
  border: 1px solid var(--border-primary);
  display: inline-block;
  border-radius: 4px;
  margin-top: 2px;
  
  @media (max-width: 480px) {
    font-size: 9px;
    padding: 1px 4px;
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
        <TokenInfo>
          <TokenName>{asset.name || 'Unknown Token'}</TokenName>
          <TokenSymbol>{asset.ticker || 'N/A'}</TokenSymbol>
        </TokenInfo>
      </CardHeader>
    </CardContainer>
  )
}