"use client"

import { Home, Map, User } from "lucide-react"

interface NavigationProps {
  currentScreen: string
  onNavigate: (screen: "home" | "selection" | "map" | "footprints") => void
}

export default function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/30 backdrop-blur-md border-t border-white/30 shadow-lg z-20">
      <div className="flex items-center justify-around h-full">
        <button
          onClick={() => onNavigate("home")}
          className={`flex flex-col items-center justify-center w-20 h-full ${
            currentScreen === "home" ? "text-neutral-800" : "text-neutral-500"
          }`}
        >
          <div className={`p-2 rounded-full ${currentScreen === "home" ? "bg-white/50" : ""}`}>
            <Home size={20} />
          </div>
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          onClick={() => onNavigate("footprints")}
          className={`flex flex-col items-center justify-center w-20 h-full ${
            currentScreen === "footprints" ? "text-neutral-800" : "text-neutral-500"
          }`}
        >
          <div className={`p-2 rounded-full ${currentScreen === "footprints" ? "bg-white/50" : ""}`}>
            <Map size={20} />
          </div>
          <span className="text-xs mt-1">Footprints</span>
        </button>
        <button className="flex flex-col items-center justify-center w-20 h-full text-neutral-500">
          <div className="p-2 rounded-full">
            <User size={20} />
          </div>
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  )
}
