"use client"

import { useState } from "react"
import { AppLayout } from "../../components/layout/AppLayout"
import styled from "styled-components"
import { Card, Button } from "../../components/styled/GlobalStyles"

const MarketplaceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const MarketplaceHeader = styled.div`
  text-align: center;
  background: var(--brutal-violet);
  padding: 24px;
  border: 4px solid var(--border-primary);
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
`

const MarketplaceTitle = styled.h1`
  font-size: 32px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 3px;
`

const MarketplaceSubtitle = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`

const FilterButton = styled(Button)<{ $active?: boolean }>`
  background: ${props => props.$active ? "var(--brutal-yellow)" : "var(--light-bg)"};
  font-size: 14px;
  padding: 12px 16px;
  
  &:hover {
    background: var(--brutal-cyan);
  }
`

const BeastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`

const BeastCard = styled(Card)`
  padding: 20px;
  text-align: center;
  transition: all 0.1s ease;
  
  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 4px 4px 0px 0px var(--border-primary);
  }
`

const BeastIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`

const BeastName = styled.h3`
  font-size: 20px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
`

const BeastLevel = styled.div`
  background: var(--brutal-pink);
  padding: 4px 8px;
  border: 2px solid var(--border-primary);
  font-size: 12px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  margin-bottom: 16px;
  display: inline-block;
`

const BeastStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
`

const StatItem = styled.div`
  background: var(--brutal-lime);
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

const BeastPrice = styled.div`
  background: var(--brutal-orange);
  padding: 12px;
  border: 3px solid var(--border-primary);
  font-size: 18px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
`

const BuyButton = styled(Button)`
  background: var(--brutal-cyan);
  
  &:hover {
    background: var(--brutal-yellow);
  }
`

const mockBeasts = [
  {
    id: 1,
    name: "Flame Dragon",
    type: "fire",
    icon: "🔥",
    level: 15,
    stats: { hp: 95, attack: 135, defense: 75 },
    price: 150,
    owner: "CryptoKing"
  },
  {
    id: 2,
    name: "Aqua Serpent",
    type: "water",
    icon: "🌊",
    level: 12,
    stats: { hp: 110, attack: 100, defense: 95 },
    price: 120,
    owner: "TokenMaster"
  },
  {
    id: 3,
    name: "Stone Golem",
    type: "earth",
    icon: "🌍",
    level: 18,
    stats: { hp: 140, attack: 90, defense: 140 },
    price: 200,
    owner: "DeFiPro"
  },
  {
    id: 4,
    name: "Thunder Wolf",
    type: "electric",
    icon: "⚡",
    level: 10,
    stats: { hp: 80, attack: 125, defense: 80 },
    price: 100,
    owner: "AlgoTrader"
  },
  {
    id: 5,
    name: "Inferno Phoenix",
    type: "fire",
    icon: "🔥",
    level: 25,
    stats: { hp: 120, attack: 160, defense: 90 },
    price: 350,
    owner: "BlockchainBull"
  },
  {
    id: 6,
    name: "Frost Bear",
    type: "water",
    icon: "🌊",
    level: 14,
    stats: { hp: 125, attack: 105, defense: 110 },
    price: 180,
    owner: "SmartContract"
  }
]

export default function MarketplacePage() {
  const [filter, setFilter] = useState("all")

  const filteredBeasts = filter === "all" 
    ? mockBeasts 
    : mockBeasts.filter(beast => beast.type === filter)

  const filters = [
    { id: "all", label: "All" },
    { id: "fire", label: "Fire" },
    { id: "water", label: "Water" },
    { id: "earth", label: "Earth" },
    { id: "electric", label: "Electric" }
  ]

  return (
    <AppLayout>
      <MarketplaceContainer>
        <MarketplaceHeader>
          <MarketplaceTitle>🏪 MARKETPLACE</MarketplaceTitle>
          <MarketplaceSubtitle>Buy and sell battle beasts</MarketplaceSubtitle>
        </MarketplaceHeader>

        <FilterContainer>
          {filters.map((filterOption) => (
            <FilterButton
              key={filterOption.id}
              $active={filter === filterOption.id}
              onClick={() => setFilter(filterOption.id)}
            >
              {filterOption.label}
            </FilterButton>
          ))}
        </FilterContainer>

        <BeastGrid>
          {filteredBeasts.map((beast) => (
            <BeastCard key={beast.id}>
              <BeastIcon>{beast.icon}</BeastIcon>
              <BeastName>{beast.name}</BeastName>
              <BeastLevel>Level {beast.level}</BeastLevel>
              
              <BeastStats>
                <StatItem>
                  <StatLabel>HP</StatLabel>
                  <StatValue>{beast.stats.hp}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>ATK</StatLabel>
                  <StatValue>{beast.stats.attack}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>DEF</StatLabel>
                  <StatValue>{beast.stats.defense}</StatValue>
                </StatItem>
              </BeastStats>
              
              <BeastPrice>{beast.price} $WAM</BeastPrice>
              
              <BuyButton $fullWidth>
                BUY BEAST
              </BuyButton>
            </BeastCard>
          ))}
        </BeastGrid>
      </MarketplaceContainer>
    </AppLayout>
  )
}