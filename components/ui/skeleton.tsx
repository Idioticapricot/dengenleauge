import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <motion.div
      data-slot="skeleton"
      className={cn("bg-gray-300 border-4 border-black shadow-[4px_4px_0px_0px_#000] rounded-none", className)}
      animate={{
        backgroundColor: ["#f3f4f6", "#e5e7eb", "#f3f4f6"],
        scale: [1, 1.02, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={props.style}
      onClick={props.onClick}
    />
  )
}

// Battle-specific skeleton components
function BattleHeaderSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#fa7a7a] border-4 border-black p-5 shadow-[6px_6px_0px_0px_#000] text-center font-mono"
    >
      <Skeleton className="h-8 w-64 mx-auto mb-4" />
      <div className="flex gap-4 justify-center mb-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
      </div>
      <Skeleton className="h-12 w-32 mx-auto" />
    </motion.div>
  )
}

function TeamSectionSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_0px_#000] font-mono"
    >
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <Skeleton className="h-12 w-full" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function BattleChartSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_0px_#000] font-mono"
    >
      <Skeleton className="h-6 w-32 mb-4" />
      <Skeleton className="h-64 w-full" />
    </motion.div>
  )
}

function CoinGridSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_#000] font-mono"
        >
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-8 w-20" />
        </motion.div>
      ))}
    </motion.div>
  )
}

function TokenCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_#000] font-mono"
    >
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="h-10 w-10 rounded-none border-2 border-black" />
        <div className="flex-1">
          <Skeleton className="h-5 w-20 mb-1" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <Skeleton className="h-6 w-24 mb-2" />
      <Skeleton className="h-4 w-32" />
    </motion.div>
  )
}

export {
  Skeleton,
  BattleHeaderSkeleton,
  TeamSectionSkeleton,
  BattleChartSkeleton,
  CoinGridSkeleton,
  TokenCardSkeleton
}
