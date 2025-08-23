"use client"

import styled from "styled-components"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Users, Calendar, Trophy, User } from "lucide-react"

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
`

const NavList = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`

const NavItem = styled(Link)<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 0;
  text-decoration: none;
  color: var(--text-primary);
  background: ${(props) => (props.$active ? "var(--brutal-yellow)" : "transparent")};
  border: ${(props) => (props.$active ? "3px solid var(--border-primary)" : "3px solid transparent")};
  box-shadow: ${(props) => (props.$active ? "2px 2px 0px 0px var(--border-primary)" : "none")};
  transition: all 0.1s ease;
  font-weight: 900;
  text-transform: uppercase;
  
  &:hover {
    background: var(--brutal-lime);
    border: 3px solid var(--border-primary);
    box-shadow: 2px 2px 0px 0px var(--border-primary);
    transform: translate(1px, 1px);
  }
`

const NavIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const NavLabel = styled.span`
  font-size: 10px;
  font-weight: 900;
  font-family: var(--font-mono);
  letter-spacing: 0.5px;
`

const navItems = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/match", icon: Users, label: "Match" },
  { href: "/tournament", icon: Calendar, label: "Tournament" },
  { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <NavContainer>
      <NavList>
        {navItems.map(({ href, icon: Icon, label }) => (
          <NavItem key={href} href={href} $active={pathname === href}>
            <NavIcon>
              <Icon size={20} />
            </NavIcon>
            <NavLabel>{label}</NavLabel>
          </NavItem>
        ))}
      </NavList>
    </NavContainer>
  )
}
