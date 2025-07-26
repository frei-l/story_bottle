"use client"
import Navigation from "@/components/navigation";
import BasicMap from "@/components/map";
import { Link, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { defaultLocations, currentLocation } from "@/components/default-locations";

export default function Home() {
  const router = useRouter();
  // 以中心点为基准，1公里内均匀分布几个点
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="relative w-full max-w-md h-[100dvh] overflow-hidden flex flex-col">
        {/* 顶部标题栏 */}
        <div className="flex-shrink-0 bg-white/90 backdrop-blur-sm z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-lg font-medium text-gray-900">附近故事</h1>
            <button onClick={() => router.push('/upload')} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <Upload size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* 地图容器 - 占据屏幕1/2 */}
        <div className="h-1/2 flex items-center justify-center p-4">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <BasicMap markerType="bubble" locations={defaultLocations} userLocation={currentLocation} />
          </div>
        </div>

        {/* 底部内容区域 */}
        <div className="flex-shrink-0 px-4 pb-4 space-y-12 pt-2">
          {/* 探索故事按钮 */}
          <button onClick={() => router.push('/bottle')} className="w-full bg-yellow-400 hover:bg-yellow-500 transition-colors rounded-full py-4 font-medium text-gray-900 text-lg shadow-lg">
            探索故事
          </button>

          {/* 底部文字和星星 */}
          <div className="flex items-center justify-center gap-12 mt-12">
            <span className="text-gray-600 text-sm">你所在的街区有X条故事~</span>
            <Image
              src="/star-yellow-eyes.png"
              alt="星星"
              width={40}
              height={40}
              className="object-contain transform scale-[3] rotate-[10deg]"
            />
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
