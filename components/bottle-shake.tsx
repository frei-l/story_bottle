"use client"

import { useBallStore, type BallState, type Sphere } from "@/lib/ball-store"
import { motion } from "framer-motion"
import { useEffect } from "react"
import Image from "next/image"


export default function BottleShake() {
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
    for (let i = 3; i < 60; i++) {
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

    // 为每个彩色小球附近生成3个灰色小球
    for (let colorId = 0; colorId < 3; colorId++) {
      const coloredBall = newSpheres[colorId]
      for (let j = 0; j < 2; j++) {
        const nearbyGrayId = 60 + colorId * 2 + j
        // 在彩色小球附近随机生成位置
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * 30 + 10 // 距离彩色小球30-90像素
        const nearbyX = coloredBall.x + Math.cos(angle) * distance
        const nearbyY = coloredBall.y + Math.sin(angle) * distance

        newSpheres.push({
          id: nearbyGrayId,
          x: nearbyX,
          y: nearbyY,
          size: Math.random() * 20 + 25, // 稍小一些，25-45
          color: `rgba(200, 200, 200, ${Math.random() * 0.4 + 0.1})`,
          delay: Math.random() * 2,
        })
      }
    }

    setSpheres(newSpheres)
    setBallStates(newBallStates)
  }, [setSpheres, setBallStates])


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
                delay: ballState.startDelay + 3.5, // 瓶子摇动1秒 + 移动到瓶口2.5秒后出现
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
      <div className="absolute inset-0 bg-white"></div>

      {/* 背景虚化效果 - 当小球激活时显示 */}
      {ballsActivated && (
        <motion.div
          className="absolute inset-0 backdrop-blur-sm z-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2.5 }}
        />
      )}

      {/* Film grain texture overlay */}
      {/* <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=400')] opacity-20 mix-blend-overlay pointer-events-none"></div> */}

      {/* Light leaks */}
      {/* <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#FF6F61] opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#FFD166] opacity-20 blur-3xl"></div> */}

      {/* 屏幕中央的球（固定定位） */}
      {getCenterBalls()}

      {/* App title */}
      {/* <div className="absolute top-12 left-0 right-0 text-center">
        <h1 className="text-3xl font-medium text-neutral-800">Story Bottle</h1>
      </div> */}

      <div className="relative flex flex-col items-center justify-center h-full w-full px-6">
        <motion.div
          transition={{ duration: 0.5 }}
          className="relative mb-12 cursor-pointer"
          onClick={activateBalls}
        >
          {/* Bottle container */}
          <div className="relative w-96 h-[576px]">
            {/* Bottle glow */}
            <div className="absolute inset-0 bg-white/30 rounded-full blur-3xl"></div>


            <motion.div
              className="relative w-96 h-[576px]"
              animate={
                ballsActivated
                  ? {
                    y: [0, -36, 36, -36, 36, -18, 18, 0], // 瓶身摇动幅度调整为更大尺寸
                  }: {}
              }
              transition={
                ballsActivated
                  ? {
                    duration: 1, // 摇动持续1秒
                    ease: "easeInOut",
                  }
                  : {}
              }
            >
              {/* Bottle image */}
              <Image
                src="/bottle.png"
                alt="Story Bottle"
                width={1000}
                height={1000}
                className="object-contain relative z-10"
              />
              {/* Bottle interior for spheres */}
              <div className="absolute inset-0 w-96 h-[576px] overflow-hidden">
                <div className="absolute inset-4 rounded-3xl overflow-hidden">
                  {/* 彩色小球和附近的灰色小球渲染在瓶子内 */}
                  {spheres.map((sphere) => {
                    const isColoredBall = sphere.id < 3
                    const isNearbyGrayBall = sphere.id >= 60 && sphere.id < 69 // 每个彩色小球附近的3个灰色小球

                    if (isColoredBall) {
                      const ballState = ballStates.find(b => b.id === sphere.id)
                      // 彩色小球的z-index: 20-35 范围内，基于id分配
                      const coloredBallZIndex = 1

                      // 如果球已激活，显示移动到瓶口的动画
                      if (ballsActivated && ballState?.stage === 'activated') {
                        return (
                          <motion.div
                            key={sphere.id}
                            className="absolute rounded-full"
                            style={{
                              width: `${sphere.size}px`,
                              height: `${sphere.size}px`,
                              backgroundColor: sphere.color,
                              boxShadow: `0 0 15px ${sphere.color}`,
                              left: `calc(50% + ${sphere.x}px)`,
                              top: `calc(50% + ${sphere.y}px)`,
                              zIndex: coloredBallZIndex,
                            }}
                            animate={{
                              x: 0,
                              y: -450, // 移动到瓶口（调整为更大瓶子的距离）
                              scale: 0.8,
                              opacity: 0, // 逐渐消失
                            }}
                            transition={{
                              duration: 2.5,
                              delay: ballState.startDelay + 1, // 瓶子摇动1秒后开始移动
                            }}
                          />
                        )
                      } else {
                        // 未激活状态：显示浮动动画
                        return (
                          <motion.div
                            key={sphere.id}
                            className="absolute rounded-full"
                            style={{
                              width: `${sphere.size}px`,
                              height: `${sphere.size}px`,
                              backgroundColor: sphere.color,
                              boxShadow: `0 0 15px ${sphere.color}`,
                              left: `calc(50% + ${sphere.x}px)`,
                              top: `calc(50% + ${sphere.y}px)`,
                              zIndex: coloredBallZIndex,
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
                    } else if (isNearbyGrayBall) {
                      // 渲染彩色小球附近的灰色小球
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
                            zIndex: 1, // 与彩色小球同层
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
                  {/* Floating gray spheres */}
                  {spheres.map((sphere) => {
                    const isColoredBall = sphere.id < 3
                    if (!isColoredBall) {
                      // 灰色小球的z-index: 10-30 范围内，基于id和位置创建层次感
                      const grayBallZIndex = 15 + (sphere.id % 20) + Math.floor(sphere.y / 20)

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
                            zIndex: grayBallZIndex,
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
        </div>
      </div>
    </div>
  )
}
