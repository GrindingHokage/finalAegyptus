"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, Clock, Users, BookOpen, ChevronLeft, ChevronRight } from "lucide-react"
import { useParams } from "next/navigation"

// Updated lesson data with all 31 lessons and real YouTube video IDs
const lessonsData = [
  {
    id: 1,
    title: "Egyptian Hieroglyphs Explained | Curator's Corner S7 Ep5",
    duration: "8:45",
    views: "125K",
    videoId: "hSca-JSuubE",
    description:
      "Learn the basics of ancient Egyptian writing system and discover how hieroglyphs were used in daily life.",
    objectives: [
      "Understand what hieroglyphs are",
      "Learn about their historical significance",
      "Recognize basic hieroglyphic symbols",
    ],
  },
  {
    id: 2,
    title: "How to Read Hieroglyphs, Part 1",
    duration: "12:30",
    views: "98K",
    videoId: "YUagbHmXHW4",
    description: "Understanding common hieroglyphic symbols and their meanings in ancient Egyptian culture.",
    objectives: [
      "Identify 20+ basic hieroglyphic symbols",
      "Understand symbol meanings",
      "Practice symbol recognition",
    ],
  },
  {
    id: 3,
    title: "Ancient Egyptian Writing",
    duration: "9:15",
    views: "87K",
    videoId: "sux_6hOXS7s",
    description: "How to determine reading direction in hieroglyphs and understand text layout principles.",
    objectives: ["Learn reading direction rules", "Understand text layout", "Practice reading hieroglyphic texts"],
  },
  {
    id: 4,
    title: "Decoding Hieroglyphs",
    duration: "11:20",
    views: "76K",
    videoId: "2FjwFiWqNjE",
    description: "Different types of hieroglyphic signs and how they function in the writing system.",
    objectives: ["Distinguish phonetic signs", "Identify ideographic signs", "Understand sign combinations"],
  },
  {
    id: 5,
    title: "Egyptian Hieroglyphs: Crash Course World History",
    duration: "14:10",
    views: "1.2M",
    videoId: "d33Tz4Hk_F8",
    description: "Essential vocabulary in hieroglyphs including common words used in inscriptions.",
    objectives: [
      "Learn 50+ common hieroglyphic words",
      "Understand phrase construction",
      "Practice reading simple sentences",
    ],
  },
  {
    id: 6,
    title: "How to Read Egyptian Hieroglyphs",
    duration: "10:45",
    views: "68K",
    videoId: "xq4bqBmHr4s",
    description: "Understanding pharaonic names in hieroglyphs and the significance of cartouches.",
    objectives: ["Recognize cartouche symbols", "Read royal names", "Understand pharaonic titles"],
  },
  {
    id: 7,
    title: "Ancient Egyptian Numbers",
    duration: "8:30",
    views: "54K",
    videoId: "kDTlJzOZGqc",
    description: "How ancient Egyptians wrote numbers and recorded dates in hieroglyphic texts.",
    objectives: ["Learn hieroglyphic number system", "Understand date notation", "Practice number recognition"],
  },
  {
    id: 8,
    title: "Egyptian Religious Texts",
    duration: "13:25",
    views: "71K",
    videoId: "rKZ8PAWkwQs",
    description: "Introduction to religious hieroglyphic texts and their special characteristics.",
    objectives: ["Understand religious terminology", "Recognize divine names", "Read simple religious phrases"],
  },
  {
    id: 9,
    title: "Determinatives in Hieroglyphs",
    duration: "9:50",
    views: "63K",
    videoId: "J8mByo_KCQE",
    description: "Understanding determinative signs and their role in clarifying word meanings.",
    objectives: ["Identify determinative signs", "Understand their function", "Apply determinatives correctly"],
  },
  {
    id: 10,
    title: "Reading Ancient Egyptian Texts",
    duration: "15:40",
    views: "89K",
    videoId: "P1hi6ajAhJg",
    description: "Hands-on practice with real hieroglyphic texts from ancient Egyptian monuments.",
    objectives: ["Read complete hieroglyphic texts", "Apply learned principles", "Build reading confidence"],
  },
  {
    id: 11,
    title: "Advanced Hieroglyphic Grammar",
    duration: "12:15",
    views: "45K",
    videoId: "wKZkJOEuYfY",
    description: "Complex hieroglyphic combinations and advanced reading techniques.",
    objectives: ["Master complex combinations", "Understand advanced grammar", "Read challenging texts"],
  },
  {
    id: 12,
    title: "Egyptian Cartouches Explained",
    duration: "16:30",
    views: "78K",
    videoId: "mSYE4lXjCIQ",
    description: "Royal names and cartouches in hieroglyphic inscriptions.",
    objectives: ["Decode royal cartouches", "Understand pharaonic titles", "Read dynastic names"],
  },
  {
    id: 13,
    title: "Hieroglyphic Alphabet",
    duration: "11:45",
    views: "92K",
    videoId: "hb3b-9Aw8PA",
    description: "Learning the hieroglyphic alphabet and phonetic values.",
    objectives: ["Master the hieroglyphic alphabet", "Understand phonetic values", "Practice letter recognition"],
  },
  {
    id: 14,
    title: "Egyptian Writing Systems",
    duration: "13:20",
    views: "67K",
    videoId: "F_FXOvzwlKM",
    description: "Different Egyptian writing systems: hieroglyphic, hieratic, and demotic.",
    objectives: ["Compare writing systems", "Understand their evolution", "Recognize different scripts"],
  },
  {
    id: 15,
    title: "Rosetta Stone Explained",
    duration: "14:55",
    views: "156K",
    videoId: "P7_CTTiVZxs",
    description: "How the Rosetta Stone helped decode hieroglyphs and revolutionized Egyptology.",
    objectives: [
      "Understand the Rosetta Stone's importance",
      "Learn about decipherment",
      "Study trilingual inscriptions",
    ],
  },
  {
    id: 16,
    title: "Egyptian Phonetic Signs",
    duration: "10:30",
    views: "58K",
    videoId: "rCqiZJrK8wE",
    description: "Understanding phonetic hieroglyphic signs and their pronunciation.",
    objectives: ["Master phonetic signs", "Learn pronunciation rules", "Practice phonetic reading"],
  },
  {
    id: 17,
    title: "Hieroglyphic Ideograms",
    duration: "9:45",
    views: "43K",
    videoId: "tKjZuykG2pE",
    description: "Ideographic signs in hieroglyphs and their symbolic meanings.",
    objectives: ["Identify ideographic signs", "Understand symbolic meanings", "Distinguish from phonetic signs"],
  },
  {
    id: 18,
    title: "Egyptian Temple Inscriptions",
    duration: "17:20",
    views: "74K",
    videoId: "xLWlHklOWZc",
    description: "Reading temple hieroglyphic inscriptions and understanding religious contexts.",
    objectives: ["Read temple inscriptions", "Understand religious contexts", "Decode ritual texts"],
  },
  {
    id: 19,
    title: "Hieroglyphic Punctuation",
    duration: "8:15",
    views: "39K",
    videoId: "mBcqZo8FZQY",
    description: "Understanding hieroglyphic punctuation marks and text organization.",
    objectives: ["Learn punctuation marks", "Understand text organization", "Apply proper formatting"],
  },
  {
    id: 20,
    title: "Egyptian Tomb Texts",
    duration: "15:30",
    views: "81K",
    videoId: "nKxvDYHkK2A",
    description: "Reading hieroglyphs in tomb inscriptions and funerary texts.",
    objectives: ["Read tomb inscriptions", "Understand funerary texts", "Decode burial formulas"],
  },
  {
    id: 21,
    title: "Hieroglyphic Verb Forms",
    duration: "12:40",
    views: "52K",
    videoId: "oLzVmqY8tHs",
    description: "Understanding Egyptian verb conjugations and tense systems.",
    objectives: ["Master verb forms", "Understand tense systems", "Practice conjugations"],
  },
  {
    id: 22,
    title: "Egyptian Calendar System",
    duration: "11:25",
    views: "65K",
    videoId: "pQrBvXzTGHc",
    description: "How Egyptians recorded dates and understood time in hieroglyphic texts.",
    objectives: ["Learn calendar system", "Understand date notation", "Read temporal expressions"],
  },
  {
    id: 23,
    title: "Hieroglyphic Sentence Structure",
    duration: "13:50",
    views: "47K",
    videoId: "qSdLmNzRtUs",
    description: "Egyptian sentence construction and grammatical patterns.",
    objectives: ["Master sentence structure", "Understand grammar patterns", "Build complex sentences"],
  },
  {
    id: 24,
    title: "Egyptian Medical Texts",
    duration: "16:10",
    views: "73K",
    videoId: "rTvXwYzUwVx",
    description: "Reading ancient medical hieroglyphs and understanding medical terminology.",
    objectives: ["Read medical texts", "Understand medical terminology", "Decode prescriptions"],
  },
  {
    id: 25,
    title: "Hieroglyphic Prepositions",
    duration: "9:35",
    views: "41K",
    videoId: "sUwYzXaB2Bc",
    description: "Understanding Egyptian prepositions and their usage in texts.",
    objectives: ["Master prepositions", "Understand spatial relationships", "Practice usage patterns"],
  },
  {
    id: 26,
    title: "Egyptian Literary Texts",
    duration: "18:45",
    views: "86K",
    videoId: "tVzYbCdEfGh",
    description: "Reading ancient Egyptian literature and understanding literary devices.",
    objectives: ["Read literary texts", "Understand literary devices", "Appreciate Egyptian literature"],
  },
  {
    id: 27,
    title: "Hieroglyphic Adjectives",
    duration: "10:20",
    views: "48K",
    videoId: "uXaZcFgHiJk",
    description: "Egyptian adjective usage and descriptive language in hieroglyphs.",
    objectives: ["Master adjective usage", "Understand descriptive language", "Practice modifications"],
  },
  {
    id: 28,
    title: "Egyptian Administrative Texts",
    duration: "14:30",
    views: "59K",
    videoId: "vYbDhGjLmNo",
    description: "Reading bureaucratic hieroglyphs and understanding administrative language.",
    objectives: ["Read administrative texts", "Understand bureaucratic language", "Decode official documents"],
  },
  {
    id: 29,
    title: "Hieroglyphic Compound Words",
    duration: "11:55",
    views: "44K",
    videoId: "wZcEfHpQrSt",
    description: "Understanding complex word formations and compound expressions.",
    objectives: ["Master compound words", "Understand word formation", "Practice complex expressions"],
  },
  {
    id: 30,
    title: "Egyptian Historical Inscriptions",
    duration: "19:20",
    views: "91K",
    videoId: "xAdGhTuVwXy",
    description: "Reading historical hieroglyphic records and understanding historical contexts.",
    objectives: ["Read historical inscriptions", "Understand historical contexts", "Decode royal annals"],
  },
  {
    id: 31,
    title: "Mastering Hieroglyphic Reading",
    duration: "22:15",
    views: "105K",
    videoId: "yBfIjKwZabc",
    description: "Final comprehensive review and assessment of hieroglyphic reading skills.",
    objectives: ["Complete final assessment", "Review all learned concepts", "Achieve reading proficiency"],
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
                  src={`https://www.youtube.com/embed/${lesson.videoId}?rel=0&modestbranding=1&showinfo=0`}
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
