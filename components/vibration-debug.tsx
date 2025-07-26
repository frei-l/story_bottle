"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getVibrationInfo, triggerVibration, vibrationPatterns } from "@/lib/haptics"
import { Vibrate, Smartphone, AlertCircle } from "lucide-react"

export default function VibrationDebug() {
  const [vibrationInfo, setVibrationInfo] = useState<any>(null)
  const [testCount, setTestCount] = useState(0)

  useEffect(() => {
    const info = getVibrationInfo()
    setVibrationInfo(info)
  }, [])

  const handleVibrationTest = (pattern: number | number[], name: string) => {
    console.log(`[VibrationDebug] 测试震动: ${name}`)
    const result = triggerVibration(pattern)
    if (result) {
      setTestCount(prev => prev + 1)
    }
  }

  if (!vibrationInfo) return null

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Vibrate className="w-5 h-5" />
          震动反馈测试
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 支持状态 */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="w-4 h-4" />
            <span className="font-medium">设备信息</span>
          </div>
          <div className="text-sm space-y-1">
            <p>支持震动: {vibrationInfo.supported ? '✅ 是' : '❌ 否'}</p>
            <p>iOS设备: {vibrationInfo.isIOS ? '是' : '否'}</p>
            <p>Android设备: {vibrationInfo.isAndroid ? '是' : '否'}</p>
            {vibrationInfo.note && (
              <div className="flex items-start gap-2 mt-2 text-orange-600">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>{vibrationInfo.note}</p>
              </div>
            )}
          </div>
        </div>

        {/* 测试按钮 */}
        {vibrationInfo.supported && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">点击按钮测试不同的震动模式：</p>
            
            <Button
              onClick={() => handleVibrationTest(vibrationPatterns.tap, '轻触')}
              variant="outline"
              className="w-full"
            >
              轻触震动 (10ms)
            </Button>
            
            <Button
              onClick={() => handleVibrationTest(vibrationPatterns.shake, '摇晃')}
              variant="outline"
              className="w-full"
            >
              摇晃震动模式
            </Button>
            
            <Button
              onClick={() => handleVibrationTest(vibrationPatterns.success, '成功')}
              variant="outline"
              className="w-full"
            >
              成功反馈
            </Button>
            
            <Button
              onClick={() => handleVibrationTest(vibrationPatterns.rhythm, '节奏')}
              variant="outline"
              className="w-full"
            >
              节奏震动
            </Button>
          </div>
        )}

        {/* 测试统计 */}
        {testCount > 0 && (
          <p className="text-sm text-center text-gray-500">
            已测试 {testCount} 次
          </p>
        )}
      </CardContent>
    </Card>
  )
}