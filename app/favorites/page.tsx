"use client"
import Navigation from "@/components/navigation";
import OpenStreetMap from "@/components/map/OpenStreetMap";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const router = useRouter();
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="relative w-full max-w-md h-[100dvh] overflow-hidden flex flex-col bg-gray-50">
        {/* 顶部标题栏 */}
        <div className="flex-shrink-0 bg-white/90 backdrop-blur-sm z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-lg font-medium text-gray-900">我的收集</h1>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <Heart size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* 地图容器 - 占据屏幕1/2 */}
        <div className="h-1/2 flex items-center justify-center p-4">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <OpenStreetMap />
          </div>
        </div>

        {/* 底部内容区域 */}
        <div className="flex-shrink-0 px-4 pb-4 space-y-6 pt-2">
          {/* 统计信息 */}
          <div className="space-y-2">
            <p className="text-gray-700 text-base font-medium">你已经解锁了<span className="text-yellow-600 font-bold">3</span>个城市</p>
            <p className="text-gray-700 text-base font-medium">收藏了<span className="text-yellow-600 font-bold">5</span>个瓶子</p>
          </div>

          {/* 蓝色装饰和鼓励文字 */}
          <div className="relative bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-4 mt-6">
            {/* 蓝色装饰图案 */}
            <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full opacity-60"></div>
            <div className="absolute top-2 right-4 w-8 h-8 bg-gradient-to-br from-cyan-200 to-blue-300 rounded-full opacity-40"></div>
            
            <div className="relative z-10">
              <p className="text-gray-700 text-sm leading-relaxed text-center">
                你的探索会让区域地图逐渐上色，<br/>
                出发探索城市更多角落吧！
                <span className="inline-block ml-1 text-cyan-500 font-bold">🎯</span>
              </p>
            </div>
          </div>
        </div>

        {/* 底部导航 */}
        <div className="flex-shrink-0">
          <Navigation />
        </div>
      </div>
    </main>
  )
}
