// 触觉反馈工具函数

// 防重复触发的时间戳记录
let lastVibrationTime = 0
const VIBRATION_COOLDOWN = 200 // 200ms 冷却时间

/**
 * 检查设备是否支持震动API
 */
export const isVibrationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'vibrate' in navigator
}

/**
 * 触发设备震动
 * @param pattern - 震动模式，可以是单个数字或数组
 * @returns 是否成功触发震动
 */
export const triggerVibration = (pattern: number | number[], ignoreCooldown: boolean = false): boolean => {
  const timestamp = new Date().toISOString()
  const now = Date.now()
  
  // 检查冷却时间（除非明确忽略）
  if (!ignoreCooldown && (now - lastVibrationTime) < VIBRATION_COOLDOWN) {
    console.log(`[Haptics][${timestamp}] ⏳ 震动在冷却期内，跳过触发 (${now - lastVibrationTime}ms < ${VIBRATION_COOLDOWN}ms)`)
    return false
  }
  
  // 检查是否在客户端环境
  if (typeof window === 'undefined') {
    console.log(`[Haptics][${timestamp}] 服务端环境，无法触发震动`)
    return false
  }

  // 检查是否支持震动API
  if (!isVibrationSupported()) {
    console.log(`[Haptics][${timestamp}] 此设备不支持震动API - Navigator支持:`, 'navigator' in window, 'Vibrate支持:', 'vibrate' in (navigator || {}))
    return false
  }

  try {
    console.log(`[Haptics][${timestamp}] 开始触发震动，模式:`, pattern)
    
    // 调用震动API
    const result = navigator.vibrate(pattern)
    
    // 更新最后触发时间
    lastVibrationTime = now
    
    if (result) {
      console.log(`[Haptics][${timestamp}] ✅ 震动触发成功:`, pattern)
    } else {
      console.warn(`[Haptics][${timestamp}] ⚠️ 震动触发失败（可能是iOS设备或已被禁用）:`, pattern)
    }
    
    return result
  } catch (error) {
    console.error(`[Haptics][${timestamp}] ❌ 触发震动时出错:`, error, '模式:', pattern)
    return false
  }
}

/**
 * 停止当前的震动
 */
export const stopVibration = (): void => {
  triggerVibration(0)
}

/**
 * 预设的震动模式
 */
export const vibrationPatterns = {
  // 轻微触感
  tap: 10,
  
  // 中等触感
  medium: 20,
  
  // 强烈触感
  strong: 50,
  
  // 瓶子摇晃模式（优化版 - 1秒持续震动匹配动画）
  shake: [
    40, 60,  // 第一次摇晃
    40, 60,  // 第二次摇晃  
    40, 60,  // 第三次摇晃
    40, 60,  // 第四次摇晃
    40, 60,  // 第五次摇晃
    30, 40,  // 第六次摇晃（减弱）
    30, 40,  // 第七次摇晃（减弱）
    20       // 最后一次轻微震动
  ],
  
  // 成功反馈（轻柔的双击震动）
  success: [30, 80, 30],
  
  // 错误反馈
  error: [50, 100, 50, 100, 50],
  
  // 节奏感震动（用于动画同步）
  rhythm: [20, 80, 20, 80, 20, 80, 20]
}

/**
 * 获取设备震动支持情况的详细信息
 */
export const getVibrationInfo = () => {
  const info = {
    supported: isVibrationSupported(),
    platform: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    isIOS: typeof navigator !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent),
    isAndroid: typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent),
    lastVibrationTime: lastVibrationTime,
    cooldownRemaining: Math.max(0, VIBRATION_COOLDOWN - (Date.now() - lastVibrationTime)),
    note: ''
  }
  
  if (info.isIOS) {
    info.note = 'iOS设备不支持Web震动API'
  } else if (info.isAndroid) {
    info.note = '支持震动反馈'
  } else if (!info.supported) {
    info.note = '当前设备或浏览器不支持震动API'
  }
  
  return info
}

/**
 * 重置震动冷却时间 - 调试用
 */
export const resetVibrationCooldown = () => {
  lastVibrationTime = 0
  console.log('[Haptics] 震动冷却时间已重置')
}