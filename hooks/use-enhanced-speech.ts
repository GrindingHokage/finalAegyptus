"use client"

import { useState, useRef, useCallback, useEffect } from "react"

interface SpeechConfig {
  language: "en" | "ar" | "auto"
  continuous?: boolean
  interimResults?: boolean
}

interface TranscriptionResult {
  text: string
  language: string
  confidence: number
  duration?: number
  fallback?: boolean
  error?: string
}

interface VoiceOptions {
  voice: "male" | "female"
  speed: number
}

export function useEnhancedSpeech(config: SpeechConfig = { language: "auto" }) {
  // States
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null)
  const [voiceOptions, setVoiceOptions] = useState<VoiceOptions>({ voice: "female", speed: 1.0 })

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Enhanced logging
  const log = useCallback((message: string, level: "info" | "error" | "warn" = "info") => {
    const timestamp = new Date().toISOString()
    console[level](`[${timestamp}] [Speech Hook] ${message}`)
  }, [])

  // Cleanup function
  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null
    }

    if (currentUtteranceRef.current) {
      speechSynthesis.cancel()
      currentUtteranceRef.current = null
    }
  }, [])

  // Get optimal audio format
  const getOptimalAudioFormat = useCallback(() => {
    const formats = [
      { mimeType: "audio/wav", extension: "wav" },
      { mimeType: "audio/webm;codecs=opus", extension: "webm" },
      { mimeType: "audio/webm", extension: "webm" },
      { mimeType: "audio/mp4", extension: "mp4" },
      { mimeType: "audio/ogg;codecs=opus", extension: "ogg" },
    ]

    for (const format of formats) {
      if (MediaRecorder.isTypeSupported(format.mimeType)) {
        log(`Selected audio format: ${format.mimeType}`)
        return format
      }
    }

    log("No optimal format found, using default", "warn")
    return { mimeType: "", extension: "webm" }
  }, [log])

  // Start recording with enhanced settings
  const startRecording = useCallback(async () => {
    try {
      setError(null)
      log("Starting recording...")

      // Request high-quality microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000, // Whisper prefers 16kHz
          channelCount: 1, // Mono
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      streamRef.current = stream
      audioChunksRef.current = []

      // Get optimal audio format
      const audioFormat = getOptimalAudioFormat()

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: audioFormat.mimeType || undefined,
        audioBitsPerSecond: 128000,
      })

      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
          log(`Audio chunk received: ${event.data.size} bytes`)
        }
      }

      mediaRecorder.onstop = async () => {
        try {
          log("Recording stopped, processing audio...")

          const audioBlob = new Blob(audioChunksRef.current, {
            type: audioFormat.mimeType || "audio/webm",
          })

          log(`Audio blob created: ${audioBlob.size} bytes, type: ${audioBlob.type}`)

          // Only transcribe if we have substantial audio data
          if (audioBlob.size > 1000) {
            // At least 1KB
            await transcribeAudio(audioBlob, audioFormat.extension)
          } else {
            setError("Recording too short. Please record for at least 2 seconds.")
            setIsTranscribing(false)
            log("Recording too short", "warn")
          }
        } catch (error) {
          log(`Error processing recording: ${error}`, "error")
          setError("Failed to process recording")
          setIsTranscribing(false)
        }
      }

      mediaRecorder.onerror = (event) => {
        log(`MediaRecorder error: ${event}`, "error")
        setError("Recording failed. Please try again.")
        setIsRecording(false)
        setIsTranscribing(false)
      }

      // Start recording with frequent data collection for better quality
      mediaRecorder.start(100) // Collect data every 100ms
      setIsRecording(true)

      // Start timer
      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      log(`Recording started with format: ${audioFormat.mimeType}`)
    } catch (err) {
      log(`Failed to start recording: ${err}`, "error")
      setError("Failed to access microphone. Please check permissions and try again.")
      cleanup()
    }
  }, [log, getOptimalAudioFormat, cleanup])

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      log("Stopping recording...")
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      // Stop media stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
    }
  }, [isRecording, log])

  // Enhanced transcription with proper error handling
  const transcribeAudio = useCallback(
    async (audioBlob: Blob, extension: string): Promise<TranscriptionResult | null> => {
      setIsTranscribing(true)
      setError(null)

      log(`Starting transcription: ${audioBlob.size} bytes, extension: ${extension}`)

      try {
        const formData = new FormData()

        // Create a proper file with the right extension and name
        const fileName = `recording.${extension}`
        const audioFile = new File([audioBlob], fileName, { type: audioBlob.type })

        formData.append("audio", audioFile)
        formData.append("language", config.language)

        log("Sending transcription request...")

        const response = await fetch("/api/speech/transcribe", {
          method: "POST",
          body: formData,
        })

        log(`Transcription response: ${response.status} ${response.statusText}`)

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Transcription API error: ${response.status} - ${errorText}`)
        }

        const result = await response.json()
        log(`Transcription result: ${JSON.stringify(result)}`)

        if (result.fallback) {
          setError(result.error || "Speech recognition service unavailable")
        } else if (result.text && result.text.trim()) {
          setError(null) // Clear any previous errors on success
          log("Transcription successful!")
        } else {
          setError("No speech detected. Please try speaking more clearly.")
        }

        setTranscriptionResult(result)
        return result
      } catch (err) {
        log(`Transcription error: ${err}`, "error")

        const fallbackResult: TranscriptionResult = {
          text: "Transcription failed. Please type your text manually.",
          language: config.language === "auto" ? "en" : config.language,
          confidence: 0,
          fallback: true,
          error: err instanceof Error ? err.message : "Unknown error",
        }

        setTranscriptionResult(fallbackResult)
        setError("Speech recognition failed. Please try again or type manually.")
        return fallbackResult
      } finally {
        setIsTranscribing(false)
      }
    },
    [config.language, log],
  )

  // Enhanced text-to-speech
  const speak = useCallback(
    async (text: string, language = "en") => {
      if (!text.trim()) return

      // Stop any current speech
      speechSynthesis.cancel()

      setIsSpeaking(true)
      setError(null)

      log(`Starting TTS: "${text.substring(0, 50)}..." in ${language}`)

      try {
        // Wait for voices to load
        const loadVoices = (): Promise<SpeechSynthesisVoice[]> => {
          return new Promise((resolve) => {
            const voices = speechSynthesis.getVoices()
            if (voices.length > 0) {
              resolve(voices)
            } else {
              const handler = () => {
                speechSynthesis.removeEventListener("voiceschanged", handler)
                resolve(speechSynthesis.getVoices())
              }
              speechSynthesis.addEventListener("voiceschanged", handler)
            }
          })
        }

        const voices = await loadVoices()
        log(`Available voices: ${voices.length}`)

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = language === "ar" ? "ar-SA" : "en-US"
        utterance.rate = Math.max(0.1, Math.min(2.0, voiceOptions.speed))
        utterance.pitch = 1
        utterance.volume = 1

        // Smart voice selection
        const targetLang = language === "ar" ? "ar" : "en"
        const genderKeywords =
          voiceOptions.voice === "female" ? ["female", "woman", "girl", "lady"] : ["male", "man", "boy", "gentleman"]

        const preferredVoice =
          voices.find((voice) => {
            const matchesLanguage = voice.lang.toLowerCase().startsWith(targetLang)
            const matchesGender = genderKeywords.some((keyword) => voice.name.toLowerCase().includes(keyword))
            return matchesLanguage && matchesGender
          }) ||
          voices.find((voice) => voice.lang.toLowerCase().startsWith(targetLang)) ||
          voices[0]

        if (preferredVoice) {
          utterance.voice = preferredVoice
          log(`Selected voice: ${preferredVoice.name}`)
        }

        utterance.onstart = () => {
          log("Speech started")
        }

        utterance.onend = () => {
          log("Speech ended")
          setIsSpeaking(false)
          currentUtteranceRef.current = null
        }

        utterance.onerror = (event) => {
          log(`Speech synthesis error: ${event.error}`, "error")
          setError("Speech synthesis failed")
          setIsSpeaking(false)
          currentUtteranceRef.current = null
        }

        currentUtteranceRef.current = utterance
        speechSynthesis.speak(utterance)
      } catch (err) {
        log(`TTS error: ${err}`, "error")
        setError("Speech synthesis failed")
        setIsSpeaking(false)
      }
    },
    [voiceOptions, log],
  )

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    speechSynthesis.cancel()
    setIsSpeaking(false)
    currentUtteranceRef.current = null
    log("Speech stopped")
  }, [log])

  // Toggle recording
  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [isRecording, startRecording, stopRecording])

  // Format recording time
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  return {
    // States
    isRecording,
    isTranscribing,
    isSpeaking,
    recordingTime,
    error,
    transcriptionResult,
    voiceOptions,

    // Actions
    startRecording,
    stopRecording,
    toggleRecording,
    transcribeAudio,
    speak,
    stopSpeaking,
    setVoiceOptions,

    // Utilities
    formatTime,
    clearError: () => setError(null),
    getStatus: () => {
      if (isRecording) return "🎙️ Recording..."
      if (isTranscribing) return "🔄 Processing with Whisper..."
      if (isSpeaking) return "🔊 Speaking..."
      return "✅ Ready"
    },
  }
}
