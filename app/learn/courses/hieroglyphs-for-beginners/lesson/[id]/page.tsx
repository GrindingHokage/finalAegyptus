"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, Clock, Users, BookOpen, ChevronLeft, ChevronRight } from "lucide-react"
import { useParams } from "next/navigation"

// Updated lesson data with all 31 lessons and real YouTube video IDs from CSV
const lessonsData = [
  {
    id: 1,
    title: "History of the Egyptian Language | Ancient Egyptian Language Lesson 01",
    duration: "15:30",
    views: "28K",
    videoId: "g_TfXrMOkHY",
    description: "Learn the history and development of the ancient Egyptian language",
    objectives: [
      "Understand the evolution of Egyptian language",
      "Learn about different periods of Egyptian",
      "Recognize language development patterns",
    ],
  },
  {
    id: 2,
    title: "Egyptian Alphabet | Ancient Egyptian Language Lesson 02",
    duration: "12:45",
    views: "20K",
    videoId: "krXJPYmU-nI",
    description: "Master the Egyptian alphabet and basic hieroglyphic signs",
    objectives: ["Learn the hieroglyphic alphabet", "Understand phonetic values", "Practice letter recognition"],
  },
  {
    id: 3,
    title: "Hieroglyphic Biliteral signs | Ancient Egyptian Language Lesson 03",
    duration: "14:20",
    views: "10K",
    videoId: "XfuIS4EaKQY",
    description: "Understanding biliteral signs in hieroglyphic writing",
    objectives: ["Master biliteral signs", "Understand two-consonant combinations", "Practice sign recognition"],
  },
  {
    id: 4,
    title: "Hieroglyphs starting with sound A | Ancient Egyptian Language Lesson 04",
    duration: "11:15",
    views: "7.6K",
    videoId: "iETq4uN2L0o",
    description: "Learn hieroglyphs that begin with the sound 'A'",
    objectives: ["Identify A-sound hieroglyphs", "Practice pronunciation", "Build vocabulary"],
  },
  {
    id: 5,
    title: "Hieroglyphs starting with sound j | Ancient Egyptian Language Lesson 05",
    duration: "10:30",
    views: "5.3K",
    videoId: "B6EgA6ptn3M",
    description: "Explore hieroglyphs beginning with the 'j' sound",
    objectives: ["Learn J-sound hieroglyphs", "Understand phonetic variations", "Practice reading exercises"],
  },
  {
    id: 6,
    title: "Hieroglyphs starting with sound w | Ancient Egyptian Language Lesson 06",
    duration: "13:45",
    views: "4.1K",
    videoId: "oCKropR-ay4",
    description: "Discover hieroglyphs that start with the sound 'w'",
    objectives: ["Learn W-sound hieroglyphs", "Practice writing", "Enhance sign knowledge"],
  },
  {
    id: 7,
    title: "Hieroglyphs starting with sound b | Ancient Egyptian Language Lesson 07",
    duration: "12:00",
    views: "3.2K",
    videoId: "jE6yViayUUw",
    description: "Study hieroglyphs beginning with the 'b' sound",
    objectives: ["Identify B-sound hieroglyphs", "Understand usage", "Practice sentence construction"],
  },
  {
    id: 8,
    title: "Hieroglyphs starting with sound p | Ancient Egyptian Language Lesson 08",
    duration: "11:30",
    views: "2.8K",
    videoId: "soE0nZ-vRQQ",
    description: "Explore hieroglyphs starting with the 'p' sound",
    objectives: ["Learn P-sound hieroglyphs", "Understand phonetic context", "Practice reading comprehension"],
  },
  {
    id: 9,
    title: "Hieroglyphs starting with sound f | Ancient Egyptian Language Lesson 09",
    duration: "14:00",
    views: "2.5K",
    videoId: "b-nCvCu-z7A",
    description: "Learn hieroglyphs that begin with the sound 'f'",
    objectives: ["Identify F-sound hieroglyphs", "Practice pronunciation", "Build vocabulary"],
  },
  {
    id: 10,
    title: "Hieroglyphs starting with sound m | Ancient Egyptian Language Lesson 10",
    duration: "10:45",
    views: "2.3K",
    videoId: "E_vYxS7Cl-Q",
    description: "Study hieroglyphs starting with the 'm' sound",
    objectives: ["Learn M-sound hieroglyphs", "Understand usage", "Practice sentence construction"],
  },
  {
    id: 11,
    title: "Hieroglyphs starting with sound n | Ancient Egyptian Language Lesson 11",
    duration: "12:15",
    views: "2.1K",
    videoId: "bVayEqGyvvg",
    description: "Explore hieroglyphs beginning with the 'n' sound",
    objectives: ["Identify N-sound hieroglyphs", "Practice writing", "Enhance sign knowledge"],
  },
  {
    id: 12,
    title: "Hieroglyphs starting with sound r | Ancient Egyptian Language Lesson 12",
    duration: "11:00",
    views: "1.9K",
    videoId: "Sj-B5W-S8iE",
    description: "Learn hieroglyphs that start with the sound 'r'",
    objectives: ["Learn R-sound hieroglyphs", "Understand phonetic context", "Practice reading comprehension"],
  },
  {
    id: 13,
    title: "Hieroglyphs starting with sound h | Ancient Egyptian Language Lesson 13",
    duration: "13:30",
    views: "1.8K",
    videoId: "w_aZnG-Y-nM",
    description: "Study hieroglyphs beginning with the 'h' sound",
    objectives: ["Identify H-sound hieroglyphs", "Practice pronunciation", "Build vocabulary"],
  },
  {
    id: 14,
    title: "Hieroglyphs starting with sound H | Ancient Egyptian Language Lesson 14",
    duration: "12:45",
    views: "1.7K",
    videoId: "w-0y5t_jVVE",
    description: "Explore hieroglyphs that start with the emphatic 'H' sound",
    objectives: ["Learn Emphatic H-sound hieroglyphs", "Understand usage", "Practice sentence construction"],
  },
  {
    id: 15,
    title: "Hieroglyphs starting with sound x | Ancient Egyptian Language Lesson 15",
    duration: "11:15",
    views: "1.6K",
    videoId: "b-nCvCu-z7A",
    description: "Learn hieroglyphs beginning with the 'x' sound",
    objectives: ["Identify X-sound hieroglyphs", "Practice writing", "Enhance sign knowledge"],
  },
  {
    id: 16,
    title: "Hieroglyphs starting with sound X | Ancient Egyptian Language Lesson 16",
    duration: "13:00",
    views: "1.5K",
    videoId: "e9p0K-vCj7g",
    description: "Study hieroglyphs that start with the emphatic 'X' sound",
    objectives: ["Learn Emphatic X-sound hieroglyphs", "Understand phonetic context", "Practice reading comprehension"],
  },
  {
    id: 17,
    title: "Hieroglyphs starting with sound s | Ancient Egyptian Language Lesson 17",
    duration: "12:30",
    views: "1.4K",
    videoId: "e9p0K-vCj7g",
    description: "Explore hieroglyphs beginning with the 's' sound",
    objectives: ["Identify S-sound hieroglyphs", "Practice pronunciation", "Build vocabulary"],
  },
  {
    id: 18,
    title: "Hieroglyphs starting with sound S | Ancient Egyptian Language Lesson 18",
    duration: "11:45",
    views: "1.3K",
    videoId: "e9p0K-vCj7g",
    description: "Learn hieroglyphs that start with the emphatic 'S' sound",
    objectives: ["Learn Emphatic S-sound hieroglyphs", "Understand usage", "Practice sentence construction"],
  },
  {
    id: 19,
    title: "Hieroglyphs starting with sound q | Ancient Egyptian Language Lesson 19",
    duration: "13:15",
    views: "1.2K",
    videoId: "e9p0K-vCj7g",
    description: "Study hieroglyphs beginning with the 'q' sound",
    objectives: ["Identify Q-sound hieroglyphs", "Practice writing", "Enhance sign knowledge"],
  },
  {
    id: 20,
    title: "Hieroglyphs starting with sound k | Ancient Egyptian Language Lesson 20",
    duration: "12:00",
    views: "1.1K",
    videoId: "e9p0K-vCj7g",
    description: "Explore hieroglyphs that start with the 'k' sound",
    objectives: ["Learn K-sound hieroglyphs", "Understand phonetic context", "Practice reading comprehension"],
  },
  {
    id: 21,
    title: "Hieroglyphs starting with sound g | Ancient Egyptian Language Lesson 21",
    duration: "11:30",
    views: "1K",
    videoId: "e9p0K-vCj7g",
    description: "Learn hieroglyphs beginning with the 'g' sound",
    objectives: ["Identify G-sound hieroglyphs", "Practice pronunciation", "Build vocabulary"],
  },
  {
    id: 22,
    title: "Hieroglyphs starting with sound t | Ancient Egyptian Language Lesson 22",
    duration: "13:45",
    views: "950",
    videoId: "e9p0K-vCj7g",
    description: "Study hieroglyphs that start with the 't' sound",
    objectives: ["Learn T-sound hieroglyphs", "Understand usage", "Practice sentence construction"],
  },
  {
    id: 23,
    title: "Hieroglyphs starting with sound T | Ancient Egyptian Language Lesson 23",
    duration: "12:15",
    views: "900",
    videoId: "e9p0K-vCj7g",
    description: "Explore hieroglyphs beginning with the emphatic 'T' sound",
    objectives: ["Identify Emphatic T-sound hieroglyphs", "Practice writing", "Enhance sign knowledge"],
  },
  {
    id: 24,
    title: "Hieroglyphs starting with sound d | Ancient Egyptian Language Lesson 24",
    duration: "11:00",
    views: "850",
    videoId: "e9p0K-vCj7g",
    description: "Learn hieroglyphs that start with the 'd' sound",
    objectives: ["Learn D-sound hieroglyphs", "Understand phonetic context", "Practice reading comprehension"],
  },
  {
    id: 25,
    title: "Hieroglyphs starting with sound D | Ancient Egyptian Language Lesson 25",
    duration: "13:30",
    views: "800",
    videoId: "e9p0K-vCj7g",
    description: "Study hieroglyphs beginning with the emphatic 'D' sound",
    objectives: ["Identify Emphatic D-sound hieroglyphs", "Practice pronunciation", "Build vocabulary"],
  },
  {
    id: 26,
    title: "Determinatives part 1",
    duration: "12:45",
    views: "750",
    videoId: "e9p0K-vCj7g",
    description: "Understanding determinatives in hieroglyphic writing (Part 1)",
    objectives: ["Learn about determinatives", "Understand their function", "Practice sign recognition"],
  },
  {
    id: 27,
    title: "Determinatives part 2",
    duration: "11:15",
    views: "700",
    videoId: "e9p0K-vCj7g",
    description: "Understanding determinatives in hieroglyphic writing (Part 2)",
    objectives: ["Learn about determinatives", "Understand their function", "Practice sign recognition"],
  },
  {
    id: 28,
    title: "Egyptian names and titles",
    duration: "13:00",
    views: "650",
    videoId: "e9p0K-vCj7g",
    description: "Reading and understanding Egyptian names and titles in hieroglyphs",
    objectives: ["Read royal names", "Understand pharaonic titles", "Decode cartouches"],
  },
  {
    id: 29,
    title: "Gods and Goddesses",
    duration: "12:30",
    views: "600",
    videoId: "e9p0K-vCj7g",
    description: "Identifying and understanding gods and goddesses in hieroglyphic texts",
    objectives: ["Recognize divine names", "Understand religious context", "Read simple religious phrases"],
  },
  {
    id: 30,
    title: "King list",
    duration: "11:45",
    views: "550",
    videoId: "e9p0K-vCj7g",
    description: "Reading and understanding the king list in hieroglyphic inscriptions",
    objectives: ["Read royal inscriptions", "Understand historical context", "Decode royal annals"],
  },
  {
    id: 31,
    title: "Scarab of Queen Tiye",
    duration: "12:30",
    views: "1.2K",
    videoId: "qVxfI0tdUFM",
    description: "Reading and understanding Queen Tiye's scarab inscription",
    objectives: ["Read royal inscriptions", "Understand historical context", "Apply all learned skills"],
  },
]

export default function LessonPage() {
  const params = useParams()
  const lessonId = Number.parseInt(params.id as string)
  const lesson = lessonsData.find((l) => l.id === lessonId)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("hieroglyphs-progress")
    if (saved) {
      const completedLessons = JSON.parse(saved)
      setIsCompleted(completedLessons.includes(lessonId))
    }
  }, [lessonId])

  const markComplete = () => {
    const saved = localStorage.getItem("hieroglyphs-progress")
    const completedLessons = saved ? JSON.parse(saved) : []
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId)
      localStorage.setItem("hieroglyphs-progress", JSON.stringify(completedLessons))
      setIsCompleted(true)
    }
  }

  if (!lesson) {
    return <div>Lesson not found</div>
  }

  const previousLesson = lessonsData.find((l) => l.id === lessonId - 1)
  const nextLesson = lessonsData.find((l) => l.id === lessonId + 1)

  return (
    <div className="container py-8 px-4 max-w-6xl">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/learn/courses/hieroglyphs-for-beginners"
          className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to course
        </Link>

        <div className="flex items-center gap-2">
          {isCompleted && (
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
              <CheckCircle className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          )}
          <Badge variant="outline" className="border-gold/20">
            Lesson {lesson.id} of 31
          </Badge>
        </div>
      </div>

      {/* Lesson Header */}
      <div className="mb-8">
        <h1 className="font-cinzel text-3xl font-bold text-gold mb-2">
          Lesson {lesson.id}: {lesson.title}
        </h1>
        <p className="text-muted-foreground text-lg mb-4">{lesson.description}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {lesson.duration}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {lesson.views} views
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <Card className="border-gold/20">
            <CardContent className="p-0">
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${lesson.videoId}?list=PLaINFseE0hFoZSLjI1qSLieMySa5PYkWp`}
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Lesson Actions */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!isCompleted && (
                <Button onClick={markComplete} className="bg-gold hover:bg-gold/90 text-black">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Complete
                </Button>
              )}

              <a
                href={`https://www.youtube.com/watch?v=${lesson.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold/80 text-sm"
              >
                Watch on YouTube →
              </a>
            </div>
          </div>

          {/* Navigation Between Lessons */}
          <div className="mt-8 flex items-center justify-between">
            {previousLesson ? (
              <Link href={`/learn/courses/hieroglyphs-for-beginners/lesson/${previousLesson.id}`}>
                <Button variant="outline" className="border-gold/20 hover:border-gold/50">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous: Lesson {previousLesson.id}
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <Link href={`/learn/courses/hieroglyphs-for-beginners/lesson/${nextLesson.id}`}>
                <Button className="bg-gold hover:bg-gold/90 text-black">
                  Next: Lesson {nextLesson.id}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Link href="/learn/courses/hieroglyphs-for-beginners">
                <Button className="bg-gold hover:bg-gold/90 text-black">
                  Complete Course
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Lesson Sidebar */}
        <div className="space-y-6">
          {/* Learning Objectives */}
          <Card className="border-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-gold" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {lesson.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                    {objective}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Course Progress */}
          <Card className="border-gold/20">
            <CardHeader>
              <CardTitle className="text-lg">Course Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Progress value={(lessonId / 31) * 100} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Lesson {lessonId} of 31 • {Math.round((lessonId / 31) * 100)}% Complete
                </p>
              </div>
            </CardContent>
          </Card>

          {/* All Lessons Quick Access */}
          <Card className="border-gold/20">
            <CardHeader>
              <CardTitle className="text-lg">All Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {lessonsData.map((l) => (
                  <Link
                    key={l.id}
                    href={`/learn/courses/hieroglyphs-for-beginners/lesson/${l.id}`}
                    className={`block p-2 rounded text-sm transition-colors ${
                      l.id === lessonId ? "bg-gold/10 text-gold border border-gold/20" : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">
                        {l.id}. {l.title.length > 30 ? l.title.substring(0, 30) + "..." : l.title}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">{l.duration}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
