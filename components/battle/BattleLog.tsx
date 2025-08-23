"use client"

import { useEffect, useRef, useState } from "react"
import styled from "styled-components"

interface BattleLogProps {
  log: string[]
  maxEntries?: number
}

const LogContainer = styled.div<{ $expanded: boolean }>`
  background: var(--light-bg);
  border: 4px solid var(--border-primary);
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  height: ${props => props.$expanded ? '300px' : 'auto'};
  display: flex;
  flex-direction: column;
`

const LogHeader = styled.div`
  background: var(--brutal-cyan);
  border-bottom: 3px solid var(--border-primary);
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 900;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: var(--font-mono);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  
  &:hover {
    background: var(--brutal-lime);
  }
`

const LogContent = styled.div<{ $expanded: boolean }>`
  flex: ${props => props.$expanded ? '1' : 'none'};
  padding: 16px;
  overflow-y: ${props => props.$expanded ? 'auto' : 'hidden'};
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: ${props => props.$expanded ? 'none' : '120px'};
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--light-bg);
    border: 2px solid var(--border-primary);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--brutal-violet);
    border: 2px solid var(--border-primary);
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: var(--brutal-pink);
  }
`

const LogEntry = styled.div<{ $isAction?: boolean }>`
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
  padding: 6px 8px;
  background: ${props => props.$isAction ? 'var(--brutal-yellow)' : 'transparent'};
  border: ${props => props.$isAction ? '2px solid var(--border-primary)' : 'none'};
  border-radius: 0;
  line-height: 1.4;
  
  ${props => props.$isAction && `
    box-shadow: 1px 1px 0px 0px var(--border-primary);
    margin-bottom: 4px;
  `}
`

const LogTimestamp = styled.span`
  font-size: 10px;
  opacity: 0.7;
  margin-right: 8px;
`

export function BattleLog({ log, maxEntries = 20 }: BattleLogProps) {
  const logContentRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (logContentRef.current) {
      logContentRef.current.scrollTop = logContentRef.current.scrollHeight
    }
  }, [log])

  // Limit log entries to prevent memory issues
  const displayLog = log.slice(-maxEntries)
  const recentLog = displayLog.slice(-3) // Show only last 3 entries when collapsed

  const isActionEntry = (entry: string) => {
    return entry.includes('used') || entry.includes('Dealt') || entry.includes('critical')
  }

  const formatTimestamp = (index: number) => {
    const now = new Date()
    const time = new Date(now.getTime() - (displayLog.length - index) * 2000)
    return time.toLocaleTimeString('en-US', { 
      hour12: false, 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }

  const logToShow = isExpanded ? displayLog : recentLog

  return (
    <LogContainer $expanded={isExpanded}>
      <LogHeader onClick={() => setIsExpanded(!isExpanded)}>
        <span>📜 BATTLE LOG</span>
        <span>{isExpanded ? '▼' : '▲'}</span>
      </LogHeader>
      
      <LogContent ref={logContentRef} $expanded={isExpanded}>
        {logToShow.length === 0 ? (
          <LogEntry>
            Waiting for battle to start...
          </LogEntry>
        ) : (
          logToShow.map((entry, index) => (
            <LogEntry key={index} $isAction={isActionEntry(entry)}>
              <LogTimestamp>{formatTimestamp(index)}</LogTimestamp>
              {entry}
            </LogEntry>
          ))
        )}
      </LogContent>
    </LogContainer>
  )
}