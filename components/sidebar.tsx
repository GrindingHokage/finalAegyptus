"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Languages, ShoppingBag, Glasses, Map, BookOpen, User, AlignJustify, X } from "lucide-react"
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const isMobile = useIsMobile()

  // Handle dropdown state changes
  const handleDropdownOpenChange = (open: boolean) => {
    setIsDropdownOpen(open)
  }

  // Close sidebar when clicking outside (but not on navigation items)
  const handleBackdropClick = () => {
    if (!isDropdownOpen) {
      setIsOpen(false)
    }
  }

  // Handle navigation item click
  const handleNavClick = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Menu button - Always visible */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-accent"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <AlignJustify className="h-6 w-6" />}
      </Button>

      {/* Backdrop overlay */}
      {isOpen && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30" onClick={handleBackdropClick} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-background border-r border-border transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
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
                    onClick={handleNavClick}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-border p-4">
            <ThemeToggle onDropdownOpenChange={handleDropdownOpenChange} />
          </div>
        </div>
      </div>
    </>
  )
}
