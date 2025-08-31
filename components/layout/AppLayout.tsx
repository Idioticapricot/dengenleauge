"use client"

import type React from "react"
import styled from "styled-components"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { Container, MainContent } from "../styled/GlobalStyles"
import { Header } from "./Header"
import { BottomNavigation } from "./BottomNavigation"
import { BrutalToastContainer } from "../ui/BrutalToast"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Container>
      <Header />
      <MainContent>{children}</MainContent>
      <BottomNavigation />
      <BrutalToastContainer />
    </Container>
  )
}
