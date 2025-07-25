"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function NextPage() {
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsAnimated(true)
    }, 1000)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'radial-gradient(circle at center, #E6B800 0%, #F4C430 30%, #F2D98D 70%, #F5E6D3 100%)'
    }}>
       <motion.div
        className="absolute left-0 right-0 bg-yellow-50 shadow-2xl"
        style={{
          borderTopLeftRadius: "24px",
          borderTopRightRadius: "24px",
        }}
        initial={{
          bottom: "-100%",
          height: "90%",
        }}
        animate={{
          bottom: isAnimated ? "0%" : "-100%",
          height: "90%",
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: 1.2,
        }}
      >
        {/* Paper content */}
        <div className="p-8 pt-12">
          <div className="text-gray-700 text-sm mb-4">2025/07/25 周五</div>
          <div className="text-gray-800 text-base leading-relaxed">翻斗大街翻斗花园xxx</div>

          {/* Additional paper lines for visual effect */}
          <div className="mt-8 space-y-4">
            <div className="h-px bg-yellow-200 w-full"></div>
            <div className="h-px bg-yellow-200 w-full"></div>
            <div className="h-px bg-yellow-200 w-full"></div>
            <div className="h-px bg-yellow-200 w-full"></div>
            <div className="h-px bg-yellow-200 w-full"></div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}