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
    const newBallStates: BallState[] = []

    // Generate 3 yellow star spheres
    for (let i = 0; i < 3; i++) {
      newSpheres.push({
        id: i,
        x: Math.random() * 80 - 65,
        y: Math.random() * 180 - 80,
        size: 90,
        color: "yellow", // 简化为标识用
        delay: Math.random() * 2,
      })

      // 初始化彩色小球状态
      newBallStates.push({
        id: i,
        stage: 'floating',
        startDelay: i * 0.5, // 每个球延迟0.5秒
      })
    }

    // Generate gray star spheres with more even distribution
    for (let i = 3; i < 9; i++) {
      // Use a 4x3 grid layout for better distribution
      const gridCols = 3
      const gridRows = 3
      const gridX = Math.floor((i - 3) / gridCols) // Create 4 columns
      const gridY = (i - 3) % gridCols // Create 3 rows

      // Add controlled randomness within each grid cell
      const xOffset = (Math.random() - 0.5) * 25 // 控制随机偏移
      const yOffset = (Math.random() - 0.5) * 25

      newSpheres.push({
        id: i,
        x: (gridX * 60 - 90) + xOffset, // 增加网格间距
        y: (gridY * 100 - 100) + yOffset, // 增加垂直间距
        size: 90,
        color: "gray", // 简化为标识用
        delay: Math.random() * 2,
      })
    }



    setSpheres(newSpheres)
    setBallStates(newBallStates)
  }, [setSpheres, setBallStates])


  // 获取屏幕中央的球（使用固定定位）
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
              className="fixed z-50"
              style={{
                width: `${sphere.size}px`,
                height: `${sphere.size}px`,
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
            >
              <Image
                src="/star-yellow.png"
                alt="Yellow Star"
                width={sphere.size}
                height={sphere.size}
                className="object-contain"
              />
            </motion.div>
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

      {/* 屏幕中央的球（固定定位） */}
      {getCenterBalls()}

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
                  } : {}
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
                  {/* 星星渲染在瓶子内 */}
                  {spheres.map((sphere) => {
                    const isColoredBall = sphere.id < 3

                    if (isColoredBall) {
                      const ballState = ballStates.find(b => b.id === sphere.id)
                      // 彩色小球的z-index: 20-35 范围内，基于id分配
                      const coloredBallZIndex = 1

                      // 如果球已激活，显示移动到瓶口的动画
                      if (ballsActivated && ballState?.stage === 'activated') {
                        return (
                          <motion.div
                            key={sphere.id}
                            className="absolute"
                            style={{
                              width: `${sphere.size}px`,
                              height: `${sphere.size}px`,
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
                          >
                            <Image
                              src="/star-yellow.png"
                              alt="Yellow Star"
                              width={sphere.size}
                              height={sphere.size}
                              className="object-contain"
                            />
                          </motion.div>
                        )
                      } else {
                        // 未激活状态：显示浮动动画
                        return (
                          <motion.div
                            key={sphere.id}
                            className="absolute"
                            style={{
                              width: `${sphere.size}px`,
                              height: `${sphere.size}px`,
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
                          >
                            <Image
                              src="/star-yellow.png"
                              alt="Yellow Star"
                              width={sphere.size}
                              height={sphere.size}
                              className="object-contain"
                            />
                          </motion.div>
                        )
                      }
                    }
                  })}
                  {/* Floating gray stars */}
                  {spheres.map((sphere) => {
                    const isColoredBall = sphere.id < 3
                    if (!isColoredBall) {
                      // 灰色小球的z-index: 10-30 范围内，基于id和位置创建层次感
                      const grayBallZIndex = 15 + (sphere.id % 20) + Math.floor(sphere.y / 20)

                      return (
                        <motion.div
                          key={sphere.id}
                          className="absolute"
                          style={{
                            width: `${sphere.size}px`,
                            height: `${sphere.size}px`,
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
                        >
                          <Image
                            src="/star-grey.png"
                            alt="Grey Star"
                            width={sphere.size}
                            height={sphere.size}
                            className="object-contain"
                          />
                        </motion.div>
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
