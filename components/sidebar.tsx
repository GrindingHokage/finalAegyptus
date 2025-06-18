"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Languages, ShoppingBag, Glasses, Map, BookOpen, User, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useIsMobile } from "@/hooks/use-mobile"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Translate", href: "/translate", icon: Languages },
  { name: "Bazaar", href: "/bazaar", icon: ShoppingBag },
  { name: "VR", href: "/vr", icon: Glasses },
  { name: "Sites", href: "/sites", icon: Map },
  { name: "Learn", href: "/learn", icon: BookOpen },
  { name: "Profile", href: "/profile", icon: User },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const isMobile = useIsMobile()

  // Reset hover state when switching between mobile and desktop
  useEffect(() => {
    setIsHovering(false)
  }, [isMobile])

  // Handle hover area for desktop
  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovering(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovering(false)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Hover trigger area for desktop */}
      <div className="fixed left-0 top-0 h-full w-4 z-30 hidden md:block" onMouseEnter={handleMouseEnter} />

      {/* Backdrop overlay for mobile */}
      {isOpen && isMobile && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar for desktop and mobile */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-background border-r border-border transition-transform duration-300 ease-in-out",
          isMobile
            ? isOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : isHovering
              ? "translate-x-0"
              : "-translate-x-full",
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-center h-16 border-b border-border">
            <h1 className="font-cinzel text-2xl font-bold text-gold">AEGYPTUS</h1>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-gold/10 text-gold border border-gold/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    )}
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-border p-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  )
}
