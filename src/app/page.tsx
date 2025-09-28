import { HeroSection } from "@/components/sections/hero-section"
import { PainAgitateSolution } from "@/components/sections/pain-agitate-solution"
import { SolutionSection } from "@/components/sections/solution-section"
import { StandoutSection } from "@/components/sections/standout-section"
import { ContentToolSection } from "@/components/sections/content-tool-section"
import { HowItWorksSection } from "@/components/sections/how-it-works-section"
import { ThreePillarsSection } from "@/components/sections/three-pillars"
import { GuaranteeSection } from "@/components/sections/guarantee-section"
import { ScarcitySection } from "@/components/sections/scarcity-section"
import { CTASection } from "@/components/sections/cta-section"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ThreePillarsSection />
      <PainAgitateSolution />
      <SolutionSection />
      <StandoutSection />
      <ContentToolSection />
      <HowItWorksSection />
      <GuaranteeSection />
      <ScarcitySection />
      <CTASection />
    </main>
  )
}
