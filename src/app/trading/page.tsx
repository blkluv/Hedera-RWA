import { Navbar } from "@/components/navbar"
import { TradingContent } from "@/components/trading-content"

export default function TradingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <TradingContent />
      </main>
    </div>
  )
}
