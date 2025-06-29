import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AssetGrid } from "@/components/asset-grid"
import { StatsSection } from "@/components/stats-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <AssetGrid />
      </main>
    </div>
  )
}
