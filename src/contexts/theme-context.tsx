"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme") as Theme
    return stored || "light"
  })

  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const root = window.document.documentElement

    const updateTheme = () => {
      let newActualTheme: "light" | "dark" = "light"

      if (theme === "system") {
        newActualTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      } else {
        newActualTheme = theme
      }

      setActualTheme(newActualTheme)

      root.classList.remove("light", "dark")
      root.classList.add(newActualTheme)
    }

    updateTheme()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (theme === "system") {
        updateTheme()
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  useEffect(() => {
    localStorage.setItem("theme", theme)
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
