import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import {
  fetchAssetDataFromMirrorNode,
  fetchAssetMetadataFromIPFS,
} from "@/utils/hedera-integration";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { AssetDetail } from "@/components/asset-detail";

// Utility to fetch all asset token IDs and CIDs from HCS topic (stub)
async function fetchAssetRegistryFromHCS(): Promise<
  { tokenId: string; cid: string }[]
> {
  // TODO: Integrate with HCS topic to get all asset registry entries
  // For now, return mocked data
  return [
    { tokenId: "0.0.mockedTokenId1", cid: "mockedCID1" },
    { tokenId: "0.0.mockedTokenId2", cid: "mockedCID2" },
  ];
}

export function AssetGrid() {
  const [assets, setAssets] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filteredAssets, setFilteredAssets] = useState<any[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function loadAssets() {
      // Fetch asset registry from HCS
      const registry = await fetchAssetRegistryFromHCS();
      // Fetch asset data from Mirror Node and metadata from IPFS
      const loadedAssets = await Promise.all(
        registry.map(async ({ tokenId, cid }) => {
          const onChain = await fetchAssetDataFromMirrorNode(tokenId);
          const meta = await fetchAssetMetadataFromIPFS(cid);
          return {
            id: tokenId,
            ...meta,
            ...onChain,
            status: "Available",
            image: meta.image,
          };
        })
      );
      setAssets(loadedAssets);
      setFilteredAssets(loadedAssets);
    }
    loadAssets();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredAssets(assets);
    } else {
      setFilteredAssets(
        assets.filter(
          (a) =>
            a.name.toLowerCase().includes(search.toLowerCase()) ||
            a.location?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, assets]);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-primary">
            Featured Properties
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover premium real estate investment opportunities tokenized on
            Hedera
          </p>
        </div>
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Search by name or location..."
            className="w-full max-w-md p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAssets.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-12">
              No assets found.
            </div>
          ) : (
            filteredAssets.map((asset) => (
              <Card
                key={asset.id}
                className="overflow-hidden hover:shadow-2xl transition-shadow border-2 border-transparent hover:border-primary"
              >
                <div className="relative">
                  <Image
                    src={asset.image || "/placeholder.svg"}
                    alt={asset.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <Badge
                    className="absolute top-3 right-3"
                    variant={
                      asset.status === "Limited" ? "destructive" : "default"
                    }
                  >
                    {asset.status}
                  </Badge>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-1">
                    {asset.name}
                  </CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {asset.location}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Total Value
                    </span>
                    <span className="font-semibold">{asset.price}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Token Price
                    </span>
                    <span className="font-semibold text-primary">
                      {asset.tokenPrice}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Available
                    </span>
                    <span className="text-sm">
                      {asset.circulatingSupply}/{asset.totalSupply}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-green-600">
                        {asset.yield} Yield
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{asset.holders}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => {
                      setSelectedAsset(asset);
                      setModalOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Properties
          </Button>
        </div>

        <Sheet open={modalOpen} onOpenChange={setModalOpen}>
          <SheetContent side="right" className="max-w-2xl w-full">
            {selectedAsset && (
              <>
                <AssetDetail asset={selectedAsset} />
                <SheetClose asChild>
                  <Button variant="outline" className="mt-4 w-full">
                    Close
                  </Button>
                </SheetClose>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
}
