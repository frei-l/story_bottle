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

    // Generate all stars as gray initially
    for (let i = 0; i < 9; i++) {
      if (i < 3) {
        // First 3 stars that will turn yellow
        newSpheres.push({
          id: i,
          x: Math.random() * 80 - 65,
          y: Math.random() * 180 - 80,
          size: 90,
          color: "gray", // All stars start as gray
          delay: Math.random() * 2,
        })

        // 初始化可变色星星状态
        newBallStates.push({
          id: i,
          stage: 'floating',
          startDelay: i * 0.5, // 每个球延迟0.5秒
        })
      } else {
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
          const centerY = (sphere.id) * 150 - 240 // -150, 0, 150 垂直间距
          const leftOffset = -100 // 偏左的位置
          const labels = ["星星1", "星星2", "星星3"]
          
          return (
            <motion.div
              key={`center-${sphere.id}`}
              className="fixed z-50 flex items-center"
              style={{
                left: '50%',
                top: '50%',
              }}
              initial={{
                x: leftOffset,
                y: -400, // 从顶部开始
                opacity: 0,
              }}
              animate={{
                x: leftOffset,
                y: centerY,
                opacity: 1,
              }}
              transition={{
                duration: 1.5,
                delay: ballState.startDelay + 3.5, // 瓶子摇动1秒 + 移动到瓶口2.5秒后出现
                ease: "easeOut",
              }}
            >
              <motion.div
                style={{
                  width: `${sphere.size}px`,
                  height: `${sphere.size}px`,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1.3 }}
                transition={{
                  duration: 0.5,
                  delay: ballState.startDelay + 4, // 稍微延迟缩放效果
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
              <motion.p 
                className="ml-12 text-2xl text-neutral-700 font-light whitespace-nowrap"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  delay: ballState.startDelay + 4.2,
                }}
              >
                {labels[sphere.id]}
              </motion.p>
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
          className="relative mb-12 cursor-pointer"
          onClick={activateBalls}
          animate={ballsActivated ? { opacity: 0 } : { opacity: 1 }}
          transition={ballsActivated ? { duration: 1.5, delay: 3 } : { duration: 0.5 }}
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
                    const isTransformableStar = sphere.id < 3
                    const ballState = ballStates.find(b => b.id === sphere.id)
                    const zIndex = isTransformableStar ? 20 + sphere.id : 15 + (sphere.id % 20) + Math.floor(sphere.y / 20)

                    if (isTransformableStar && ballsActivated && ballState?.stage === 'activated') {
                      // 激活后的星星动画
                      return (
                        <motion.div
                          key={sphere.id}
                          className="absolute"
                          style={{
                            width: `${sphere.size}px`,
                            height: `${sphere.size}px`,
                            left: `calc(50% + ${sphere.x}px)`,
                            top: `calc(50% + ${sphere.y}px)`,
                            zIndex,
                          }}
                          animate={{
                            x: 0,
                            y: -450, // 移动到瓶口
                            scale: 0.8,
                            opacity: 0, // 逐渐消失
                          }}
                          transition={{
                            x: { duration: 2.5, delay: ballState.startDelay + 2 },
                            y: { duration: 2.5, delay: ballState.startDelay + 2 },
                            scale: { duration: 2.5, delay: ballState.startDelay + 2 },
                            opacity: { duration: 2.5, delay: ballState.startDelay + 2 },
                          }}
                        >
                          <motion.div
                            className="relative w-full h-full"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 0.5, delay: 1 }}
                          >
                            <Image
                              src="/star-grey.png"
                              alt="Grey Star"
                              width={sphere.size}
                              height={sphere.size}
                              className="object-contain"
                            />
                          </motion.div>
                          <motion.div
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1 }}
                          >
                            <Image
                              src="/star-yellow.png"
                              alt="Yellow Star"
                              width={sphere.size}
                              height={sphere.size}
                              className="object-contain"
                            />
                          </motion.div>
                        </motion.div>
                      )
                    }

                    // 所有星星的默认浮动状态（包括可变色的和普通的）
                    return (
                      <motion.div
                        key={sphere.id}
                        className="absolute"
                        style={{
                          width: `${sphere.size}px`,
                          height: `${sphere.size}px`,
                          left: `calc(50% + ${sphere.x}px)`,
                          top: `calc(50% + ${sphere.y}px)`,
                          zIndex,
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
