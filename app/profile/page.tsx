"use client"

import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Bell, History, MessageCircle, Settings, ChevronRight } from "lucide-react"
import Image from "next/image"

export default function ProfilePage() {
    const menuItems = [
        {
            icon: Bell,
            title: "我的通知",
            hasNotification: true
        },
        {
            icon: History,
            title: "瓶子历史",
            hasNotification: false
        },
        {
            icon: MessageCircle,
            title: "问题反馈",
            hasNotification: false
        },
        {
            icon: Settings,
            title: "我的设置",
            hasNotification: false
        }
    ]

    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <div className="relative w-full max-w-md h-[100dvh] overflow-hidden bg-white">
                {/* 头部个人信息 */}
                <div className="flex flex-col items-center pt-16 pb-8">
                    {/* 星星头像 */}
                    <div className="relative mb-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-100 to-blue-200 flex items-center justify-center">
                            <Image
                                src="/star-yellow-eyes.png"
                                alt="User Avatar"
                                width={60}
                                height={60}
                                className="object-contain transform scale-[1.5] "
                            />
                        </div>
                    </div>

                    {/* 姓名 */}
                    <h1 className="text-xl font-medium text-gray-800">小水</h1>
                </div>

                {/* 菜单项列表 */}
                <div className="px-6 space-y-1">
                    {menuItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between px-4 py-4 bg-white hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <item.icon className="w-5 h-5 text-gray-600" />
                                    {item.hasNotification && (
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                                    )}
                                </div>
                                <span className="text-gray-800 font-medium">{item.title}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                    ))}
                </div>

                {/* 底部退出按钮 */}
                <div className="absolute bottom-24 left-6 right-6">
                    <Button
                        variant="outline"
                        className="w-full py-3 text-gray-600 border-gray-200 hover:bg-gray-50 rounded-xl"
                    >
                        退出账号
                    </Button>
                </div>

                <Navigation />
            </div>
        </main>
    )
} 