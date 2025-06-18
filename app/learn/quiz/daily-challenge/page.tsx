"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Loader2 } from "lucide-react"

export default function DailyChallengeRedirect() {
  const router = useRouter()

  // Get today's date to determine which quiz to show
  useEffect(() => {
    // Simple rotation of quizzes based on day of month
    const today = new Date()
    const dayOfMonth = today.getDate()

    // Rotate between the 3 quizzes based on day of month
    const quizIds = ["hieroglyph-basics", "pyramid-facts", "daily-life"]
    const todaysQuizIndex = dayOfMonth % quizIds.length
    const todaysQuizId = quizIds[todaysQuizIndex]

    // Redirect after a short delay
    const timer = setTimeout(() => {
      router.push(`/learn/quiz/${todaysQuizId}?daily=true`)
    }, 1500)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="container py-8 px-4 max-w-3xl flex items-center justify-center min-h-[60vh]">
      <Card className="border-gold/20 w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-gold" />
          </div>
          <CardTitle className="text-2xl">Daily Challenge</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">Loading today's special quiz challenge...</p>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
          <Button
            variant="outline"
            className="border-gold/20 hover:border-gold/50"
            onClick={() => router.push("/learn/quiz")}
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
