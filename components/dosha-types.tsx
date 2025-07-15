import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wind, Flame, Mountain } from "lucide-react"

const doshaTypes = [
  {
    name: "Vata",
    icon: Wind,
    element: "Air & Space",
    characteristics: ["Creative", "Energetic", "Quick-thinking", "Adaptable"],
    description: "Governs movement, breathing, and nervous system functions.",
    className: "dosha-vata",
  },
  {
    name: "Pitta",
    icon: Flame,
    element: "Fire & Water",
    characteristics: ["Focused", "Determined", "Intelligent", "Competitive"],
    description: "Controls digestion, metabolism, and body temperature.",
    className: "dosha-pitta",
  },
  {
    name: "Kapha",
    icon: Mountain,
    element: "Earth & Water",
    characteristics: ["Calm", "Stable", "Nurturing", "Patient"],
    description: "Provides structure, immunity, and emotional stability.",
    className: "dosha-kapha",
  },
]

export function DoshaTypes() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Discover Your Dosha</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understanding your unique constitution is the foundation of Ayurvedic wellness. Each dosha represents
            different qualities and governs specific functions in your body.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {doshaTypes.map((dosha, index) => (
            <Card
              key={index}
              className={`border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105 ${dosha.className}`}
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto p-4 rounded-full bg-white/80 w-fit mb-4">
                  <dosha.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-serif text-2xl">{dosha.name}</CardTitle>
                <p className="text-sm font-medium text-muted-foreground">{dosha.element}</p>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">{dosha.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Key Characteristics:</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {dosha.characteristics.map((char, charIndex) => (
                      <span key={charIndex} className="px-3 py-1 bg-white/80 rounded-full text-xs font-medium">
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
