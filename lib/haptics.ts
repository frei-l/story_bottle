// 触觉反馈工具函数

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
export const triggerVibration = (pattern: number | number[]): boolean => {
  // 检查是否在客户端环境
  if (typeof window === 'undefined') {
    console.log('[Haptics] 服务端环境，无法触发震动')
    return false
  }

  // 检查是否支持震动API
  if (!isVibrationSupported()) {
    console.log('[Haptics] 此设备不支持震动API')
    return false
  }

  try {
    // 调用震动API
    const result = navigator.vibrate(pattern)
    
    if (result) {
      console.log('[Haptics] 震动触发成功:', pattern)
    } else {
      console.log('[Haptics] 震动触发失败（可能是iOS设备）')
    }
    
    return result
  } catch (error) {
    console.error('[Haptics] 触发震动时出错:', error)
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