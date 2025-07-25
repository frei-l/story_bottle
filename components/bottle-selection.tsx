"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface BottleSelectionProps {
  onSelect: (bottleType: string) => void
}

export default function BottleSelection({ onSelect }: BottleSelectionProps) {
  const [selectedBottle, setSelectedBottle] = useState<string | null>(null)
  const [spheres, setSpheres] = useState<
    Array<{ id: number; x: number; y: number; size: number; color: string; delay: number }>
  >([])

  const bottles = [
    { id: "romantic", label: "#Romantic", color: "#FF6F61" },
    { id: "memory", label: "#Memory", color: "#FFD166" },
    { id: "fun", label: "#Fun", color: "#6FFFB0" },
  ]

  useEffect(() => {
    // Generate random gray spheres for background
    const newSpheres = []

    // Generate 15-20 gray spheres
    for (let i = 0; i < Math.floor(Math.random() * 6) + 15; i++) {
      newSpheres.push({
        id: i,
        x: Math.random() * 80 - 40,
        y: Math.random() * 120 - 60,
        size: Math.random() * 8 + 5,
        color: `rgba(200, 200, 200, ${Math.random() * 0.3 + 0.1})`,
        delay: Math.random() * 2,
      })
    }

    setSpheres(newSpheres)
  }, [])

  const handleSelect = (bottleId: string) => {
    setSelectedBottle(bottleId)

    // Simulate cork pop animation and then navigate
    setTimeout(() => {
      onSelect(bottleId)
    }, 1000)
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden">
      {/* Warm gradient background with collage texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8e9d6] to-[#ffd9c0]"></div>

      {/* Collage texture overlay */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=400')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      {/* Light leaks */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#FF6F61] opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#FFD166] opacity-20 blur-3xl"></div>

      <div className="relative w-full h-full flex flex-col items-center justify-center px-6">
        <h2 className="text-2xl font-medium text-neutral-800 mb-8">Choose a story</h2>

        {/* Bottle with spheres */}
        <div className="relative w-48 h-72 mb-8">
          {/* Bottle glow */}
          <div className="absolute inset-0 bg-white/30 rounded-full blur-3xl"></div>

          {/* Glass bottle */}
          <div className="w-48 h-72 rounded-3xl overflow-hidden relative">
            {/* Glass texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-sm border border-white/30 shadow-lg rounded-3xl z-10"></div>

            {/* Bottle neck */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-16 bg-gradient-to-b from-white/30 to-white/10 rounded-t-xl z-20"></div>
            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-8 h-4 bg-gradient-to-b from-white/30 to-white/10 rounded-full z-20"></div>

            {/* Bottle interior */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden">
              {/* Background gray spheres */}
              {spheres.map((sphere) => (
                <motion.div
                  key={sphere.id}
                  className="absolute rounded-full"
                  style={{
                    width: `${sphere.size}px`,
                    height: `${sphere.size}px`,
                    backgroundColor: sphere.color,
                    left: `calc(50% + ${sphere.x}px)`,
                    top: `calc(50% + ${sphere.y}px)`,
                  }}
                  animate={{
                    opacity: [0.5, 0.3, 0.5],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 3 + sphere.delay,
                    ease: "easeInOut",
                    delay: sphere.delay,
                  }}
                />
              ))}

              {/* Colorful spheres near the neck */}
              {bottles.map((bottle, index) => (
                <motion.div
                  key={`sphere-${bottle.id}`}
                  className="absolute rounded-full cursor-pointer"
                  style={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: bottle.color,
                    boxShadow: `0 0 15px ${bottle.color}`,
                    left: `calc(50% + ${(index - 1) * 20}px)`,
                    top: "25%",
                  }}
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2 + index * 0.5,
                    ease: "easeInOut",
                  }}
                  onClick={() => handleSelect(bottle.id)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {selectedBottle === bottle.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 2, 0] }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: bottle.color }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sphere labels */}
        <div className="flex justify-between w-full max-w-xs mb-8">
          {bottles.map((bottle, index) => (
            <motion.div
              key={bottle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex flex-col items-center"
              onClick={() => handleSelect(bottle.id)}
            >
              <span className="text-sm font-caveat text-lg" style={{ color: bottle.color }}>
                {bottle.label}
              </span>
            </motion.div>
          ))}
        </div>

        <p className="text-neutral-700 font-light text-center font-caveat text-lg">Tap a sphere to reveal your story</p>
      </div>
    </div>
  )
}
