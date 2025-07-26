// 设备运动检测工具

export interface MotionData {
  x: number
  y: number
  z: number
  timestamp: number
}

export class MotionDetector {
  private lastMotion: MotionData | null = null
  private shakeThreshold = 15 // 加速度阈值
  private shakeTimeout: NodeJS.Timeout | null = null
  private onShakeCallback: (() => void) | null = null
  private isListening = false

  constructor(onShake?: () => void) {
    if (onShake) {
      this.onShakeCallback = onShake
    }
  }

  // 请求权限（iOS 13+需要）
  async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined') {
      console.log('[Motion] 服务端环境，跳过权限请求')
      return false
    }

    // 检查是否支持DeviceMotionEvent
    if (!('DeviceMotionEvent' in window)) {
      console.log('[Motion] 设备不支持DeviceMotionEvent')
      return false
    }

    // 检查是否需要请求权限（iOS 13+）
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission()
        console.log('[Motion] iOS权限请求结果:', permission)
        return permission === 'granted'
      } catch (error) {
        console.error('[Motion] iOS权限请求失败:', error)
        return false
      }
    }

    // 非iOS设备或iOS 13以下版本，直接返回true
    console.log('[Motion] 无需请求权限，直接支持')
    return true
  }

  // 开始监听
  start() {
    if (this.isListening) {
      console.log('[Motion] 已在监听中')
      return
    }

    if (typeof window === 'undefined') {
      console.log('[Motion] 服务端环境，无法启动监听')
      return
    }

    console.log('[Motion] 开始监听设备运动')
    this.isListening = true

    window.addEventListener('devicemotion', this.handleMotion)
    
    // 发送状态更新事件
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('motion-debug', {
        detail: {
          type: 'status',
          data: { listening: true }
        }
      }))
    }
  }

  // 停止监听
  stop() {
    if (!this.isListening) return

    console.log('[Motion] 停止监听设备运动')
    this.isListening = false

    if (typeof window !== 'undefined') {
      window.removeEventListener('devicemotion', this.handleMotion)
      
      // 发送状态更新事件
      window.dispatchEvent(new CustomEvent('motion-debug', {
        detail: {
          type: 'status',
          data: { listening: false }
        }
      }))
    }

    if (this.shakeTimeout) {
      clearTimeout(this.shakeTimeout)
      this.shakeTimeout = null
    }
  }

  // 处理运动事件
  private handleMotion = (event: DeviceMotionEvent) => {
    const acceleration = event.accelerationIncludingGravity

    if (!acceleration || 
        acceleration.x === null || 
        acceleration.y === null || 
        acceleration.z === null) {
      return
    }

    const current: MotionData = {
      x: acceleration.x,
      y: acceleration.y,
      z: acceleration.z,
      timestamp: Date.now()
    }

    // 计算加速度变化
    if (this.lastMotion) {
      const deltaX = Math.abs(current.x - this.lastMotion.x)
      const deltaY = Math.abs(current.y - this.lastMotion.y)
      const deltaZ = Math.abs(current.z - this.lastMotion.z)
      const totalDelta = deltaX + deltaY + deltaZ

      // 发送调试事件
      if (totalDelta > 5) {
        console.log('[Motion] 检测到运动:', {
          deltaX: deltaX.toFixed(2),
          deltaY: deltaY.toFixed(2),
          deltaZ: deltaZ.toFixed(2),
          total: totalDelta.toFixed(2)
        })
        
        // 发送自定义事件用于调试面板
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('motion-debug', {
            detail: {
              type: 'motion',
              data: {
                x: deltaX,
                y: deltaY,
                z: deltaZ,
                total: totalDelta
              }
            }
          }))
        }
      }

      // 检测是否超过阈值
      if (totalDelta > this.shakeThreshold) {
        this.onShakeDetected()
      }
    }

    this.lastMotion = current
  }

  // 检测到晃动
  private onShakeDetected() {
    // 防抖处理，避免过于频繁的触发
    if (this.shakeTimeout) {
      clearTimeout(this.shakeTimeout)
    }

    console.log('[Motion] 检测到晃动!')

    // 发送晃动事件
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('motion-debug', {
        detail: { type: 'shake' }
      }))
    }

    // 立即触发回调
    if (this.onShakeCallback) {
      this.onShakeCallback()
    }

    // 设置防抖，1秒内不再触发
    this.shakeTimeout = setTimeout(() => {
      this.shakeTimeout = null
    }, 1000)
  }

  // 设置晃动回调
  setOnShake(callback: () => void) {
    this.onShakeCallback = callback
  }

  // 设置灵敏度（阈值越低越灵敏）
  setSensitivity(threshold: number) {
    this.shakeThreshold = Math.max(5, Math.min(30, threshold))
    console.log('[Motion] 灵敏度设置为:', this.shakeThreshold)
  }

  // 获取当前状态
  getStatus() {
    return {
      isListening: this.isListening,
      threshold: this.shakeThreshold,
      hasPermission: typeof window !== 'undefined' && 'DeviceMotionEvent' in window
    }
  }
}