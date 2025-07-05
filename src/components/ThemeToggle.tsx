
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className, variant = 'default' }: { className?: string; variant?: 'default' | 'icon' }) {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "rounded-full shadow-lg",
        variant === 'default' && 'h-14 w-14',
        variant === 'icon' && 'h-10 w-10',
        className
      )}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className={cn(
        "rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0",
        variant === 'default' && 'h-[1.8rem] w-[1.8rem]',
        variant === 'icon' && 'h-[1.2rem] w-[1.2rem]'
      )} />
      <Moon className={cn(
        "absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100",
        variant === 'default' && 'h-[1.8rem] w-[1.8rem]',
        variant === 'icon' && 'h-[1.2rem] w-[1.2rem]'
      )} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
