"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "../../components/layout/AppLayout"
import styled from "styled-components"
import { Card, Button } from "../../components/styled/GlobalStyles"
import Link from "next/link"

const TokenSelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const SearchSection = styled.div`
  margin-bottom: 20px;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 16px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(51, 65, 85, 0.5);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 16px;
  font-family: var(--font-exo2);
  
  &::placeholder {
    color: var(--text-muted);
  }
  
  &:focus {
    outline: none;
    border-color: var(--primary-green);
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  }
`

const FilterSection = styled.div`
  margin: 20px 0;
`

const FilterLabel = styled.div`
  color: var(--text-muted);
  font-size: 14px;
  margin-bottom: 12px;
  font-family: var(--font-exo2);
`

const FilterButtons = styled.div`
  display: flex;
  gap: 12px;
`

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 12px 20px;
  background: ${(props) => (props.$active ? "var(--primary-green)" : "rgba(30, 41, 59, 0.6)")};
  border: 1px solid ${(props) => (props.$active ? "var(--primary-green)" : "rgba(51, 65, 85, 0.5)")};
  border-radius: 8px;
  color: ${(props) => (props.$active ? "white" : "var(--text-primary)")};
  font-family: var(--font-orbitron);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${(props) => (props.$active ? "var(--primary-green-dark)" : "rgba(30, 41, 59, 0.8)")};
  }
`

const TokensHeader = styled.div`
  color: var(--text-muted);
  font-size: 14px;
  margin-bottom: 16px;
  font-family: var(--font-exo2);
`

const TokenGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(30, 41, 59, 0.3);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--primary-green);
    border-radius: 3px;
  }
`

const TokenCard = styled.div<{ $selected?: boolean }>`
  background: ${(props) =>
    props.$selected
      ? "linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)"
      : "rgba(30, 41, 59, 0.6)"};
  border: 1px solid ${(props) => (props.$selected ? "var(--primary-green)" : "rgba(51, 65, 85, 0.5)")};
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    border-color: var(--primary-green);
  }
`

const TokenHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`

const TokenImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
`

const TokenInfo = styled.div`
  flex: 1;
`

const TokenName = styled.div`
  color: var(--text-primary);
  font-family: var(--font-orbitron);
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
`

const TokenTicker = styled.div`
  color: var(--text-muted);
  font-family: var(--font-exo2);
  font-size: 14px;
`

const TokenStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
`

const TokenRank = styled.div`
  background: var(--primary-green);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-family: var(--font-orbitron);
  font-weight: 600;
  font-size: 12px;
`

const TokenPrice = styled.div`
  color: var(--text-primary);
  font-family: var(--font-exo2);
  font-weight: 600;
  font-size: 14px;
`

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: var(--primary-green);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  padding: 12px 0;
  font-family: var(--font-orbitron);
  text-decoration: none;
  
  &:hover {
    color: var(--primary-green-dark);
  }
`

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: var(--text-muted);
  font-family: var(--font-exo2);
`

interface Token {
  id: number
  name: string
  ticker: string
  price: number
  rank: number
  image: string
  confidence: number
  market_cap: number
}

export default function CreateSquadPage() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("ALL")
  const [selectedTokens, setSelectedTokens] = useState<Token[]>([])

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(
          "https://api.vestigelabs.org/assets/list?network_id=0&exclude_labels=8,7&denominating_asset_id=31566704&limit=20&offset=0&order_by=rank&order_dir=asc",
        )
        const data = await response.json()
        setTokens(data.results || [])
      } catch (error) {
        console.error("Failed to fetch tokens:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTokens()
  }, [])

  const filteredTokens = tokens.filter((token) => {
    const matchesSearch =
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.ticker.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleTokenSelect = (token: Token) => {
    if (selectedTokens.find((t) => t.id === token.id)) {
      setSelectedTokens(selectedTokens.filter((t) => t.id !== token.id))
    } else if (selectedTokens.length < 5) {
      setSelectedTokens([...selectedTokens, token])
    }
  }

  return (
    <AppLayout>
      <Card>
        <TokenSelectionContainer>
          <BackButton href="/home">← Back</BackButton>

          <h2
            style={{
              color: "var(--text-primary)",
              fontFamily: "var(--font-orbitron)",
              fontSize: "24px",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            Select Tokens
          </h2>

          <SearchSection>
            <SearchInput
              type="text"
              placeholder="🔍 Search token name or paste address"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchSection>

          <FilterSection>
            <FilterLabel>Filter token by:</FilterLabel>
            <FilterButtons>
              {["ALL", "CB", "MF", "ST"].map((filter) => (
                <FilterButton
                  key={filter}
                  $active={selectedFilter === filter}
                  onClick={() => setSelectedFilter(filter)}
                >
                  {filter === "ALL" ? "🛡️" : filter === "CB" ? "🛡️" : filter === "MF" ? "⚽" : "🎯"} {filter}
                </FilterButton>
              ))}
            </FilterButtons>
          </FilterSection>

          <TokensHeader>
            Available Tokens ({filteredTokens.length}): {selectedTokens.length}/5 selected
          </TokensHeader>

          {loading ? (
            <LoadingSpinner>Loading tokens...</LoadingSpinner>
          ) : (
            <TokenGrid>
              {filteredTokens.map((token) => (
                <TokenCard
                  key={token.id}
                  $selected={!!selectedTokens.find((t) => t.id === token.id)}
                  onClick={() => handleTokenSelect(token)}
                >
                  <TokenHeader>
                    <TokenImage
                      src={token.image}
                      alt={token.name}
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "/digital-token.png"
                      }}
                    />
                    <TokenInfo>
                      <TokenName>${token.ticker}</TokenName>
                      <TokenTicker>{token.name}</TokenTicker>
                    </TokenInfo>
                  </TokenHeader>
                  <TokenStats>
                    <TokenRank>#{token.rank}</TokenRank>
                    <TokenPrice>${token.price.toFixed(6)}</TokenPrice>
                  </TokenStats>
                </TokenCard>
              ))}
            </TokenGrid>
          )}

          <Button
            $variant="primary"
            $size="lg"
            $fullWidth
            disabled={selectedTokens.length === 0}
            style={{ marginTop: "20px", fontFamily: "var(--font-orbitron)", fontWeight: 600 }}
          >
            Create Squad ({selectedTokens.length}/5)
          </Button>
        </TokenSelectionContainer>
      </Card>
    </AppLayout>
  )
}
