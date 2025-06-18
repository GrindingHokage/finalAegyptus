import type React from "react"
import type { Metadata } from "next"
import { Inter, Cinzel_Decorative } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/components/cart/cart-context"
import { AuthProvider } from "@/context/auth-context"
import { Toaster } from "@/components/ui/toaster"
import AuthGuard from "@/components/auth-guard" // Import AuthGuard

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const cinzel = Cinzel_Decorative({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-cinzel",
})

export const metadata: Metadata = {
  title: "AEGYPTUS - Ancient Egypt Reimagined",
  description: "Explore ancient Egyptian civilization through AI, VR, and virtual tourism",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${cinzel.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          <AuthProvider>
            <CartProvider>
              <div className="min-h-screen">
                <AuthGuard>
                  <div className="flex min-h-screen">
                    <Sidebar />
                    <main className="flex-1 overflow-auto">{children}</main>
                  </div>
                </AuthGuard>
              </div>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
