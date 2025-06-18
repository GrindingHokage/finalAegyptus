"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Trophy, CheckCircle, BookOpen, Brain, Home, Pyramid } from "lucide-react"
import { quizData } from "@/lib/quiz-data"
import { useQuizProgress } from "@/hooks/use-quiz-progress"

export default function QuizPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>("all")
  const { completedQuizzes, getQuizProgress } = useQuizProgress()

  const filterQuizzes = (category: string) => {
    if (category === "all") return quizData
    return quizData.filter((quiz) => quiz.category === category)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500 hover:bg-green-600"
      case "medium":
        return "bg-amber-500 hover:bg-amber-600"
      case "hard":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-slate-500 hover:bg-slate-600"
    }
  }

  const getDifficultyStars = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return 1
      case "medium":
        return 2
      case "hard":
        return 3
      default:
        return 0
    }
  }

  return (
    <div className="container py-8 px-4 max-w-4xl">
      <h1 className="font-cinzel text-3xl font-bold mb-6 text-gold">Knowledge Quizzes</h1>

      <div className="mb-8">
        <p className="text-muted-foreground">
          Test your knowledge of Ancient Egypt with our interactive quizzes. Complete quizzes to earn points and track
          your progress.
        </p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="all" className="data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
            All Quizzes
          </TabsTrigger>
          <TabsTrigger value="hieroglyphs" className="data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
            Hieroglyphs
          </TabsTrigger>
          <TabsTrigger value="pyramids" className="data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
            Pyramids
          </TabsTrigger>
          <TabsTrigger value="daily-life" className="data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
            Daily Life
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filterQuizzes(activeTab).map((quiz) => {
              const progress = getQuizProgress(quiz.id)
              const isCompleted = progress?.completed || false
              const score = progress?.score || 0
              const totalQuestions = quiz.questions.length

              return (
                <Card key={quiz.id} className="border-gold/20 hover:border-gold/50 transition-colors overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          {quiz.category === "hieroglyphs" && <BookOpen className="h-4 w-4 text-gold" />}
                          {quiz.category === "pyramids" && <Pyramid className="h-4 w-4 text-gold" />}
                          {quiz.category === "daily-life" && <Home className="h-4 w-4 text-gold" />}
                          <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        </div>
                        <CardDescription className="mt-1">
                          {quiz.questions.length} questions • {quiz.estimatedTime} min
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`${getDifficultyColor(quiz.difficulty)} text-white`}>{quiz.difficulty}</Badge>
                        <div className="flex">
                          {Array(getDifficultyStars(quiz.difficulty))
                            .fill(0)
                            .map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-gold text-gold" />
                            ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{quiz.description}</p>

                    {isCompleted ? (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-green-500">
                          <CheckCircle className="h-4 w-4" />
                          <span>Completed</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4 text-gold" />
                          <span className="font-medium">
                            {score}/{totalQuestions} correct
                          </span>
                        </div>
                      </div>
                    ) : progress?.started ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {progress.currentQuestion}/{totalQuestions} questions
                          </span>
                        </div>
                        <Progress value={(progress.currentQuestion / totalQuestions) * 100} className="h-2" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Brain className="h-4 w-4" />
                        <span>Not started yet</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button
                      className="w-full bg-gold hover:bg-gold/90 text-black"
                      onClick={() => router.push(`/learn/quiz/${quiz.id}`)}
                    >
                      {isCompleted ? "Retake Quiz" : progress?.started ? "Continue Quiz" : "Start Quiz"}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quiz Stats */}
      <Card className="mt-8 border-gold/20 bg-gradient-to-r from-gold/5 to-gold/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-gold" />
            Your Quiz Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg border border-gold/20">
              <span className="text-2xl font-bold text-gold">{completedQuizzes.length}</span>
              <span className="text-sm text-muted-foreground">Quizzes Completed</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg border border-gold/20">
              <span className="text-2xl font-bold text-gold">
                {completedQuizzes.reduce((total, quiz) => total + quiz.score, 0)}
              </span>
              <span className="text-sm text-muted-foreground">Total Score</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg border border-gold/20">
              <span className="text-2xl font-bold text-gold">
                {completedQuizzes.length > 0
                  ? Math.round(
                      completedQuizzes.reduce((total, quiz) => total + (quiz.score / quiz.totalQuestions) * 100, 0) /
                        completedQuizzes.length,
                    )
                  : 0}
                %
              </span>
              <span className="text-sm text-muted-foreground">Average Score</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
