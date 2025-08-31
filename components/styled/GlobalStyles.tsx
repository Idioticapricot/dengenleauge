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
    --brutal-blue: #4A90E2;
    --brutal-green: #7ED321;
    --dark-bg: #000000;
    --light-bg: #ffffff;
    --text-primary: #000000;
    --text-secondary: #666666;
    --text-muted: #999999;
    --border-primary: #000000;
    --font-mono: 'Courier New', 'Monaco', 'Menlo', monospace;
    --font-sans: 'Arial', 'Helvetica', sans-serif;
    --shadow-brutal: 6px 6px 0px 0px var(--border-primary);
    --shadow-brutal-sm: 3px 3px 0px 0px var(--border-primary);
    --shadow-brutal-lg: 8px 8px 0px 0px var(--border-primary);
    --shadow-brutal-xl: 12px 12px 0px 0px var(--border-primary);
    --shadow-brutal-inner: inset 4px 4px 0px 0px var(--border-primary);
    --shadow-brutal-glow: 0 0 20px rgba(255, 229, 0, 0.5);
    --shadow-brutal-text: 2px 2px 0px 0px var(--border-primary);

    /* Animation durations */
    --duration-fast: 0.15s;
    --duration-normal: 0.3s;
    --duration-slow: 0.5s;

    /* Border widths */
    --border-width-thin: 2px;
    --border-width-normal: 4px;
    --border-width-thick: 6px;

    /* Mobile-first touch targets */
    --min-touch-target: 44px;
    --min-tap-target: 44px;

    /* Mobile spacing */
    --mobile-padding: 16px;
    --mobile-margin: 16px;
    --mobile-gap: 12px;

    /* Spacing scale */
    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 24px;
    --space-xl: 32px;
    --space-2xl: 48px;
    
    /* Typography scale */
    --text-xs: 12px;
    --text-sm: 14px;
    --text-base: 16px;
    --text-lg: 18px;
    --text-xl: 20px;
    --text-2xl: 24px;
    --text-3xl: 30px;
    --text-4xl: 36px;
    
    /* Border radius */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    
    /* Z-index scale */
    --z-dropdown: 1000;
    --z-sticky: 1020;
    --z-fixed: 1030;
    --z-modal: 1040;
    --z-popover: 1050;
    --z-tooltip: 1060;
  }

  .dark {
    --dark-bg: #ffffff;
    --light-bg: #000000;
    --text-primary: #ffffff;
    --text-secondary: #cccccc;
    --border-primary: #ffffff;
  }

  /* Base mobile styles */
  * {
    -webkit-tap-highlight-color: rgba(255, 229, 0, 0.3);
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    box-sizing: border-box;
  }
  
  /* Performance optimizations */
  * {
    will-change: auto;
  }
  
  *:hover, *:focus, *:active {
    will-change: transform, box-shadow, background-color;
  }
  
  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }
  
  /* Reduce motion for users who prefer it */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Enable text selection for content */
  p, span, div, h1, h2, h3, h4, h5, h6 {
    -webkit-user-select: text;
    -khtml-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }

  /* Touch-friendly interactions */
  button, a, input, textarea, select {
    min-height: var(--min-touch-target);
    min-width: var(--min-touch-target);
  }

  /* Responsive breakpoints - Mobile First */
  @media (min-width: 481px) {
    :root {
      --mobile-padding: 20px;
      --mobile-margin: 20px;
      --mobile-gap: 16px;
    }
  }

  @media (min-width: 769px) {
    :root {
      --mobile-padding: 24px;
      --mobile-margin: 24px;
      --mobile-gap: 20px;
    }
  }

  @media (min-width: 1025px) {
    :root {
      --mobile-padding: 32px;
      --mobile-margin: 32px;
      --mobile-gap: 24px;
    }
  }

  /* Tablet styles */
  @media (max-width: 1024px) and (min-width: 769px) {
    :root {
      --border-width: 3px;
      --shadow-offset: 3px;
    }
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    :root {
      --border-width: 2px;
      --shadow-offset: 2px;
    }

    /* Optimize for mobile performance */
    *, *::before, *::after {
      animation-duration: 0.2s !important;
      animation-delay: 0s !important;
      transition-duration: 0.2s !important;
    }
    

  }

  /* Small mobile styles */
  @media (max-width: 480px) {
    :root {
      --border-width: 1px;
      --shadow-offset: 1px;
      --mobile-padding: 12px;
      --mobile-margin: 12px;
      --mobile-gap: 8px;
    }
  }

  /* Improved scrollbar for mobile */
  @media (max-width: 768px) {
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    ::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
    }

    ::-webkit-scrollbar-thumb {
      background: var(--brutal-yellow);
      border-radius: 3px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: var(--brutal-lime);
    }
  }

  /* Mobile viewport optimizations */
  @media (max-width: 768px) {
    html {
      font-size: 16px;
    }

    body {
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: none;
      font-size: 16px;
      line-height: 1.5;
    }

    /* Prevent zoom on input focus */
    input[type="text"],
    input[type="email"],
    input[type="password"],
    input[type="number"],
    textarea,
    select {
      font-size: 16px;
    }

    /* Mobile typography */
    h1 {
      font-size: 1.75rem;
      line-height: 1.2;
      margin-bottom: 1rem;
    }

    h2 {
      font-size: 1.5rem;
      line-height: 1.3;
      margin-bottom: 0.875rem;
    }

    h3 {
      font-size: 1.25rem;
      line-height: 1.4;
      margin-bottom: 0.75rem;
    }

    p {
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    /* Better mobile spacing */
    .mobile-spacing {
      margin-bottom: var(--mobile-margin);
    }

    .mobile-padding {
      padding: var(--mobile-padding);
    }

    /* Mobile text sizing */
    .text-xs-mobile { font-size: 0.75rem; }
    .text-sm-mobile { font-size: 0.875rem; }
    .text-base-mobile { font-size: 1rem; }
    .text-lg-mobile { font-size: 1.125rem; }
    .text-xl-mobile { font-size: 1.25rem; }
    .text-2xl-mobile { font-size: 1.5rem; }
    .text-3xl-mobile { font-size: 1.875rem; }
    .text-4xl-mobile { font-size: 2.25rem; }
  }

  /* Small mobile specific styles */
  @media (max-width: 480px) {
    body {
      font-size: 14px;
    }

    h1 { font-size: 1.5rem; }
    h2 { font-size: 1.25rem; }
    h3 { font-size: 1.125rem; }
    p { font-size: 0.875rem; }

    /* Compact spacing for very small screens */
    .mobile-spacing {
      margin-bottom: calc(var(--mobile-margin) * 0.75);
    }

    .mobile-padding {
      padding: calc(var(--mobile-padding) * 0.75);
    }
  }

  /* Focus styles for accessibility */
  @media (max-width: 768px) {
    *:focus-visible {
      outline: 3px solid var(--brutal-yellow);
      outline-offset: 2px;
    }
  }

  /* Brutal Design Utility Classes */
  .brutal-border {
    border: var(--border-width-normal) solid var(--border-primary);
  }

  .brutal-shadow {
    box-shadow: var(--shadow-brutal);
  }

  .brutal-shadow-hover {
    transition: transform var(--duration-fast) ease, box-shadow var(--duration-fast) ease;
    will-change: transform, box-shadow;
  }

  .brutal-shadow-hover:hover {
    transform: translate(2px, 2px);
    box-shadow: var(--shadow-brutal-sm);
  }

  .brutal-shadow-active:active {
    transform: translate(4px, 4px);
    box-shadow: none;
  }

  .brutal-text-shadow {
    text-shadow: var(--shadow-brutal-text);
  }

  .brutal-glow {
    box-shadow: var(--shadow-brutal-glow);
  }

  .brutal-animation-fast {
    transition-duration: var(--duration-fast);
  }

  .brutal-animation-normal {
    transition-duration: var(--duration-normal);
  }

  .brutal-animation-slow {
    transition-duration: var(--duration-slow);
  }

  /* Mobile-specific brutal utilities */
  @media (max-width: 768px) {
    .brutal-border {
      border-width: var(--border-width-thin);
    }

    .brutal-shadow {
      box-shadow: var(--shadow-brutal-sm);
    }

    .brutal-shadow-hover:hover {
      transform: translate(1px, 1px);
      box-shadow: 2px 2px 0px 0px var(--border-primary);
    }

    .brutal-shadow-active:active {
      transform: translate(2px, 2px);
      box-shadow: none;
    }
  }

  @media (max-width: 480px) {
    .brutal-border {
      border-width: 1px;
    }

    .brutal-shadow {
      box-shadow: 2px 2px 0px 0px var(--border-primary);
    }

    .brutal-shadow-hover:hover {
      transform: none;
    }
  }
`

export const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  min-height: 100vh;
  background: var(--light-bg);
  padding-bottom: 80px;
  
  @media (max-width: 768px) {
    border-left: 3px solid var(--border-primary);
    border-right: 3px solid var(--border-primary);
    max-width: 100%;
  }
  
  @media (max-width: 480px) {
    border-left: 2px solid var(--border-primary);
    border-right: 2px solid var(--border-primary);
  }
`

export const StadiumBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--brutal-violet);
  z-index: -2;
`

export const MainContent = styled.main`
  padding: 20px 16px 20px;
  position: relative;
  z-index: 1;
  flex: 1;
  
  @media (max-width: 768px) {
    padding: 16px 12px 16px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 8px 12px;
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
  $variant?: "primary" | "secondary" | "danger" | "outline" | "ghost"
  $size?: "sm" | "md" | "lg"
  $fullWidth?: boolean
  $loading?: boolean
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
        return "18px 36px"
      default:
        return "14px 28px"
    }
  }};
  width: ${(props) => (props.$fullWidth ? "100%" : "auto")};
  cursor: pointer;
  transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s ease;
  position: relative;
  box-shadow: var(--shadow-brutal);
  will-change: transform, box-shadow;
  
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
      case "ghost":
        return "transparent"
      default:
        return "var(--brutal-yellow)"
    }
  }};
  
  opacity: ${(props) => (props.$loading ? 0.7 : 1)};
  pointer-events: ${(props) => (props.$loading ? 'none' : 'auto')};
  
  color: var(--text-primary);
  
  &:hover:not(:disabled) {
    transform: translate(2px, 2px);
    box-shadow: var(--shadow-brutal-sm);
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
        case "ghost":
          return "var(--brutal-yellow)"
        default:
          return "var(--brutal-lime)"
      }
    }};
    
    ${(props) => props.$loading && `
      background: var(--text-muted) !important;
    `}
  }
  
  &:active:not(:disabled) {
    transform: translate(4px, 4px);
    box-shadow: none;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: var(--shadow-brutal);
    filter: grayscale(0.3);
  }

  @media (max-width: 768px) {
    border-width: 3px;
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
          return "8px 14px"
        case "lg":
          return "16px 28px"
        default:
          return "12px 22px"
      }
    }};
    
    &:hover:not(:disabled) {
      transform: translate(1px, 1px);
    }
    
    &:active:not(:disabled) {
      transform: translate(2px, 2px);
    }
  }

  @media (max-width: 480px) {
    border-width: 2px;
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
          return "6px 12px"
        case "lg":
          return "14px 24px"
        default:
          return "10px 18px"
      }
    }};
    
    &:hover:not(:disabled) {
      transform: none;
    }
    
    &:active:not(:disabled) {
      transform: translate(1px, 1px);
    }
  }
  
  /* Focus styles for accessibility */
  &:focus-visible {
    outline: 2px solid var(--brutal-yellow);
    outline-offset: 2px;
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

// Loading Spinner Component
export const LoadingSpinner = styled.div<{ $size?: 'sm' | 'md' | 'lg' }>`
  width: ${(props) => {
    switch (props.$size) {
      case 'sm': return '16px'
      case 'lg': return '32px'
      default: return '24px'
    }
  }};
  height: ${(props) => {
    switch (props.$size) {
      case 'sm': return '16px'
      case 'lg': return '32px'
      default: return '24px'
    }
  }};
  border: 3px solid var(--text-muted);
  border-top: 3px solid var(--brutal-yellow);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

// Badge Component
export const Badge = styled.span<{
  $variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  $size?: 'sm' | 'md' | 'lg'
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => {
    switch (props.$size) {
      case 'sm': return '2px 6px'
      case 'lg': return '6px 12px'
      default: return '4px 8px'
    }
  }};
  font-size: ${props => {
    switch (props.$size) {
      case 'sm': return '10px'
      case 'lg': return '14px'
      default: return '12px'
    }
  }};
  font-weight: 900;
  font-family: var(--font-mono);
  text-transform: uppercase;
  border: 2px solid var(--border-primary);
  background: ${props => {
    switch (props.$variant) {
      case 'primary': return 'var(--brutal-yellow)'
      case 'secondary': return 'var(--brutal-cyan)'
      case 'success': return 'var(--brutal-lime)'
      case 'warning': return 'var(--brutal-orange)'
      case 'danger': return 'var(--brutal-red)'
      default: return 'var(--brutal-yellow)'
    }
  }};
  color: var(--text-primary);
`
