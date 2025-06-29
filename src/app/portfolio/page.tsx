import { Navbar } from "@/components/navbar"
import { PortfolioContent } from "@/components/portfolio-content"

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <PortfolioContent />
      </main>
    </div>
  )
}
