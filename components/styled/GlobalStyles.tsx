"use client"

import styled, { createGlobalStyle } from "styled-components"

export const GlobalStyle = createGlobalStyle`
  :root {
    --brutal-yellow: #FFE500;
    --brutal-lime: #9dfc7c;
    --brutal-cyan: #79F7FF;
    --brutal-pink: #fa8cef;
    --brutal-red: #fa7a7a;
    --brutal-orange: #FF965B;
    --brutal-violet: #918efa;
    --dark-bg: #000000;
    --light-bg: #ffffff;
    --text-primary: #000000;
    --text-secondary: #000000;
    --border-primary: #000000;
    --font-mono: 'Courier New', monospace;
  }

  /* Responsive breakpoints */
  @media (max-width: 768px) {
    :root {
      --border-width: 2px;
      --shadow-offset: 2px;
    }
  }

  @media (max-width: 480px) {
    :root {
      --border-width: 1px;
      --shadow-offset: 1px;
    }
  }

  /* Improved scrollbar for mobile */
  @media (max-width: 768px) {
    ::-webkit-scrollbar {
      width: 4px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: var(--brutal-yellow);
      border-radius: 2px;
    }
  }
`

export const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  min-height: 100vh;
  background: var(--light-bg);
  position: relative;
  overflow: hidden;
  border-left: 4px solid var(--border-primary);
  border-right: 4px solid var(--border-primary);
  
  @media (max-width: 768px) {
    border-left: 2px solid var(--border-primary);
    border-right: 2px solid var(--border-primary);
    max-width: 100%;
  }
`

export const StadiumBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--light-bg);
  z-index: -2;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(255, 229, 0, 0.1) 10px,
        rgba(255, 229, 0, 0.1) 20px
      );
    z-index: -1;
  }

  @media (max-width: 768px) {
    &::before {
      background-image: 
        repeating-linear-gradient(
          45deg,
          transparent,
          transparent 8px,
          rgba(255, 229, 0, 0.08) 8px,
          rgba(255, 229, 0, 0.08) 16px
        );
    }
  }
`

export const MainContent = styled.main`
  padding: 20px 16px 100px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 16px 12px 120px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 8px 120px;
  }
`

export const Card = styled.div<{ $variant?: "primary" | "secondary" | "dark" }>`
  background: ${(props) => {
    switch (props.$variant) {
      case "primary":
        return "var(--brutal-yellow)"
      case "secondary":
        return "var(--brutal-cyan)"
      default:
        return "var(--light-bg)"
    }
  }};
  border: 4px solid var(--border-primary);
  border-radius: 0;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 6px 6px 0px 0px var(--border-primary);
  font-family: var(--font-mono);
  transition: all 0.1s ease;
  
  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 4px 4px 0px 0px var(--border-primary);
  }

  @media (max-width: 768px) {
    border-width: 3px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 4px 4px 0px 0px var(--border-primary);
    
    &:hover {
      transform: translate(1px, 1px);
      box-shadow: 3px 3px 0px 0px var(--border-primary);
    }
  }

  @media (max-width: 480px) {
    border-width: 2px;
    padding: 12px;
    margin-bottom: 12px;
    box-shadow: 2px 2px 0px 0px var(--border-primary);
    
    &:hover {
      transform: none;
      box-shadow: 2px 2px 0px 0px var(--border-primary);
    }
  }
`

export const Button = styled.button<{
  $variant?: "primary" | "secondary" | "danger" | "outline"
  $size?: "sm" | "md" | "lg"
  $fullWidth?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 4px solid var(--border-primary);
  border-radius: 0;
  font-weight: 900;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: ${(props) => {
    switch (props.$size) {
      case "sm":
        return "12px"
      case "lg":
        return "18px"
      default:
        return "14px"
    }
  }};
  padding: ${(props) => {
    switch (props.$size) {
      case "sm":
        return "10px 16px"
      case "lg":
        return "16px 32px"
      default:
        return "12px 24px"
    }
  }};
  width: ${(props) => (props.$fullWidth ? "100%" : "auto")};
  cursor: pointer;
  transition: all 0.1s ease;
  position: relative;
  box-shadow: 4px 4px 0px 0px var(--border-primary);
  
  background: ${(props) => {
    switch (props.$variant) {
      case "primary":
        return "var(--brutal-yellow)"
      case "secondary":
        return "var(--brutal-cyan)"
      case "danger":
        return "var(--brutal-red)"
      case "outline":
        return "var(--light-bg)"
      default:
        return "var(--brutal-yellow)"
    }
  }};
  
  color: var(--text-primary);
  
  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px 0px var(--border-primary);
    background: ${(props) => {
      switch (props.$variant) {
        case "primary":
          return "var(--brutal-lime)"
        case "secondary":
          return "var(--brutal-pink)"
        case "danger":
          return "var(--brutal-orange)"
        case "outline":
          return "var(--brutal-yellow)"
        default:
          return "var(--brutal-lime)"
      }
    }};
  }
  
  &:active {
    transform: translate(4px, 4px);
    box-shadow: none;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: 4px 4px 0px 0px var(--border-primary);
  }

  @media (max-width: 768px) {
    border-width: 3px;
    box-shadow: 3px 3px 0px 0px var(--border-primary);
    font-size: ${(props) => {
      switch (props.$size) {
        case "sm":
          return "11px"
        case "lg":
          return "16px"
        default:
          return "13px"
      }
    }};
    padding: ${(props) => {
      switch (props.$size) {
        case "sm":
          return "8px 12px"
        case "lg":
          return "14px 24px"
        default:
          return "10px 18px"
      }
    }};
    
    &:hover {
      transform: translate(1px, 1px);
      box-shadow: 2px 2px 0px 0px var(--border-primary);
    }
    
    &:active {
      transform: translate(2px, 2px);
    }
  }

  @media (max-width: 480px) {
    border-width: 2px;
    box-shadow: 2px 2px 0px 0px var(--border-primary);
    font-size: ${(props) => {
      switch (props.$size) {
        case "sm":
          return "10px"
        case "lg":
          return "14px"
        default:
          return "12px"
      }
    }};
    padding: ${(props) => {
      switch (props.$size) {
        case "sm":
          return "6px 10px"
        case "lg":
          return "12px 20px"
        default:
          return "8px 14px"
      }
    }};
    
    &:hover {
      transform: none;
      box-shadow: 2px 2px 0px 0px var(--border-primary);
    }
    
    &:active {
      transform: translate(1px, 1px);
    }
  }
`

// New responsive utility components
export const ResponsiveGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns || 2}, 1fr);
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`

export const ResponsiveFlex = styled.div<{ $direction?: "row" | "column" }>`
  display: flex;
  flex-direction: ${props => props.$direction || "row"};
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`

export const MobileHidden = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`

export const DesktopHidden = styled.div`
  @media (min-width: 769px) {
    display: none;
  }
`
