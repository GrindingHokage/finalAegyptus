"use client"

import type React from "react"

import { useAuth } from "@/context/auth-context"
import { usePathname } from "next/navigation"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()

  // Check if current path is an auth page
  const isAuthPage = pathname.startsWith("/auth")

  // If we're on an auth page, don't show the sidebar layout
  if (isAuthPage) {
    return <>{children}</>
  }

  // If user is authenticated, show the full layout with sidebar
  if (user) {
    return <>{children}</>
  }

  // If loading or not authenticated, don't render anything (middleware will redirect)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return null
}
