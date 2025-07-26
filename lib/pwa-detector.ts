// PWA检测和调试工具

export interface PWAEnvironment {
  // 浏览器信息
  browser: {
    name: string
    version: string
    engine: string
    isChromium: boolean
  }
  // 设备信息
  device: {
    type: 'mobile' | 'tablet' | 'desktop'
    os: string
    osVersion: string
    isIOS: boolean
    isAndroid: boolean
    isMacOS: boolean
    isWindows: boolean
  }
  // PWA支持情况
  pwaSupport: {
    serviceWorker: boolean
    manifest: boolean
    https: boolean
    installPrompt: boolean
    notifications: boolean
    push: boolean
    cache: boolean
    fetch: boolean
    standalone: boolean
  }
  // 安装状态
  installStatus: {
    isInstalled: boolean
    isInstallable: boolean
    displayMode: string
    installBlockers: string[]
  }
}

// 检测浏览器信息
function detectBrowser() {
  const ua = navigator.userAgent
  const vendor = navigator.vendor || ''
  
  let name = 'Unknown'
  let version = 'Unknown'
  let engine = 'Unknown'
  let isChromium = false

  // Chrome/Chromium
  if (/Chrome/.test(ua) && /Google Inc/.test(vendor)) {
    name = 'Chrome'
    version = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || 'Unknown'
    engine = 'Blink'
    isChromium = true
  }
  // Edge
  else if (/Edg/.test(ua)) {
    name = 'Edge'
    version = ua.match(/Edg\/(\d+\.\d+)/)?.[1] || 'Unknown'
    engine = 'Blink'
    isChromium = true
  }
  // Safari
  else if (/Safari/.test(ua) && /Apple Computer/.test(vendor)) {
    name = 'Safari'
    version = ua.match(/Version\/(\d+\.\d+)/)?.[1] || 'Unknown'
    engine = 'WebKit'
  }
  // Firefox
  else if (/Firefox/.test(ua)) {
    name = 'Firefox'
    version = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || 'Unknown'
    engine = 'Gecko'
  }
  // Opera
  else if (/OPR/.test(ua)) {
    name = 'Opera'
    version = ua.match(/OPR\/(\d+\.\d+)/)?.[1] || 'Unknown'
    engine = 'Blink'
    isChromium = true
  }
  // Samsung Internet
  else if (/SamsungBrowser/.test(ua)) {
    name = 'Samsung Internet'
    version = ua.match(/SamsungBrowser\/(\d+\.\d+)/)?.[1] || 'Unknown'
    engine = 'Blink'
    isChromium = true
  }

  return { name, version, engine, isChromium }
}

// 检测设备信息
function detectDevice() {
  const ua = navigator.userAgent
  const platform = navigator.platform
  
  // 检测操作系统
  let os = 'Unknown'
  let osVersion = 'Unknown'
  let isIOS = false
  let isAndroid = false
  let isMacOS = false
  let isWindows = false

  if (/iPhone|iPad|iPod/.test(ua)) {
    os = 'iOS'
    isIOS = true
    const match = ua.match(/OS (\d+)_(\d+)/)
    if (match) osVersion = `${match[1]}.${match[2]}`
  } else if (/Android/.test(ua)) {
    os = 'Android'
    isAndroid = true
    osVersion = ua.match(/Android (\d+\.\d+)/)?.[1] || 'Unknown'
  } else if (/Macintosh/.test(ua)) {
    os = 'macOS'
    isMacOS = true
    const match = ua.match(/Mac OS X (\d+)[._](\d+)/)
    if (match) osVersion = `${match[1]}.${match[2]}`
  } else if (/Windows/.test(ua)) {
    os = 'Windows'
    isWindows = true
    if (/Windows NT 10\.0/.test(ua)) osVersion = '10'
    else if (/Windows NT 6\.3/.test(ua)) osVersion = '8.1'
    else if (/Windows NT 6\.2/.test(ua)) osVersion = '8'
    else if (/Windows NT 6\.1/.test(ua)) osVersion = '7'
  }

  // 检测设备类型
  let type: 'mobile' | 'tablet' | 'desktop' = 'desktop'
  
  if (/Mobile|Android/.test(ua) && !/iPad|Tablet/.test(ua)) {
    type = 'mobile'
  } else if (/iPad|Tablet|Android/.test(ua) || (isIOS && screen.width >= 768)) {
    type = 'tablet'
  }

  return { type, os, osVersion, isIOS, isAndroid, isMacOS, isWindows }
}

// 检测PWA支持情况
function detectPWASupport() {
  return {
    serviceWorker: 'serviceWorker' in navigator,
    manifest: !!document.querySelector('link[rel="manifest"]'),
    https: location.protocol === 'https:' || location.hostname === 'localhost',
    installPrompt: 'BeforeInstallPromptEvent' in window,
    notifications: 'Notification' in window,
    push: 'PushManager' in window,
    cache: 'caches' in window,
    fetch: 'fetch' in window,
    standalone: window.matchMedia('(display-mode: standalone)').matches
  }
}

// 检测安装状态和阻碍因素
function detectInstallStatus(browser: any, device: any, pwaSupport: any): any {
  const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                     (('standalone' in window.navigator) && (window.navigator as any).standalone)
  
  const installBlockers: string[] = []
  
  // HTTPS检查
  if (!pwaSupport.https) {
    installBlockers.push('需要HTTPS连接（localhost除外）')
  }
  
  // Service Worker检查
  if (!pwaSupport.serviceWorker) {
    installBlockers.push('浏览器不支持Service Worker')
  }
  
  // Manifest检查
  if (!pwaSupport.manifest) {
    installBlockers.push('缺少Web App Manifest')
  }
  
  // 浏览器特定检查
  if (browser.name === 'Safari' || device.isIOS) {
    if (!pwaSupport.standalone && device.isIOS) {
      installBlockers.push('iOS需要手动添加到主屏幕（点击分享按钮 > 添加到主屏幕）')
    }
  }
  
  if (browser.name === 'Firefox') {
    installBlockers.push('Firefox桌面版不支持PWA安装（移动版支持）')
  }
  
  // 检测是否可安装
  const isInstallable = installBlockers.length === 0 && !isInstalled && browser.isChromium

  return {
    isInstalled,
    isInstallable,
    displayMode: getDisplayMode(),
    installBlockers
  }
}

// 获取显示模式
function getDisplayMode(): string {
  if (window.matchMedia('(display-mode: fullscreen)').matches) return 'fullscreen'
  if (window.matchMedia('(display-mode: standalone)').matches) return 'standalone'
  if (window.matchMedia('(display-mode: minimal-ui)').matches) return 'minimal-ui'
  return 'browser'
}

// 主检测函数
export function detectPWAEnvironment(): PWAEnvironment {
  const browser = detectBrowser()
  const device = detectDevice()
  const pwaSupport = detectPWASupport()
  const installStatus = detectInstallStatus(browser, device, pwaSupport)

  const environment: PWAEnvironment = {
    browser,
    device,
    pwaSupport,
    installStatus
  }

  // 在控制台输出详细信息
  console.group('🔍 PWA环境检测报告')
  
  console.group('📱 设备信息')
  console.log(`类型: ${device.type}`)
  console.log(`操作系统: ${device.os} ${device.osVersion}`)
  console.log(`平台: ${navigator.platform}`)
  console.groupEnd()
  
  console.group('🌐 浏览器信息')
  console.log(`名称: ${browser.name}`)
  console.log(`版本: ${browser.version}`)
  console.log(`引擎: ${browser.engine}`)
  console.log(`基于Chromium: ${browser.isChromium ? '是' : '否'}`)
  console.groupEnd()
  
  console.group('✅ PWA支持情况')
  Object.entries(pwaSupport).forEach(([key, value]) => {
    console.log(`${key}: ${value ? '✅ 支持' : '❌ 不支持'}`)
  })
  console.groupEnd()
  
  console.group('📥 安装状态')
  console.log(`已安装: ${installStatus.isInstalled ? '是' : '否'}`)
  console.log(`可安装: ${installStatus.isInstallable ? '是' : '否'}`)
  console.log(`显示模式: ${installStatus.displayMode}`)
  if (installStatus.installBlockers.length > 0) {
    console.log('安装阻碍因素:')
    installStatus.installBlockers.forEach(blocker => {
      console.log(`  - ${blocker}`)
    })
  }
  console.groupEnd()
  
  console.groupEnd()

  return environment
}

// 导出工具函数
export function logPWAEvent(event: string, data?: any) {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] PWA事件: ${event}`, data || '')
}