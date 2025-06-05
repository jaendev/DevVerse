'use client'

import { useEffect, useState } from "react"
import { useAuthStore, useThemeStore } from "@/src/stores"

interface StoreProviderProps {
  children: React.ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {

  const [isHydrated, setIsHydrated] = useState(false)
  const { checkAuth } = useAuthStore()
  const { setTheme, theme } = useThemeStore()

  useEffect(() => {

    // Hydrate store before mouthing component
    setIsHydrated(true)

    // Apply initial theme
    const root = window.document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    // Check auth
    checkAuth()
  }, [setTheme, theme, checkAuth])

  // Show content after hydration to prevent mismatches SSR
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return <>{children}</>
}