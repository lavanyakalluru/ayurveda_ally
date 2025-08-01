"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { DoshaResult } from "@/components/dosha-result"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

const questions = [
  {
    id: 1,
    question: "What best describes your body frame?",
    options: [
      { value: "vata", text: "Thin, light, small-boned" },
      { value: "pitta", text: "Medium build, well-proportioned" },
      { value: "kapha", text: "Large frame, heavy, well-built" },
    ],
  },
  {
    id: 2,
    question: "How is your appetite typically?",
    options: [
      { value: "vata", text: "Variable, sometimes forget to eat" },
      { value: "pitta", text: "Strong, regular, get irritable when hungry" },
      { value: "kapha", text: "Steady, can skip meals easily" },
    ],
  },
  {
    id: 3,
    question: "What describes your sleep pattern?",
    options: [
      { value: "vata", text: "Light sleeper, tend to wake up easily" },
      { value: "pitta", text: "Moderate sleep, wake up refreshed" },
      { value: "kapha", text: "Deep sleeper, need 8+ hours" },
    ],
  },
  {
    id: 4,
    question: "How do you handle stress?",
    options: [
      { value: "vata", text: "Get anxious and worried easily" },
      { value: "pitta", text: "Become irritated and angry" },
      { value: "kapha", text: "Remain calm but may withdraw" },
    ],
  },
  {
    id: 5,
    question: "What's your energy level like?",
    options: [
      { value: "vata", text: "Comes in bursts, then crashes" },
      { value: "pitta", text: "Steady and intense" },
      { value: "kapha", text: "Steady and enduring" },
    ],
  },
  {
    id: 6,
    question: "How is your digestion?",
    options: [
      { value: "vata", text: "Irregular, sometimes bloated or gassy" },
      { value: "pitta", text: "Strong, rarely have digestive issues" },
      { value: "kapha", text: "Slow but steady, feel heavy after meals" },
    ],
  },
  {
    id: 7,
    question: "What's your preferred weather?",
    options: [
      { value: "vata", text: "Warm and humid" },
      { value: "pitta", text: "Cool and dry" },
      { value: "kapha", text: "Warm and dry" },
    ],
  },
  {
    id: 8,
    question: "How do you make decisions?",
    options: [
      { value: "vata", text: "Quickly but often change my mind" },
      { value: "pitta", text: "Decisively after analyzing facts" },
      { value: "kapha", text: "Slowly and deliberately" },
    ],
  },
]

export default function DoshaQuizPage() {
  const { user } = useAuth()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: value }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setShowResult(true)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const calculateDosha = () => {
    const scores = { vata: 0, pitta: 0, kapha: 0 }
    Object.values(answers).forEach((answer) => {
      scores[answer as keyof typeof scores]++
    })

    const dominant = Object.entries(scores).reduce((a, b) =>
      scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b,
    )[0]

    return { dominant, scores }
  }

  useEffect(() => {
    if (showResult && user?.email) {
      const result = calculateDosha()
      fetch("/api/dosha/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user.email,
          dominantDosha: result.dominant,
          scores: result.scores,
          answers,
        }),
      }).catch((err) => console.error("Save failed:", err))
    }
  }, [showResult, user?.email, answers])

  if (showResult) {
    const result = calculateDosha()
    return (
      <DoshaResult
        result={result}
        onRetake={() => {
          setShowResult(false)
          setCurrentQuestion(0)
          setAnswers({})
        }}
      />
    )
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Please sign in to take the quiz</h1>
          <p className="text-muted-foreground mb-6">You need to be signed in to save your dosha results</p>
          <Button asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">Discover Your Dosha</h1>
          <p className="text-muted-foreground">
            Answer these questions honestly to understand your unique constitution
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">{questions[currentQuestion].question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={answers[currentQuestion] || ""} onValueChange={handleAnswer}>
              {questions[currentQuestion].options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <RadioGroupItem value={option.value} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0}>
                Previous
              </Button>
              <Button onClick={nextQuestion} disabled={!answers[currentQuestion]}>
                {currentQuestion === questions.length - 1 ? "Get Results" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
