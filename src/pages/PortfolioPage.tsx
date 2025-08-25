import { PortfolioContent } from "@/components/Portfolio/PortfolioContent";
import { Navbar } from "../layouts/Navbar";

export function PortfolioPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <PortfolioContent />
      </main>
    </div>
  );
}
