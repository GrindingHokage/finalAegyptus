import { type NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import os from "os"
import { spawn } from "child_process"

// Enhanced logging
function log(message: string, level: "info" | "error" | "warn" = "info") {
  const timestamp = new Date().toISOString()
  console[level](`[${timestamp}] [STT API] ${message}`)
}

// Check if Python and required packages are available
async function checkPythonEnvironment(): Promise<{ available: boolean; error?: string }> {
  return new Promise((resolve) => {
    const python = spawn("python3", ["-c", "import whisper, torch; print('OK')"])

    let stderr = ""

    python.stderr.on("data", (data) => {
      stderr += data.toString()
    })

    python.on("close", (code) => {
      if (code === 0) {
        resolve({ available: true })
      } else {
        resolve({ available: false, error: stderr })
      }
    })

    python.on("error", (error) => {
      resolve({ available: false, error: error.message })
    })

    // Timeout after 10 seconds
    setTimeout(() => {
      python.kill()
      resolve({ available: false, error: "Environment check timeout" })
    }, 10000)
  })
}

// Validate audio file
async function validateAudioFile(filePath: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const stats = await fs.stat(filePath)

    if (stats.size === 0) {
      return { valid: false, error: "Audio file is empty" }
    }

    if (stats.size > 25 * 1024 * 1024) {
      // 25MB limit
      return { valid: false, error: "Audio file too large (max 25MB)" }
    }

    log(`Audio file validated: ${stats.size} bytes`)
    return { valid: true }
  } catch (error) {
    return { valid: false, error: `File validation failed: ${error}` }
  }
}

// Run Whisper transcription using Python script
async function runWhisperTranscription(audioPath: string, language: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), "scripts", "whisper_service.py")
    const modelSize = "base" // Use base model for balance of speed and accuracy

    log(`Starting Whisper transcription: ${audioPath}`)

    const python = spawn("python3", [scriptPath, audioPath, language, modelSize], {
      stdio: ["pipe", "pipe", "pipe"],
    })

    let stdout = ""
    let stderr = ""

    python.stdout.on("data", (data) => {
      stdout += data.toString()
    })

    python.stderr.on("data", (data) => {
      stderr += data.toString()
    })

    python.on("close", (code) => {
      log(`Whisper process finished with code: ${code}`)

      if (code === 0) {
        try {
          // Parse the JSON output
          const lines = stdout.trim().split("\n")
          const jsonLine = lines[lines.length - 1] // Last line should be JSON
          const result = JSON.parse(jsonLine)

          log(`Transcription result: ${result.success ? "SUCCESS" : "FAILED"}`)
          resolve(result)
        } catch (e) {
          log(`Failed to parse Whisper output: ${stdout}`, "error")
          reject(new Error(`Failed to parse Whisper output: ${e}`))
        }
      } else {
        log(`Whisper process failed: ${stderr}`, "error")
        reject(new Error(`Whisper process failed with code ${code}: ${stderr}`))
      }
    })

    python.on("error", (error) => {
      log(`Failed to start Whisper process: ${error.message}`, "error")
      reject(new Error(`Failed to start Whisper process: ${error.message}`))
    })

    // Timeout after 60 seconds for longer audio files
    setTimeout(() => {
      python.kill()
      reject(new Error("Whisper transcription timeout (60s)"))
    }, 60000)
  })
}

export async function POST(request: NextRequest) {
  let tempPath: string | null = null

  try {
    log("Received transcription request")

    const formData = await request.formData()
    const audioFile = formData.get("audio") as File
    const language = (formData.get("language") as string) || "auto"

    if (!audioFile) {
      log("No audio file provided", "error")
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    log(`Audio file received: ${audioFile.name}, Size: ${audioFile.size} bytes, Type: ${audioFile.type}`)

    // Validate file size
    if (audioFile.size === 0) {
      return NextResponse.json({ error: "Audio file is empty" }, { status: 400 })
    }

    if (audioFile.size > 25 * 1024 * 1024) {
      // 25MB limit
      return NextResponse.json({ error: "Audio file too large (max 25MB)" }, { status: 400 })
    }

    // Check if Python environment is available
    log("Checking Python environment...")
    const envCheck = await checkPythonEnvironment()

    if (!envCheck.available) {
      log(`Python environment not available: ${envCheck.error}`, "warn")
      return NextResponse.json({
        text: "Speech recognition requires Python and Whisper to be installed. Please install the requirements or type your text manually.",
        language: language === "auto" ? "en" : language,
        confidence: 0,
        fallback: true,
        error: envCheck.error,
      })
    }

    log("Python environment OK")

    // Use system temp directory
    const tempDir = path.join(os.tmpdir(), "aegyptus-whisper")
    await fs.mkdir(tempDir, { recursive: true })

    // Save uploaded file temporarily with proper extension
    const audioId = uuidv4()
    const originalExtension = audioFile.name.split(".").pop()?.toLowerCase() || "webm"

    // Map common web formats to supported extensions
    const extensionMap: { [key: string]: string } = {
      webm: "webm",
      mp4: "mp4",
      wav: "wav",
      mp3: "mp3",
      m4a: "m4a",
      ogg: "ogg",
    }

    const fileExtension = extensionMap[originalExtension] || "webm"
    tempPath = path.join(tempDir, `${audioId}.${fileExtension}`)

    const arrayBuffer = await audioFile.arrayBuffer()
    await fs.writeFile(tempPath, Buffer.from(arrayBuffer))

    log(`Audio saved to: ${tempPath}`)

    // Validate the saved file
    const validation = await validateAudioFile(tempPath)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    // Run Whisper transcription
    const result = await runWhisperTranscription(tempPath, language)

    // Clean up temporary file
    await fs.unlink(tempPath).catch(() => {})
    tempPath = null

    if (result.success && result.text) {
      log(`Transcription successful: "${result.text.substring(0, 50)}..."`)
      return NextResponse.json({
        text: result.text,
        language: result.language,
        confidence: result.confidence,
        duration: 0,
      })
    } else {
      log(`Transcription failed: ${result.error}`, "error")
      throw new Error(result.error || "Transcription failed")
    }
  } catch (error) {
    log(`STT API error: ${error}`, "error")

    // Clean up temporary file on error
    if (tempPath) {
      try {
        await fs.unlink(tempPath)
      } catch {}
    }

    // Return appropriate error response
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    if (errorMessage.includes("timeout")) {
      return NextResponse.json(
        {
          text: "Speech recognition timed out. Please try with a shorter audio clip.",
          language: "en",
          confidence: 0,
          fallback: true,
        },
        { status: 408 },
      )
    }

    return NextResponse.json(
      {
        text: "Speech recognition temporarily unavailable. Please type your text manually.",
        language: "en",
        confidence: 0,
        fallback: true,
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}
