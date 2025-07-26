"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Download } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { detectPWAEnvironment, logPWAEvent } from "@/lib/pwa-detector"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // 运行完整的PWA环境检测
    const env = detectPWAEnvironment()
    
    // 检测PWA是否已安装
    if (env.installStatus.isInstalled) {
      setIsInstalled(true)
      logPWAEvent('PWA已安装', { displayMode: env.installStatus.displayMode })
    }

    // 监听beforeinstallprompt事件
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      const promptEvent = event as BeforeInstallPromptEvent
      setInstallPrompt(promptEvent)
      setIsVisible(true)
      
      logPWAEvent('beforeinstallprompt事件触发', {
        环境: env,
        时间: new Date().toLocaleString()
      })
    }

    // 监听app安装成功事件
    const handleAppInstalled = () => {
      logPWAEvent('appinstalled事件触发 - PWA安装成功')
      setIsInstalled(true)
      setIsVisible(false)
      setInstallPrompt(null)
    }

    // 添加事件监听器
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // 如果有安装阻碍因素，记录到控制台
    if (env.installStatus.installBlockers.length > 0 && !env.installStatus.isInstalled) {
      logPWAEvent('检测到安装阻碍因素', {
        阻碍因素: env.installStatus.installBlockers,
        建议: '请解决以上问题以启用PWA安装功能'
      })
    }

    // 清理函数
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) {
      logPWAEvent('安装点击失败', { 原因: '安装提示不可用' })
      return
    }

    try {
      logPWAEvent('用户点击安装按钮', { 时间: new Date().toLocaleString() })
      await installPrompt.prompt()
      
      const result = await installPrompt.userChoice
      logPWAEvent('用户安装选择', { 
        结果: result.outcome,
        时间: new Date().toLocaleString()
      })
      
      // 无论结果如何，都重置状态
      setInstallPrompt(null)
      setIsVisible(false)
    } catch (error) {
      logPWAEvent('安装过程错误', { 
        错误: error instanceof Error ? error.message : String(error),
        堆栈: error instanceof Error ? error.stack : undefined
      })
    }
  }

  const handleDismiss = () => {
    logPWAEvent('用户关闭安装提示', { 时间: new Date().toLocaleString() })
    setIsVisible(false)
  }

  // 如果已安装或不可见，不渲染任何内容
  if (isInstalled || !isVisible) {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <Card className="shadow-lg border-2">
            <CardHeader className="relative pb-3">
              <button
                onClick={handleDismiss}
                className="absolute right-2 top-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="关闭"
              >
                <X className="w-4 h-4" />
              </button>
              <CardTitle className="flex items-center gap-2 pr-8">
                <Download className="w-5 h-5" />
                安装应用
              </CardTitle>
              <CardDescription>
                将故事瓶添加到主屏幕，获得更好的体验
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 离线使用，随时随地摇一摇</li>
                <li>• 快速启动，如原生应用般流畅</li>
                <li>• 接收故事更新通知</li>
              </ul>
              <div className="flex gap-2">
                <Button 
                  onClick={handleInstallClick}
                  className="flex-1"
                  size="sm"
                >
                  立即安装
                </Button>
                <Button 
                  onClick={handleDismiss}
                  variant="outline"
                  size="sm"
                >
                  稍后再说
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}