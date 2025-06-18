"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

type User = {
  id: string
  email: string
  name: string
  provider: "email" | "google"
}

type AuthContextType = {
  user: User | null
  loading: boolean
  error: string | null
  loginWithEmailAndPassword: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Helper to set a mock cookie
  const setAuthCookie = (token: string) => {
    document.cookie = `aegyptus_auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure` // 7 days
  }

  // Helper to clear the mock cookie
  const clearAuthCookie = () => {
    document.cookie = "aegyptus_auth_token=; path=/; max-age=0; SameSite=Lax; Secure"
  }

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("aegyptus_user")
        const authCookie = document.cookie.split("; ").find((row) => row.startsWith("aegyptus_auth_token="))

        if (storedUser && authCookie) {
          setUser(JSON.parse(storedUser))
        } else {
          // If either is missing, ensure both are cleared
          localStorage.removeItem("aegyptus_user")
          clearAuthCookie()
        }
      } catch (err) {
        console.error("Error loading user from storage:", err)
        localStorage.removeItem("aegyptus_user")
        clearAuthCookie()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Simulate API delay
  const simulateDelay = () => new Promise((resolve) => setTimeout(resolve, 1000))

  // Login with email and password
  const loginWithEmailAndPassword = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      await simulateDelay()

      // Simple validation (in real app, this would be server-side)
      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split("@")[0],
        provider: "email",
      }

      localStorage.setItem("aegyptus_user", JSON.stringify(newUser))
      setAuthCookie("mock_jwt_token_email") // Set mock cookie
      setUser(newUser)
      router.push("/")

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      })
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to sign in")
      toast({
        title: "Authentication error",
        description: err.message || "Failed to sign in",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Login with Google (simulated)
  const loginWithGoogle = async () => {
    setLoading(true)
    setError(null)

    try {
      await simulateDelay()

      const newUser: User = {
        id: Date.now().toString(),
        email: "google.user@example.com",
        name: "Google User",
        provider: "google",
      }

      localStorage.setItem("aegyptus_user", JSON.stringify(newUser))
      setAuthCookie("mock_jwt_token_google") // Set mock cookie
      setUser(newUser)
      router.push("/")

      toast({
        title: "Welcome!",
        description: "You've successfully signed in with Google.",
      })
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to sign in with Google")
      toast({
        title: "Authentication error",
        description: err.message || "Failed to sign in with Google",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Sign up with email and password
  const signup = async (email: string, password: string, name: string) => {
    setLoading(true)
    setError(null)

    try {
      await simulateDelay()

      // Simple validation
      if (!email || !password || !name) {
        throw new Error("All fields are required")
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters")
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Please enter a valid email address")
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        provider: "email",
      }

      localStorage.setItem("aegyptus_user", JSON.stringify(newUser))
      setAuthCookie("mock_jwt_token_signup") // Set mock cookie
      setUser(newUser)
      router.push("/")

      toast({
        title: "Account created!",
        description: "Welcome to AEGYPTUS.",
      })
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to create account")
      toast({
        title: "Registration error",
        description: err.message || "Failed to create account",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Logout
  const logout = async () => {
    setLoading(true)

    try {
      localStorage.removeItem("aegyptus_user")
      clearAuthCookie() // Clear mock cookie
      setUser(null)
      router.push("/auth/signin")

      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      })
    } catch (err: any) {
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        loginWithEmailAndPassword,
        loginWithGoogle,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
