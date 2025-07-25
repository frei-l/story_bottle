"use client"

import { Button } from "@/components/ui/button"
import { Toast } from "@/components/ui/toast"
import { motion } from "framer-motion"
import { Check, Share2 } from "lucide-react"
import { useEffect, useState } from "react"

interface MapFeedbackProps {
  bottleType: string | null
  onContinue: () => void
}

export default function MapFeedback({ bottleType, onContinue }: MapFeedbackProps) {
  const [showToast, setShowToast] = useState(false)
  const [revealComplete, setRevealComplete] = useState(false)

  const getColor = () => {
    switch (bottleType) {
      case "romantic":
        return "#FF6F61"
      case "memory":
        return "#FFD166"
      case "fun":
        return "#6FFFB0"
      default:
        return "#6FFFB0"
    }
  }

  const getStoryText = () => {
    switch (bottleType) {
      case "romantic":
        return "The old café where time stood still, and so did we."
      case "memory":
        return "Echoes of laughter still bounce off these walls."
      case "fun":
        return "That spontaneous dance party under the city lights!"
      default:
        return "A new memory has been created here."
    }
  }

  useEffect(() => {
    // Show toast after map reveal animation
    setTimeout(() => {
      setShowToast(true)
    }, 2000)

    setTimeout(() => {
      setRevealComplete(true)
    }, 1500)
  }, [])

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden">
      {/* Map background */}
      <div className="relative w-full h-full">
        {/* Grayscale map base with film grain */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=400')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=400')] opacity-30 mix-blend-overlay"></div>

        {/* Vignette effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20"></div>

        {/* Color reveal overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=400')] bg-cover bg-center"
          style={{ clipPath: "circle(30% at center)" }}
        ></motion.div>

        {/* Artistic brushstroke */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div
            className="w-64 h-32 rounded-full blur-sm opacity-70 transform rotate-45"
            style={{ backgroundColor: getColor() }}
          ></div>
        </motion.div>

        {/* Location pin with glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-6 h-6 bg-white rounded-full border-4 border-neutral-800 shadow-lg relative">
            <div
              className="absolute inset-0 rounded-full blur-lg -z-10"
              style={{ backgroundColor: getColor(), opacity: 0.7 }}
            ></div>
          </div>
        </div>

        {/* Story text with collage aesthetic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute top-[60%] left-1/2 -translate-x-1/2 w-64 text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-white/50 rotate-1">
            <p className="font-caveat text-xl text-neutral-800">{getStoryText()}</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom actions */}
      {revealComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-24 left-0 right-0 flex justify-center gap-4 px-6"
        >
          <Button
            variant="outline"
            className="bg-white/30 backdrop-blur-sm border border-white/50 text-neutral-800"
            onClick={onContinue}
          >
            Continue
          </Button>
          <Button className="bg-white/20 backdrop-blur-sm border border-white/50 text-neutral-800 hover:bg-white/30">
            <Share2 size={16} className="mr-2" />
            Share
          </Button>
        </motion.div>
      )}

      {/* Toast notification */}
      {showToast && (
        <Toast
          title="You've left your mark here"
          description="Your story has been added to your footprints"
          icon={<Check className="h-4 w-4" />}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  )
}
