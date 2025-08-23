"use client"

import { useState } from "react"
import styled from "styled-components"
import { Button } from "../styled/GlobalStyles"
import { BeastCard as BeastCardComponent } from "../beast/BeastCard"
import { mockBeasts } from "../../data/mockBeasts"

interface SellModalProps {
  onClose: () => void
}

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`

const PopupContent = styled.div`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  box-shadow: 8px 8px 0px 0px var(--border-primary);
  padding: 32px;
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  font-family: var(--font-mono);
`

const PopupTitle = styled.h2`
  font-size: 24px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
`

const SellStep = styled.div<{ $active: boolean }>`
  display: ${props => props.$active ? 'block' : 'none'};
`

const StepTitle = styled.h3`
  font-size: 18px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: var(--brutal-cyan);
  padding: 8px 16px;
  border: 3px solid var(--border-primary);
  text-align: center;
`

const BeastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`

const SelectableBeastCard = styled.div<{ $selected: boolean }>`
  cursor: pointer;
  transition: all 0.1s ease;
  border: ${props => props.$selected ? '4px solid var(--brutal-yellow)' : 'none'};
  background: ${props => props.$selected ? 'var(--brutal-yellow)' : 'transparent'};
  padding: ${props => props.$selected ? '8px' : '0'};
  
  &:hover {
    transform: translate(2px, 2px);
  }
`

const PriceSection = styled.div`
  background: var(--brutal-lime);
  border: 4px solid var(--border-primary);
  padding: 24px;
  margin-bottom: 24px;
  text-align: center;
`

const PriceInput = styled.input`
  width: 200px;
  padding: 12px 16px;
  border: 4px solid var(--border-primary);
  background: var(--light-bg);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-weight: 900;
  font-size: 18px;
  text-align: center;
  margin: 0 8px;
  
  &:focus {
    outline: none;
    background: var(--brutal-yellow);
  }
`

const PriceLabel = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: var(--text-primary);
  margin-bottom: 12px;
  text-transform: uppercase;
`

const SelectedBeastDisplay = styled.div`
  background: var(--brutal-violet);
  border: 4px solid var(--border-primary);
  padding: 16px;
  margin-bottom: 24px;
  text-align: center;
`

const SelectedBeastName = styled.div`
  font-size: 20px;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  margin-bottom: 8px;
`

const PopupButtons = styled.div`
  display: flex;
  gap: 12px;
`

const PopupButton = styled(Button)`
  flex: 1;
  font-size: 14px;
  padding: 12px;
  text-transform: uppercase;
`

const BackButton = styled(Button)`
  background: var(--brutal-red);
  
  &:hover {
    background: var(--brutal-orange);
  }
`

export function SellModal({ onClose }: SellModalProps) {
  const [step, setStep] = useState<'select' | 'price'>('select')
  const [selectedBeast, setSelectedBeast] = useState<string | null>(null)
  const [price, setPrice] = useState('')

  const userBeasts = mockBeasts.slice(0, 3)

  const handleBeastSelect = (beastId: string) => {
    setSelectedBeast(beastId)
  }

  const handleNextStep = () => {
    if (selectedBeast) {
      setStep('price')
    }
  }

  const handleConfirmSell = () => {
    if (selectedBeast && price) {
      console.log(`Listing beast ${selectedBeast} for ${price} $WAM`)
      onClose()
    }
  }

  const selectedBeastData = userBeasts.find(b => b.id === selectedBeast)

  return (
    <PopupOverlay onClick={onClose}>
      <PopupContent onClick={(e) => e.stopPropagation()}>
        <PopupTitle>🏷️ SELL BEAST</PopupTitle>
        
        <SellStep $active={step === 'select'}>
          <StepTitle>Step 1: Select Beast to Sell</StepTitle>
          
          <BeastGrid>
            {userBeasts.map((beast) => (
              <SelectableBeastCard
                key={beast.id}
                $selected={selectedBeast === beast.id}
                onClick={() => handleBeastSelect(beast.id)}
              >
                <BeastCardComponent
                  beast={beast}
                  selected={selectedBeast === beast.id}
                />
              </SelectableBeastCard>
            ))}
          </BeastGrid>
          
          <PopupButtons>
            <PopupButton onClick={onClose}>
              Cancel
            </PopupButton>
            <PopupButton 
              onClick={handleNextStep}
              disabled={!selectedBeast}
            >
              Next: Set Price
            </PopupButton>
          </PopupButtons>
        </SellStep>

        <SellStep $active={step === 'price'}>
          <StepTitle>Step 2: Set Price</StepTitle>
          
          {selectedBeastData && (
            <SelectedBeastDisplay>
              <SelectedBeastName>{selectedBeastData.name}</SelectedBeastName>
              <div>Level {selectedBeastData.level} • {selectedBeastData.tier} Tier</div>
            </SelectedBeastDisplay>
          )}
          
          <PriceSection>
            <PriceLabel>Set Your Price</PriceLabel>
            <div>
              <PriceInput
                type="number"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="1"
              />
              <span style={{ fontSize: '18px', fontWeight: 900 }}>$WAM</span>
            </div>
          </PriceSection>
          
          <PopupButtons>
            <BackButton onClick={() => setStep('select')}>
              ← Back
            </BackButton>
            <PopupButton 
              onClick={handleConfirmSell}
              disabled={!price || parseFloat(price) <= 0}
            >
              List for Sale
            </PopupButton>
          </PopupButtons>
        </SellStep>
      </PopupContent>
    </PopupOverlay>
  )
}