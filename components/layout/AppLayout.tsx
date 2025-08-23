"use client"

import type React from "react"

import { Container, StadiumBackground, MainContent, GlobalStyle } from "../styled/GlobalStyles"
import { Header } from "./Header"
import { BottomNavigation } from "./BottomNavigation"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <GlobalStyle />
      <StadiumBackground />
      <Container className="min-h-screen bg-white dark:bg-black">
        <Header />
        <MainContent className="font-mono">{children}</MainContent>
        <BottomNavigation />
      </Container>
    </>
  )
}
