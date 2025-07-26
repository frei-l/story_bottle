"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface DebugInfo {
  supported: boolean
  permission: boolean
  listening: boolean
  lastMotion: {
    x: number
    y: number
    z: number
    total: number
    timestamp: string
  } | null
  shakeCount: number
}

export default function MotionDebugPanel({ onClose }: { onClose?: () => void }) {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    supported: false,
    permission: false,
    listening: false,
    lastMotion: null,
    shakeCount: 0
  })

  useEffect(() => {
    // 检查支持情况
    const checkSupport = () => {
      const supported = typeof window !== 'undefined' && 'DeviceMotionEvent' in window
      const needsPermission = typeof (DeviceMotionEvent as any).requestPermission === 'function'
      
      setDebugInfo(prev => ({
        ...prev,
        supported,
        permission: !needsPermission
      }))
    }

    checkSupport()

    // 监听调试事件
    const handleDebugEvent = (event: CustomEvent) => {
      const { type, data } = event.detail
      
      if (type === 'motion') {
        setDebugInfo(prev => ({
          ...prev,
          lastMotion: {
            ...data,
            timestamp: new Date().toLocaleTimeString()
          }
        }))
      } else if (type === 'shake') {
        setDebugInfo(prev => ({
          ...prev,
          shakeCount: prev.shakeCount + 1
        }))
      } else if (type === 'status') {
        setDebugInfo(prev => ({
          ...prev,
          ...data
        }))
      }
    }

    window.addEventListener('motion-debug' as any, handleDebugEvent)

    return () => {
      window.removeEventListener('motion-debug' as any, handleDebugEvent)
    }
  }, [])

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">运动检测调试</CardTitle>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div>
          <strong>支持状态:</strong>
          <ul className="ml-4 mt-1">
            <li>DeviceMotionEvent: {debugInfo.supported ? '✅' : '❌'}</li>
            <li>需要权限: {debugInfo.permission ? '❌' : '✅'}</li>
            <li>正在监听: {debugInfo.listening ? '✅' : '❌'}</li>
          </ul>
        </div>
        
        <div>
          <strong>晃动次数:</strong> {debugInfo.shakeCount}
        </div>
        
        {debugInfo.lastMotion && (
          <div>
            <strong>最后运动数据:</strong>
            <ul className="ml-4 mt-1">
              <li>X: {debugInfo.lastMotion.x.toFixed(2)}</li>
              <li>Y: {debugInfo.lastMotion.y.toFixed(2)}</li>
              <li>Z: {debugInfo.lastMotion.z.toFixed(2)}</li>
              <li>总计: {debugInfo.lastMotion.total.toFixed(2)}</li>
              <li>时间: {debugInfo.lastMotion.timestamp}</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}