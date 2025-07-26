"use client"

import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Camera } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export default function UploadPage() {
    const [content, setContent] = useState("")
    const [location, setLocation] = useState("XXXX")

    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <div className="relative w-full max-w-md h-[100dvh] overflow-hidden">
                {/* 头部区域 */}
                <div className="flex items-center justify-between px-6 pt-4 pb-6">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-xl font-bold text-gray-900">上传故事</h1>
                        <p className="text-gray-600 text-xs">写下你的记忆，让更多人看到你的生活</p>
                    </div>
                    <Image
                        src="/star_yellow_eyes.png"
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
                        <p className="text-gray-600 text-xs pt-1"> 我在{location}</p>
                    </div>
                    <div className="relative">
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="聊聊你的一天吧"
                            className="min-h-[300px] w-full rounded-2xl border-0 bg-gray-100 resize-none text-base placeholder:text-gray-400 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                        />

                        {/* 照片上传区域 */}
                        <div className="absolute bottom-4 left-4">
                            <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
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
                        className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-xl text-base"
                        disabled={!content.trim()}
                    >
                        确认发布
                    </Button>
                </div>

                <Navigation />
            </div>
        </main>
    )
}
