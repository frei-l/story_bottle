"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface ToastProps {
  title: string
  description?: string
  icon?: React.ReactNode
  onClose: () => void
}

export function Toast({ title, description, icon, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-4 w-[90%] max-w-sm z-50 flex items-center border border-white/50"
        >
          {icon && <div className="mr-3 text-neutral-800">{icon}</div>}
          <div className="flex-1">
            <h3 className="font-medium text-neutral-800">{title}</h3>
            {description && <p className="text-sm text-neutral-600">{description}</p>}
          </div>
          <button onClick={handleClose} className="ml-2 text-neutral-500 hover:text-neutral-800">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export const ToastViewport = () => {
  return null
}

export const ToastTitle = () => {
  return null
}

export const ToastDescription = () => {
  return null
}

export const ToastClose = () => {
  return null
}

export const ToastAction = () => {
  return null
}
