import { Navbar } from "../layouts/Navbar";
import { PortfolioContent } from "../layouts/PortfolioContent";

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
