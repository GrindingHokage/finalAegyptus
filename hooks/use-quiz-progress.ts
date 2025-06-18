"use client"

import React, { useState, useEffect } from "react"

export interface QuizProgress {
  id: string
  currentQuestion: number
  score: number
  started: boolean
  completed: boolean
  totalQuestions: number
  timeRemaining?: number
}

export function useQuizProgress() {
  const [completedQuizzes, setCompletedQuizzes] = useState<QuizProgress[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load quiz progress from localStorage on mount
  useEffect(() => {
    const loadProgress = () => {
      try {
        const savedProgress = localStorage.getItem("aegyptus-quiz-progress")
        if (savedProgress) {
          const parsedProgress = JSON.parse(savedProgress)
          setCompletedQuizzes(parsedProgress)
        }
      } catch (error) {
        console.error("Failed to load quiz progress:", error)
      }
      setIsLoaded(true)
    }

    loadProgress()
  }, [])

  // Save quiz progress to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("aegyptus-quiz-progress", JSON.stringify(completedQuizzes))
    }
  }, [completedQuizzes, isLoaded])

  // Memoize the saveQuizProgress function to prevent unnecessary re-renders
  const saveQuizProgress = React.useCallback((progress: QuizProgress) => {
    setCompletedQuizzes((prev) => {
      const existingIndex = prev.findIndex((p) => p.id === progress.id)
      if (existingIndex >= 0) {
        // Only update if there are actual changes
        const currentProgress = prev[existingIndex]
        if (JSON.stringify(currentProgress) === JSON.stringify(progress)) {
          return prev // No changes, return the same array
        }

        const updated = [...prev]
        updated[existingIndex] = progress
        return updated
      } else {
        return [...prev, progress]
      }
    })
  }, [])

  // Memoize the getQuizProgress function
  const getQuizProgress = React.useCallback(
    (quizId: string): QuizProgress | undefined => {
      return completedQuizzes.find((quiz) => quiz.id === quizId)
    },
    [completedQuizzes],
  )

  const resetAllProgress = React.useCallback(() => {
    setCompletedQuizzes([])
    localStorage.removeItem("aegyptus-quiz-progress")
  }, [])

  return {
    completedQuizzes,
    saveQuizProgress,
    getQuizProgress,
    resetAllProgress,
  }
}
