"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useBallStore, type Sphere, type BallState } from "@/lib/ball-store"
import { useBallAnimation } from "@/hooks/use-ball-animation"

interface BottleShakeProps {
  onShake: () => void
}

export default function BottleShake({ onShake }: BottleShakeProps) {
  const [isShaking, setIsShaking] = useState(false)
  
  // 使用 zustand store
  const {
    spheres,
    ballsActivated,
    ballStates,
    setSpheres,
    setBallStates,
    activateBalls,
    resetBalls
  } = useBallStore()

  // 使用动画 hook
  const { getColoredBallAnimation } = useBallAnimation()

  useEffect(() => {
    // Generate random spheres
    const newSpheres: Sphere[] = []
    const colors = ["#FF6F61", "#FFD166", "#6FFFB0"]
    const newBallStates: BallState[] = []

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
      
      // 初始化彩色小球状态
      newBallStates.push({
        id: i,
        stage: 'floating',
        startDelay: i * 0.5, // 每个球延迟0.5秒
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
    setBallStates(newBallStates)
  }, [setSpheres, setBallStates])

  // Simulate shake detection with a button for demo purposes
  const handleShakeButton = () => {
    setIsShaking(true)
    setTimeout(() => {
      setIsShaking(false)
      onShake()
    }, 1500)
  }

  // 获取屏幕中央的彩色球（使用固定定位）
  const getCenterBalls = () => {
    return spheres
      .filter(sphere => sphere.id < 3)
      .map(sphere => {
        const ballState = ballStates.find(b => b.id === sphere.id)
        if (ballState?.stage === 'activated') {
          const centerX = (sphere.id - 1) * 120 // -120, 0, 120
          return (
            <motion.div
              key={`center-${sphere.id}`}
              className="fixed rounded-full z-50"
              style={{
                width: `${sphere.size}px`,
                height: `${sphere.size}px`,
                backgroundColor: sphere.color,
                boxShadow: `0 0 20px ${sphere.color}`,
                left: '50%',
                top: '50%',
              }}
              initial={{
                x: -sphere.size / 2,
                y: -sphere.size / 2,
                scale: 0,
                opacity: 0,
              }}
              animate={{
                x: centerX - sphere.size / 2,
                y: -sphere.size / 2,
                scale: 1.3,
                opacity: 1,
              }}
              transition={{
                duration: 1,
                delay: ballState.startDelay + 2.5, // 在球到达瓶口后出现
                ease: "easeOut",
              }}
            />
          )
        }
        return null
      })
      .filter(Boolean)
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden">
      {/* Warm gradient background with film grain */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8e9d6] to-[#ffd9c0]"></div>

      {/* 背景虚化效果 - 当小球激活时显示 */}
      {ballsActivated && (
        <motion.div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm z-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2.5 }}
        />
      )}

      {/* Film grain texture overlay */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=400')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      {/* Light leaks */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#FF6F61] opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#FFD166] opacity-20 blur-3xl"></div>

      {/* 屏幕中央的球（固定定位） */}
      {getCenterBalls()}

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

            {/* 彩色小球渲染在瓶子内，只在未到达中央时显示 */}
            {spheres.map((sphere) => {
              const isColoredBall = sphere.id < 3
              if (isColoredBall) {
                const ballState = ballStates.find(b => b.id === sphere.id)
                
                // 如果球已激活，显示移动到瓶口的动画
                if (ballsActivated && ballState?.stage === 'activated') {
                  return (
                    <motion.div
                      key={sphere.id}
                      className="absolute rounded-full z-30"
                      style={{
                        width: `${sphere.size}px`,
                        height: `${sphere.size}px`,
                        backgroundColor: sphere.color,
                        boxShadow: `0 0 15px ${sphere.color}`,
                        left: `calc(50% + ${sphere.x}px)`,
                        top: `calc(50% + ${sphere.y}px)`,
                      }}
                      animate={{
                        x: 0,
                        y: -300, // 移动到瓶口
                        scale: 0.8,
                        opacity: 0, // 逐渐消失
                      }}
                      transition={{
                        duration: 2.5,
                        delay: ballState.startDelay,
                      }}
                    />
                  )
                } else {
                  // 未激活状态：显示浮动动画
                  return (
                    <motion.div
                      key={sphere.id}
                      className="absolute rounded-full z-30"
                      style={{
                        width: `${sphere.size}px`,
                        height: `${sphere.size}px`,
                        backgroundColor: sphere.color,
                        boxShadow: `0 0 15px ${sphere.color}`,
                        left: `calc(50% + ${sphere.x}px)`,
                        top: `calc(50% + ${sphere.y}px)`,
                      }}
                      animate={{
                        x: [0, 10, -5, 8, 0],
                        y: [0, -8, 12, -5, 0],
                        scale: [1, 1.05, 0.95, 1.02, 1],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 10 + sphere.delay,
                        delay: sphere.delay,
                      }}
                    />
                  )
                }
              }
            })}

            <motion.div
              className="relative w-48 h-72"
              animate={{ y: [0, -5, 0] }}
              transition={{
                repeat: Infinity,
                duration: 3,
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
                  {/* Floating gray spheres */}
                  {spheres.map((sphere) => {
                    const isColoredBall = sphere.id < 3
                    if (!isColoredBall) {
                      // 灰色小球保持原有动画
                      return (
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
                            x: [0, 10, -5, 8, 0],
                            y: [0, -8, 12, -5, 0],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 10 + sphere.delay,
                            delay: sphere.delay,
                          }}
                        />
                      )
                    }
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="text-center space-y-6 relative z-10">
          <p className="text-neutral-700 font-light text-lg font-caveat">Shake to wake the stories</p>

          {/* 激活彩色小球按钮 */}
          <button
            onClick={activateBalls}
            disabled={ballsActivated}
            className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-md text-neutral-800 px-8 py-3 rounded-full hover:bg-white/30 transition-colors disabled:opacity-50 border border-white/30 shadow-lg mr-4"
          >
            <span>Activate Balls</span>
          </button>

          {/* 重置按钮 */}
          <button
            onClick={resetBalls}
            className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-md text-neutral-800 px-8 py-3 rounded-full hover:bg-white/30 transition-colors border border-white/30 shadow-lg"
          >
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  )
}
