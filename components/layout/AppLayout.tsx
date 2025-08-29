"use client"

import type React from "react"

import { Container, StadiumBackground, MainContent, GlobalStyle } from "../styled/GlobalStyles"
import { Header } from "./Header"
import { BottomNavigation } from "./BottomNavigation"
import { BrutalToastContainer } from "../ui/BrutalToast"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <GlobalStyle />
      <StadiumBackground />
      <Container className="min-h-screen">
        <Header />
        <MainContent className="font-mono">{children}</MainContent>
        <BottomNavigation />
      </Container>
      <BrutalToastContainer />
    </>
  )
}
