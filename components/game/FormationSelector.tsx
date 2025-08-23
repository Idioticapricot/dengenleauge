"use client"

import styled from "styled-components"

const FormationContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
  padding: 4px 0;
`

const FormationButton = styled.button<{ $active?: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: 2px solid ${(props) => (props.$active ? "var(--primary-green)" : "rgba(51, 65, 85, 0.5)")};
  background: ${(props) => (props.$active ? "rgba(34, 197, 94, 0.2)" : "rgba(30, 41, 59, 0.6)")};
  color: ${(props) => (props.$active ? "var(--primary-green)" : "var(--text-secondary)")};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    border-color: var(--primary-green);
    background: rgba(34, 197, 94, 0.1);
    color: var(--primary-green);
  }
`

interface FormationSelectorProps {
  selectedFormation: string
  onFormationChange: (formation: string) => void
}

const formations = ["2-2-1", "0-2-3", "3-2-0", "0-0-5"]

export function FormationSelector({ selectedFormation, onFormationChange }: FormationSelectorProps) {
  return (
    <FormationContainer>
      {formations.map((formation) => (
        <FormationButton
          key={formation}
          $active={selectedFormation === formation}
          onClick={() => onFormationChange(formation)}
        >
          {formation}
        </FormationButton>
      ))}
    </FormationContainer>
  )
}
