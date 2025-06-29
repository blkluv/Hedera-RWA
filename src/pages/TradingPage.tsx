import { Navbar } from "../layouts/Navbar";
import { TradingContent } from "../layouts/TradingContent";

export function TradingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <TradingContent />
      </main>
    </div>
  );
}
