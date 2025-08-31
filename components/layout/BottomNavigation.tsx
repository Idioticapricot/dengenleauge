"use client"

import { usePathname, useRouter } from "next/navigation"
import styled from "styled-components"
import { Users, Trophy, User, Swords, DollarSign } from "lucide-react"

const NavContainer = styled.nav`
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  height: 80px !important;
  background: var(--light-bg);
  border-top: 4px solid var(--border-primary);
  padding: 12px 0 8px;
  z-index: 9998;
  font-family: var(--font-mono);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  visibility: visible !important;
  opacity: 1 !important;
  box-sizing: border-box;
  transform: none !important;
  transition: none !important;
  
  @media (max-width: 768px) {
    border-width: 3px;
    padding: 12px 0 6px;
    height: 76px !important;
  }
  
  @media (max-width: 480px) {
    border-width: 2px;
    padding: 10px 0 4px;
    height: 72px !important;
  }
`

const NavItems = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 8px;
  
  @media (max-width: 480px) {
    padding: 0 4px;
  }
`

const NavItem = styled.div<{ $isActive: boolean; $isBattle?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: ${props => props.$isBattle ? '14px 18px' : '10px 14px'};
  min-height: 44px;
  min-width: 44px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 900;
  text-transform: uppercase;
  position: relative;
  border-radius: 8px;
  
  background: ${props => {
    if (props.$isBattle && props.$isActive) return 'var(--brutal-red)'
    if (props.$isBattle) return 'var(--brutal-orange)'
    if (props.$isActive) return 'var(--brutal-yellow)'
    return 'transparent'
  }};
  
  border: ${props => {
    if (props.$isBattle || props.$isActive) return '4px solid var(--border-primary)'
    return '4px solid transparent'
  }};
  
  box-shadow: ${props => {
    if (props.$isBattle && props.$isActive) return '6px 6px 0px 0px var(--border-primary)'
    if (props.$isBattle || props.$isActive) return '3px 3px 0px 0px var(--border-primary)'
    return 'none'
  }};
  
  transform: ${props => props.$isBattle ? 'scale(1.05)' : 'scale(1)'};
  
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${props => props.$isBattle ? 'var(--brutal-red)' : 'var(--brutal-lime)'};
      border: 4px solid var(--border-primary);
      box-shadow: 3px 3px 0px 0px var(--border-primary);
      transform: ${props => props.$isBattle ? 'scale(1.1)' : 'scale(1.05)'};
    }
  }
  
  &:active {
    transform: ${props => props.$isBattle ? 'scale(1.05)' : 'scale(1.02)'};
    transition: all 0.1s ease;
  }
  
  ${props => props.$isActive && `
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 3px;
      background: var(--brutal-yellow);
      border-radius: 2px;
      animation: activeIndicator 0.3s ease-out;
    }
    
    @keyframes activeIndicator {
      0% { width: 0; }
      100% { width: 20px; }
    }
  `}
  
  @media (max-width: 768px) {
    padding: ${props => props.$isBattle ? '10px 12px' : '8px 10px'};
    border-width: 3px;
    
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        border-width: 3px;
        box-shadow: 2px 2px 0px 0px var(--border-primary);
      }
    }
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.$isBattle ? '8px 10px' : '6px 8px'};
    border-width: 2px;
    
    @media (hover: hover) and (pointer: fine) {
      &:hover {
        border-width: 2px;
        box-shadow: 1px 1px 0px 0px var(--border-primary);
        transform: none;
      }
    }
  }
`

const IconContainer = styled.div<{ $isBattle?: boolean }>`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  @media (hover: hover) and (pointer: fine) {
    ${NavItem}:hover & {
      transform: ${props => props.$isBattle ? 'rotate(15deg) scale(1.1)' : 'rotate(10deg) scale(1.05)'};
    }
  }
  
  ${NavItem}:active & {
    transform: scale(0.9);
  }
  
  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
  
  @media (max-width: 480px) {
    width: 18px;
    height: 18px;
  }
`

const NavLabel = styled.span`
  font-size: 10px;
  font-weight: 900;
  font-family: var(--font-mono);
  letter-spacing: 0.5px;
  color: var(--text-primary);
  
  @media (max-width: 768px) {
    font-size: 9px;
    letter-spacing: 0.3px;
  }
  
  @media (max-width: 480px) {
    font-size: 8px;
    letter-spacing: 0.2px;
  }
`


const navItems = [
  { href: "/team", icon: Users, label: "Team" },
  { href: "/tournament", icon: Trophy, label: "Tournament" },
  { href: "/battle", icon: Swords, label: "Battle", isBattle: true },
  { href: "/defi", icon: DollarSign, label: "DeFi" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function BottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <NavContainer>
      <NavItems>
        {navItems.map(({ href, icon: Icon, label, isBattle }) => {
          const isActive = pathname === href
          
          return (
            <NavItem
              key={href}
              $isActive={isActive}
              $isBattle={isBattle}
              onClick={() => router.push(href)}
            >
              <IconContainer $isBattle={isBattle}>
                <Icon size={isBattle ? 24 : 20} />
              </IconContainer>
              <NavLabel>{label}</NavLabel>
            </NavItem>
          )
        })}
      </NavItems>
    </NavContainer>
  )
}
