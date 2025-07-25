import type React from "react"
import "./globals.css"
import { Caveat } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

// Load Caveat font
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-caveat",
})

export const metadata = {
  title: "Story Bottle",
  description: "A city-interactive storytelling app",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${caveat.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
