"use client"

import { useState, useEffect } from "react"
import { useWallet } from "../wallet/WalletProvider"

interface ReferralData {
  code: string
  totalReferrals: number
  totalEarnings: number
  referralHistory: ReferralRecord[]
  pendingRewards: number
}

interface ReferralRecord {
  id: string
  referredUser: string
  joinDate: string
  reward: number
  status: "pending" | "paid"
}

export function useReferralSystem() {
  const { wallet } = useWallet()
  const [referralData, setReferralData] = useState<ReferralData>({
    code: "",
    totalReferrals: 0,
    totalEarnings: 0,
    referralHistory: [],
    pendingRewards: 0,
  })

  useEffect(() => {
    if (wallet.address) {
      const code = `CFL${wallet.address.slice(-6).toUpperCase()}`
      setReferralData((prev) => ({ ...prev, code }))
    }
  }, [wallet.address])

  const trackReferral = async (referredAddress: string) => {
    try {
      const newReferral: ReferralRecord = {
        id: `ref_${Date.now()}`,
        referredUser: referredAddress,
        joinDate: new Date().toISOString(),
        reward: 5.0, // $5 referral bonus
        status: "pending",
      }

      setReferralData((prev) => ({
        ...prev,
        totalReferrals: prev.totalReferrals + 1,
        pendingRewards: prev.pendingRewards + newReferral.reward,
        referralHistory: [newReferral, ...prev.referralHistory],
      }))

      return newReferral
    } catch (error) {
      console.error("Failed to track referral:", error)
      throw error
    }
  }

  const claimRewards = async () => {
    try {
      if (referralData.pendingRewards <= 0) {
        throw new Error("No pending rewards to claim")
      }

      // Simulate blockchain transaction for reward claim
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setReferralData((prev) => ({
        ...prev,
        totalEarnings: prev.totalEarnings + prev.pendingRewards,
        pendingRewards: 0,
        referralHistory: prev.referralHistory.map((ref) => ({
          ...ref,
          status: "paid" as const,
        })),
      }))

      return referralData.pendingRewards
    } catch (error) {
      console.error("Failed to claim rewards:", error)
      throw error
    }
  }

  const generateReferralLink = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://cfl.fun"
    return `${baseUrl}/ref/${referralData.code}`
  }

  const shareReferralLink = async () => {
    const link = generateReferralLink()
    const text = `Join CFL - Crypto Fantasy League and get bonus rewards! Use my referral code: ${referralData.code}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join CFL - Crypto Fantasy League",
          text,
          url: link,
        })
        return true
      } catch (error) {
        console.error("Failed to share:", error)
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(`${text}\n${link}`)
      return true
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
      return false
    }
  }

  return {
    referralData,
    trackReferral,
    claimRewards,
    generateReferralLink,
    shareReferralLink,
  }
}
