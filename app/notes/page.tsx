"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import notesData from "@/components/notes-data"

export default function NextPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isAnimated, setIsAnimated] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [likeActive, setLikeActive] = useState(false)
  const [saveActive, setSaveActive] = useState(false)
  const [dislikeActive, setDislikeActive] = useState(false)
  
  // 获取URL中的index参数
  const noteIndex = searchParams.get('index') ? parseInt(searchParams.get('index')!) : 0
  const note = notesData[noteIndex] || notesData[0] // 默认显示第一个笔记

  useEffect(() => {
    setTimeout(() => {
      setIsAnimated(true)
    }, 1000)
    
    // Show button after the paper animation is complete
    setTimeout(() => {
      setShowButton(true)
    }, 2200) // 1000ms delay + 1200ms animation duration
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

  const handleGoHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{
      background: 'radial-gradient(circle at center, #E6B800 0%, #F4C430 30%, #F2D98D 70%, #F5E6D3 100%)'
    }}>
      {/* Greeting star in top-right corner */}
      <div className="absolute top-0 right-0 z-10">
        <Image
          src="/greeting_star.png"
          alt="Greeting Star"
          width={120}
          height={120}
          className="object-contain"
        />
      </div>

      {/* Text in top-right area, slightly to the left */}
      <div className="absolute top-9 right-20 z-10 text-right text-white">
        <div className="text-sm font-medium leading-tight">你已经收集了</div>
        <div className="text-sm font-medium leading-tight">5个故事～</div>
      </div>

      <motion.div
        className="absolute left-0 right-0 bg-yellow-50 shadow-2xl"
        style={{
          borderTopLeftRadius: "24px",
          borderTopRightRadius: "24px",
        }}
        initial={{
          bottom: "-100%",
          height: "85%",
        }}
        animate={{
          bottom: isAnimated ? "0%" : "-100%",
          height: "85%",
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
              <div className="text-gray-800 text-base leading-relaxed mb-1">{note.date} {note.weekday}</div>
              <div className="text-gray-700 text-xs mb-1">{note.author}</div>
              <div className="text-gray-700 text-xs mb-4">{note.location}</div>
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

          {/* Note content */}
          <div className="px-4 mt-6">
            <div className="text-gray-800 text-md leading-relaxed whitespace-pre-wrap">
              {note.content}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom button */}
      <motion.div 
        className="absolute bottom-8 left-0 right-0 flex justify-center z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: showButton ? 1 : 0, 
          y: showButton ? 0 : 20 
        }}
        transition={{ 
          duration: 0.6, 
          ease: "easeOut" 
        }}
      >
        <button
          onClick={handleGoHome}
          className="px-8 py-3 bg-yellow-400 text-gray-800 text-sm font-medium rounded-full shadow-lg hover:bg-yellow-500 transition-colors duration-200 active:scale-95 transform"
        >
          点亮我的街道地图
        </button>
      </motion.div>
    </div>
  )
}