"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Mail, ShieldQuestion } from "lucide-react" // Using ShieldQuestion for the main icon
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Basic email validation
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    // Simulate success
    setSubmitted(true)
    toast({
      title: "Password Reset Link Sent",
      description: "If an account with that email exists, a reset link has been sent to your inbox.",
    })
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-6">
          <ShieldQuestion className="w-20 h-20 text-gold" />
        </div>

        <h1 className="font-cinzel text-3xl font-bold text-gold text-center mb-2">Forgot Your Password?</h1>

        <p className="text-center text-muted-foreground mb-8">
          Enter your email address below and we'll send you a link to reset your password.
        </p>

        {submitted ? (
          <div className="text-center space-y-6">
            <div className="bg-green-500/10 text-green-500 p-4 rounded-md">
              <p>Password reset email sent! Check your inbox for further instructions.</p>
            </div>
            <Link href="/auth/signin">
              <Button className="bg-gold hover:bg-gold/90 text-black font-medium">Return to Sign In</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-gold/20 focus-visible:ring-gold focus-visible:border-gold/50"
                  required
                  aria-label="Email address"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-black font-medium" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>

            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link href="/auth/signin" className="text-gold hover:text-gold/80 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
