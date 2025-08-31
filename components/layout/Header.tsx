"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useWallet } from "@txnlab/use-wallet-react"
import { useRouter } from "next/navigation"
import { algodClient } from "../../lib/algorand-config"
import { SimpleConnectButton } from "../wallet/SimpleConnectButton"
import Image from "next/image"


export function Header() {
  const { activeAccount } = useWallet()
  const router = useRouter()
  const [showWamPopup, setShowWamPopup] = useState(false)
  const [degenBalance, setDegenBalance] = useState('0')
  const [isDark, setIsDark] = useState(false)
  const DEGEN_ASA_ID = parseInt(process.env.DEGEN_ASSET_ID || '745007115')

  const handleWamClick = () => {
    router.push('/buy-tokens')
  }

  const handleGoToDeposit = () => {
    setShowWamPopup(false)
    router.push('/profile')
  }

  const handleProfileClick = () => {
    router.push('/profile')
  }

  const handleNetworkSwitch = () => {
    // Algorand doesn't need network switching like EVM chains
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const fetchDegenBalance = async () => {
    if (!activeAccount?.address) return

    try {
      const response = await fetch(`/api/user-degen-balance?walletAddress=${activeAccount.address}`)
      const data = await response.json()

      if (data.success) {
        const balance = Number(data.data.degenBalance || 0)
        setDegenBalance(balance.toFixed(2))
      } else {
        setDegenBalance('0')
      }
    } catch (error) {
      console.error('Error fetching DEGEN balance:', error)
      setDegenBalance('0')
    }
  }

  useEffect(() => {
    fetchDegenBalance()
  }, [activeAccount?.address])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const getNetworkName = () => {
    return "ALGO" // Algorand network
  }

  return (
    <>
      {showWamPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-5"
          onClick={() => setShowWamPopup(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8 max-w-md w-full font-mono md:border-3 md:shadow-[4px_4px_0px_0px_#000] md:p-6 sm:border-2 sm:shadow-[2px_2px_0px_0px_#000] sm:p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-black text-black mb-4 uppercase tracking-wider text-center md:text-xl md:mb-3 sm:text-lg sm:mb-2.5">
              💰 BUY $DEGEN
            </h2>
            <p className="text-sm font-bold text-black mb-6 text-center md:text-xs md:mb-5 sm:text-xs sm:mb-4">
              Get more $DEGEN tokens to create beasts and battle other trainers!
            </p>
            <div className="flex gap-3 sm:flex-col sm:gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-[#FFE500] border-4 border-black px-3 py-3 font-black uppercase text-sm shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-all duration-150 md:border-3 md:px-2.5 md:py-2.5 md:text-xs sm:border-2 sm:px-2 sm:py-2 sm:text-xs"
                onClick={() => setShowWamPopup(false)}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-[#79F7FF] border-4 border-black px-3 py-3 font-black uppercase text-sm shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-all duration-150 md:border-3 md:px-2.5 md:py-2.5 md:text-xs sm:border-2 sm:px-2 sm:py-2 sm:text-xs"
                onClick={handleGoToDeposit}
              >
                Go to Deposit
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="flex items-center justify-between p-4 bg-white border-b-4 border-black sticky top-0 z-[100] font-mono backdrop-blur-[10px] shadow-[0_2px_10px_rgba(0,0,0,0.1)] md:p-3 md:border-b-3 md:flex-wrap md:gap-2 sm:p-2.5 sm:border-b-2 sm:gap-1.5"
      >
        <div className="flex items-center gap-3 md:gap-2">
          {/* Left section - can add logo or other elements here */}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 md:gap-2 md:flex-wrap md:justify-end sm:gap-1.5 sm:w-full sm:justify-between">
          {activeAccount?.address && (
            <motion.div
              whileHover={{ scale: 1.05, x: 2, y: 2 }}
              whileTap={{ scale: 0.95, x: 4, y: 4 }}
              className="flex items-center gap-2 bg-[#9dfc7c] border-3 border-black p-2 shadow-[3px_3px_0px_0px_#000] font-black uppercase cursor-pointer transition-all duration-100 hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 md:border-2 md:p-1.5 md:shadow-[2px_2px_0px_0px_#000] md:text-xs md:hover:translate-x-0 md:hover:translate-y-0 md:hover:shadow-[2px_2px_0px_0px_#000] sm:p-1 sm:text-xs sm:gap-1.5"
              onClick={handleWamClick}
            >
              <div className="w-6 h-6 bg-[#FFE500] border-2 border-black flex items-center justify-center text-xs font-black font-mono md:w-5 md:h-5 md:text-[10px] md:border-1 sm:w-4.5 sm:h-4.5 sm:text-[9px]">
                $D
              </div>
              <span className="font-black text-black font-mono sm:text-xs">
                {degenBalance}
              </span>
              <motion.button
                whileHover={{ rotate: 180 }}
                className="w-6 h-6 bg-[#FFE500] border-2 border-black text-black text-base font-black flex items-center justify-center font-mono cursor-pointer transition-all duration-100 hover:bg-[#79F7FF] hover:translate-x-1 hover:translate-y-1 md:w-5 md:h-5 md:text-sm md:border-1 sm:w-4.5 sm:h-4.5 sm:text-xs"
                onClick={(e) => { e.stopPropagation(); router.push('/buy-tokens'); }}
              >
                +
              </motion.button>
            </motion.div>
          )}
          <SimpleConnectButton />
        </div>
      </motion.header>
    </>
  )
}
