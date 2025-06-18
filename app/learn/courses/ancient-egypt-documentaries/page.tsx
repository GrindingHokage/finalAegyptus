"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Play, CheckCircle, Clock, Users, RotateCcw } from "lucide-react"

// Documentary lesson data with YouTube video IDs
const lessonsData = [
  {
    id: 1,
    title: "The Secrets of Ancient Egypt's Great Pyramid",
    duration: "45:30",
    views: "2.1M",
    videoId: "AP_KX52tiBU",
    description: "Explore the mysteries and engineering marvels of the Great Pyramid of Giza",
  },
  {
    id: 2,
    title: "Lost Treasures of Ancient Egypt",
    duration: "52:15",
    views: "1.8M",
    videoId: "CskfvgEItPA",
    description: "Discover the incredible treasures and artifacts of ancient Egyptian civilization",
  },
  {
    id: 3,
    title: "The Rise and Fall of Ancient Egypt",
    duration: "48:20",
    views: "1.5M",
    videoId: "8AgeNvHZ_ks",
    description: "Journey through the complete history of ancient Egyptian dynasties",
  },
  {
    id: 4,
    title: "Mysteries of the Egyptian Pharaohs",
    duration: "43:45",
    views: "1.3M",
    videoId: "4jEad6zxaFk",
    description: "Uncover the secrets of Egypt's most powerful rulers and their legacies",
  },
  {
    id: 5,
    title: "Ancient Egyptian Mummies and the Afterlife",
    duration: "50:10",
    views: "1.7M",
    videoId: "hSnlO7FsCe0",
    description: "Explore Egyptian beliefs about death, mummification, and the journey to the afterlife",
  },
  {
    id: 6,
    title: "The Temple Builders of Ancient Egypt",
    duration: "46:35",
    views: "980K",
    videoId: "ZU2Roq-emxw",
    description: "Discover the magnificent temples and their role in Egyptian society",
  },
  {
    id: 7,
    title: "Cleopatra: The Last Pharaoh",
    duration: "44:25",
    views: "2.3M",
    videoId: "E3ky-NwBEU4",
    description: "The fascinating story of Egypt's most famous queen and the end of an era",
  },
  {
    id: 8,
    title: "Ancient Egyptian Gods and Mythology",
    duration: "41:50",
    views: "1.4M",
    videoId: "YpKej05RgsY",
    description: "Journey into the complex world of Egyptian deities and religious beliefs",
  },
  {
    id: 9,
    title: "The Nile: Lifeline of Ancient Egypt",
    duration: "47:15",
    views: "1.1M",
    videoId: "VMPL301Aq-U",
    description: "Understand how the Nile River shaped Egyptian civilization for millennia",
  },
  {
    id: 10,
    title: "Ancient Egyptian Art and Culture",
    duration: "49:30",
    views: "890K",
    videoId: "hsWCqjWkNhI",
    description: "Explore the artistic achievements and cultural practices of ancient Egypt",
  },
  {
    id: 11,
    title: "The Valley of the Kings: Royal Tombs",
    duration: "53:20",
    views: "1.6M",
    videoId: "lSWqqpN0Z0o",
    description: "Discover the hidden tombs and treasures in Egypt's most famous burial ground",
  },
  {
    id: 12,
    title: "Ancient Egypt's Greatest Mysteries Solved",
    duration: "55:45",
    views: "2.5M",
    videoId: "BR2ZMj3o5EU",
    description: "Modern archaeology reveals answers to Egypt's most enduring questions",
  },
]

const courseInfo = {
  title: "Ancient Egypt Documentaries",
  subtitle: "Comprehensive documentary series exploring ancient Egyptian civilization",
  difficulty: "All Levels",
  totalLessons: 12,
  totalDuration: "9:58:30",
  thumbnail:
    "https://lh3.googleusercontent.com/pw/AP1GczNsQKZ-FgGKKRfUczdRJ33cKw6zLPY1m1VbcproMP3XHhuP7pShBceAZW_OhRkEhGOZnlpYCPmJY2UyhDHgDeqHSYqYZuwdRR__oBsoU1G7bt6ziBwyH7CSXFjHB31fu5SlHVuB0l_YSaT8yjFPvp8=w880-h880-s-no-gm?authuser=0",
}

export default function AncientEgyptDocumentariesPage() {
  const [completedLessons, setCompletedLessons] = useState<number[]>([])

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("egypt-documentaries-progress")
    if (saved) {
      setCompletedLessons(JSON.parse(saved))
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem("egypt-documentaries-progress", JSON.stringify(completedLessons))
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
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                {courseInfo.difficulty}
              </Badge>
              <Badge variant="outline" className="border-gold/20">
                {courseInfo.totalLessons} documentaries
              </Badge>
              <Badge variant="outline" className="border-gold/20">
                {courseInfo.totalDuration}
              </Badge>
            </div>

            {/* Progress Section */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Viewing Progress</span>
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

      {/* Documentaries List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-6">Documentary Collection</h2>

        {lessonsData.map((lesson) => {
          const isCompleted = completedLessons.includes(lesson.id)

          return (
            <Link key={lesson.id} href={`/learn/courses/ancient-egypt-documentaries/documentary/${lesson.id}`}>
              <Card className="border-gold/20 hover:border-gold/50 transition-colors cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isCompleted && <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />}
                      <div>
                        <CardTitle className="text-lg">
                          Documentary {lesson.id}: {lesson.title}
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
                            Rewatch
                          </Badge>
                        ) : (
                          <Badge className="bg-gold/10 text-gold border-gold/20">
                            <Play className="h-3 w-3 mr-1" />
                            Watch
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
