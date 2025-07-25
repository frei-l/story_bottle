"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import BottleShake from "@/components/bottle-shake"
import BottleSelection from "@/components/bottle-selection"
import MapFeedback from "@/components/map-feedback"
import FootprintsPage from "@/components/footprints-page"
import Navigation from "@/components/navigation"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"home" | "selection" | "map" | "footprints">("home")
  const [selectedBottle, setSelectedBottle] = useState<string | null>(null)

  const handleShake = () => {
    // Simulate shake detection
    setCurrentScreen("selection")
  }

  const handleBottleSelect = (bottleType: string) => {
    setSelectedBottle(bottleType)
    setCurrentScreen("map")
  }

  const handleNavigate = (screen: "home" | "selection" | "map" | "footprints") => {
    setCurrentScreen(screen)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="relative w-full max-w-md h-[100dvh] overflow-hidden">
        <AnimatePresence mode="wait">
          {currentScreen === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <BottleShake onShake={handleShake} />
            </motion.div>
          )}

          {currentScreen === "selection" && (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <BottleSelection onSelect={handleBottleSelect} />
            </motion.div>
          )}

          {currentScreen === "map" && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <MapFeedback bottleType={selectedBottle} onContinue={() => handleNavigate("home")} />
            </motion.div>
          )}

          {currentScreen === "footprints" && (
            <motion.div
              key="footprints"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <FootprintsPage />
            </motion.div>
          )}
        </AnimatePresence>

        <Navigation currentScreen={currentScreen} onNavigate={handleNavigate} />
      </div>
    </main>
  )
}
