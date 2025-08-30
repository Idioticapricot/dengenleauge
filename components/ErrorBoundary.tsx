"use client"

import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faRotate } from '@fortawesome/free-solid-svg-icons'

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: var(--brutal-red);
  border: 4px solid var(--border-primary);
  padding: 40px;
  text-align: center;
  box-shadow: 8px 8px 0px 0px var(--border-primary);
`

const ErrorTitle = styled.h1`
  font-size: 32px;
  font-weight: 900;
  color: var(--text-primary);
  margin: 0 0 16px 0;
  font-family: var(--font-mono);
  text-transform: uppercase;
`

const ErrorMessage = styled.p`
  font-size: 16px;
  color: var(--text-primary);
  margin: 0 0 24px 0;
  font-family: var(--font-mono);
`

const RetryButton = styled.button`
  background: var(--brutal-yellow);
  border: 4px solid var(--border-primary);
  padding: 12px 24px;
  font-weight: 900;
  font-family: var(--font-mono);
  cursor: pointer;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  
  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px var(--border-primary);
  }
`

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>
            <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: '8px' }} />
            Something Went Wrong
          </ErrorTitle>
          <ErrorMessage>
            The application encountered an unexpected error. Please try refreshing the page.
          </ErrorMessage>
          <RetryButton onClick={() => window.location.reload()}>
            <FontAwesomeIcon icon={faRotate} style={{ marginRight: '8px' }} />
            Reload Page
          </RetryButton>
        </ErrorContainer>
      )
    }

    return this.props.children
  }
}