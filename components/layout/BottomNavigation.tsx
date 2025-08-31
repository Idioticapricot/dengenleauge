"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Users, Calendar, Trophy, User, Swords, BarChart3, Zap, DollarSign } from "lucide-react"
import { useSwipe } from "../../hooks/useSwipe"


const navItems = [
  { href: "/team", icon: Users, label: "Team" },
  { href: "/tournament", icon: Trophy, label: "Tournament" },
  { href: "/battle", icon: Swords, label: "Battle", isBattle: true },
  { href: "/defi", icon: DollarSign, label: "DeFi" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function BottomNavigation() {
  const pathname = usePathname()

  // Add swipe gesture support
  const navRef = useSwipe<HTMLDivElement>({
    onSwipeLeft: () => {
      // Navigate to next item or cycle through navigation
      const currentIndex = navItems.findIndex(item => item.href === pathname)
      const nextIndex = (currentIndex + 1) % navItems.length
      // Could implement navigation logic here
    },
    onSwipeRight: () => {
      // Navigate to previous item
      const currentIndex = navItems.findIndex(item => item.href === pathname)
      const prevIndex = currentIndex === 0 ? navItems.length - 1 : currentIndex - 1
      // Could implement navigation logic here
    }
  })

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[600px] bg-white border-t-4 border-l-4 border-r-4 border-black pb-1 pt-4 px-0 z-[100] font-mono shadow-[-4px_0_20px_rgba(0,0,0,0.1)] backdrop-blur-[10px] md:border-t-3 md:border-l-3 md:border-r-3 md:pb-0.5 md:pt-3 md:max-w-full sm:border-t-2 sm:border-l-2 sm:border-r-2 sm:shadow-[-2px_0_15px_rgba(0,0,0,0.1)]"
    >
      <div className="flex justify-around items-center px-2 sm:px-1">
        {navItems.map(({ href, icon: Icon, label, isBattle }) => {
          const isActive = pathname === href
          const baseClasses = "flex flex-col items-center gap-1 text-decoration-none text-black font-black uppercase relative overflow-hidden min-h-[44px] min-w-[44px] transition-all duration-150 ease-out"
          const paddingClasses = isBattle ? "py-3.5 px-4.5" : "py-2.5 px-3.5"
          const responsivePadding = isBattle
            ? "md:py-2.5 md:px-3 sm:py-2 sm:px-2.5"
            : "md:py-1.5 md:px-2 sm:py-1 sm:px-1.5"

          const backgroundClasses = isBattle && isActive
            ? "bg-[#fa7a7a]"
            : isBattle
            ? "bg-[#FF965B]"
            : isActive
            ? "bg-[#FFE500]"
            : "bg-transparent"

          const borderClasses = isBattle || isActive
            ? "border-4 border-black md:border-3 sm:border-2"
            : "border-4 border-transparent md:border-3 sm:border-2"

          const shadowClasses = isBattle && isActive
            ? "shadow-[6px_6px_0px_0px_#000]"
            : isBattle
            ? "shadow-[3px_3px_0px_0px_#000]"
            : isActive
            ? "shadow-[3px_3px_0px_0px_#000]"
            : "shadow-none"

          const transformClasses = isBattle ? "scale-105" : "scale-100"

          return (
            <motion.div
              key={href}
              whileHover={{
                scale: isBattle ? 1.1 : 1.05,
                x: 1,
                y: 1,
                backgroundColor: isBattle ? "#fa7a7a" : "#9dfc7c"
              }}
              whileTap={{
                scale: isBattle ? 1.1 : 1.02,
                x: 2,
                y: 2,
                boxShadow: isBattle ? "2px 2px 0px 0px #000" : "1px 1px 0px 0px #000"
              }}
              className={`${baseClasses} ${paddingClasses} ${responsivePadding} ${backgroundClasses} ${borderClasses} ${shadowClasses} ${transformClasses} hover:border-black hover:shadow-[3px_3px_0px_0px_#000] md:hover:shadow-[2px_2px_0px_0px_#000] sm:hover:shadow-[1px_1px_0px_0px_#000]`}
            >
              <motion.div
                whileHover={{ rotate: isBattle ? 10 : 5 }}
                className="w-6 h-6 flex items-center justify-center md:w-5 md:h-5 sm:w-4.5 sm:h-4.5"
              >
                <Icon size={isBattle ? 24 : 20} className="md:w-5 md:h-5 sm:w-4.5 sm:h-4.5" />
              </motion.div>
              <span className="text-[10px] font-black font-mono tracking-[0.5px] md:text-[9px] md:tracking-[0.3px] sm:text-[8px] sm:tracking-[0.2px]">
                {label}
              </span>

              {/* Ripple effect on tap */}
              <motion.div
                className="absolute top-1/2 left-1/2 w-0 h-0 bg-white/30 rounded-full -translate-x-1/2 -translate-y-1/2"
                whileTap={{
                  width: "100px",
                  height: "100px",
                  transition: { duration: 0.3 }
                }}
              />
            </motion.div>
          )
        })}
      </div>
    </motion.nav>
  )
}
