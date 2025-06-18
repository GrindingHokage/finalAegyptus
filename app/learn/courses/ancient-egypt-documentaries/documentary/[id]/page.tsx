"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, Clock, Users, BookOpen, ChevronLeft, ChevronRight } from "lucide-react"
import { useParams } from "next/navigation"

// Documentary data with YouTube video IDs
const documentariesData = [
  {
    id: 1,
    title: "The Secrets of Ancient Egypt's Great Pyramid",
    duration: "45:30",
    views: "2.1M",
    videoId: "AP_KX52tiBU",
    description: "Explore the mysteries and engineering marvels of the Great Pyramid of Giza",
    highlights: [
      "Advanced engineering techniques of pyramid construction",
      "Hidden chambers and secret passages",
      "Mathematical precision in ancient architecture",
    ],
  },
  {
    id: 2,
    title: "Lost Treasures of Ancient Egypt",
    duration: "52:15",
    views: "1.8M",
    videoId: "CskfvgEItPA",
    description: "Discover the incredible treasures and artifacts of ancient Egyptian civilization",
    highlights: [
      "Tutankhamun's golden treasures",
      "Ancient jewelry and ceremonial objects",
      "Archaeological discoveries and their significance",
    ],
  },
  {
    id: 3,
    title: "The Rise and Fall of Ancient Egypt",
    duration: "48:20",
    views: "1.5M",
    videoId: "8AgeNvHZ_ks",
    description: "Journey through the complete history of ancient Egyptian dynasties",
    highlights: [
      "Old, Middle, and New Kingdom periods",
      "Political changes and foreign invasions",
      "Cultural evolution over 3000 years",
    ],
  },
  {
    id: 4,
    title: "Mysteries of the Egyptian Pharaohs",
    duration: "43:45",
    views: "1.3M",
    videoId: "4jEad6zxaFk",
    description: "Uncover the secrets of Egypt's most powerful rulers and their legacies",
    highlights: [
      "Divine kingship and pharaonic power",
      "Famous pharaohs and their achievements",
      "Royal burial practices and tomb construction",
    ],
  },
  {
    id: 5,
    title: "Ancient Egyptian Mummies and the Afterlife",
    duration: "50:10",
    views: "1.7M",
    videoId: "hSnlO7FsCe0",
    description: "Explore Egyptian beliefs about death, mummification, and the journey to the afterlife",
    highlights: [
      "Mummification process and techniques",
      "Book of the Dead and afterlife beliefs",
      "Canopic jars and burial rituals",
    ],
  },
  {
    id: 6,
    title: "The Temple Builders of Ancient Egypt",
    duration: "46:35",
    views: "980K",
    videoId: "ZU2Roq-emxw",
    description: "Discover the magnificent temples and their role in Egyptian society",
    highlights: [
      "Karnak and Luxor temple complexes",
      "Religious ceremonies and festivals",
      "Architectural innovations in temple design",
    ],
  },
  {
    id: 7,
    title: "Cleopatra: The Last Pharaoh",
    duration: "44:25",
    views: "2.3M",
    videoId: "E3ky-NwBEU4",
    description: "The fascinating story of Egypt's most famous queen and the end of an era",
    highlights: [
      "Cleopatra's political alliances with Rome",
      "The end of Ptolemaic rule",
      "Legacy and historical impact",
    ],
  },
  {
    id: 8,
    title: "Ancient Egyptian Gods and Mythology",
    duration: "41:50",
    views: "1.4M",
    videoId: "YpKej05RgsY",
    description: "Journey into the complex world of Egyptian deities and religious beliefs",
    highlights: [
      "Major gods: Ra, Osiris, Isis, and Horus",
      "Creation myths and religious stories",
      "Temple worship and priestly duties",
    ],
  },
  {
    id: 9,
    title: "The Nile: Lifeline of Ancient Egypt",
    duration: "47:15",
    views: "1.1M",
    videoId: "VMPL301Aq-U",
    description: "Understand how the Nile River shaped Egyptian civilization for millennia",
    highlights: [
      "Annual flooding and agricultural cycles",
      "Transportation and trade along the Nile",
      "Nilometers and flood prediction",
    ],
  },
  {
    id: 10,
    title: "Ancient Egyptian Art and Culture",
    duration: "49:30",
    views: "890K",
    videoId: "hsWCqjWkNhI",
    description: "Explore the artistic achievements and cultural practices of ancient Egypt",
    highlights: [
      "Artistic conventions and symbolism",
      "Daily life and social hierarchy",
      "Music, dance, and entertainment",
    ],
  },
  {
    id: 11,
    title: "The Valley of the Kings: Royal Tombs",
    duration: "53:20",
    views: "1.6M",
    videoId: "lSWqqpN0Z0o",
    description: "Discover the hidden tombs and treasures in Egypt's most famous burial ground",
    highlights: [
      "Tomb construction and decoration",
      "Howard Carter's discovery of Tutankhamun",
      "Tomb robbers and preservation efforts",
    ],
  },
  {
    id: 12,
    title: "Ancient Egypt's Greatest Mysteries Solved",
    duration: "55:45",
    views: "2.5M",
    videoId: "BR2ZMj3o5EU",
    description: "Modern archaeology reveals answers to Egypt's most enduring questions",
    highlights: [
      "How the pyramids were really built",
      "Deciphering hieroglyphs and the Rosetta Stone",
      "New discoveries using modern technology",
    ],
  },
]

export default function DocumentaryPage() {
  const params = useParams()
  const documentaryId = Number.parseInt(params.id as string)
  const documentary = documentariesData.find((d) => d.id === documentaryId)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("egypt-documentaries-progress")
    if (saved) {
      const completedDocumentaries = JSON.parse(saved)
      setIsCompleted(completedDocumentaries.includes(documentaryId))
    }
  }, [documentaryId])

  const markComplete = () => {
    const saved = localStorage.getItem("egypt-documentaries-progress")
    const completedDocumentaries = saved ? JSON.parse(saved) : []
    if (!completedDocumentaries.includes(documentaryId)) {
      completedDocumentaries.push(documentaryId)
      localStorage.setItem("egypt-documentaries-progress", JSON.stringify(completedDocumentaries))
      setIsCompleted(true)
    }
  }

  if (!documentary) {
    return <div>Documentary not found</div>
  }

  const previousDocumentary = documentariesData.find((d) => d.id === documentaryId - 1)
  const nextDocumentary = documentariesData.find((d) => d.id === documentaryId + 1)

  return (
    <div className="container py-8 px-4 max-w-6xl">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/learn/courses/ancient-egypt-documentaries"
          className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to documentaries
        </Link>

        <div className="flex items-center gap-2">
          {isCompleted && (
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
              <CheckCircle className="h-3 w-3 mr-1" />
              Watched
            </Badge>
          )}
          <Badge variant="outline" className="border-gold/20">
            Documentary {documentary.id} of 12
          </Badge>
        </div>
      </div>

      {/* Documentary Header */}
      <div className="mb-8">
        <h1 className="font-cinzel text-3xl font-bold text-gold mb-2">
          Documentary {documentary.id}: {documentary.title}
        </h1>
        <p className="text-muted-foreground text-lg mb-4">{documentary.description}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {documentary.duration}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {documentary.views} views
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
                  src={`https://www.youtube.com/embed/${documentary.videoId}?rel=0&modestbranding=1&showinfo=0`}
                  title={documentary.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Documentary Actions */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!isCompleted && (
                <Button onClick={markComplete} className="bg-gold hover:bg-gold/90 text-black">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Watched
                </Button>
              )}

              <a
                href={`https://www.youtube.com/watch?v=${documentary.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold/80 text-sm"
              >
                Watch on YouTube →
              </a>
            </div>
          </div>

          {/* Navigation Between Documentaries */}
          <div className="mt-8 flex items-center justify-between">
            {previousDocumentary ? (
              <Link href={`/learn/courses/ancient-egypt-documentaries/documentary/${previousDocumentary.id}`}>
                <Button variant="outline" className="border-gold/20 hover:border-gold/50">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous: Documentary {previousDocumentary.id}
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {nextDocumentary ? (
              <Link href={`/learn/courses/ancient-egypt-documentaries/documentary/${nextDocumentary.id}`}>
                <Button className="bg-gold hover:bg-gold/90 text-black">
                  Next: Documentary {nextDocumentary.id}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Link href="/learn/courses/ancient-egypt-documentaries">
                <Button className="bg-gold hover:bg-gold/90 text-black">
                  Complete Series
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Documentary Sidebar */}
        <div className="space-y-6">
          {/* Documentary Highlights */}
          <Card className="border-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-gold" />
                Documentary Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {documentary.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Series Progress */}
          <Card className="border-gold/20">
            <CardHeader>
              <CardTitle className="text-lg">Series Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Progress value={(documentaryId / 12) * 100} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Documentary {documentaryId} of 12 • {Math.round((documentaryId / 12) * 100)}% Complete
                </p>
              </div>
            </CardContent>
          </Card>

          {/* All Documentaries Quick Access */}
          <Card className="border-gold/20">
            <CardHeader>
              <CardTitle className="text-lg">All Documentaries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {documentariesData.map((d) => (
                  <Link
                    key={d.id}
                    href={`/learn/courses/ancient-egypt-documentaries/documentary/${d.id}`}
                    className={`block p-2 rounded text-sm transition-colors ${
                      d.id === documentaryId ? "bg-gold/10 text-gold border border-gold/20" : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">
                        {d.id}. {d.title.length > 25 ? d.title.substring(0, 25) + "..." : d.title}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">{d.duration}</span>
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
