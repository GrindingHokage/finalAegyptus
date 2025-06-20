"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Play, CheckCircle, Clock, Users, RotateCcw } from "lucide-react"

// Complete lesson data with all 31 lessons from CSV with exact titles, views, and video IDs
const lessonsData = [
  {
    id: 1,
    title: "History of the Egyptian Language | Ancient Egyptian Language Lesson 01",
    duration: "15:30",
    views: "28K",
    videoId: "g_TfXrMOkHY",
    description: "Learn the history and development of the ancient Egyptian language",
  },
  {
    id: 2,
    title: "Egyptian Alphabet | Ancient Egyptian Language Lesson 02",
    duration: "12:45",
    views: "20K",
    videoId: "krXJPYmU-nI",
    description: "Master the Egyptian alphabet and basic hieroglyphic signs",
  },
  {
    id: 3,
    title: "Hieroglyphic Biliteral signs | Ancient Egyptian Language Lesson 03",
    duration: "14:20",
    views: "10K",
    videoId: "XfuIS4EaKQY",
    description: "Understanding biliteral signs in hieroglyphic writing",
  },
  {
    id: 4,
    title: "Hieroglyphs starting with sound A | Ancient Egyptian Language Lesson 04",
    duration: "11:15",
    views: "7.6K",
    videoId: "iETq4uN2L0o",
    description: "Learn hieroglyphs that begin with the sound 'A'",
  },
  {
    id: 5,
    title: "Hieroglyphs starting with sound j | Ancient Egyptian Language Lesson 05",
    duration: "10:30",
    views: "5.3K",
    videoId: "B6EgA6ptn3M",
    description: "Explore hieroglyphs beginning with the 'j' sound",
  },
  {
    id: 6,
    title: "Hieroglyphs reading exercise | Ancient Egyptian Language Lesson 06",
    duration: "13:45",
    views: "4.3K",
    videoId: "u98xeU9EGnE",
    description: "Practice reading hieroglyphic texts with guided exercises",
  },
  {
    id: 7,
    title: "Hieroglyphs starting with 'ain' | Ancient Egyptian Language Lesson 07",
    duration: "9:20",
    views: "2.7K",
    videoId: "5tRtgszuvdY",
    description: "Learn hieroglyphs that start with the 'ain' sound",
  },
  {
    id: 8,
    title: "Hieroglyphs reading exercise | Ancient Egyptian Language Lesson 08",
    duration: "12:10",
    views: "2.9K",
    videoId: "18EUzfOu3qQ",
    description: "Additional reading practice with hieroglyphic texts",
  },
  {
    id: 9,
    title: "Feminine nouns | Ancient Egyptian Language Lesson 09",
    duration: "11:35",
    views: "2.5K",
    videoId: "1x30ScoFjkY",
    description: "Understanding feminine noun forms in ancient Egyptian",
  },
  {
    id: 10,
    title: "Plural nouns | Ancient Egyptian Language Lesson 10",
    duration: "10:45",
    views: "2.5K",
    videoId: "l8RLB_JclWU",
    description: "Learn how to form and recognize plural nouns",
  },
  {
    id: 11,
    title: "Let's read sentences in egyptian | Ancient Egyptian Language Lesson 11",
    duration: "16:20",
    views: "2.8K",
    videoId: "OjT_tWDoEig",
    description: "Practice reading complete sentences in ancient Egyptian",
  },
  {
    id: 12,
    title: "The Dual | Ancient Egyptian Language Lesson 12",
    duration: "8:50",
    views: "1.9K",
    videoId: "IguBEGbchVk",
    description: "Understanding the dual form in Egyptian grammar",
  },
  {
    id: 13,
    title: "Demonstrative pronouns | Ancient Egyptian Language Lesson 13",
    duration: "9:40",
    views: "2K",
    videoId: "3ggzvyd3f-U",
    description: "Learn demonstrative pronouns in ancient Egyptian",
  },
  {
    id: 14,
    title: "Possessive pronouns | Ancient Egyptian Language Lesson 14",
    duration: "10:15",
    views: "2K",
    videoId: "u6F2r7YC8m8",
    description: "Master possessive pronouns and their usage",
  },
  {
    id: 15,
    title: "Hieroglyphs reading exercise | Ancient Egyptian Language Lesson 15",
    duration: "14:30",
    views: "2.1K",
    videoId: "O83-fcc2KiA",
    description: "Advanced reading exercises with hieroglyphic texts",
  },
  {
    id: 16,
    title: "Adjectives | Ancient Egyptian Language Lesson 16",
    duration: "11:25",
    views: "1.4K",
    videoId: "MGjSwMRzN-g",
    description: "Understanding adjectives in ancient Egyptian grammar",
  },
  {
    id: 17,
    title: "Hieroglyphs reading exercise | Ancient Egyptian Language Lesson 17",
    duration: "13:15",
    views: "1.5K",
    videoId: "3hOD5JTxG5Q",
    description: "Continue practicing hieroglyphic reading skills",
  },
  {
    id: 18,
    title: "Read words | Ancient Egyptian Language Lesson 18",
    duration: "9:30",
    views: "1.3K",
    videoId: "-z6rEf1D9oM",
    description: "Practice reading individual Egyptian words",
  },
  {
    id: 19,
    title: "Read words | Ancient Egyptian Language Lesson 19",
    duration: "10:45",
    views: "1.3K",
    videoId: "JrKuLMLLBsk",
    description: "Continue word reading practice with new vocabulary",
  },
  {
    id: 20,
    title: "Short sentences in Egyptian | Ancient Egyptian Language Lesson 20",
    duration: "12:20",
    views: "1.4K",
    videoId: "Zv9gvdTlC2E",
    description: "Learn to construct and read short Egyptian sentences",
  },
  {
    id: 21,
    title: "Numbers and dates | Ancient Egyptian Language Lesson 21",
    duration: "15:10",
    views: "1.4K",
    videoId: "cwv-490wW9c",
    description: "Understanding Egyptian number system and date notation",
  },
  {
    id: 22,
    title: "Write hieroglyphics on your computer | Ancient Egyptian Language Lesson 22",
    duration: "18:45",
    views: "1.7K",
    videoId: "vtVSahk0vCE",
    description: "Learn how to type and write hieroglyphs digitally",
  },
  {
    id: 23,
    title: "Honorific transposition | Ancient Egyptian Language Lesson 23",
    duration: "11:30",
    views: "1.1K",
    videoId: "AV4iNEw-SSw",
    description: "Understanding honorific transposition in hieroglyphic writing",
  },
  {
    id: 24,
    title: "Reading exercise | Ancient Egyptian Language Lesson 24",
    duration: "13:40",
    views: "989",
    videoId: "n0I9h8Fb5KI",
    description: "Comprehensive reading exercise with various texts",
  },
  {
    id: 25,
    title: "Reading exercise | Ancient Egyptian Language Lesson 25",
    duration: "12:55",
    views: "974",
    videoId: "UqdnE2B5rzo",
    description: "Advanced reading practice with complex texts",
  },
  {
    id: 26,
    title: "Comparatives and superlatives | Ancient Egyptian Language Lesson 26",
    duration: "10:20",
    views: "935",
    videoId: "e9zOsjeNOBU",
    description: "Learn comparative and superlative forms in Egyptian",
  },
  {
    id: 27,
    title: "Reading exercise | Ancient Egyptian Language Lesson 27",
    duration: "14:15",
    views: "1.2K",
    videoId: "UsTCtuYOf_M",
    description: "Final reading exercises to test your skills",
  },
  {
    id: 28,
    title: "Nominal sentence | Ancient Egyptian Language Lesson 28",
    duration: "13:25",
    views: "1.5K",
    videoId: "zh4d1qBinUE",
    description: "Understanding nominal sentence structure in Egyptian",
  },
  {
    id: 29,
    title: "How did Champollion decipher the Rosetta Stone",
    duration: "19:30",
    views: "2.9K",
    videoId: "J6uL8dUmcy0",
    description: "The fascinating story of deciphering hieroglyphs",
  },
  {
    id: 30,
    title: "How did Champollion decipher the Rosetta Stone Part II",
    duration: "16:45",
    views: "1K",
    videoId: "0LA4N-CKjdY",
    description: "Continuation of the Rosetta Stone decipherment story",
  },
  {
    id: 31,
    title: "Scarab of Queen Tiye",
    duration: "12:30",
    views: "1.2K",
    videoId: "qVxfI0tdUFM",
    description: "Reading and understanding Queen Tiye's scarab inscription",
  },
]

const courseInfo = {
  title: "Hieroglyphs for Beginners",
  subtitle: "Learn to read and write basic hieroglyphs",
  difficulty: "Beginner",
  totalLessons: 31,
  totalDuration: "7:15:45",
  thumbnail:
    "https://lh3.googleusercontent.com/pw/AP1GczMTvOeTDk1ndlRjolGVMNsDtryEN_P23fCHHVbpqNnWnkrofI6Hlfa1sijtd8MTmfdBUFcm3AfqLxgRapQNHbNPuovAkK4tdx9Y2tEQvhiUjfrEmyBPkRqb7g0h1I7h4izwXWlNpz6CCWMDleMrDUMz=w880-h880-s-no-gm?authuser=0",
}

export default function HieroglyphsCoursePage() {
  const [completedLessons, setCompletedLessons] = useState<number[]>([])

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("hieroglyphs-progress")
    if (saved) {
      setCompletedLessons(JSON.parse(saved))
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem("hieroglyphs-progress", JSON.stringify(completedLessons))
  }, [completedLessons])

  const progressPercentage = (completedLessons.length / courseInfo.totalLessons) * 100

  return (
    <div className="container py-8 px-4 max-w-4xl">
      {/* Back Navigation */}
      <Link
        href="/learn"
        className="inline-flex items-center gap-2 text-gold hover:text-gold/80 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to courses
      </Link>

      {/* Course Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="w-full md:w-80 h-48 rounded-lg overflow-hidden bg-muted">
            <Image
              src={courseInfo.thumbnail || "/placeholder.svg"}
              alt={courseInfo.title}
              width={80}
              height={80}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="font-cinzel text-3xl font-bold text-gold mb-2">{courseInfo.title}</h1>
              <p className="text-muted-foreground text-lg">{courseInfo.subtitle}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                {courseInfo.difficulty}
              </Badge>
              <Badge variant="outline" className="border-gold/20">
                {courseInfo.totalLessons} lessons
              </Badge>
              <Badge variant="outline" className="border-gold/20">
                {courseInfo.totalDuration}
              </Badge>
            </div>

            {/* Progress Section */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Course Progress</span>
                <span className="text-gold">
                  {completedLessons.length}/{courseInfo.totalLessons} Complete
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-sm text-muted-foreground">{Math.round(progressPercentage)}% completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-6">Course Content</h2>

        {lessonsData.map((lesson) => {
          const isCompleted = completedLessons.includes(lesson.id)

          return (
            <Link key={lesson.id} href={`/learn/courses/hieroglyphs-for-beginners/lesson/${lesson.id}`}>
              <Card className="border-gold/20 hover:border-gold/50 transition-colors cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isCompleted && <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />}
                      <div>
                        <CardTitle className="text-lg">
                          Lesson {lesson.id}: {lesson.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {lesson.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {lesson.views}
                      </div>
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Review
                          </Badge>
                        ) : (
                          <Badge className="bg-gold/10 text-gold border-gold/20">
                            <Play className="h-3 w-3 mr-1" />
                            Start
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="mt-8 pt-6 border-t border-gold/20">
        <Link href="/learn">
          <Button variant="outline" className="border-gold/20 hover:border-gold/50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to all courses
          </Button>
        </Link>
      </div>
    </div>
  )
}
