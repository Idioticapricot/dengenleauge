"use client"

import { useState } from "react"
import { AppLayout } from "../../components/layout/AppLayout"
import styled from "styled-components"
import { Card, Button } from "../../components/styled/GlobalStyles"

const TeamContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const TeamHeader = styled.div`
  text-align: center;
  background: var(--brutal-violet);
  padding: 24px;
  border: 4px solid var(--border-primary);
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
`

const TeamTitle = styled.h1`
  font-size: 32px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 3px;
`

const TeamSubtitle = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`

const CurrentTeamSection = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  padding: 24px;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 2px;
  background: var(--brutal-cyan);
  padding: 8px 16px;
  border: 3px solid var(--border-primary);
  display: inline-block;
`

const TeamSlots = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
`

const TeamSlot = styled.div<{ $filled?: boolean }>`
  background: ${props => props.$filled ? "var(--brutal-lime)" : "var(--light-bg)"};
  border: 4px solid var(--border-primary);
  padding: 20px;
  text-align: center;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.$filled ? "pointer" : "default"};
  transition: all 0.1s ease;
  box-shadow: 2px 2px 0px 0px var(--border-primary);
  
  &:hover {
    transform: ${props => props.$filled ? "translate(1px, 1px)" : "none"};
    box-shadow: ${props => props.$filled ? "1px 1px 0px 0px var(--border-primary)" : "2px 2px 0px 0px var(--border-primary)"};
  }
`

const SlotIcon = styled.div`
  font-size: 32px;
  margin-bottom: 8px;
`

const SlotText = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const BeastName = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  margin-bottom: 4px;
`

const BeastLevel = styled.div`
  font-size: 10px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  background: var(--brutal-pink);
  padding: 2px 6px;
  border: 2px solid var(--border-primary);
`

const MyBeastsSection = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  padding: 24px;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
`

const BeastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`

const BeastCard = styled(Card)<{ $selected?: boolean }>`
  padding: 16px;
  text-align: center;
  cursor: pointer;
  background: ${props => props.$selected ? "var(--brutal-yellow)" : "var(--light-bg)"};
  transition: all 0.1s ease;
  
  &:hover {
    background: var(--brutal-cyan);
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px var(--border-primary);
  }
`

const BeastIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`

const BeastCardName = styled.h3`
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
`

const BeastStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  margin-bottom: 12px;
`

const StatItem = styled.div`
  background: var(--brutal-orange);
  padding: 4px;
  border: 2px solid var(--border-primary);
  text-align: center;
`

const StatLabel = styled.div`
  font-size: 8px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const StatValue = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
`

const SaveTeamButton = styled(Button)`
  background: var(--brutal-lime);
  font-size: 18px;
  padding: 16px 32px;
  margin-top: 20px;
  
  &:hover {
    background: var(--brutal-cyan);
  }
`

const mockOwnedBeasts = [
  { id: 1, name: "Fire Dragon", type: "fire", icon: "🔥", level: 5, hp: 100, attack: 80, defense: 60 },
  { id: 2, name: "Water Serpent", type: "water", icon: "🌊", level: 3, hp: 90, attack: 70, defense: 70 },
  { id: 3, name: "Earth Golem", type: "earth", icon: "🌍", level: 7, hp: 120, attack: 60, defense: 90 },
  { id: 4, name: "Thunder Wolf", type: "electric", icon: "⚡", level: 4, hp: 85, attack: 95, defense: 65 },
  { id: 5, name: "Ice Phoenix", type: "water", icon: "❄️", level: 6, hp: 95, attack: 85, defense: 75 },
]

export default function TeamPage() {
  const [currentTeam, setCurrentTeam] = useState([null, null, null])
  const [selectedBeasts, setSelectedBeasts] = useState<number[]>([])

  const handleBeastSelect = (beast: any) => {
    const emptySlotIndex = currentTeam.findIndex(slot => slot === null)
    if (emptySlotIndex !== -1 && !selectedBeasts.includes(beast.id)) {
      const newTeam = [...currentTeam]
      newTeam[emptySlotIndex] = beast
      setCurrentTeam(newTeam)
      setSelectedBeasts([...selectedBeasts, beast.id])
    }
  }

  const handleSlotClick = (index: number) => {
    if (currentTeam[index]) {
      const beastId = currentTeam[index].id
      const newTeam = [...currentTeam]
      newTeam[index] = null
      setCurrentTeam(newTeam)
      setSelectedBeasts(selectedBeasts.filter(id => id !== beastId))
    }
  }

  return (
    <AppLayout>
      <TeamContainer>
        <TeamHeader>
          <TeamTitle>⚔️ MY TEAM</TeamTitle>
          <TeamSubtitle>Select 3 beasts for battle</TeamSubtitle>
        </TeamHeader>

        <CurrentTeamSection>
          <SectionTitle>CURRENT TEAM</SectionTitle>
          <TeamSlots>
            {currentTeam.map((beast, index) => (
              <TeamSlot 
                key={index} 
                $filled={!!beast}
                onClick={() => handleSlotClick(index)}
              >
                {beast ? (
                  <>
                    <SlotIcon>{beast.icon}</SlotIcon>
                    <BeastName>{beast.name}</BeastName>
                    <BeastLevel>LVL {beast.level}</BeastLevel>
                  </>
                ) : (
                  <>
                    <SlotIcon>➕</SlotIcon>
                    <SlotText>EMPTY SLOT</SlotText>
                  </>
                )}
              </TeamSlot>
            ))}
          </TeamSlots>
          
          <SaveTeamButton 
            $fullWidth 
            disabled={currentTeam.filter(Boolean).length !== 3}
          >
            SAVE TEAM ({currentTeam.filter(Boolean).length}/3)
          </SaveTeamButton>
        </CurrentTeamSection>

        <MyBeastsSection>
          <SectionTitle>MY BEASTS</SectionTitle>
          <BeastGrid>
            {mockOwnedBeasts.map((beast) => (
              <BeastCard
                key={beast.id}
                $selected={selectedBeasts.includes(beast.id)}
                onClick={() => handleBeastSelect(beast)}
              >
                <BeastIcon>{beast.icon}</BeastIcon>
                <BeastCardName>{beast.name}</BeastCardName>
                
                <BeastStats>
                  <StatItem>
                    <StatLabel>HP</StatLabel>
                    <StatValue>{beast.hp}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>ATK</StatLabel>
                    <StatValue>{beast.attack}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>DEF</StatLabel>
                    <StatValue>{beast.defense}</StatValue>
                  </StatItem>
                </BeastStats>
                
                <BeastLevel>Level {beast.level}</BeastLevel>
              </BeastCard>
            ))}
          </BeastGrid>
        </MyBeastsSection>
      </TeamContainer>
    </AppLayout>
  )
}