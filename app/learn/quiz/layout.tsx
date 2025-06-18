import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AEGYPTUS - Knowledge Quizzes",
  description: "Test your knowledge of Ancient Egypt with interactive quizzes",
}

export default function QuizLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="min-h-screen">{children}</div>
}
