"use client"

import { useEffect } from "react"
import { logPWAEvent } from "@/lib/pwa-detector"

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js')
          
          logPWAEvent('Service Worker 注册成功', {
            scope: registration.scope,
            active: registration.active?.state,
            installing: registration.installing?.state,
            waiting: registration.waiting?.state
          })

          // 监听Service Worker更新
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'activated') {
                  logPWAEvent('Service Worker 已更新并激活')
                }
              })
            }
          })
        } catch (error) {
          logPWAEvent('Service Worker 注册失败', {
            错误: error instanceof Error ? error.message : String(error)
          })
        }
      })
    } else {
      logPWAEvent('Service Worker 不支持', {
        原因: typeof window === 'undefined' ? '服务端渲染环境' : '浏览器不支持'
      })
    }
  }, [])

  return null
}