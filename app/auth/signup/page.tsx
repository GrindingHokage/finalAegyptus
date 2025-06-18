"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/context/auth-context"

export default function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false,
  })

  const { signup, loginWithGoogle, loading } = useAuth()
  const router = useRouter()

  // Check password strength
  useEffect(() => {
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const hasMinLength = password.length >= 8

    let score = 0
    if (hasUppercase) score++
    if (hasNumber) score++
    if (hasSpecialChar) score++
    if (hasMinLength) score++

    setPasswordStrength({
      score,
      hasUppercase,
      hasNumber,
      hasSpecialChar,
      hasMinLength,
    })
  }, [password])

  const getStrengthText = () => {
    const { score } = passwordStrength
    if (score === 0) return "Weak"
    if (score === 1) return "Weak"
    if (score === 2) return "Medium"
    if (score === 3) return "Good"
    return "Strong"
  }

  const getStrengthColor = () => {
    const { score } = passwordStrength
    if (score === 0) return "bg-red-500"
    if (score === 1) return "bg-red-500"
    if (score === 2) return "bg-yellow-500"
    if (score === 3) return "bg-green-500"
    return "bg-green-500"
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("Passwords don't match")
      return
    }

    if (!agreedToTerms) {
      alert("You must agree to the Terms & Conditions and Privacy Policy")
      return
    }

    await signup(email, password, name)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 text-[#FFD700]">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path
                fill="currentColor"
                d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,3.18L19,6.3V11.22C19,12.92 18.5,14.65 17.65,16.17C16,14.94 13.26,14.5 12,14.5C10.74,14.5 8,14.94 6.35,16.17C5.5,14.65 5,12.92 5,11.22V6.3L12,3.18M12,6A3.5,3.5 0 0,0 8.5,9.5A3.5,3.5 0 0,0 12,13A3.5,3.5 0 0,0 15.5,9.5A3.5,3.5 0 0,0 12,6M12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8Z"
              />
            </svg>
          </div>
        </div>

        <h1 className="font-cinzel text-4xl font-bold text-gold text-center mb-2">Join the Journey Through Time</h1>

        <p className="text-center text-muted-foreground mb-8">Create your account to explore ancient Egypt's wonders</p>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 border-gold/20 focus-visible:ring-gold focus-visible:border-gold/50"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 border-gold/20 focus-visible:ring-gold focus-visible:border-gold/50"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 border-gold/20 focus-visible:ring-gold focus-visible:border-gold/50"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>

              {/* Password strength indicator */}
              {password && (
                <>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Password strength:</span>
                      <span
                        className={`font-medium ${
                          passwordStrength.score >= 3
                            ? "text-green-500"
                            : passwordStrength.score >= 2
                              ? "text-yellow-500"
                              : "text-red-500"
                        }`}
                      >
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getStrengthColor()}`}
                        style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <span className={`${passwordStrength.hasUppercase ? "text-green-500" : "text-muted-foreground"}`}>
                        {passwordStrength.hasUppercase ? <Check size={12} /> : "•"}
                      </span>
                      <span>Uppercase letter</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`${passwordStrength.hasNumber ? "text-green-500" : "text-muted-foreground"}`}>
                        {passwordStrength.hasNumber ? <Check size={12} /> : "•"}
                      </span>
                      <span>Number</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`${passwordStrength.hasMinLength ? "text-green-500" : "text-muted-foreground"}`}>
                        {passwordStrength.hasMinLength ? <Check size={12} /> : "•"}
                      </span>
                      <span>8+ characters</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className={`${passwordStrength.hasSpecialChar ? "text-green-500" : "text-muted-foreground"}`}
                      >
                        {passwordStrength.hasSpecialChar ? <Check size={12} /> : "•"}
                      </span>
                      <span>Special character</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10 border-gold/20 focus-visible:ring-gold focus-visible:border-gold/50"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
              className="border-gold/20 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
            />
            <label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <Link href="/terms" className="text-gold hover:text-gold/80 transition-colors">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-gold hover:text-gold/80 transition-colors">
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full bg-gold hover:bg-gold/90 text-black font-medium"
            disabled={loading || !agreedToTerms}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gold/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or sign up with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-gold/20 hover:border-gold/50 flex items-center justify-center gap-2"
            onClick={loginWithGoogle}
            disabled={loading}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-gold hover:text-gold/80 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
