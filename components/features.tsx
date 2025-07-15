import { Card, CardContent } from "@/components/ui/card"
import { Brain, Heart, Leaf, Target, Calendar, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced AI analyzes your symptoms and provides personalized Ayurvedic recommendations.",
  },
  {
    icon: Heart,
    title: "Dosha Profiling",
    description: "Discover your unique constitution through our comprehensive dosha assessment quiz.",
  },
  {
    icon: Leaf,
    title: "Natural Remedies",
    description: "Get herbal remedies, dietary suggestions, and lifestyle changes tailored to your needs.",
  },
  {
    icon: Target,
    title: "Goal-Oriented Plans",
    description: "Set health goals and receive structured daily and weekly wellness routines.",
  },
  {
    icon: Calendar,
    title: "Daily Routines",
    description: "Personalized dinacharya (daily routine) recommendations for optimal health.",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Monitor your wellness journey with detailed progress tracking and insights.",
  },
]

export function Features() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Why Choose Ayurveda Ally?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Combining ancient Ayurvedic wisdom with modern AI technology to provide you with the most personalized
            wellness experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10 mr-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
