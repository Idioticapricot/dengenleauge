"use client"

import { useState } from "react"
import { AppLayout } from "../../components/layout/AppLayout"
import styled from "styled-components"
import { Card, Button } from "../../components/styled/GlobalStyles"
import { BeastCard as BeastCardComponent } from "../../components/beast/BeastCard"
import { LevelUpModal } from "../../components/beast/LevelUpModal"
import { mockBeasts } from "../../data/mockBeasts"
import { Beast } from "../../types/beast"

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



export default function TeamPage() {
  const [currentTeam, setCurrentTeam] = useState<(Beast | null)[]>([null, null, null])
  const [selectedBeasts, setSelectedBeasts] = useState<string[]>([])
  const [levelUpBeast, setLevelUpBeast] = useState<string | null>(null)

  const handleBeastSelect = (beastId: string) => {
    const beast = mockBeasts.find(b => b.id === beastId)
    if (!beast) return
    
    const emptySlotIndex = currentTeam.findIndex(slot => slot === null)
    if (emptySlotIndex !== -1 && !selectedBeasts.includes(beast.id)) {
      const newTeam = [...currentTeam]
      newTeam[emptySlotIndex] = beast
      setCurrentTeam(newTeam)
      setSelectedBeasts([...selectedBeasts, beast.id])
    }
  }

  const handleLevelUp = (beastId: string) => {
    setLevelUpBeast(beastId)
  }

  const handleConfirmLevelUp = async (beastId: string, newStats: { health: number; stamina: number; power: number }) => {
    // TODO: Your backend friend will implement this
    // await levelUpBeast(beastId, newStats)
    console.log(`Leveling up beast ${beastId} with stats:`, newStats)
    setLevelUpBeast(null)
  }

  const handleCloseLevelUp = () => {
    setLevelUpBeast(null)
  }

  const handleSlotClick = (index: number) => {
    if (currentTeam[index]) {
      const beastId = currentTeam[index]!.id
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
                    <SlotIcon>{beast.elementType === 'fire' ? '🔥' : beast.elementType === 'water' ? '🌊' : beast.elementType === 'earth' ? '🌍' : '⚡'}</SlotIcon>
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
            {mockBeasts.map((beast) => (
              <BeastCardComponent
                key={beast.id}
                beast={beast}
                selected={selectedBeasts.includes(beast.id)}
                onSelect={handleBeastSelect}
                onLevelUp={handleLevelUp}
              />
            ))}
          </BeastGrid>
        </MyBeastsSection>
      </TeamContainer>

      {levelUpBeast && (
        <LevelUpModal
          beastId={levelUpBeast}
          beastName={mockBeasts.find(b => b.id === levelUpBeast)?.name || "Unknown Beast"}
          currentLevel={mockBeasts.find(b => b.id === levelUpBeast)?.level || 1}
          currentStats={mockBeasts.find(b => b.id === levelUpBeast)?.stats || { health: 0, stamina: 0, power: 0 }}
          onConfirm={handleConfirmLevelUp}
          onClose={handleCloseLevelUp}
        />
      )}
    </AppLayout>
  )
}