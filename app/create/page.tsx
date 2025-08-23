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

const DescriptionInput = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 16px;
  border: 4px solid var(--border-primary);
  background: var(--light-bg);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 700;
  resize: vertical;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    background: var(--brutal-lime);
  }
  
  &::placeholder {
    color: var(--text-primary);
    opacity: 0.7;
  }
`

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const StatControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--brutal-cyan);
  border: 3px solid var(--border-primary);
  box-shadow: 2px 2px 0px 0px var(--border-primary);
`

const StatName = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
`

const StatButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const StatButton = styled.button`
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-primary);
  background: var(--brutal-yellow);
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 900;
  cursor: pointer;
  font-family: var(--font-mono);
  transition: all 0.1s ease;
  
  &:hover:not(:disabled) {
    background: var(--brutal-orange);
    transform: translate(1px, 1px);
  }
  
  &:disabled {
    background: var(--brutal-red);
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const StatDisplay = styled.div`
  width: 40px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--light-bg);
  border: 3px solid var(--border-primary);
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
`

const OverviewSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const OverviewItem = styled.div`
  padding: 16px;
  background: var(--brutal-violet);
  border: 3px solid var(--border-primary);
  box-shadow: 2px 2px 0px 0px var(--border-primary);
`

const OverviewLabel = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
`

const OverviewValue = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
`

const OverviewStats = styled.div`
  display: flex;
  gap: 12px;
`

const OverviewStat = styled.div`
  background: var(--brutal-lime);
  padding: 8px 12px;
  border: 2px solid var(--border-primary);
  font-size: 12px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
`

type Step = 'tier' | 'design' | 'stats' | 'final'

interface BeastData {
  tier: string | null
  description: string
  stats: {
    health: number
    stamina: number
    power: number
  }
}

export default function CreatePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>('tier')
  const [beastData, setBeastData] = useState<BeastData>({
    tier: null,
    description: '',
    stats: { health: 5, stamina: 5, power: 5 }
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = () => {
    if (currentStep === 'tier' && beastData.tier) {
      setBeastData({...beastData, description: '', stats: { health: 5, stamina: 5, power: 5 }})
      setCurrentStep('design')
    } else if (currentStep === 'design' && beastData.description.trim()) {
      setBeastData({...beastData, stats: { health: 5, stamina: 5, power: 5 }})
      setCurrentStep('stats')
    } else if (currentStep === 'stats') {
      setCurrentStep('final')
    }
  }

  const handleBack = () => {
    if (currentStep === 'design') {
      setBeastData({...beastData, tier: null, stats: { health: 5, stamina: 5, power: 5 }})
      setCurrentStep('tier')
    } else if (currentStep === 'stats') {
      setBeastData({...beastData, description: '', stats: { health: 5, stamina: 5, power: 5 }})
      setCurrentStep('design')
    } else if (currentStep === 'final') {
      setBeastData({...beastData, stats: { health: 5, stamina: 5, power: 5 }})
      setCurrentStep('stats')
    } else {
      router.back()
    }
  }

  const handleCreate = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    router.push("/home")
  }
  
  const selectedTierData = tiers.find(t => t.id === beastData.tier)
  const getMaxPoints = () => {
    if (beastData.tier === 'basic') return 20
    if (beastData.tier === 'advanced') return 30
    if (beastData.tier === 'legendary') return 40
    return 20
  }
  
  const getTotalUsedPoints = () => {
    return beastData.stats.health + beastData.stats.stamina + beastData.stats.power
  }
  
  const getRemainingPoints = () => {
    return getMaxPoints() - getTotalUsedPoints()
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'tier':
        return (
          <Card>
            <SectionTitle>SELECT TIER</SectionTitle>
            <TierSelector>
              {tiers.map((tier) => (
                <TierCard
                  key={tier.id}
                  $selected={beastData.tier === tier.id}
                  $color={tier.color}
                  onClick={() => setBeastData({...beastData, tier: tier.id})}
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
        )
      
      case 'design':
        return (
          <Card>
            <SectionTitle>DESCRIBE YOUR BEAST</SectionTitle>
            <DescriptionInput
              placeholder="Describe your beast's appearance, personality, and abilities..."
              value={beastData.description}
              onChange={(e) => setBeastData({...beastData, description: e.target.value})}
            />
          </Card>
        )
      
      case 'stats':
        return (
          <Card>
            <SectionTitle>DISTRIBUTE STATS ({getRemainingPoints()} POINTS LEFT)</SectionTitle>
            <StatsContainer>
              {Object.entries(beastData.stats).map(([stat, value]) => (
                <StatControl key={stat}>
                  <StatName>{stat.toUpperCase()}</StatName>
                  <StatButtons>
                    <StatButton 
                      onClick={() => {
                        if (value > 5) {
                          setBeastData({
                            ...beastData,
                            stats: {...beastData.stats, [stat]: value - 1}
                          })
                        }
                      }}
                      disabled={value <= 5}
                    >
                      -
                    </StatButton>
                    <StatDisplay>{value}</StatDisplay>
                    <StatButton 
                      onClick={() => {
                        if (getRemainingPoints() > 0) {
                          setBeastData({
                            ...beastData,
                            stats: {...beastData.stats, [stat]: value + 1}
                          })
                        }
                      }}
                      disabled={getRemainingPoints() <= 0}
                    >
                      +
                    </StatButton>
                  </StatButtons>
                </StatControl>
              ))}
            </StatsContainer>
          </Card>
        )
      
      case 'final':
        return (
          <Card>
            <SectionTitle>BEAST OVERVIEW</SectionTitle>
            <OverviewSection>
              <OverviewItem>
                <OverviewLabel>TIER:</OverviewLabel>
                <OverviewValue>{selectedTierData?.name}</OverviewValue>
              </OverviewItem>
              <OverviewItem>
                <OverviewLabel>DESCRIPTION:</OverviewLabel>
                <OverviewValue>{beastData.description}</OverviewValue>
              </OverviewItem>
              <OverviewItem>
                <OverviewLabel>STATS:</OverviewLabel>
                <OverviewStats>
                  <OverviewStat>Health: {beastData.stats.health}</OverviewStat>
                  <OverviewStat>Stamina: {beastData.stats.stamina}</OverviewStat>
                  <OverviewStat>Power: {beastData.stats.power}</OverviewStat>
                </OverviewStats>
              </OverviewItem>
            </OverviewSection>
          </Card>
        )
    }
  }

  return (
    <AppLayout>
      <BackButton onClick={handleBack}>
        ← BACK
      </BackButton>
      
      <CreateContainer>
        <CreateHeader>
          <CreateTitle>🐲 CREATE BEAST</CreateTitle>
          <CreateSubtitle>
            {currentStep === 'tier' && 'Choose your beast tier'}
            {currentStep === 'design' && 'Design your beast'}
            {currentStep === 'stats' && 'Distribute stat points'}
            {currentStep === 'final' && 'Review and create'}
          </CreateSubtitle>
        </CreateHeader>
        
        {renderStep()}

        {currentStep !== 'final' ? (
          <MintButton
            $fullWidth
            disabled={
              (currentStep === 'tier' && !beastData.tier) ||
              (currentStep === 'design' && !beastData.description.trim()) ||
              (currentStep === 'stats' && getRemainingPoints() !== 0)
            }
            onClick={handleNext}
          >
            NEXT
          </MintButton>
        ) : (
          <MintButton
            $fullWidth
            disabled={isLoading}
            onClick={handleCreate}
          >
            {isLoading ? "CREATING..." : "CREATE BEAST (20 $WAM)"}
          </MintButton>
        )}
      </CreateContainer>
    </AppLayout>
  )
}