"use client"

import { useBallStore, type BallState, type Sphere } from "@/lib/ball-store"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { MotionDetector } from "@/lib/motion-detector"
import { Button } from "@/components/ui/button"
import { getVibrationInfo, triggerVibration, vibrationPatterns } from "@/lib/haptics"
import { getRandomNotes, type RandomNote } from "@/utils/random-notes"



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

  const [selectedStar, setSelectedStar] = useState<number | null>(null)
  const [clickedStar, setClickedStar] = useState<number | null>(null) // 记录被点击的星星
  const [showTransition, setShowTransition] = useState(false)
  const [needsPermission, setNeedsPermission] = useState(false)
  const [motionEnabled, setMotionEnabled] = useState(false)
  const [motionSupported, setMotionSupported] = useState(false)
  const [clickEnabled, setClickEnabled] = useState(true) // 默认启用点击
  const [randomNotes, setRandomNotes] = useState<RandomNote[]>([])
  const motionDetectorRef = useRef<MotionDetector | null>(null)
  const router = useRouter()

  // 组件初始化时重置状态，确保每次进入页面都是初始状态
  useEffect(() => {
    resetBalls()
    // 生成随机笔记
    const notes = getRandomNotes(3)
    setRandomNotes(notes)
  }, [])

  // 初始化震动支持检测
  useEffect(() => {
    getVibrationInfo()
  }, [])

  // 初始化运动检测
  useEffect(() => {
    const initMotionDetection = async () => {
      // 在开发环境下强制启用点击功能
      if (process.env.NODE_ENV === 'development') {
        setMotionSupported(false)
        setMotionEnabled(false)
        setClickEnabled(true)
        setNeedsPermission(false)
        return
      }

      // 创建运动检测器实例
      const detector = new MotionDetector(() => {
        if (!ballsActivated) {
          playBottleShakeSound() // 播放晃动音效
          activateBalls()
        }
      })

      motionDetectorRef.current = detector

      // 检查是否支持并需要权限
      if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
        setMotionSupported(true)

        // 检查是否是iOS 13+需要权限
        if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
          setNeedsPermission(true)
          setClickEnabled(false) // 禁用点击，等待权限授予
        } else {
          // 不需要权限，直接启动
          detector.start()
          setMotionEnabled(true)
          setClickEnabled(false) // 禁用点击功能
        }
      } else {
        setMotionSupported(false)
        setClickEnabled(true) // 只启用点击功能
      }
    }

    initMotionDetection()

    // 清理函数
    return () => {
      if (motionDetectorRef.current) {
        motionDetectorRef.current.stop()
      }
    }
  }, [ballsActivated, activateBalls])

  // 处理瓶子点击事件
  const handleBottleClick = () => {
    if (clickEnabled && !ballsActivated) {
      playBottleShakeSound() // 播放晃动音效
      activateBalls()
    }
  }

  // 播放瓶子晃动音效
  const playBottleShakeSound = () => {
    const audio = new Audio('/bottle-shake.mp3')
    audio.play().catch(error => {
      console.log('Failed to play bottle shake sound:', error)
    })
  }

  // 获取提示文字
  const getPromptText = () => {
    // 开发环境下显示特殊提示
    if (process.env.NODE_ENV === 'development') {
      return '【开发模式】点击瓶子唤醒故事'
    }

    if (needsPermission) {
      return '需要获取运动传感器权限以启用摇一摇功能'
    } else if (motionEnabled) {
      return '摇一摇手机唤醒故事'
    } else if (clickEnabled) {
      return '点击瓶子唤醒故事'
    } else if (motionSupported) {
      return '摇一摇唤醒故事'
    } else {
      return '点击瓶子唤醒故事'
    }
  }

  // 处理权限请求
  const handleRequestPermission = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!motionDetectorRef.current) return

    const granted = await motionDetectorRef.current.requestPermission()
    if (granted) {
      motionDetectorRef.current.start()
      setMotionEnabled(true)
      setNeedsPermission(false)
      setClickEnabled(false) // 禁用点击功能
    } else {
      setNeedsPermission(false)
      setClickEnabled(true) // 启用点击功能作为备选
      alert('未获得运动传感器权限，将使用点击模式')
    }
  }

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

  const handleStarClick = (starId: number) => {
    // 防止重复点击
    if (clickedStar !== null) return

    // 播放点击星星音效
    const audio = new Audio('/click-star.mp3')
    audio.play().catch(error => {
      console.log('Failed to play star click sound:', error)
    })

    // 点击星星时的震动反馈
    triggerVibration(vibrationPatterns.success)

    // 设置被点击的星星，触发发光和摇晃效果
    setClickedStar(starId)

    // 延迟显示过渡动画，让发光效果先播放
    setTimeout(() => {
      setSelectedStar(starId)
      setShowTransition(true)
      setTimeout(() => {
        // 获取对应的笔记索引并跳转
        const noteIndex = randomNotes[starId]?.index
        router.push(`/notes?index=${noteIndex}`) // 跳转到下一页并传递索引
      }, 1500) // 动画持续1.5秒后跳转
    }, 800) // 发光和摇晃效果持续0.8秒
  }

  // 获取屏幕中央的球（使用固定定位）
  const getCenterBalls = () => {
    return spheres
      .filter(sphere => sphere.id < 3)
      .map(sphere => {
        const ballState = ballStates.find(b => b.id === sphere.id)
        if (ballState?.stage === 'activated') {
          const centerY = (sphere.id) * 150 - 240 // -150, 0, 150 垂直间距
          const leftOffset = -100 // 偏左的位置
          const labels = randomNotes.map(note => note.emotion)
          const contents = randomNotes.map(note => note.content)

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
                animate={
                  clickedStar === sphere.id
                    ? {
                      scale: [1.3, 1.5, 1.3], // 轻微晃动效果
                      rotate: [0, 5, -5, 0], // 轻微旋转
                    }
                    : { scale: 1.3 }
                }
                transition={
                  clickedStar === sphere.id
                    ? {
                      scale: { duration: 0.8, ease: "easeInOut" },
                      rotate: { duration: 0.8, ease: "easeInOut" },
                    }
                    : {
                      duration: 0.5,
                      delay: ballState.startDelay + 4, // 稍微延迟缩放效果
                    }
                }
                className="cursor-pointer relative"
                onClick={() => handleStarClick(sphere.id)}
              >
                {/* 发光效果背景 */}
                {clickedStar === sphere.id && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "radial-gradient(circle, rgba(244, 196, 48, 0.6) 0%, rgba(244, 196, 48, 0.3) 50%, transparent 70%)",
                      filter: "blur(8px)",
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 2, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                )}

                <Image
                  src="/star-yellow.png"
                  alt="Yellow Star"
                  width={sphere.size}
                  height={sphere.size}
                  className={`object-contain relative z-10 ${clickedStar === sphere.id ? 'drop-shadow-[0_0_15px_rgba(244,196,48,0.8)]' : ''
                    }`}
                />
              </motion.div>
              <motion.div
                className={`ml-12 text-2xl font-light whitespace-nowrap transition-colors duration-300 ${clickedStar === sphere.id
                  ? 'text-yellow-600 font-medium'
                  : 'text-neutral-700'
                  }`}
                initial={{ opacity: 0, x: -20 }}
                animate={
                  clickedStar === sphere.id
                    ? { opacity: 1, x: 0, scale: [1, 1.1, 1] }
                    : { opacity: 1, x: 0 }
                }
                transition={
                  clickedStar === sphere.id
                    ? {
                      opacity: { duration: 0.8, delay: ballState.startDelay + 4.2 },
                      x: { duration: 0.8, delay: ballState.startDelay + 4.2 },
                      scale: { duration: 0.8, ease: "easeInOut" },
                    }
                    : {
                      duration: 0.8,
                      delay: ballState.startDelay + 4.2,
                    }
                }
              >
                <div className="flex flex-col w-40">
                  <p className="text-2xl font-medium">#{labels[sphere.id]}</p>
                  <p className="text-base font-light text-neutral-600 max-w-[120px] whitespace-pre-wrap break-words -mt-6">{contents[sphere.id]}</p>
                </div>
              </motion.div>
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

      {/* 黄色填充动画 */}
      <AnimatePresence>
        {showTransition && selectedStar !== null && (
          <motion.div
            className="fixed inset-0 z-[100]"
            style={{
              background: 'radial-gradient(circle at center, #E6B800 0%, #F4C430 30%, #F2D98D 70%, #F5E6D3 100%)'
            }}
            initial={{
              clipPath: `circle(0px at ${selectedStar === 0 ? '40%' : selectedStar === 1 ? '40%' : '40%'} ${selectedStar === 0 ? '25%' : selectedStar === 1 ? '50%' : '65%'})`
            }}
            animate={{
              clipPath: 'circle(150% at 50% 50%)'
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut"
            }}
          />
        )}
      </AnimatePresence>

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
          className={`relative mb-12 ${clickEnabled ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={handleBottleClick}
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
        {
          !ballsActivated && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center">
              <p className="text-neutral-700 font-light text-md font-caveat">
                {getPromptText()}
              </p>
              {needsPermission && (
                <Button
                  onClick={handleRequestPermission}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  启用摇一摇功能
                </Button>
              )}
            </div>
          )
        }
        {
          ballsActivated && (
            <motion.p
              className="text-neutral-700 font-light text-md font-caveat absolute bottom-20 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 5.5 // 在星星完全显现后显示 (ballState.startDelay最大值1 + 4.2 + 一些缓冲)
              }}
            >
              轻点揭开你的故事
            </motion.p>
          )
        }
      </div>
    </div>
  )
}
