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
`

export const MainContent = styled.main`
  padding: 20px 16px 100px;
  position: relative;
  z-index: 1;
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
`
