"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Volume2 } from "lucide-react"

const GOOGLE_API_KEY = "AIzaSyAlwtYp99Drxekhb69_zud2rbI028Jo9zw"

export default function Translate() {
  const [inputText, setInputText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [isSpeaking, setIsSpeaking] = useState(false)

  const translate = async () => {
    const encodedParams = new URLSearchParams()
    encodedParams.set("q", inputText)
    encodedParams.set("target", "ar")
    encodedParams.set("source", "en")

    const url = "https://google-translate1.p.rapidapi.com/language/translate/v2"
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "application/gzip",
        "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
        "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
      },
      body: encodedParams,
    }

    try {
      const response = await fetch(url, options)
      const result = await response.json()
      setTranslatedText(result.data.translations[0].translatedText)
    } catch (error) {
      console.error(error)
    }
  }

  const speak = (text: string) => {
    if (!text.trim()) return

    if (isSpeaking) {
      // Stop current speech
      speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    setIsSpeaking(true)

    // Enhanced TTS with Google optimization
    const utterance = new SpeechSynthesisUtterance(text)

    // Get enhanced voices
    const voices = speechSynthesis.getVoices()
    let selectedVoice = null

    // Prioritize high-quality voices
    const targetLang = translatedText.includes("العربية") || /[\u0600-\u06FF]/.test(text) ? "ar" : "en"

    if (targetLang === "ar") {
      selectedVoice =
        voices.find((v) => v.lang.startsWith("ar") && (v.name.includes("Enhanced") || v.name.includes("Premium"))) ||
        voices.find((v) => v.lang.startsWith("ar"))
    } else {
      selectedVoice =
        voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Neural") || v.name.includes("Enhanced"))) ||
        voices.find((v) => v.lang.startsWith("en"))
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice
    }

    // Enhanced speech parameters
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 0.9

    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    speechSynthesis.speak(utterance)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="w-full md:w-1/2 flex flex-col gap-2">
        <Textarea
          placeholder="Enter text to translate"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <Button onClick={translate}>Translate to Arabic</Button>
      </div>

      <div className="w-full md:w-1/2 flex flex-col gap-2">
        <Textarea readOnly placeholder="Translation" value={translatedText} />
        <Button
          onClick={() => speak(translatedText)}
          disabled={!translatedText}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium transition-all duration-200 flex flex-col items-center gap-1 h-16"
        >
          {isSpeaking ? (
            <>
              <div className="flex gap-1">
                <div className="w-1 h-4 bg-black"></div>
                <div className="w-1 h-4 bg-black"></div>
              </div>
              <span className="text-xs">Speaking...</span>
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4" />
              <span className="text-xs">Speak</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
