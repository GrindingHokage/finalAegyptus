import { useState, useEffect } from "react"
;("use client")

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, CheckCircle, XCircle, Trophy, ArrowRight, Crown } from "lucide-react"
import { quizData } from "@/lib/quiz-data"
import { useQuizProgress } from "@/hooks/use-quiz-progress"
import { cn } from "@/lib/utils"

export default function QuizDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isDailyChallenge = searchParams.get("daily") === "true"

  const quizId = params.id as string
  const quiz = quizData.find((q) => q.id === quizId)

  const { saveQuizProgress, getQuizProgress } = useQuizProgress()
  const savedProgress = getQuizProgress(quizId)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(savedProgress?.currentQuestion || 0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(savedProgress?.score || 0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(quiz ? quiz.estimatedTime * 60 : 600) // in seconds
  const [timerActive, setTimerActive] = useState(true)

  useEffect(() => {
    if (!quiz) {
      router.push("/learn/quiz")
      return
    }

    // Initialize or restore timer
    if (savedProgress?.timeRemaining) {
      setTimeRemaining(savedProgress.timeRemaining)
    }

    // Start timer
    let timer: NodeJS.Timeout
    if (timerActive && !quizCompleted) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setTimerActive(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [quiz, router, timerActive, quizCompleted, savedProgress])

  // Save progress whenever it changes
  useEffect(() => {
    // Only save progress when these values actually change
    // and avoid saving on every render
    const saveProgress = () => {
      if (quiz) {
        saveQuizProgress({
          id: quiz.id,
          currentQuestion: currentQuestionIndex,
          score,
          started: true,
          completed: quizCompleted,
          totalQuestions: quiz.questions.length,
          timeRemaining,
        })
      }
    }

    // Use a timeout to debounce frequent updates
    const timeoutId = setTimeout(saveProgress, 300)

    return () => clearTimeout(timeoutId)
  }, [currentQuestionIndex, score, quizCompleted, timeRemaining, quiz, saveQuizProgress])

  if (!quiz) {
    return <div>Loading...</div>
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const totalQuestions = quiz.questions.length
  const progress = (currentQuestionIndex / totalQuestions) * 100

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return

    const isAnswerCorrect = selectedAnswer === currentQuestion.correctAnswer
    setIsCorrect(isAnswerCorrect)
    setIsAnswerSubmitted(true)

    if (isAnswerCorrect) {
      setScore((prev) => prev + 1)
    }
  }

  const handleNextQuestion = () => {
    setSelectedAnswer(null)
    setIsAnswerSubmitted(false)

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setQuizCompleted(true)
      setTimerActive(false)
    }
  }

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setIsAnswerSubmitted(false)
    setIsCorrect(false)
    setScore(0)
    setQuizCompleted(false)
    setTimeRemaining(quiz.estimatedTime * 60)
    setTimerActive(true)
  }

  return (
    <div className="container py-8 px-4 max-w-3xl">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/learn/quiz")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-cinzel text-xl md:text-2xl font-bold ml-2 text-gold">
          {isDailyChallenge ? "Daily Challenge: " : ""}
          {quiz.title}
        </h1>
        {isDailyChallenge && <Crown className="ml-2 h-5 w-5 text-gold" />}
      </div>

      {!quizCompleted ? (
        <Card className="border-gold/20">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <CardTitle>
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </CardTitle>
                <Progress value={progress} className="h-2 mt-2" />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gold" />
                <span className={cn("font-mono", timeRemaining < 60 && "text-red-500 animate-pulse")}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="space-y-6">
              <div className="text-lg font-medium">{currentQuestion.question}</div>

              <RadioGroup
                value={selectedAnswer || ""}
                onValueChange={(value) => {
                  if (value !== selectedAnswer) {
                    setSelectedAnswer(value)
                  }
                }}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, index) => {
                  const optionKey = String.fromCharCode(65 + index) // A, B, C, D
                  const isSelected = selectedAnswer === optionKey
                  const showCorrect = isAnswerSubmitted && optionKey === currentQuestion.correctAnswer
                  const showIncorrect = isAnswerSubmitted && isSelected && !isCorrect

                  return (
                    <div
                      key={optionKey}
                      className={cn(
                        "flex items-center space-x-2 rounded-md border p-3 cursor-pointer transition-colors",
                        isSelected && !isAnswerSubmitted && "border-gold bg-gold/5",
                        showCorrect && "border-green-500 bg-green-500/10",
                        showIncorrect && "border-red-500 bg-red-500/10",
                        isAnswerSubmitted ? "pointer-events-none" : "hover:border-gold/50",
                      )}
                    >
                      <RadioGroupItem
                        value={optionKey}
                        id={`option-${optionKey}`}
                        disabled={isAnswerSubmitted}
                        className={cn(
                          showCorrect && "text-green-500 border-green-500",
                          showIncorrect && "text-red-500 border-red-500",
                        )}
                      />
                      <Label htmlFor={`option-${optionKey}`} className="flex-1 cursor-pointer font-normal">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium mr-2">{optionKey}.</span>
                            {option}
                          </div>
                          {showCorrect && <CheckCircle className="h-5 w-5 text-green-500" />}
                          {showIncorrect && <XCircle className="h-5 w-5 text-red-500" />}
                        </div>
                      </Label>
                    </div>
                  )
                })}
              </RadioGroup>

              {isAnswerSubmitted && (
                <div
                  className={cn(
                    "p-4 rounded-md",
                    isCorrect ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20",
                  )}
                >
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-medium">{isCorrect ? "Correct!" : "Incorrect!"}</span>
                  </div>
                  <p className="mt-2 text-sm">
                    {isCorrect
                      ? "Great job! You selected the right answer."
                      : `The correct answer is ${currentQuestion.correctAnswer}.`}
                  </p>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="pt-2">
            {!isAnswerSubmitted ? (
              <Button
                className="w-full bg-gold hover:bg-gold/90 text-black"
                onClick={handleAnswerSubmit}
                disabled={!selectedAnswer}
              >
                Submit Answer
              </Button>
            ) : (
              <Button className="w-full bg-gold hover:bg-gold/90 text-black" onClick={handleNextQuestion}>
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <>
                    Next Question <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Complete Quiz <Trophy className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <Card className="border-gold/20">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-gold" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">
              {isDailyChallenge ? "Daily Challenge Completed!" : "Quiz Completed!"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-gold">
                {score} / {totalQuestions}
              </p>
              <p className="text-muted-foreground mt-1">
                {score === totalQuestions
                  ? "Perfect score! Excellent work!"
                  : score >= totalQuestions * 0.7
                    ? "Great job! You did well."
                    : "Good effort! Keep learning."}
              </p>
            </div>

            <Separator className="bg-gold/20" />

            <div className="space-y-4">
              <h3 className="font-medium">Quiz Summary</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-background/50 rounded-lg border border-gold/20">
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                  <div className="text-xl font-bold mt-1">{Math.round((score / totalQuestions) * 100)}%</div>
                </div>

                <div className="p-4 bg-background/50 rounded-lg border border-gold/20">
                  <div className="text-sm text-muted-foreground">Time Taken</div>
                  <div className="text-xl font-bold mt-1">{formatTime(quiz.estimatedTime * 60 - timeRemaining)}</div>
                </div>
              </div>

              {isDailyChallenge && (
                <div className="p-4 bg-gold/10 rounded-lg border border-gold/30 mt-4">
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-gold" />
                    <h3 className="font-medium text-gold">Daily Challenge Bonus</h3>
                  </div>
                  <p className="text-sm mt-2">
                    You've earned {Math.round((score / totalQuestions) * 100)} bonus points for completing today's
                    challenge!
                  </p>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button className="w-full bg-gold hover:bg-gold/90 text-black" onClick={handleRestartQuiz}>
              Retake Quiz
            </Button>
            <Button
              variant="outline"
              className="w-full border-gold/20 hover:border-gold/50"
              onClick={() => router.push("/learn/quiz")}
            >
              Back to Quizzes
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
