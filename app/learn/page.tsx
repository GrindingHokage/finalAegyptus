"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, BookOpen, Star, Crown, History, CheckCircle, Brain } from "lucide-react"
import { quizData } from "@/lib/quiz-data"
import { useQuizProgress } from "@/hooks/use-quiz-progress"

// Sample data for courses
const allCourses = [
  {
    id: 1,
    title: "Hieroglyphs for Beginners",
    description: "Learn to read and write basic hieroglyphic symbols and understand their meanings",
    level: "Beginner",
    lessons: 31,
    duration: "7+ hours",
    image: "/placeholder.svg?height=120&width=120",
    link: "/learn/courses/hieroglyphs-for-beginners",
  },
  {
    id: 2,
    title: "Ancient Egypt Documentaries",
    description: "Comprehensive documentary series exploring ancient Egyptian civilization",
    level: "All Levels",
    lessons: 12,
    duration: "10+ hours",
    image: "/placeholder.svg?height=120&width=120",
    link: "/learn/courses/ancient-egypt-documentaries",
  },
  {
    id: 3,
    title: "Egyptian Mythology",
    description: "Explore the gods and myths of ancient Egypt and their cultural significance",
    level: "Intermediate",
    lessons: 8,
    duration: "3 hours",
    image: "/placeholder.svg?height=120&width=120",
    link: "#",
  },
  {
    id: 4,
    title: "Egyptian Architecture",
    description: "The principles and evolution of ancient Egyptian building techniques",
    level: "Intermediate",
    lessons: 10,
    duration: "4 hours",
    image: "/placeholder.svg?height=120&width=120",
    link: "#",
  },
]

const getLevelColor = (level: string) => {
  switch (level.toLowerCase()) {
    case "beginner":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "intermediate":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20"
    case "advanced":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    case "all levels":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20"
  }
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-500"
    case "medium":
      return "bg-orange-500"
    case "hard":
      return "bg-red-500"
    default:
      return "bg-slate-500"
  }
}

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState("courses")
  const { completedQuizzes, getQuizProgress } = useQuizProgress()

  // Get featured quizzes (limit to 3)
  const featuredQuizzes = quizData.slice(0, 3)

  return (
    <div className="container py-8 px-4 max-w-4xl">
      <h1 className="font-cinzel text-3xl font-bold mb-8 text-gold">Learn</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="courses" className="data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
            Courses
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
            Quizzes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-8">
          {/* All Courses Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">All Courses</h2>
            <div className="space-y-4">
              {allCourses.map((course) => (
                <Link href={course.link} key={course.id}>
                  <Card className="border-gold/20 hover:border-gold/50 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                          <Image
                            src={
                              course.id === 1
                                ? "https://lh3.googleusercontent.com/pw/AP1GczMTvOeTDk1ndlRjolGVMNsDtryEN_P23fCHHVbpqNnWnkrofI6Hlfa1sijtd8MTmfdBUFcm3AfqLxgRapQNHbNPuovAkK4tdx9Y2tEQvhiUjfrEmyBPkRqb7g0h1I7h4izwXWlNpz6CCWMDleMrDUMz=w880-h880-s-no-gm?authuser=0"
                                : course.id === 2
                                  ? "https://lh3.googleusercontent.com/pw/AP1GczOLizWPIN1Qs7mVZW4FX_axdqn3HPzsgXoIlQGEX665N0NdSFqm3O9Tb8l9SqJMgSEXAY_xDSMYsXH_W1IIfcR3oH3D6vyCmdAATGtZWaSiyoQOMqib8TequkshRWp6HCOZBHwUeaR8UcGyAq3PU3s=w869-h869-s-no-gm?authuser=0"
                                  : course.image || "/placeholder.svg"
                            }
                            alt={course.title}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{course.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                            </div>
                            <Badge variant="outline" className={getLevelColor(course.level)}>
                              {course.level}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {course.lessons} {course.id === 2 ? "documentaries" : "lessons"}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {course.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-8">
          {/* Featured Quizzes Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Featured Quizzes</h2>
              <Link href="/learn/quiz">
                <Button variant="link" className="text-gold">
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredQuizzes.map((quiz) => {
                const progress = getQuizProgress(quiz.id)
                const isCompleted = progress?.completed || false
                const score = progress?.score || 0
                const totalQuestions = quiz.questions.length

                return (
                  <Card key={quiz.id} className="border-gold/20 hover:border-gold/50 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{quiz.title}</CardTitle>
                        <Badge className={`${getDifficultyColor(quiz.difficulty)} text-white`}>{quiz.difficulty}</Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {quiz.questions.length} questions • {quiz.estimatedTime} min
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      {isCompleted ? (
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-green-500">
                            <CheckCircle className="h-3 w-3" />
                            <span>Completed</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-gold text-gold" />
                            <span>
                              {score}/{totalQuestions}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Brain className="h-3 w-3" />
                          <span>Test your knowledge</span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Link href={`/learn/quiz/${quiz.id}`} className="w-full">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-gold/20 hover:border-gold/50 text-xs"
                        >
                          {isCompleted ? "Retake Quiz" : "Start Quiz"}
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Quiz Stats */}
          <Card className="border-gold/20 bg-gradient-to-r from-gold/5 to-gold/10">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <History className="h-5 w-5 text-gold" />
                Your Quiz History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg border border-gold/20">
                  <span className="text-xl font-bold text-gold">{completedQuizzes.length}</span>
                  <span className="text-xs text-muted-foreground">Quizzes Completed</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg border border-gold/20">
                  <span className="text-xl font-bold text-gold">
                    {completedQuizzes.reduce((total, quiz) => total + quiz.score, 0)}
                  </span>
                  <span className="text-xs text-muted-foreground">Total Score</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg border border-gold/20">
                  <span className="text-xl font-bold text-gold">
                    {completedQuizzes.length > 0
                      ? Math.round(
                          completedQuizzes.reduce(
                            (total, quiz) => total + (quiz.score / quiz.totalQuestions) * 100,
                            0,
                          ) / completedQuizzes.length,
                        )
                      : 0}
                    %
                  </span>
                  <span className="text-xs text-muted-foreground">Average Score</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/learn/quiz" className="w-full">
                <Button className="w-full bg-gold hover:bg-gold/90 text-black">
                  <Crown className="mr-2 h-4 w-4" />
                  Take a Quiz
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Daily Challenge */}
          <Card className="border-gold/20 bg-gradient-to-r from-gold/5 to-gold/10">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gold flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Daily Challenge
                  </h3>
                  <p className="text-muted-foreground">Complete today's quiz to earn bonus points</p>
                </div>
                <Link href="/learn/quiz/daily-life">
                  <Button className="bg-gold hover:bg-gold/90 text-black font-medium">Start Challenge</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
