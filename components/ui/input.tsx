import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<
  React.ElementRef<"input">,
  React.ComponentPropsWithoutRef<"input">
>(({ className, type, ...props }, ref) => {
  const [isFocused, setIsFocused] = React.useState(false)

  return (
    <motion.div
      animate={{
        x: isFocused ? 1 : 0,
        y: isFocused ? 1 : 0,
        boxShadow: isFocused
          ? "1px 1px 0px 0px #000"
          : "6px 6px 0px 0px #000"
      }}
      transition={{ duration: 0.1 }}
      className="relative"
    >
      <input
        type={type}
        ref={ref}
        data-slot="input"
        className={cn(
          "file:text-black placeholder:text-gray-500 selection:bg-[#FFE500] selection:text-black border-black flex h-12 w-full min-w-0 border-4 bg-white px-4 py-3 text-base font-mono font-black shadow-[6px_6px_0px_0px_#000] transition-all duration-100 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-bold disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus:bg-[#FFE500] focus:shadow-none",
          "aria-invalid:border-[#fa7a7a] aria-invalid:bg-[#fa7a7a]/20",
          className
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {/* Focus ring animation */}
      <motion.div
        className="absolute inset-0 border-4 border-[#FFE500] pointer-events-none"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: isFocused ? 1 : 0,
          scale: isFocused ? 1 : 0.95
        }}
        transition={{ duration: 0.15 }}
      />
    </motion.div>
  )
})
Input.displayName = "Input"

export { Input }
