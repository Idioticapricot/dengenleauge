import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, HTMLMotionProps } from "framer-motion"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold font-mono uppercase tracking-wide transition-all duration-75 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 border-3 border-black shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-1 active:translate-y-1 active:shadow-none",
  {
    variants: {
      variant: {
        default:
          "bg-yellow-300 text-black border-black hover:bg-lime-300",
        destructive:
          "bg-red-300 text-black border-black hover:bg-red-400",
        outline:
          "bg-white text-black border-black hover:bg-yellow-300",
        secondary:
          "bg-cyan-300 text-black border-black hover:bg-cyan-400",
        ghost:
          "bg-transparent border-transparent shadow-none hover:bg-yellow-300 hover:border-black hover:shadow-brutal",
        link: "bg-transparent border-transparent shadow-none text-black underline-offset-4 hover:underline hover:bg-yellow-300",
        success:
          "bg-lime-300 text-black border-black hover:bg-lime-400",
        warning:
          "bg-orange-300 text-black border-black hover:bg-orange-400",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-11 px-4 py-2",
        lg: "h-14 px-8 py-4 text-base",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    "aria-label"?: string
    "aria-describedby"?: string
  }

function Button({
  className,
  variant,
  size,
  asChild = false,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  ...props
}: ButtonProps) {
  const baseClassName = cn(buttonVariants({ variant, size, className }))

  if (asChild) {
    return (
      <Slot
        data-slot="button"
        className={baseClassName}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        {...props}
      />
    )
  }

  return (
    <motion.button
      data-slot="button"
      className={baseClassName}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      whileHover={{
        x: 2,
        y: 2,
        boxShadow: "2px 2px 0px 0px #000000",
        transition: { duration: 0.15, ease: "easeOut" }
      }}
      whileTap={{
        x: 4,
        y: 4,
        boxShadow: "0px 0px 0px 0px #000000",
        transition: { duration: 0.1, ease: "easeOut" }
      }}
      initial={{ x: 0, y: 0 }}
      {...(props as any)}
    />
  )
}

export { Button, buttonVariants }
