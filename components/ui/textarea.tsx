import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  React.ElementRef<"textarea">,
  React.ComponentPropsWithoutRef<"textarea">
>(({ className, ...props }, ref) => {
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
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
          "placeholder:text-gray-500 border-black bg-white px-4 py-3 text-base font-mono font-black shadow-[6px_6px_0px_0px_#000] border-4 min-h-16 w-full resize-none transition-all duration-100 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
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
Textarea.displayName = "Textarea"

export { Textarea }
