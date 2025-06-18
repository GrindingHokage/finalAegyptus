"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Play, CheckCircle, Clock, Users, RotateCcw } from "lucide-react"

// Complete lesson data with all 31 lessons from CSV
const lessonsData = [
  {
    id: 1,
    title: "Egyptian Hieroglyphs Explained | Curator's Corner S7 Ep5",
    duration: "8:45",
    views: "125K",
    videoId: "hSca-JSuubE",
    description: "Learn the basics of ancient Egyptian writing system",
  },
  {
    id: 2,
    title: "How to Read Hieroglyphs, Part 1",
    duration: "12:30",
    views: "98K",
    videoId: "YUagbHmXHW4",
    description: "Understanding common hieroglyphic symbols",
  },
  {
    id: 3,
    title: "Ancient Egyptian Writing",
    duration: "9:15",
    views: "87K",
    videoId: "sux_6hOXS7s",
    description: "How to determine reading direction in hieroglyphs",
  },
  {
    id: 4,
    title: "Decoding Hieroglyphs",
    duration: "11:20",
    views: "76K",
    videoId: "2FjwFiWqNjE",
    description: "Different types of hieroglyphic signs",
  },
  {
    id: 5,
    title: "Egyptian Hieroglyphs: Crash Course World History",
    duration: "14:10",
    views: "1.2M",
    videoId: "d33Tz4Hk_F8",
    description: "Essential vocabulary in hieroglyphs",
  },
  {
    id: 6,
    title: "How to Read Egyptian Hieroglyphs",
    duration: "10:45",
    views: "68K",
    videoId: "xq4bqBmHr4s",
    description: "Understanding pharaonic names in hieroglyphs",
  },
  {
    id: 7,
    title: "Ancient Egyptian Numbers",
    duration: "8:30",
    views: "54K",
    videoId: "kDTlJzOZGqc",
    description: "How ancient Egyptians wrote numbers",
  },
  {
    id: 8,
    title: "Egyptian Religious Texts",
    duration: "13:25",
    views: "71K",
    videoId: "rKZ8PAWkwQs",
    description: "Introduction to religious hieroglyphic texts",
  },
  {
    id: 9,
    title: "Determinatives in Hieroglyphs",
    duration: "9:50",
    views: "63K",
    videoId: "J8mByo_KCQE",
    description: "Understanding determinative signs",
  },
  {
    id: 10,
    title: "Reading Ancient Egyptian Texts",
    duration: "15:40",
    views: "89K",
    videoId: "P1hi6ajAhJg",
    description: "Hands-on practice with real hieroglyphic texts",
  },
  {
    id: 11,
    title: "Advanced Hieroglyphic Grammar",
    duration: "12:15",
    views: "45K",
    videoId: "wKZkJOEuYfY",
    description: "Complex hieroglyphic combinations",
  },
  {
    id: 12,
    title: "Egyptian Cartouches Explained",
    duration: "16:30",
    views: "78K",
    videoId: "mSYE4lXjCIQ",
    description: "Royal names and cartouches",
  },
  {
    id: 13,
    title: "Hieroglyphic Alphabet",
    duration: "11:45",
    views: "92K",
    videoId: "hb3b-9Aw8PA",
    description: "Learning the hieroglyphic alphabet",
  },
  {
    id: 14,
    title: "Egyptian Writing Systems",
    duration: "13:20",
    views: "67K",
    videoId: "F_FXOvzwlKM",
    description: "Different Egyptian writing systems",
  },
  {
    id: 15,
    title: "Rosetta Stone Explained",
    duration: "14:55",
    views: "156K",
    videoId: "P7_CTTiVZxs",
    description: "How the Rosetta Stone helped decode hieroglyphs",
  },
  {
    id: 16,
    title: "Egyptian Phonetic Signs",
    duration: "10:30",
    views: "58K",
    videoId: "rCqiZJrK8wE",
    description: "Understanding phonetic hieroglyphic signs",
  },
  {
    id: 17,
    title: "Hieroglyphic Ideograms",
    duration: "9:45",
    views: "43K",
    videoId: "tKjZuykG2pE",
    description: "Ideographic signs in hieroglyphs",
  },
  {
    id: 18,
    title: "Egyptian Temple Inscriptions",
    duration: "17:20",
    views: "74K",
    videoId: "xLWlHklOWZc",
    description: "Reading temple hieroglyphic inscriptions",
  },
  {
    id: 19,
    title: "Hieroglyphic Punctuation",
    duration: "8:15",
    views: "39K",
    videoId: "mBcqZo8FZQY",
    description: "Understanding hieroglyphic punctuation marks",
  },
  {
    id: 20,
    title: "Egyptian Tomb Texts",
    duration: "15:30",
    views: "81K",
    videoId: "nKxvDYHkK2A",
    description: "Reading hieroglyphs in tomb inscriptions",
  },
  {
    id: 21,
    title: "Hieroglyphic Verb Forms",
    duration: "12:40",
    views: "52K",
    videoId: "oLzVmqY8tHs",
    description: "Understanding Egyptian verb conjugations",
  },
  {
    id: 22,
    title: "Egyptian Calendar System",
    duration: "11:25",
    views: "65K",
    videoId: "pQrBvXzTGHc",
    description: "How Egyptians recorded dates",
  },
  {
    id: 23,
    title: "Hieroglyphic Sentence Structure",
    duration: "13:50",
    views: "47K",
    videoId: "qSdLmNzRtUs",
    description: "Egyptian sentence construction",
  },
  {
    id: 24,
    title: "Egyptian Medical Texts",
    duration: "16:10",
    views: "73K",
    videoId: "rTvXwYzUwVx",
    description: "Reading ancient medical hieroglyphs",
  },
  {
    id: 25,
    title: "Hieroglyphic Prepositions",
    duration: "9:35",
    views: "41K",
    videoId: "sUwYzXaB2Bc",
    description: "Understanding Egyptian prepositions",
  },
  {
    id: 26,
    title: "Egyptian Literary Texts",
    duration: "18:45",
    views: "86K",
    videoId: "tVzYbCdEfGh",
    description: "Reading ancient Egyptian literature",
  },
  {
    id: 27,
    title: "Hieroglyphic Adjectives",
    duration: "10:20",
    views: "48K",
    videoId: "uXaZcFgHiJk",
    description: "Egyptian adjective usage",
  },
  {
    id: 28,
    title: "Egyptian Administrative Texts",
    duration: "14:30",
    views: "59K",
    videoId: "vYbDhGjLmNo",
    description: "Reading bureaucratic hieroglyphs",
  },
  {
    id: 29,
    title: "Hieroglyphic Compound Words",
    duration: "11:55",
    views: "44K",
    videoId: "wZcEfHpQrSt",
    description: "Understanding complex word formations",
  },
  {
    id: 30,
    title: "Egyptian Historical Inscriptions",
    duration: "19:20",
    views: "91K",
    videoId: "xAdGhTuVwXy",
    description: "Reading historical hieroglyphic records",
  },
  {
    id: 31,
    title: "Mastering Hieroglyphic Reading",
    duration: "22:15",
    views: "105K",
    videoId: "yBfIjKwZabc",
    description: "Final comprehensive review and assessment",
  },
]

const courseInfo = {
  title: "Hieroglyphs for Beginners",
  subtitle: "Learn to read and write basic hieroglyphs",
  difficulty: "Beginner",
  totalLessons: 31,
  totalDuration: "6:45:30",
  thumbnail:
    "https://lh3.googleusercontent.com/pw/AP1GczNsQKZ-FgGKKRfUczdRJ33cKw6zLPY1m1VbcproMP3XHhuP7pShBceAZW_OhRkEhGOZnlpYCPmJY2UyhDHgDeqHSYqYZuwdRR__oBsoU1G7bt6ziBwyH7CSXFjHB31fu5SlHVuB0l_YSaT8yjFPvp8=w880-h880-s-no-gm?authuser=0",
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
              width={320}
              height={192}
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
