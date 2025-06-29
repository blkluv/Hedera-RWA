import { AssetGrid } from "../layouts/AssetGrid";
import { HeroSection } from "../layouts/HeroSection";
import { Navbar } from "../layouts/Navbar";
import { StatsSection } from "../layouts/StatsSection";

export function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <AssetGrid />
      </main>
    </div>
  );
}
