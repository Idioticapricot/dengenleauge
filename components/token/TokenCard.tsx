"use client"

import { motion } from "framer-motion"


interface TokenCardProps {
  symbol: string
  logo: string
  price: number
  change: number
  points: number
  selected?: boolean
  onClick?: () => void
}

export function TokenCard({ symbol, logo, price, change, points, selected, onClick }: TokenCardProps) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === 'Enter' || event.key === ' ') && onClick) {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <TokenCardContainer
      $selected={selected}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Token ${symbol}: Price $${price.toFixed(4)}, Change ${change >= 0 ? '+' : ''}${change.toFixed(2)}%, Points ${points}`}
      aria-pressed={selected}
    >
      <TokenLogo aria-label={`${symbol} logo`}>{logo}</TokenLogo>
      <TokenSymbol>{symbol}</TokenSymbol>
      <TokenPrice aria-label={`Price: $${price.toFixed(4)}`}>${price.toFixed(4)}</TokenPrice>
      <TokenChange $positive={change >= 0} aria-label={`Price change: ${change >= 0 ? '+' : ''}${change.toFixed(2)}%`}>
        {change >= 0 ? "+" : ""}
        {change.toFixed(2)}%
      </TokenChange>
      <TokenPoints aria-label={`Points: ${points}`}>{points} pts</TokenPoints>
    </TokenCardContainer>
  )
}
