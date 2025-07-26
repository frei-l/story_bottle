"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function NextPage() {
  const [isAnimated, setIsAnimated] = useState(false)
  const [likeActive, setLikeActive] = useState(false)
  const [saveActive, setSaveActive] = useState(false)
  const [dislikeActive, setDislikeActive] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsAnimated(true)
    }, 1000)
  }, [])

  const handleLikeClick = () => {
    setLikeActive(!likeActive)
  }

  const handleSaveClick = () => {
    setSaveActive(!saveActive)
  }

  const handleDislikeClick = () => {
    setDislikeActive(!dislikeActive)
  }

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
        <div className="py-4 px-2 relative">
          {/* Header with content on left and action icons on right */}
          <div className="flex justify-between items-start pt-2 px-4">
            {/* Content in left side */}
            <div>
              <div className="text-gray-800 text-base leading-relaxed mb-1"> 2025/07/25 周五</div>
              <div className="text-gray-700 text-xs mb-4">翻斗大街翻斗花园xxx</div>
            </div>

            {/* Action icons in right side */}
            <div className="flex space-x-4 mt-3">
              <button
                onClick={handleLikeClick}
                className="w-6 h-6 transition-transform hover:scale-110 active:scale-95"
              >
                <Image
                  src={likeActive ? "/like-activated.png" : "/like.png"}
                  alt="Like"
                  width={16}
                  height={16}
                  className="w-full h-full object-contain"
                />
              </button>

              <button
                onClick={handleSaveClick}
                className="w-6 h-6 transition-transform hover:scale-110 active:scale-95"
              >
                <Image
                  src={saveActive ? "/save-activated.png" : "/save.png"}
                  alt="Save"
                  width={16}
                  height={16}
                  className="w-full h-full object-contain"
                />
              </button>

              <button
                onClick={handleDislikeClick}
                className="w-6 h-6 transition-transform hover:scale-110 active:scale-95"
              >
                <Image
                  src={dislikeActive ? "/dislike-activated.png" : "/dislike.png"}
                  alt="Dislike"
                  width={16}
                  height={16}
                  className="w-full h-full object-contain"
                />
              </button>
            </div>
          </div>

          {/* Additional paper lines for visual effect */}
          <div className="mt-8 space-y-8">
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