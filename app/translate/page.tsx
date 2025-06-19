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
  Mic,
  MicOff,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { useEnhancedSpeech } from "@/hooks/use-enhanced-speech"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

export default function TranslatePage() {
  const genAI = new GoogleGenerativeAI("AIzaSyCXBLLr9AdkUotagl6SAHMfGZtAdUAwRp8")
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const [fromLanguage, setFromLanguage] = useState<Language>("hieroglyph")
  const [toLanguage, setToLanguage] = useState<Language>("english")
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [history, setHistory] = useState<TranslationHistory[]>([])
  const [isTranslating, setIsTranslating] = useState(false)
  const [voiceOptions, setVoiceOptions] = useState({
    voice: "female" as "male" | "female",
    speed: 1.0,
  })

  // Enhanced Speech functionality
  const speechConfig = {
    language:
      fromLanguage === "arabic" ? ("ar" as const) : fromLanguage === "english" ? ("en" as const) : ("auto" as const),
  }

  const {
    isRecording,
    isTranscribing,
    isSpeaking,
    recordingTime,
    error: speechError,
    transcriptionResult,
    toggleRecording,
    speak,
    formatTime,
    clearError,
    voiceOptions: hookVoiceOptions,
    setVoiceOptions: setHookVoiceOptions,
  } = useEnhancedSpeech(speechConfig)

  // Image Translation states
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imageTranslationResult, setImageTranslationResult] = useState<string | null>(null)
  const [selectedReadingDirection, setSelectedReadingDirection] = useState<ReadingDirection>("ltr")
  const [isImageTranslating, setIsImageTranslating] = useState(false)

  const handleSwapLanguages = () => {
    const temp = fromLanguage
    setFromLanguage(toLanguage)
    setToLanguage(temp)
    setInputText("")
    setOutputText("")
  }

  const handleFromLanguageChange = (value: Language) => {
    if (value === toLanguage) {
      setToLanguage(fromLanguage)
    }
    setFromLanguage(value)
    setInputText("")
    setOutputText("")
  }

  const handleToLanguageChange = (value: Language) => {
    if (value === fromLanguage) {
      setFromLanguage(toLanguage)
    }
    setToLanguage(value)
    setOutputText("")
  }

  const handleTranslate = async () => {
    if (!inputText.trim()) return

    setIsTranslating(true)

    try {
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

      const result = await model.generateContent(prompt)
      const response = result.response
      const translatedText = response.text()

      setOutputText(translatedText)

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

  // Enhanced voice input handler
  const handleVoiceInput = async () => {
    if (fromLanguage === "hieroglyph") {
      return
    }

    clearError()

    if (isRecording) {
      // Stop recording and get transcription
      toggleRecording()
    } else {
      // Start recording
      toggleRecording()
    }
  }

  // Handle transcription result
  useEffect(() => {
    if (transcriptionResult && transcriptionResult.text) {
      setInputText((prev) => prev + (prev ? " " : "") + transcriptionResult.text)
    }
  }, [transcriptionResult])

  const handleImageUploadClick = () => {
    imageInputRef.current?.click()
  }

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
        setImageTranslationResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageTranslation = async () => {
    if (!uploadedImage) return

    setIsImageTranslating(true)
    setImageTranslationResult(null)

    try {
      const mockOcrText = "𓊪𓏏𓇯𓀭𓊨𓏏𓉐"

      const prompt = `Translate the following Hieroglyphic symbols into English. The reading direction is ${selectedReadingDirection}. Provide only the translation without explanations: ${mockOcrText}`

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
      imageInputRef.current.value = ""
    }
  }

  const handleCopyTranslation = useCallback(() => {
    if (outputText) {
      navigator.clipboard.writeText(outputText)
      console.log("Translation copied to clipboard")
    }
  }, [outputText])

  const handlePronounceTranslation = useCallback(() => {
    if (outputText && toLanguage !== "hieroglyph") {
      const language = toLanguage === "arabic" ? "ar" : "en"
      speak(outputText, language)
    }
  }, [outputText, toLanguage, speak])

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  const getAvailableLanguages = (currentLanguage: Language, isTarget: boolean) => {
    return languages.filter((lang) => (isTarget ? lang.value !== fromLanguage : lang.value !== toLanguage))
  }

  return (
    <div className="container py-8 px-4 max-w-6xl">
      <h1 className="font-cinzel text-3xl font-bold mb-8 text-gold">Translate</h1>

      {speechError && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{speechError}</AlertDescription>
        </Alert>
      )}

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
                      isRecording && "border-red-500 bg-red-500/10 animate-pulse",
                      isTranscribing && "border-blue-500 bg-blue-500/10",
                    )}
                  >
                    {isTranscribing ? (
                      <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                    ) : isRecording ? (
                      <MicOff className="h-4 w-4 text-red-600" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}

                    {/* Status indicator */}
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
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePronounceTranslation}
                      disabled={toLanguage === "hieroglyph"}
                      className={cn(
                        "border-gold/20 hover:border-gold/50 relative",
                        toLanguage === "hieroglyph" && "opacity-50 cursor-not-allowed",
                        isSpeaking && "border-green-500 bg-green-500/10 animate-pulse",
                      )}
                    >
                      {isSpeaking ? (
                        <RefreshCw className="h-4 w-4 animate-spin text-green-600" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}

                      {/* Speaking indicator */}
                      {isSpeaking && (
                        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-background border border-gold/20 px-2 py-1 rounded-md whitespace-nowrap">
                          🔊 Speaking...
                        </span>
                      )}
                    </Button>

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

                <div className="space-y-3">
                  <label htmlFor="reading-direction" className="text-sm font-medium block">
                    Reading Direction
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {readingDirections.map((dir) => (
                      <Button
                        key={dir.value}
                        variant={selectedReadingDirection === dir.value ? "default" : "outline"}
                        className={cn(
                          "w-full h-12 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2",
                          selectedReadingDirection === dir.value
                            ? "bg-gold text-black hover:bg-gold/90 border-gold shadow-md"
                            : "border-gold/30 hover:border-gold/60 hover:bg-gold/5 text-foreground",
                        )}
                        onClick={() => setSelectedReadingDirection(dir.value)}
                      >
                        {dir.value === "ltr" && <ArrowRight className="h-4 w-4 flex-shrink-0" />}
                        {dir.value === "rtl" && <ArrowLeft className="h-4 w-4 flex-shrink-0" />}
                        {dir.value === "ttb" && <ArrowDown className="h-4 w-4 flex-shrink-0" />}
                        <span className="truncate">{dir.label}</span>
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
                  </div>
                )}

                <hr className="my-4 border-gold/10" />

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-gold" />
                    Detection Details
                  </h4>
                  <div className="p-3 border border-gold/20 rounded-md bg-muted/50 text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-muted-foreground" />
                      <span>Model: OpenAI Whisper + Coqui TTS</span>
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
