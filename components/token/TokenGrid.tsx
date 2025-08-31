"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TokenCard } from "./TokenCard"

interface VestigeToken {
  id: number
  ticker: string
  name: string
  price: number
  price1d: number
  image: string
  rank: number
}

export function TokenGrid() {
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])
  const [tokens, setTokens] = useState<VestigeToken[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(
          "https://api.vestigelabs.org/assets/list?network_id=0&exclude_labels=8,7&denominating_asset_id=31566704&limit=20&offset=0&order_by=rank&order_dir=asc",
        )
        const data = await response.json()

        // Filter out ALGO and take first 5 tokens
        const filteredTokens = data.results.filter((token: VestigeToken) => token.ticker !== "ALGO").slice(0, 5)

        setTokens(filteredTokens)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch tokens:", error)
        setLoading(false)
      }
    }

    fetchTokens()
  }, [])

  const handleTokenSelect = (symbol: string) => {
    if (selectedTokens.includes(symbol)) {
      setSelectedTokens(selectedTokens.filter((s) => s !== symbol))
    } else if (selectedTokens.length < 5) {
      setSelectedTokens([...selectedTokens, symbol])
    }
  }

  const calculateChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.h2
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="font-bold text-xl text-white mb-4"
        >
          Loading Tokens...
        </motion.h2>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="font-bold text-xl text-white mb-4 text-center"
      >
        Select Your Squad ({selectedTokens.length}/5)
      </motion.h2>
      <motion.div
        className="grid grid-cols-2 gap-3 mb-5"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {tokens.map((token, index) => {
          const change = calculateChange(token.price, token.price1d)
          return (
            <motion.div
              key={token.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.3 }}
              className={index === 4 ? "col-span-2 max-w-[200px] mx-auto" : ""}
            >
              <TokenCard
                symbol={token.ticker}
                logo={token.image}
                price={token.price}
                change={change}
                points={Math.floor(Math.random() * 1000) + 100} // Mock points for now
                selected={selectedTokens.includes(token.ticker)}
                onClick={() => handleTokenSelect(token.ticker)}
              />
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
