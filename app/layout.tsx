import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Cinzel } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/context/auth-context"
import { CartProvider } from "@/components/cart/cart-context"
import AuthGuard from "@/components/auth-guard"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Aegyptus - Ancient Egypt Explorer",
  description: "Explore ancient Egypt through interactive learning, virtual tours, and cultural experiences",
  keywords: ["ancient egypt", "history", "education", "virtual tours", "archaeology", "pharaohs"],
  authors: [{ name: "Aegyptus Team" }],
  creator: "Aegyptus",
  publisher: "Aegyptus",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://aegyptus.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Aegyptus - Ancient Egypt Explorer",
    description: "Explore ancient Egypt through interactive learning, virtual tours, and cultural experiences",
    url: "https://aegyptus.vercel.app",
    siteName: "Aegyptus",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aegyptus - Ancient Egypt Explorer",
    description: "Explore ancient Egypt through interactive learning, virtual tours, and cultural experiences",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aegyptus",
  },
  generator: "v0.dev",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#d4af37" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/ios/180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/ios/152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/ios/167.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/ios/120.png" />

        {/* Standard Favicons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/ios/32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/ios/16.png" />

        {/* PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Aegyptus" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#d4af37" />
        <meta name="msapplication-TileImage" content="/windows11/Square150x150Logo.scale-200.png" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Windows 11 Tiles */}
        <meta name="msapplication-square70x70logo" content="/windows11/SmallTile.scale-200.png" />
        <meta name="msapplication-square150x150logo" content="/windows11/Square150x150Logo.scale-200.png" />
        <meta name="msapplication-wide310x150logo" content="/windows11/Wide310x150Logo.scale-200.png" />
        <meta name="msapplication-square310x310logo" content="/windows11/LargeTile.scale-200.png" />
      </head>
      <body className={`${inter.variable} ${cinzel.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <AuthGuard>{children}</AuthGuard>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
