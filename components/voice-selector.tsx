"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Volume2, User, Users } from "lucide-react"

interface VoiceOptions {
  voice: "male" | "female"
  speed: number
}

interface VoiceSelectorProps {
  voiceOptions: VoiceOptions
  onVoiceChange: (options: VoiceOptions) => void
  language: string
  onTest?: (text: string) => void
  disabled?: boolean
}

export function VoiceSelector({ voiceOptions, onVoiceChange, language, onTest, disabled = false }: VoiceSelectorProps) {
  const testText = language === "ar" ? "مرحبا، هذا اختبار للصوت" : "Hello, this is a voice test"

  return (
    <Card className="border-gold/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-gold" />
          Voice Settings
        </CardTitle>
        <CardDescription className="text-xs">Customize voice output for text-to-speech</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Voice Gender Selection */}
        <div className="space-y-2">
          <label className="text-xs font-medium">Voice Type</label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={voiceOptions.voice === "female" ? "default" : "outline"}
              size="sm"
              onClick={() => onVoiceChange({ ...voiceOptions, voice: "female" })}
              disabled={disabled}
              className={
                voiceOptions.voice === "female"
                  ? "bg-gold text-black hover:bg-gold/90"
                  : "border-gold/20 hover:border-gold/50"
              }
            >
              <User className="h-3 w-3 mr-1" />
              Female
            </Button>
            <Button
              variant={voiceOptions.voice === "male" ? "default" : "outline"}
              size="sm"
              onClick={() => onVoiceChange({ ...voiceOptions, voice: "male" })}
              disabled={disabled}
              className={
                voiceOptions.voice === "male"
                  ? "bg-gold text-black hover:bg-gold/90"
                  : "border-gold/20 hover:border-gold/50"
              }
            >
              <Users className="h-3 w-3 mr-1" />
              Male
            </Button>
          </div>
        </div>

        {/* Speed Control */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium">Speech Speed</label>
            <span className="text-xs text-muted-foreground">{(voiceOptions.speed || 1.0).toFixed(1)}x</span>
          </div>
          <Slider
            value={[voiceOptions.speed || 1.0]}
            onValueChange={([speed]) => onVoiceChange({ ...voiceOptions, speed })}
            min={0.5}
            max={2.0}
            step={0.1}
            disabled={disabled}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Slow</span>
            <span>Normal</span>
            <span>Fast</span>
          </div>
        </div>

        {/* Test Voice Button */}
        {onTest && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTest(testText)}
            disabled={disabled}
            className="w-full border-gold/20 hover:border-gold/50"
          >
            <Volume2 className="h-3 w-3 mr-1" />
            Test Voice
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
