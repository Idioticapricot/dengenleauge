"use client"

import styled from "styled-components"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Users, Calendar, Trophy, User, Swords, BarChart3, Zap, DollarSign } from "lucide-react"

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 600px;
  background: var(--light-bg);
  border-top: 4px solid var(--border-primary);
  border-left: 4px solid var(--border-primary);
  border-right: 4px solid var(--border-primary);
  padding: 12px 0 8px;
  z-index: 100;
  font-family: var(--font-mono);
  
  @media (max-width: 768px) {
    border-width: 3px;
    padding: 10px 0 6px;
    max-width: 100%;
  }
  
  @media (max-width: 480px) {
    border-width: 2px;
    padding: 8px 0 4px;
  }
`

const NavList = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 8px;
  
  @media (max-width: 480px) {
    padding: 0 4px;
  }
`

const NavItem = styled(Link)<{ $active: boolean; $isBattle?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: ${(props) => (props.$isBattle ? "12px 16px" : "8px 12px")};
  border-radius: 0;
  text-decoration: none;
  color: var(--text-primary);
  background: ${(props) => {
    if (props.$isBattle && props.$active) return "var(--brutal-red)"
    if (props.$isBattle) return "var(--brutal-orange)"
    if (props.$active) return "var(--brutal-yellow)"
    return "transparent"
  }};
  border: ${(props) => {
    if (props.$isBattle) return "4px solid var(--border-primary)"
    if (props.$active) return "3px solid var(--border-primary)"
    return "3px solid transparent"
  }};
  box-shadow: ${(props) => {
    if (props.$isBattle && props.$active) return "4px 4px 0px 0px var(--border-primary)"
    if (props.$isBattle) return "3px 3px 0px 0px var(--border-primary)"
    if (props.$active) return "2px 2px 0px 0px var(--border-primary)"
    return "none"
  }};
  transition: all 0.1s ease;
  font-weight: 900;
  text-transform: uppercase;
  transform: ${(props) => (props.$isBattle ? "scale(1.1)" : "scale(1)")};
  
  &:hover {
    background: ${(props) => (props.$isBattle ? "var(--brutal-red)" : "var(--brutal-lime)")};
    border: ${(props) => (props.$isBattle ? "4px" : "3px")} solid var(--border-primary);
    box-shadow: ${(props) => (props.$isBattle ? "3px 3px" : "2px 2px")} 0px 0px var(--border-primary);
    transform: ${(props) => (props.$isBattle ? "scale(1.1) translate(1px, 1px)" : "translate(1px, 1px)")};
  }
  
  @media (max-width: 768px) {
    padding: ${(props) => (props.$isBattle ? "10px 12px" : "6px 8px")};
    border-width: ${(props) => {
      if (props.$isBattle) return "3px"
      if (props.$active) return "2px"
      return "2px"
    }};
    box-shadow: ${(props) => {
      if (props.$isBattle && props.$active) return "3px 3px 0px 0px var(--border-primary)"
      if (props.$isBattle) return "2px 2px 0px 0px var(--border-primary)"
      if (props.$active) return "1px 1px 0px 0px var(--border-primary)"
      return "none"
    }};
    transform: ${(props) => (props.$isBattle ? "scale(1.05)" : "scale(1)")};
    
    &:hover {
      border-width: ${(props) => (props.$isBattle ? "3px" : "2px")};
      box-shadow: ${(props) => (props.$isBattle ? "2px 2px" : "1px 1px")} 0px 0px var(--border-primary);
      transform: ${(props) => (props.$isBattle ? "scale(1.05) translate(1px, 1px)" : "translate(1px, 1px)")};
    }
  }
  
  @media (max-width: 480px) {
    padding: ${(props) => (props.$isBattle ? "8px 10px" : "4px 6px")};
    border-width: ${(props) => {
      if (props.$isBattle) return "2px"
      if (props.$active) return "1px"
      return "1px"
    }};
    box-shadow: ${(props) => {
      if (props.$isBattle && props.$active) return "2px 2px 0px 0px var(--border-primary)"
      if (props.$isBattle) return "1px 1px 0px 0px var(--border-primary)"
      if (props.$active) return "1px 1px 0px 0px var(--border-primary)"
      return "none"
    }};
    transform: none;
    
    &:hover {
      transform: none;
      box-shadow: ${(props) => (props.$isBattle ? "1px 1px" : "1px 1px")} 0px 0px var(--border-primary);
    }
  }
`

const NavIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  
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
  { href: "/battle", icon: Swords, label: "Battle" },
  { href: "/game", icon: Zap, label: "PvP", isBattle: true },
  { href: "/tournament", icon: Trophy, label: "Tournament" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <NavContainer>
      <NavList>
        {navItems.map(({ href, icon: Icon, label, isBattle }) => (
          <NavItem key={href} href={href} $active={pathname === href} $isBattle={isBattle}>
            <NavIcon>
              <Icon size={isBattle ? 24 : 20} />
            </NavIcon>
            <NavLabel>{label}</NavLabel>
          </NavItem>
        ))}
      </NavList>
    </NavContainer>
  )
}
