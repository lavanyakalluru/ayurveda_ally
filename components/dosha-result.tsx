"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wind, Flame, Mountain, Download, Share } from "lucide-react"
import Link from "next/link"

interface DoshaResultProps {
  result: {
    dominant: string
    scores: { vata: number; pitta: number; kapha: number }
  }
  onRetake: () => void
}

const doshaInfo = {
  vata: {
    name: "Vata",
    icon: Wind,
    element: "Air & Space",
    description: "You are creative, energetic, and adaptable. Vata governs movement and communication.",
    characteristics: ["Creative", "Quick-thinking", "Energetic", "Adaptable", "Enthusiastic"],
    recommendations: [
      "Eat warm, cooked foods",
      "Maintain regular routines",
      "Practice calming yoga",
      "Get adequate rest",
      "Stay warm and avoid cold",
    ],
    className: "dosha-vata",
  },
  pitta: {
    name: "Pitta",
    icon: Flame,
    element: "Fire & Water",
    description: "You are focused, determined, and intelligent. Pitta governs digestion and metabolism.",
    characteristics: ["Focused", "Intelligent", "Determined", "Competitive", "Natural leader"],
    recommendations: [
      "Eat cooling foods",
      "Avoid spicy and acidic foods",
      "Practice moderate exercise",
      "Stay cool and hydrated",
      "Manage stress and anger",
    ],
    className: "dosha-pitta",
  },
  kapha: {
    name: "Kapha",
    icon: Mountain,
    element: "Earth & Water",
    description: "You are calm, stable, and nurturing. Kapha provides structure and immunity.",
    characteristics: ["Calm", "Stable", "Nurturing", "Patient", "Loyal"],
    recommendations: [
      "Eat light, spicy foods",
      "Exercise regularly",
      "Avoid heavy, oily foods",
      "Stay active and motivated",
      "Embrace variety and change",
    ],
    className: "dosha-kapha",
  },
}

export function DoshaResult({ result, onRetake }: DoshaResultProps) {
  const dominantDosha = doshaInfo[result.dominant as keyof typeof doshaInfo]
  const Icon = dominantDosha.icon

  return (
    <div className="min-h-screen gradient-bg py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">Your Dosha Profile</h1>
          <p className="text-muted-foreground">
            Based on your responses, here's your personalized Ayurvedic constitution
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Result */}
          <div className="lg:col-span-2">
            <Card className={`shadow-xl ${dominantDosha.className} border-0`}>
              <CardHeader className="text-center pb-6">
                <div className="mx-auto p-6 rounded-full bg-white/80 w-fit mb-4">
                  <Icon className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="font-serif text-3xl">Your Primary Dosha: {dominantDosha.name}</CardTitle>
                <p className="text-muted-foreground">{dominantDosha.element}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-center text-lg">{dominantDosha.description}</p>

                <div>
                  <h3 className="font-semibold mb-3">Your Characteristics:</h3>
                  <div className="flex flex-wrap gap-2">
                    {dominantDosha.characteristics.map((char, index) => (
                      <Badge key={index} variant="secondary" className="bg-white/80">
                        {char}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Personalized Recommendations:</h3>
                  <ul className="space-y-2">
                    {dominantDosha.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Score Breakdown */}
          <div className="space-y-6">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(result.scores).map(([dosha, score]) => (
                  <div key={dosha} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="capitalize font-medium">{dosha}</span>
                      <span>{score}/8</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(score / 8) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Button asChild className="w-full">
                <Link href="/ai-advisor">Get AI Recommendations</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={onRetake}>
                Retake Quiz
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
