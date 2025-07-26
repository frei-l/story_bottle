"use client"

import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Camera, Loader2, Check } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"

type SubmitStatus = 'idle' | 'loading' | 'success'

export default function UploadPage() {
    const router = useRouter()
    const [content, setContent] = useState("")
    const [location, setLocation] = useState("XXXX")
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')

    const handleSubmit = async () => {
        if (!content.trim()) return
        
        setSubmitStatus('loading')
        
        // 模拟API调用延迟
        setTimeout(() => {
            setSubmitStatus('success')
            
            // 2秒后重置状态
            setTimeout(() => {
                setSubmitStatus('idle')
                setContent("") // 清空内容
                router.push('/map')
            }, 2000)
        }, 1500)
    }

    const getButtonContent = () => {
        switch (submitStatus) {
            case 'loading':
                return (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        发布中...
                    </>
                )
            case 'success':
                return (
                    <>
                        <Check className="w-4 h-4" />
                        提交成功
                    </>
                )
            default:
                return "确认发布"
        }
    }

    const getButtonClassName = () => {
        switch (submitStatus) {
            case 'success':
                return "w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-xl text-base"
            default:
                return "w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-xl text-base"
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <div className="relative w-full max-w-md h-[100dvh] overflow-hidden">
                {/* 头部区域 */}
                <div className="flex items-center justify-between px-6 pt-4 pb-6">
                    <div className="pt-6">
                        <p className="text-gray-600 text-xs">想聊点什么？<br/>在这里发生过的故事，<br/>或者你喜欢在这边街区怎样生活？</p>
                    </div>
                    <Image
                        src="/star-yellow-eyes.png"
                        alt="Star"
                        width={48}
                        height={48}
                        className="mt-4 object-contain transform scale-[2.5] -rotate-[30deg]"
                    />
                </div>

                {/* 主要内容区域 */}
                <div className="flex-1 px-6 py-6">
                    {/* 文本输入区域 */}
                    <div className="flex gap-2 ml-2 mb-2">
                        <Image
                            src="/maps.png"
                            alt="Maps"
                            width={24}
                            height={24}
                        />
                        <p className="text-gray-400 text-xs pt-1">小水 in 幸福路 厦门市</p>
                    </div>
                    <div className="relative">
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="聊聊你的一天吧"
                            className="min-h-[300px] w-full rounded-2xl p-5 border-0 bg-yellow-100/30 resize-none text-base placeholder:text-gray-400 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                            disabled={submitStatus === 'loading'}
                        />

                        {/* 照片上传区域 */}
                        <div className="absolute bottom-4 left-4">
                            <div className="w-24 h-24 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                                <div className="relative">
                                    <Camera className="w-6 h-6 text-yellow-500" />
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 底部发布按钮 */}
                <div className="px-6 pb-24">
                    <Button
                        className={getButtonClassName()}
                        disabled={!content.trim() || submitStatus === 'loading'}
                        onClick={handleSubmit}
                    >
                        {getButtonContent()}
                    </Button>
                </div>

                <Navigation />
            </div>
        </main>
    )
}
