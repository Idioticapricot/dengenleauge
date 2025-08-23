"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "../../components/layout/AppLayout"
import styled from "styled-components"
import { Card, Button } from "../../components/styled/GlobalStyles"
import { BeastCard as BeastCardComponent } from "../../components/beast/BeastCard"
import { SellModal } from "../../components/marketplace/SellModal"
// Removed mock data import - using API

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
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`

const FilterDropdown = styled.select`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  
  &:hover {
    background: var(--brutal-cyan);
  }
  
  &:focus {
    outline: none;
    background: var(--brutal-lime);
  }
`

const SellButton = styled(Button)`
  background: var(--brutal-orange);
  font-size: 16px;
  padding: 12px 24px;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover {
    background: var(--brutal-red);
  }
`

const BeastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`

const MarketplaceBeastCard = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  padding: 16px;
  transition: all 0.1s ease;
  
  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px var(--border-primary);
  }
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



export default function MarketplacePage() {
  const [filter, setFilter] = useState("all")
  const [showSellModal, setShowSellModal] = useState(false)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMarketplaceListings = async () => {
      try {
        const params = new URLSearchParams()
        if (filter !== 'all') params.append('element', filter)
        
        const response = await fetch(`/api/marketplace?${params}`)
        if (response.ok) {
          const data = await response.json()
          setListings(data)
        }
      } catch (error) {
        console.error('Error fetching marketplace:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMarketplaceListings()
  }, [filter])

  const filters = [
    { id: "all", label: "All" },
    { id: "fire", label: "Fire" },
    { id: "water", label: "Water" },
    { id: "earth", label: "Earth" },
    { id: "electric", label: "Electric" }
  ]

  return (
    <>
      <AppLayout>
        <MarketplaceContainer>
          <MarketplaceHeader>
            <MarketplaceTitle>🏪 MARKETPLACE</MarketplaceTitle>
            <MarketplaceSubtitle>Buy and sell battle beasts</MarketplaceSubtitle>
          </MarketplaceHeader>

          <FilterContainer>
            <FilterDropdown 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              {filters.map((filterOption) => (
                <option key={filterOption.id} value={filterOption.id}>
                  {filterOption.label}
                </option>
              ))}
            </FilterDropdown>
            
            <SellButton onClick={() => setShowSellModal(true)}>
              🏷️ SELL BEAST
            </SellButton>
          </FilterContainer>

          <BeastGrid>
            {loading ? (
              <div>Loading marketplace...</div>
            ) : listings.length === 0 ? (
              <div>No beasts for sale</div>
            ) : (
              listings.map((listing: any) => (
                <MarketplaceBeastCard key={listing.id}>
                  <BeastCardComponent
                    beast={listing.beast}
                    onSelect={() => console.log('Beast selected:', listing.beast.name)}
                  />
                  <BeastPrice>{listing.price} $WAM</BeastPrice>
                  <BuyButton $fullWidth>
                    BUY BEAST
                  </BuyButton>
                </MarketplaceBeastCard>
              ))
            )}
          </BeastGrid>
        </MarketplaceContainer>
      </AppLayout>
      
      {showSellModal && (
        <SellModal onClose={() => setShowSellModal(false)} />
      )}
    </>
  )
}