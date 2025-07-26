"use client"
import Navigation from "@/components/navigation";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BasicMap from "@/components/map";


export default function FavoritesPage() {
  const router = useRouter();
  const defaultLocations = [
    { lng: 120.003618, lat: 30.295699 }, // 中心点
    { lng: 120.011618, lat: 30.295699 }, // 东约800米
    { lng: 119.995618, lat: 30.295699 }, // 西约800米
    { lng: 120.003618, lat: 30.304699 }, // 北约1公里
    { lng: 120.003618, lat: 30.286699 }, // 南约1公里
    { lng: 120.008618, lat: 30.300699 }, // 东北约700米
    { lng: 119.998618, lat: 30.290699 }, // 西南约700米
  ];
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="relative w-full max-w-md h-[100dvh] overflow-hidden flex flex-col bg-gray-50">
        {/* 顶部标题栏 */}
        <div className="flex-shrink-0 bg-white/90 backdrop-blur-sm z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-lg font-medium text-gray-900">罐子足迹</h1>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <Heart size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* 地图容器 - 占据屏幕3/5 */}
        <div className="relative h-3/5 flex items-center justify-center py-4">
          <div className="absolute -bottom-10 left-7 z-0">
            <Image 
              src="/blue-star.png" 
              alt="装饰星星" 
              width={80} 
              height={80}
              className="object-contain transform scale-[3] opacity-80"
            />
          </div>
          
          <div className="relative w-full h-full rounded-lg overflow-hidden z-10">
            <BasicMap markerType="star" locations={defaultLocations} userLocation={defaultLocations[0]} />
            
            {/* 统计信息 - 左下角 */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-10">
              <div className="space-y-1">
                <p className="text-gray-700 text-sm font-medium">你已经解锁了<span className="text-yellow-600 font-bold">3</span>个城市</p>
                <p className="text-gray-700 text-sm font-medium">收藏了<span className="text-yellow-600 font-bold">5</span>个瓶子</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 px-4 pb-4 space-y-6 pt-2">
          <div className="relative rounded-lg p-4 mt-6">
            {/* 蓝色线条装饰 - 右下角 */}
            <div className="absolute bottom-3 right-12 z-0">
              <Image 
                src="/blue-line.png" 
                alt="装饰线条" 
                width={60} 
                height={40}
                className="object-contain opacity-70"
              />
            </div>
            
            <div className="relative z-10">
              <p className="text-gray-700 text-sm leading-relaxed text-center">
                你的探索会让区域地图逐渐上色，<br/>
                出发探索城市更多角落吧！
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
