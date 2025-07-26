"use client"

import { Home, Star, User, MapPin, Search, Upload, User2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/30 backdrop-blur-md border-t border-white/30 shadow-lg z-20">
      <div className="flex items-center justify-around h-full">
        <Link href="/">
          <button
            className={`flex flex-col items-center justify-center w-20 h-full ${isActive("/") ? "text-neutral-800" : "text-neutral-500"
              }`}
          >
            <div className={`p-2 rounded-full ${isActive("/") ? "bg-white/50" : ""}`}>
              <MapPin size={20} />
            </div>
          </button>
        </Link>

        <Link href="/bottle">
          <button
            className={`flex flex-col items-center justify-center w-20 h-full ${isActive("/bottle") ? "text-neutral-800" : "text-neutral-500"
              }`}
          >
            <div className={`p-2 rounded-full ${isActive("/bottle") ? "bg-white/50" : ""}`}>
              <Star size={20} />
            </div>
          </button>
        </Link>

        <Link href="/profile">
          <button
            className={`flex flex-col items-center justify-center w-20 h-full ${isActive("/profile") ? "text-neutral-800" : "text-neutral-500"
              }`}
          >
            <div className={`p-2 rounded-full ${isActive("/profile") ? "bg-white/50" : ""}`}>
              <User size={20} />
            </div>
          </button>
        </Link>
      </div>
    </div>
  )
}
