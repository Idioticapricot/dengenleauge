"use client"

import { useState } from "react"
import { AppLayout } from "../../components/layout/AppLayout"
import styled from "styled-components"
import { Card, Button } from "../../components/styled/GlobalStyles"
import { useRouter } from "next/navigation"

const BackButton = styled(Button)`
  background: var(--brutal-red);
  margin-bottom: 24px;
  
  &:hover {
    background: var(--brutal-orange);
  }
`

const CreateContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const CreateHeader = styled.div`
  text-align: center;
  background: var(--brutal-cyan);
  padding: 24px;
  border: 4px solid var(--border-primary);
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
`

const CreateTitle = styled.h1`
  font-size: 32px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 3px;
`

const CreateSubtitle = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`

const BeastTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`

const BeastTypeCard = styled(Card)<{ $selected?: boolean }>`
  cursor: pointer;
  text-align: center;
  padding: 24px;
  background: ${props => props.$selected ? "var(--brutal-yellow)" : "var(--light-bg)"};
  transition: all 0.1s ease;
  
  &:hover {
    background: var(--brutal-lime);
    transform: translate(2px, 2px);
    box-shadow: 4px 4px 0px 0px var(--border-primary);
  }
`

const BeastIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`

const BeastTypeName = styled.h3`
  font-size: 20px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
`

const BeastTypeDescription = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  font-family: var(--font-mono);
`

const BeastStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
`

const StatItem = styled.div`
  background: var(--brutal-pink);
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

const MintCost = styled.div`
  background: var(--brutal-violet);
  padding: 8px 12px;
  border: 2px solid var(--border-primary);
  font-size: 14px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
`

const MintButton = styled(Button)`
  background: var(--brutal-lime);
  font-size: 18px;
  padding: 16px 32px;
  margin-top: 24px;
  
  &:hover {
    background: var(--brutal-cyan);
  }
  
  &:disabled {
    background: var(--brutal-red);
    opacity: 0.7;
  }
`

const beastTypes = [
  {
    id: "fire",
    name: "Fire Beast",
    icon: "🔥",
    description: "High attack, low defense",
    stats: { hp: 80, attack: 120, defense: 60 },
    cost: 50
  },
  {
    id: "water",
    name: "Water Beast",
    icon: "🌊",
    description: "Balanced stats",
    stats: { hp: 100, attack: 90, defense: 90 },
    cost: 45
  },
  {
    id: "earth",
    name: "Earth Beast",
    icon: "🌍",
    description: "High defense, low speed",
    stats: { hp: 120, attack: 80, defense: 120 },
    cost: 55
  },
  {
    id: "electric",
    name: "Electric Beast",
    icon: "⚡",
    description: "Fast and deadly",
    stats: { hp: 70, attack: 110, defense: 70 },
    cost: 60
  }
]

export default function CreatePage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleMint = async () => {
    if (!selectedType) return
    
    setIsLoading(true)
    // Simulate minting process
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    
    // Redirect to home after minting
    router.push("/home")
  }

  return (
    <AppLayout>
      <BackButton onClick={() => router.back()}>
        ← BACK
      </BackButton>
      
      <CreateContainer>
        <CreateHeader>
          <CreateTitle>🐲 CREATE BEAST</CreateTitle>
          <CreateSubtitle>Choose your beast type and mint it!</CreateSubtitle>
        </CreateHeader>

        <BeastTypeGrid>
          {beastTypes.map((beast) => (
            <BeastTypeCard
              key={beast.id}
              $selected={selectedType === beast.id}
              onClick={() => setSelectedType(beast.id)}
            >
              <BeastIcon>{beast.icon}</BeastIcon>
              <BeastTypeName>{beast.name}</BeastTypeName>
              <BeastTypeDescription>{beast.description}</BeastTypeDescription>
              
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
              
              <MintCost>{beast.cost} $WAM</MintCost>
            </BeastTypeCard>
          ))}
        </BeastTypeGrid>

        <MintButton
          $fullWidth
          disabled={!selectedType || isLoading}
          onClick={handleMint}
        >
          {isLoading ? "MINTING..." : "MINT BEAST"}
        </MintButton>
      </CreateContainer>
    </AppLayout>
  )
}