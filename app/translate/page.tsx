"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Copy,
  Volume2,
  Zap,
  Trash2,
  Clock,
  RefreshCw,
  X,
  Upload,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  MessageSquareText,
  RotateCcw,
  Sparkles,
  BrainCircuit,
  Brain,
  CirclePause,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { GoogleGenerativeAI } from "@google/generative-ai"

type Language = "hieroglyph" | "english" | "arabic"
type ReadingDirection = "ltr" | "rtl" | "ttb"

interface TranslationHistory {
  id: string
  from: Language
  to: Language
  originalText: string
  translatedText: string
  timestamp: string
  hieroglyphSymbols?: string
}

const languages = [
  { value: "hieroglyph", label: "Hieroglyph" },
  { value: "english", label: "English" },
  { value: "arabic", label: "Arabic" },
]

const readingDirections = [
  { value: "ltr", label: "Left to Right" },
  { value: "rtl", label: "Right to Left" },
  { value: "ttb", label: "Top to Bottom" },
]

const sampleHistory: TranslationHistory[] = [
  {
    id: "1",
    from: "hieroglyph",
    to: "english",
    originalText: "𓊪𓏏𓇯𓀭",
    translatedText: "The pharaoh commands the building of a temple",
    timestamp: "2 hours ago",
    hieroglyphSymbols: "𓊪𓏏𓇯𓀭",
  },
  {
    id: "2",
    from: "hieroglyph",
    to: "english",
    originalText: "𓊨𓏏𓉐",
    translatedText: "Offerings to the gods bring prosperity",
    timestamp: "Yesterday",
    hieroglyphSymbols: "𓊨𓏏𓉐",
  },
]

export default function TranslatePage() {
  const genAI = new GoogleGenerativeAI("AIzaSyB18bMYqelXowt9S6lAPYRyX1qoVA6iNpc")
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const [fromLanguage, setFromLanguage] = useState<Language>("hieroglyph")
  const [toLanguage, setToLanguage] = useState<Language>("english")
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [history, setHistory] = useState<TranslationHistory[]>([])
  const [isTranslating, setIsTranslating] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recognition, setRecognition] = useState<any>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Image Translation states
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imageTranslationResult, setImageTranslationResult] = useState<string | null>(null)
  const [selectedReadingDirection, setSelectedReadingDirection] = useState<ReadingDirection>("ltr")
  const [isImageTranslating, setIsImageTranslating] = useState(false)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()

        recognitionInstance.continuous = true
        recognitionInstance.interimResults = true

        recognitionInstance.onresult = (event: any) => {
          let transcript = ""
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              transcript += event.results[i][0].transcript + " "
            }
          }

          if (transcript) {
            setInputText((prev) => prev + transcript)
          }
        }

        recognitionInstance.onend = () => {
          setIsRecording(false)
          setRecordingTime(0)
          if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }
        }

        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsRecording(false)
          setRecordingTime(0)
          if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }
        }

        setRecognition(recognitionInstance)
      }
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const handleSwapLanguages = () => {
    const temp = fromLanguage
    setFromLanguage(toLanguage)
    setToLanguage(temp)
    setInputText("")
    setOutputText("")
  }

  const handleFromLanguageChange = (value: Language) => {
    if (value === toLanguage) {
      // If trying to select the same language, swap them
      setToLanguage(fromLanguage)
    }
    setFromLanguage(value)
    setInputText("")
    setOutputText("")
  }

  const handleToLanguageChange = (value: Language) => {
    if (value === fromLanguage) {
      // If trying to select the same language, swap them
      setFromLanguage(toLanguage)
    }
    setToLanguage(value)
    setOutputText("")
  }

  const handleTranslate = async () => {
    if (!inputText.trim()) return

    setIsTranslating(true)

    try {
      // Construct the prompt based on language direction
      let prompt = ""

      if (fromLanguage === "hieroglyph" && toLanguage === "english") {
        prompt = `Translate the following Hieroglyphic symbols into English. Provide only the translation without explanations: ${inputText}`
      } else if (fromLanguage === "hieroglyph" && toLanguage === "arabic") {
        prompt = `Translate the following Hieroglyphic symbols into Arabic. Provide only the translation without explanations: ${inputText}`
      } else if (fromLanguage === "arabic" && toLanguage === "english") {
        prompt = `Translate the following Arabic text into English. Provide only the translation without explanations: ${inputText}`
      } else if (fromLanguage === "english" && toLanguage === "arabic") {
        prompt = `Translate the following English text into Arabic. Provide only the translation without explanations: ${inputText}`
      } else if (fromLanguage === "english" && toLanguage === "hieroglyph") {
        prompt = `Translate the following English text into Hieroglyphic symbols. Provide only the hieroglyphic symbols without explanations: ${inputText}`
      } else if (fromLanguage === "arabic" && toLanguage === "hieroglyph") {
        prompt = `Translate the following Arabic text into Hieroglyphic symbols. Provide only the hieroglyphic symbols without explanations: ${inputText}`
      } else {
        prompt = `Translate "${inputText}" from ${fromLanguage} to ${toLanguage}. Provide only the translation without explanations.`
      }

      // Call Gemini API with updated model
      const result = await model.generateContent(prompt)
      const response = result.response
      const translatedText = response.text()

      setOutputText(translatedText)

      // Add to history
      const newTranslation: TranslationHistory = {
        id: Date.now().toString(),
        from: fromLanguage,
        to: toLanguage,
        originalText: inputText,
        translatedText: translatedText,
        timestamp: "Just now",
        hieroglyphSymbols:
          fromLanguage === "hieroglyph" ? inputText : toLanguage === "hieroglyph" ? translatedText : undefined,
      }

      setHistory((prev) => [newTranslation, ...prev])

      // Save to localStorage for profile page
      const existingTranslations = JSON.parse(localStorage.getItem("aegyptus_translations") || "[]")
      const profileTranslation = {
        id: newTranslation.id,
        originalText: newTranslation.originalText,
        translatedText: newTranslation.translatedText,
        sourceLanguage: newTranslation.from,
        targetLanguage: newTranslation.to,
        timestamp: new Date().toISOString(),
      }
      existingTranslations.unshift(profileTranslation)
      localStorage.setItem("aegyptus_translations", JSON.stringify(existingTranslations))
    } catch (error) {
      console.error("Translation error:", error)
      let errorMessage = "Translation failed. Please try again."

      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          errorMessage = "API key error. Please check your configuration."
        } else if (error.message.includes("quota")) {
          errorMessage = "API quota exceeded. Please try again later."
        } else if (error.message.includes("model")) {
          errorMessage = "Model not available. Please try again later."
        }
      }

      setOutputText(errorMessage)
    } finally {
      setIsTranslating(false)
    }
  }

  const handleVoiceInput = () => {
    if (fromLanguage === "hieroglyph") {
      // Voice input not available for hieroglyphs
      return
    }

    if (!recognition) {
      alert("Speech recognition is not supported in your browser. Please try using Chrome or Edge.")
      return
    }

    if (isRecording) {
      // Stop recording
      recognition.stop()
      setIsRecording(false)
      setRecordingTime(0)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    } else {
      // Start recording
      try {
        // Set language based on fromLanguage
        recognition.lang = fromLanguage === "arabic" ? "ar-SA" : "en-US"

        // Start recognition
        recognition.start()
        setIsRecording(true)

        // Start timer
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1)
        }, 1000)
      } catch (error) {
        console.error("Error starting speech recognition:", error)
        alert("Failed to start speech recognition. Please try again.")
      }
    }
  }

  const handleImageUploadClick = () => {
    imageInputRef.current?.click()
  }

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
        setImageTranslationResult(null) // Clear previous result
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageTranslation = async () => {
    if (!uploadedImage) return

    setIsImageTranslating(true)
    setImageTranslationResult(null)

    try {
      // Simulate OCR and then translation
      // In a real app, you'd send the image to a backend for OCR and then translation
      const mockOcrText = "𓊪𓏏𓇯𓀭𓊨𓏏𓉐" // Simulated hieroglyphics from image

      const prompt = `Translate the following Hieroglyphic symbols into English. The reading direction is ${selectedReadingDirection}. Provide only the translation without explanations: ${mockOcrText}`

      // If you want to translate to Arabic, adjust the prompt
      // For this demo, we'll assume translation to English for image scan
      // In a real scenario, you'd have a target language selector for image translation too.

      const result = await model.generateContent(prompt)
      const response = result.response
      const translatedText = response.text()

      setImageTranslationResult(translatedText)
    } catch (error) {
      console.error("Image translation error:", error)
      setImageTranslationResult("Failed to translate image. Please try again.")
    } finally {
      setIsImageTranslating(false)
    }
  }

  const handleResetImageTranslation = () => {
    setUploadedImage(null)
    setImageTranslationResult(null)
    setSelectedReadingDirection("ltr")
    setIsImageTranslating(false)
    if (imageInputRef.current) {
      imageInputRef.current.value = "" // Clear the file input
    }
  }

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  const getAvailableLanguages = (currentLanguage: Language, isTarget: boolean) => {
    return languages.filter((lang) => (isTarget ? lang.value !== fromLanguage : lang.value !== toLanguage))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handlePronounceTranslation = useCallback(() => {
    if (outputText && toLanguage !== "hieroglyph") {
      if (isSpeaking) {
        // Stop/pause current speech
        speechSynthesis.cancel()
        setIsSpeaking(false)
        return
      }

      setIsSpeaking(true)

      // Use Web Speech API for pronunciation
      const utterance = new SpeechSynthesisUtterance(outputText)
      utterance.lang = toLanguage === "arabic" ? "ar" : "en"

      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      speechSynthesis.speak(utterance)
    }
  }, [outputText, toLanguage, isSpeaking])

  const handleCopyTranslation = useCallback(() => {
    if (outputText) {
      navigator.clipboard.writeText(outputText)
      console.log("Translation copied to clipboard")
    }
  }, [outputText])

  return (
    <div className="container py-8 px-4 max-w-6xl">
      <h1 className="font-cinzel text-3xl font-bold mb-8 text-gold">Translate</h1>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="text">Text Translation</TabsTrigger>
          <TabsTrigger value="scan">Image Translation</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-8">
          <div className="space-y-6">
            {/* Language Selectors */}
            <div className="flex items-center gap-4">
              <Select value={fromLanguage} onValueChange={handleFromLanguageChange}>
                <SelectTrigger className="w-40 border-gold/20 focus:ring-gold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableLanguages(fromLanguage, false).map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={handleSwapLanguages}
                className="border-gold/20 hover:border-gold/50"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>

              <Select value={toLanguage} onValueChange={handleToLanguageChange}>
                <SelectTrigger className="w-40 border-gold/20 focus:ring-gold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableLanguages(toLanguage, true).map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Translation Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Input Area */}
              <div className="space-y-4">
                <Textarea
                  placeholder="Enter text to translate"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] border-gold/20 focus-visible:ring-gold resize-none"
                  dir={fromLanguage === "arabic" ? "rtl" : "ltr"}
                />

                {/* Input Controls */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleVoiceInput}
                    disabled={fromLanguage === "hieroglyph"}
                    className={cn(
                      "border-gold/20 hover:border-gold/50 relative",
                      fromLanguage === "hieroglyph" && "opacity-50 cursor-not-allowed",
                      isRecording && "border-red-500 bg-red-500/10",
                    )}
                  >
                    <div className="relative w-5 h-5 flex items-center justify-center">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={cn("transition-opacity", isRecording ? "opacity-70" : "opacity-100")}
                      >
                        <path
                          d="M12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2Z"
                          fill="currentColor"
                        />
                        <path
                          d="M19 10V11C19 15.42 15.42 19 11 19H13C17.42 19 21 15.42 21 11V10H19Z"
                          fill="currentColor"
                        />
                        <path d="M7 10V11C7 15.42 10.58 19 15 19H13C8.58 19 5 15.42 5 11V10H7Z" fill="currentColor" />
                        <path d="M12 19V22H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M8 22H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      {isRecording && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      )}
                    </div>
                    {isRecording && (
                      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-background border border-gold/20 px-2 py-1 rounded-md whitespace-nowrap">
                        {formatTime(recordingTime)}
                      </span>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setInputText("")}
                    className="border-gold/20 hover:border-gold/50"
                    disabled={!inputText.trim()}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Output Area */}
              <div className="space-y-4">
                <div className="min-h-[200px] p-3 border border-gold/20 rounded-md bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-2 capitalize">
                    {languages.find((l) => l.value === toLanguage)?.label}
                  </div>
                  <div className="text-sm" dir={toLanguage === "arabic" ? "rtl" : "ltr"}>
                    {outputText || "Translation will appear here"}
                  </div>
                </div>

                {/* Output Controls */}
                {outputText && (
                  <div className="flex gap-2">
                    <div className="flex flex-col items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePronounceTranslation}
                        disabled={toLanguage === "hieroglyph"}
                        className={cn(
                          "border-gold/20 hover:border-gold/50",
                          toLanguage === "hieroglyph" && "opacity-50 cursor-not-allowed",
                        )}
                      >
                        {isSpeaking ? <CirclePause className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      {isSpeaking && <span className="text-xs text-muted-foreground">Speaking...</span>}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyTranslation}
                      className="border-gold/20 hover:border-gold/50"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Translate Button */}
            <Button
              onClick={handleTranslate}
              disabled={!inputText.trim() || isTranslating}
              className="w-full bg-gold hover:bg-gold/90 text-black font-medium py-3"
            >
              <Zap className="mr-2 h-4 w-4" />
              {isTranslating ? "Translating..." : "Translate"}
            </Button>

            {/* Translation History */}
            <Card className="border-gold/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-gold" />
                  <h3 className="font-medium">Translation History</h3>
                </div>

                <div className="space-y-4">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gold/20 rounded-md p-4 hover:border-gold/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm text-muted-foreground">
                          {item.from} → {item.to}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteHistory(item.id)}
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      {item.hieroglyphSymbols && <div className="text-lg mb-2 font-mono">{item.hieroglyphSymbols}</div>}

                      <div className="text-sm mb-2" dir={item.to === "arabic" ? "rtl" : "ltr"}>
                        {item.translatedText}
                      </div>

                      <div className="text-xs text-muted-foreground">{item.timestamp}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scan">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Upload and Controls */}
            <Card className="border-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-gold" />
                  Upload Hieroglyph Image
                </CardTitle>
                <CardDescription>Upload an image containing hieroglyphs for translation.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-gold/30 rounded-md min-h-[200px] cursor-pointer hover:border-gold/50 transition-colors"
                  onClick={handleImageUploadClick}
                >
                  {uploadedImage ? (
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded Hieroglyph"
                      className="max-h-[200px] object-contain"
                    />
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground text-center">Drag & drop an image here, or click to upload</p>
                    </>
                  )}
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="reading-direction" className="text-sm font-medium">
                    Reading Direction
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {readingDirections.map((dir) => (
                      <Button
                        key={dir.value}
                        variant={selectedReadingDirection === dir.value ? "default" : "outline"}
                        className={cn(
                          "w-full",
                          selectedReadingDirection === dir.value
                            ? "bg-gold text-black hover:bg-gold/90"
                            : "border-gold/20 hover:border-gold/50",
                        )}
                        onClick={() => setSelectedReadingDirection(dir.value)}
                      >
                        {dir.value === "ltr" && <ArrowRight className="h-4 w-4 mr-2" />}
                        {dir.value === "rtl" && <ArrowLeft className="h-4 w-4 mr-2" />}
                        {dir.value === "ttb" && <ArrowDown className="h-4 w-4 mr-2" />}
                        {dir.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleImageTranslation}
                    disabled={!uploadedImage || isImageTranslating}
                    className="flex-1 bg-gold hover:bg-gold/90 text-black font-medium py-3"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    {isImageTranslating ? "Translating Image..." : "Translate Image"}
                  </Button>
                  <Button
                    onClick={handleResetImageTranslation}
                    variant="outline"
                    className="border-gold/20 hover:border-gold/50"
                    disabled={!uploadedImage && !imageTranslationResult}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Translation Summary Panel */}
            <Card className="border-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-gold" />
                  Translation Summary
                </CardTitle>
                <CardDescription>AI-powered hieroglyph detection and interpretation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MessageSquareText className="h-4 w-4 text-gold" />
                    Translation Results
                  </h4>
                  <div className="min-h-[120px] p-3 border border-gold/20 rounded-md bg-muted/50 text-sm">
                    {isImageTranslating ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <RefreshCw className="animate-spin mr-2" /> Translating...
                      </div>
                    ) : imageTranslationResult ? (
                      imageTranslationResult
                    ) : (
                      <span className="text-muted-foreground italic">Translation will appear here.</span>
                    )}
                  </div>
                </div>
                {imageTranslationResult && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigator.clipboard.writeText(imageTranslationResult)}
                      className="border-gold/20 hover:border-gold/50"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    {/* Add pronunciation for image translation if needed */}
                  </div>
                )}

                {/* Horizontal Rule */}
                <hr className="my-4 border-gold/10" />

                {/* Detection Details Section */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-gold" />
                    Detection Details
                  </h4>
                  <div className="p-3 border border-gold/20 rounded-md bg-muted/50 text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-muted-foreground" />
                      <span>Model: Faster R-CNN</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedReadingDirection === "ltr" && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                      {selectedReadingDirection === "rtl" && <ArrowLeft className="h-4 w-4 text-muted-foreground" />}
                      {selectedReadingDirection === "ttb" && <ArrowDown className="h-4 w-4 text-muted-foreground" />}
                      <span>
                        Direction: {readingDirections.find((d) => d.value === selectedReadingDirection)?.label}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
