import { Hero } from "@/components/hero"
import { DoshaTypes } from "@/components/dosha-types"
import { Testimonials } from "@/components/testimonials"
import { Features } from "@/components/features"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <DoshaTypes />
      <Testimonials />
    </div>
  )
}
