import type React from "react"
import "./globals.css"
import { Caveat } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import PWAInstallPrompt from "@/components/pwa-install-prompt"
import ServiceWorkerRegister from "./service-worker-register"
import { Toaster } from "@/components/ui/sonner"

// Load Caveat font
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-caveat",
})

export const metadata = {
  title: "摇一摇故事瓶",
  description: "一个城市互动的故事讲述应用",
  generator: 'Next.js',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '故事瓶'
  }
}

export const viewport = {
  themeColor: '#F4C430',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${caveat.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Toaster />
          {children}
          <PWAInstallPrompt />
          <ServiceWorkerRegister />
        </ThemeProvider>
      </body>
    </html>
  )
}
