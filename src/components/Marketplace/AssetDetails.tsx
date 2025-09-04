import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { fetchAssetMetadataFromIPFS } from "@/utils/hedera-integration";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  FileIcon,
  ImageIcon,
  X,
} from "lucide-react";
import type { AssetMetadata } from "@/utils/assets";

const AssetDetails = () => {
  const { metadataCID } = useParams();
  const [assetData, setAssetData] = useState<AssetMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);

  const assetFiles = useMemo(() => {
    if (!assetData) return [];

    const files: { type: "image" | "document"; url: string; title: string }[] =
      [];

    if (assetData.files.primaryImage) {
      files.push({
        type: "image",
        url: `https://ipfs.io/ipfs/${assetData.files.primaryImage.cid}`,
        title: "Primary Image",
      });
    }

    if (assetData.files.additionalImages) {
      assetData.files.additionalImages.forEach((img, index) => {
        files.push({
          type: "image",
          url: `https://ipfs.io/ipfs/${img.cid}`,
          title: `Additional Image ${index + 1}`,
        });
      });
    }

    if (assetData.files.legalDocs) {
      files.push({
        type: "document",
        url: `https://ipfs.io/ipfs/${assetData.files.legalDocs.cid}`,
        title: "Legal Documents",
      });
    }

    if (assetData.files.valuationReport) {
      files.push({
        type: "document",
        url: `https://ipfs.io/ipfs/${assetData.files.valuationReport.cid}`,
        title: "Valuation Report",
      });
    }

    return files;
  }, [assetData]);

  const handleNext = () => {
    if (currentAssetIndex < assetFiles.length - 1) {
      setCurrentAssetIndex(currentAssetIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentAssetIndex > 0) {
      setCurrentAssetIndex(currentAssetIndex - 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!metadataCID) {
          throw new Error("No metadata CID provided");
        }
        const data = await fetchAssetMetadataFromIPFS(metadataCID);
        setAssetData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [metadataCID]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!assetData) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          No data found for this asset
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Primary Image */}
          <Card className="p-4">
            {assetData.files.primaryImage && (
              <div
                className="relative group cursor-pointer"
                onClick={() => {
                  setCurrentAssetIndex(0);
                  setViewerOpen(true);
                }}
              >
                <img
                  src={`https://ipfs.io/ipfs/${assetData.files.primaryImage.cid}`}
                  alt={assetData.name}
                  className="w-full h-[400px] object-cover rounded-lg select-none"
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ pointerEvents: "none" }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-white" />
                </div>
                {assetFiles.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    {`1 / ${assetFiles.length}`}
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Asset Information */}
          <Card className="p-6 space-y-4">
            <h1 className="text-3xl font-bold">{assetData.name}</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {assetData.category}
              </span>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                {assetData.tokenConfig.symbol}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Location</h2>
              <p>{`${assetData.location.city}, ${assetData.location.state}, ${assetData.location.country}`}</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Description</h2>
              <p className="text-gray-600">{assetData.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Asset Value</h3>
                <p className="text-lg">
                  ${assetData.tokenomics.assetValue.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Token Supply</h3>
                <p className="text-lg">
                  {assetData.tokenomics.tokenSupply.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Price per Token</h3>
                <p className="text-lg">
                  ${assetData.tokenomics.pricePerTokenUSD}
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Dividend Yield</h3>
                <p className="text-lg">{assetData.tokenomics.dividendYield}%</p>
              </div>
            </div>

            {/* Additional Files */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Documents</h2>
              <div className="space-y-2">
                {assetData.files.legalDocs && (
                  <button
                    onClick={() => {
                      const index = assetFiles.findIndex(
                        (file) => file.title === "Legal Documents"
                      );
                      if (index !== -1) {
                        setCurrentAssetIndex(index);
                        setViewerOpen(true);
                      }
                    }}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <FileIcon className="w-5 h-5" />
                    <span>Legal Documents</span>
                  </button>
                )}
                {assetData.files.valuationReport && (
                  <button
                    onClick={() => {
                      const index = assetFiles.findIndex(
                        (file) => file.title === "Valuation Report"
                      );
                      if (index !== -1) {
                        setCurrentAssetIndex(index);
                        setViewerOpen(true);
                      }
                    }}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <FileIcon className="w-5 h-5" />
                    <span>Valuation Report</span>
                  </button>
                )}
              </div>
            </div>

            {/* Additional Information */}
            {(assetData.additionalInfo.insuranceDetails ||
              assetData.additionalInfo.specialRights) && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">
                  Additional Information
                </h2>
                {assetData.additionalInfo.insuranceDetails && (
                  <div>
                    <h3 className="font-semibold">Insurance Details</h3>
                    <p className="text-gray-600">
                      {assetData.additionalInfo.insuranceDetails}
                    </p>
                  </div>
                )}
                {assetData.additionalInfo.specialRights && (
                  <div>
                    <h3 className="font-semibold">Special Rights</h3>
                    <p className="text-gray-600">
                      {assetData.additionalInfo.specialRights}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Trading Section */}
        <div className="lg:col-span-1">
          <Card className="p-6 space-y-4 sticky top-6">
            <h2 className="text-2xl font-bold">Trading</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Current Price
                </h3>
                <p className="text-2xl font-bold">
                  ${assetData.tokenomics.pricePerTokenUSD}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Available Supply
                </h3>
                <p className="text-lg">
                  {assetData.tokenomics.tokenSupply.toLocaleString()} tokens
                </p>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount of tokens"
                  min="1"
                  max={assetData.tokenomics.tokenSupply}
                />
              </div>
              <Button className="w-full" size="lg">
                Buy Tokens
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                size="lg"
              >
                Sell Tokens
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Media Viewer Dialog */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-7xl h-[90vh] p-0">
          <div className="relative w-full h-full bg-black/95">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 text-white z-50"
              onClick={() => setViewerOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {assetFiles.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white"
                  onClick={handlePrevious}
                  disabled={currentAssetIndex === 0}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
                  onClick={handleNext}
                  disabled={currentAssetIndex === assetFiles.length - 1}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            <div className="w-full h-full flex items-center justify-center p-8">
              {assetFiles[currentAssetIndex]?.type === "image" ? (
                <img
                  src={assetFiles[currentAssetIndex].url || "/placeholder.svg"}
                  alt={assetFiles[currentAssetIndex].title}
                  className="max-w-full max-h-full object-contain select-none"
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ pointerEvents: "none" }}
                />
              ) : (
                <iframe
                  src={assetFiles[currentAssetIndex].url}
                  title={assetFiles[currentAssetIndex].title}
                  className="w-full h-full bg-white"
                  sandbox="allow-same-origin allow-scripts"
                />
              )}
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">
              {assetFiles[currentAssetIndex]?.title}{" "}
              {assetFiles.length > 1 &&
                `(${currentAssetIndex + 1}/${assetFiles.length})`}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Skeleton className="h-[400px] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    </div>
  );
};

export default AssetDetails;
