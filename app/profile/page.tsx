"use client"

import Navigation from "@/components/navigation"

export default function ProfilePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <div className="relative w-full max-w-md h-[100dvh] overflow-hidden">
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-purple-100">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">个人资料</h1>
                        <p className="text-gray-600">这里是个人资料页面</p>
                    </div>
                </div>
                <Navigation />
            </div>
        </main>
    )
} 