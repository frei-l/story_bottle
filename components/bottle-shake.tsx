"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShuffleIcon as Shake } from "lucide-react"

interface BottleShakeProps {
  onShake: () => void
}

export default function BottleShake({ onShake }: BottleShakeProps) {
  const [isShaking, setIsShaking] = useState(false)
  const [spheres, setSpheres] = useState<
    Array<{ id: number; x: number; y: number; size: number; color: string; delay: number }>
  >([])

  useEffect(() => {
    // Generate random spheres
    const newSpheres = []
    const colors = ["#FF6F61", "#FFD166", "#6FFFB0"]

    // Generate 3 colorful spheres
    for (let i = 0; i < 3; i++) {
      newSpheres.push({
        id: i,
        x: Math.random() * 80 - 65,
        y: Math.random() * 180 - 80,
        size: 40,
        color: colors[i],
        delay: Math.random() * 2,
      })
    }

    // Generate 20-27 gray spheres
    for (let i = 3; i < Math.floor(Math.random() * 8) + 40; i++) {
      // Use grid-based positioning for more even distribution
      const gridX = Math.floor(i / 5) // Create 5 columns
      const gridY = i % 5 // Create 5 rows

      // Add some controlled randomness within each grid cell
      const xOffset = (Math.random() - 0.5) * 15 // Random offset within ±7.5
      const yOffset = (Math.random() - 0.5) * 15

      newSpheres.push({
        id: i,
        x: (gridX * 20 - 100) + xOffset, // Spread across -40 to 40
        y: (gridY * 50 - 100) + yOffset, // Spread across -100 to 100
        size: Math.random() * 20 + 30, // Vary size between 30-50
        color: `rgba(200, 200, 200, ${Math.random() * 0.4 + 0.1})`,
        delay: Math.random() * 2,
      })
    }

    setSpheres(newSpheres)
  }, [])

  // Simulate shake detection with a button for demo purposes
  const handleShakeButton = () => {
    setIsShaking(true)
    setTimeout(() => {
      setIsShaking(false)
      onShake()
    }, 1500)
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden">
      {/* Warm gradient background with film grain */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8e9d6] to-[#ffd9c0]"></div>

      {/* Film grain texture overlay */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=400')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      {/* Light leaks */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#FF6F61] opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#FFD166] opacity-20 blur-3xl"></div>

      {/* App title */}
      {/* <div className="absolute top-12 left-0 right-0 text-center">
        <h1 className="text-3xl font-medium text-neutral-800">Story Bottle</h1>
      </div> */}

      <div className="relative flex flex-col items-center justify-center h-full w-full px-6">
        <motion.div
          animate={
            isShaking
              ? {
                x: [0, -10, 10, -10, 10, -5, 5, 0],
                rotate: [0, -3, 3, -3, 3, -1, 1, 0],
              }
              : {}
          }
          transition={{ duration: 0.5 }}
          className="relative mb-12"
        >
          {/* Bottle container */}
          <div className="relative w-48 h-72">
            {/* Bottle glow */}
            <div className="absolute inset-0 bg-white/30 rounded-full blur-3xl"></div>

            <motion.div
              className="relative w-48 h-72"
              animate={{ y: [0, -5, 0] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 3,
                ease: "easeInOut",
              }}
            >
              {/* Glass bottle */}
              {/* Bottle neck */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-12 h-16 bg-gradient-to-b from-white/30 to-white/10 rounded-t-xl z-20"></div>
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-8 h-4 bg-gradient-to-b from-white/30 to-white/10 rounded-full z-20"></div>
              <div className="w-48 h-72 rounded-3xl overflow-hidden relative">
                {/* Glass texture */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-3xl z-10"></div>
                {/* Bottle interior */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden">
                  {/* Floating spheres */}
                  {spheres.map((sphere) => (
                    <motion.div
                      key={sphere.id}
                      className="absolute rounded-full"
                      style={{
                        width: `${sphere.size}px`,
                        height: `${sphere.size}px`,
                        backgroundColor: sphere.color,
                        boxShadow: sphere.color.startsWith("#") ? `0 0 15px ${sphere.color}` : "none",
                        left: `calc(50% + ${sphere.x}px)`,
                        top: `calc(50% + ${sphere.y}px)`,
                      }}
                      animate={{
                        x: [0, 10, -5, 8, 0],
                        y: [0, -8, 12, -5, 0],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 10 + sphere.delay,
                        ease: "easeInOut",
                        delay: sphere.delay,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="text-center space-y-6 relative z-10">
          <p className="text-neutral-700 font-light text-lg font-caveat">Shake to wake the stories</p>

          {/* Shake button for demo purposes */}
          <button
            onClick={handleShakeButton}
            disabled={isShaking}
            className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-md text-neutral-800 px-8 py-3 rounded-full hover:bg-white/30 transition-colors disabled:opacity-50 border border-white/30 shadow-lg"
          >
            {/* <Shake size={18} className="animate-bounce" /> */}
            <span>Shake Bottle</span>
          </button>
        </div>
      </div>
    </div>
  )
}
