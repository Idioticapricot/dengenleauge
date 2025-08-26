"use client"

import { useEffect } from "react"

export default function BattlePage() {
  useEffect(() => {
    window.location.href = '/battle-meme'
  }, [])
  
  return <div>Redirecting to meme battle...</div>
}

