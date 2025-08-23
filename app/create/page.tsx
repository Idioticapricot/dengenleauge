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

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 2px;
  background: var(--brutal-violet);
  padding: 8px 16px;
  border: 3px solid var(--border-primary);
  display: inline-block;
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

const tiers = [
  {
    id: "basic",
    name: "Basic Tier",
    cost: 50,
    multiplier: 1,
    abilities: ["Standard Stats"],
    color: "var(--brutal-lime)"
  },
  {
    id: "advanced",
    name: "Advanced Tier",
    cost: 100,
    multiplier: 1.3,
    abilities: ["Enhanced Stats", "Regeneration"],
    color: "var(--brutal-cyan)"
  },
  {
    id: "legendary",
    name: "Legendary Tier",
    cost: 200,
    multiplier: 1.6,
    abilities: ["Superior Stats", "Regeneration", "Critical Strike"],
    color: "var(--brutal-yellow)"
  }
]

const beastTypes = [
  {
    id: "fire",
    name: "Fire Beast",
    icon: "🔥",
    description: "High attack, low defense",
    baseStats: { hp: 80, attack: 120, defense: 60 }
  },
  {
    id: "water",
    name: "Water Beast",
    icon: "🌊",
    description: "Balanced stats",
    baseStats: { hp: 100, attack: 90, defense: 90 }
  },
  {
    id: "earth",
    name: "Earth Beast",
    icon: "🌍",
    description: "High defense, low speed",
    baseStats: { hp: 120, attack: 80, defense: 120 }
  },
  {
    id: "electric",
    name: "Electric Beast",
    icon: "⚡",
    description: "Fast and deadly",
    baseStats: { hp: 70, attack: 110, defense: 70 }
  }
]

const TierSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`

const TierCard = styled.div<{ $selected?: boolean; $color?: string }>`
  background: ${props => props.$selected ? props.$color : "var(--light-bg)"};
  border: 4px solid var(--border-primary);
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.1s ease;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  
  &:hover {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px 0px var(--border-primary);
  }
`

const TierName = styled.h3`
  font-size: 18px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
`

const TierCost = styled.div`
  background: var(--brutal-red);
  padding: 8px 12px;
  border: 2px solid var(--border-primary);
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  margin-bottom: 12px;
`

const TierAbilities = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Ability = styled.div`
  background: var(--brutal-pink);
  padding: 4px 8px;
  border: 2px solid var(--border-primary);
  font-size: 10px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
`

export default function CreatePage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleMint = async () => {
    if (!selectedType || !selectedTier) return
    
    setIsLoading(true)
    // Simulate minting process
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    
    // Redirect to home after minting
    router.push("/home")
  }
  
  const getCalculatedStats = (baseStats: any, tier: any) => {
    return {
      hp: Math.floor(baseStats.hp * tier.multiplier),
      attack: Math.floor(baseStats.attack * tier.multiplier),
      defense: Math.floor(baseStats.defense * tier.multiplier)
    }
  }
  
  const selectedTierData = tiers.find(t => t.id === selectedTier)
  const totalCost = selectedTierData?.cost || 0

  return (
    <AppLayout>
      <BackButton onClick={() => router.back()}>
        ← BACK
      </BackButton>
      
      <CreateContainer>
        <CreateHeader>
          <CreateTitle>🐲 CREATE BEAST</CreateTitle>
          <CreateSubtitle>Choose tier and beast type</CreateSubtitle>
        </CreateHeader>
        
        <Card>
          <SectionTitle>SELECT TIER</SectionTitle>
          <TierSelector>
            {tiers.map((tier) => (
              <TierCard
                key={tier.id}
                $selected={selectedTier === tier.id}
                $color={tier.color}
                onClick={() => setSelectedTier(tier.id)}
              >
                <TierName>{tier.name}</TierName>
                <TierCost>{tier.cost} $WAM</TierCost>
                <TierAbilities>
                  {tier.abilities.map((ability, index) => (
                    <Ability key={index}>{ability}</Ability>
                  ))}
                </TierAbilities>
              </TierCard>
            ))}
          </TierSelector>
        </Card>

        {selectedTier && (
          <Card>
            <SectionTitle>SELECT BEAST TYPE</SectionTitle>
            <BeastTypeGrid>
              {beastTypes.map((beast) => {
                const calculatedStats = getCalculatedStats(beast.baseStats, selectedTierData)
                return (
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
                        <StatValue>{calculatedStats.hp}</StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>ATK</StatLabel>
                        <StatValue>{calculatedStats.attack}</StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>DEF</StatLabel>
                        <StatValue>{calculatedStats.defense}</StatValue>
                      </StatItem>
                    </BeastStats>
                    
                    <MintCost>TOTAL: {totalCost} $WAM</MintCost>
                  </BeastTypeCard>
                )
              })}
            </BeastTypeGrid>
          </Card>
        )}

        <MintButton
          $fullWidth
          disabled={!selectedType || !selectedTier || isLoading}
          onClick={handleMint}
        >
          {isLoading ? "MINTING..." : `MINT BEAST (${totalCost} $WAM)`}
        </MintButton>
      </CreateContainer>
    </AppLayout>
  )
}