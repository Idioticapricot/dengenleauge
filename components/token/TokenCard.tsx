"use client"

import { motion } from "framer-motion"


interface TokenCardProps {
  symbol: string
  logo: string
  price: number
  change: number
  points: number
  selected?: boolean
  onClick?: () => void
}

export function TokenCard({ symbol, logo, price, change, points, selected, onClick }: TokenCardProps) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === 'Enter' || event.key === ' ') && onClick) {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        x: 2,
        y: 2,
        backgroundColor: "#79F7FF",
        borderColor: "#9dfc7c"
      }}
      whileTap={{
        scale: 1.01,
        x: 1,
        y: 1,
        boxShadow: "1px 1px 0px 0px #000"
      }}
      className={`bg-white border-4 border-black p-5 cursor-pointer transition-all duration-100 font-mono shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] md:p-4 md:border-3 md:shadow-[3px_3px_0px_0px_#000] md:hover:shadow-[1px_1px_0px_0px_#000] sm:p-3 sm:border-2 sm:shadow-[2px_2px_0px_0px_#000] sm:hover:shadow-none ${selected ? 'bg-[#FFE500] shadow-[6px_6px_0px_0px_#000] md:shadow-[4px_4px_0px_0px_#000] sm:shadow-[3px_3px_0px_0px_#000]' : ''}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Token ${symbol}: Price $${price.toFixed(4)}, Change ${change >= 0 ? '+' : ''}${change.toFixed(2)}%, Points ${points}`}
      aria-pressed={selected}
    >
      <motion.div
        whileHover={{
          scale: 1.1,
          rotate: 5,
          backgroundColor: "#9dfc7c",
          boxShadow: "3px 3px 0px 0px #000"
        }}
        className="w-12 h-12 bg-[#fa8cef] border-3 border-black flex items-center justify-center text-2xl font-black mx-auto mb-3 shadow-[2px_2px_0px_0px_#000] transition-all duration-200 md:w-10 md:h-10 md:text-xl md:mb-2.5 md:border-2 md:shadow-[1px_1px_0px_0px_#000] sm:w-8 sm:h-8 sm:text-base sm:mb-2 sm:border-1"
        aria-label={`${symbol} logo`}
      >
        {logo}
      </motion.div>
      <h3 className="font-mono font-black text-lg text-black mb-1 text-center uppercase tracking-wider md:text-base md:mb-0.5 md:tracking-wide sm:text-sm sm:tracking-normal">
        {symbol}
      </h3>
      <p className="font-mono text-sm text-black mb-1 text-center font-black md:text-xs md:mb-0.5 sm:text-xs sm:mb-0.5" aria-label={`Price: $${price.toFixed(4)}`}>
        ${price.toFixed(4)}
      </p>
      <motion.p
        whileHover={{
          scale: 1.05,
          boxShadow: "2px 2px 0px 0px #000",
          backgroundColor: change >= 0 ? "#79F7FF" : "#fa8cef"
        }}
        className={`font-mono text-xs font-black text-black text-center mb-2 py-1 px-2 border-2 border-black uppercase tracking-wide inline-block w-full box-border transition-all duration-200 cursor-pointer md:text-[11px] md:mb-1.5 md:py-0.5 md:px-1.5 md:border-1 sm:text-[10px] sm:mb-1 sm:py-0.5 sm:px-1 ${change >= 0 ? 'bg-[#9dfc7c]' : 'bg-[#fa7a7a]'}`}
        aria-label={`Price change: ${change >= 0 ? '+' : ''}${change.toFixed(2)}%`}
      >
        {change >= 0 ? "+" : ""}
        {change.toFixed(2)}%
      </motion.p>
      <motion.p
        whileHover={{
          y: -2,
          boxShadow: "2px 4px 0px 0px #000",
          backgroundColor: "#fa8cef"
        }}
        className="font-mono text-sm font-black text-black text-center bg-[#918efa] py-1.5 px-3 border-2 border-black uppercase tracking-wider m-0 transition-all duration-200 cursor-pointer md:text-xs md:py-1 md:px-2.5 md:border-1 sm:text-xs sm:py-1 sm:px-2"
        aria-label={`Points: ${points}`}
      >
        {points} pts
      </motion.p>
    </motion.div>
  )
}
