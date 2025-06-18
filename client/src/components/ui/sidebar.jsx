import React, { createContext, useContext, useState } from "react"
import { cn } from "@/lib/utils"

const SidebarContext = createContext({})

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function Sidebar({ children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <div
        className={cn(
          "flex h-screen flex-col border-r bg-background transition-all duration-300",
          open ? "w-64" : "w-16"
        )}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

export function SidebarHeader({ children, className }) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {children}
    </div>
  )
}

export function SidebarContent({ children, className }) {
  return (
    <div className={cn("flex-1 overflow-auto", className)}>
      {children}
    </div>
  )
}

export function SidebarFooter({ children, className }) {
  return (
    <div className={cn("mt-auto", className)}>
      {children}
    </div>
  )
}

export function SidebarMenu({ children, className }) {
  return (
    <nav className={cn("space-y-1 px-2", className)}>
      {children}
    </nav>
  )
}

export function SidebarMenuItem({ children, className }) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  )
}

export function SidebarMenuButton({ children, className, asChild = false, ...props }) {
  const Comp = asChild ? React.Fragment : "button"
  return (
    <Comp
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
} 