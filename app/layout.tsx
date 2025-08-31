import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { StyledComponentsRegistry } from "./registry"
import { ClientProviders } from "../components/ClientProviders"
import { GlobalStyle, StadiumBackground } from "../components/styled/GlobalStyles"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "Degen League",
  description: "Battle and trade in the ultimate Degen League arena",
  generator: "v0.app",
  icons: {
    icon: "/wolf-removebg-preview.png",
    shortcut: "/wolf-removebg-preview.png",
    apple: "/wolf-removebg-preview.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <style>{`
html {
  font-family: ${inter.style.fontFamily};
  --font-inter: ${inter.variable};
  --font-space-grotesk: ${spaceGrotesk.variable};
}
        `}</style>
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <StyledComponentsRegistry>
          <GlobalStyle />
          <StadiumBackground />
          <ClientProviders>{children}</ClientProviders>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
