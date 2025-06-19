import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, language = "en", voice = "female", speed = 1.0 } = await request.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // For now, return fallback to use Web Speech API on client
    // This ensures immediate functionality while we can add server-side TTS later
    return NextResponse.json({
      fallback: true,
      message: "Using client-side speech synthesis",
    })
  } catch (error) {
    console.error("TTS API error:", error)
    return NextResponse.json({
      fallback: true,
      error: "TTS service temporarily unavailable",
    })
  }
}
