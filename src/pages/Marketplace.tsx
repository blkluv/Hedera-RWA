import { Navbar } from "@/layouts/Navbar";
import MarketplaceComponent from "@/components/Marketplace/Marketplace";
import AssetDetails from "@/components/Marketplace/AssetDetails";
import { Routes, Route } from "react-router-dom";

const Marketplace = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<MarketplaceComponent />} />
          <Route path="/:metadataCID" element={<AssetDetails />} />
        </Routes>
      </main>
    </div>
  );
};

export default Marketplace;
