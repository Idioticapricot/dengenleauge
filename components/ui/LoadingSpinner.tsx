"use client"

import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const LoadingContainer = styled.div<{ $size?: 'small' | 'medium' | 'large' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: ${props => props.$size === 'small' ? '20px' : props.$size === 'large' ? '60px' : '40px'};
`

const Spinner = styled.div<{ $size?: 'small' | 'medium' | 'large' }>`
  width: ${props => props.$size === 'small' ? '24px' : props.$size === 'large' ? '64px' : '48px'};
  height: ${props => props.$size === 'small' ? '24px' : props.$size === 'large' ? '64px' : '48px'};
  border: 4px solid var(--light-bg);
  border-top: 4px solid var(--brutal-cyan);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

const LoadingText = styled.div<{ $size?: 'small' | 'medium' | 'large' }>`
  font-size: ${props => props.$size === 'small' ? '12px' : props.$size === 'large' ? '18px' : '14px'};
  font-weight: 900;
  color: var(--text-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
`

interface LoadingSpinnerProps {
  text?: string
  size?: 'small' | 'medium' | 'large'
}

export function LoadingSpinner({ text = 'Loading...', size = 'medium' }: LoadingSpinnerProps) {
  return (
    <LoadingContainer $size={size}>
      <Spinner $size={size} />
      <LoadingText $size={size}>{text}</LoadingText>
    </LoadingContainer>
  )
}