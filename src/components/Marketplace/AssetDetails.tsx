import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAssetMetadataFromIPFS } from "@/utils/hedera-integration";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AssetMetadata {
  name: string;
  description: string;
  category: string;
  location: {
    country: string;
    state: string;
    city: string;
  };
  files: {
    primaryImage?: {
      cid: string;
      hash: string;
    };
    additionalImages?: Array<{
      cid: string;
      hash: string;
    }>;
    legalDocs?: {
      cid: string;
      hash: string;
    };
    valuationReport?: {
      cid: string;
      hash: string;
    };
  };
  tokenomics: {
    assetValue: number;
    tokenSupply: number;
    projectedIncome: number;
    annualIncome: number;
    pricePerTokenUSD: number;
    dividendYield: number;
    payoutFrequency: string;
    nextPayout: string;
  };
  tokenConfig: {
    name: string;
    symbol: string;
    decimals: number;
    supplyType: string;
  };
  additionalInfo: {
    insuranceDetails: string;
    specialRights: string;
  };
  createdAt: string;
  owner: string;
}

const AssetDetails = () => {
  const { metadataCID } = useParams();
  const [assetData, setAssetData] = useState<AssetMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Image */}
        <Card className="p-4">
          {assetData.files.primaryImage && (
            <img
              src={`https://ipfs.io/ipfs/${assetData.files.primaryImage.cid}`}
              alt={assetData.name}
              className="w-full h-[400px] object-cover rounded-lg"
            />
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
                <a
                  href={`https://ipfs.io/ipfs/${assetData.files.legalDocs.cid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline"
                >
                  📄 Legal Documents
                </a>
              )}
              {assetData.files.valuationReport && (
                <a
                  href={`https://ipfs.io/ipfs/${assetData.files.valuationReport.cid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:underline"
                >
                  📊 Valuation Report
                </a>
              )}
            </div>
          </div>

          {/* Additional Information */}
          {(assetData.additionalInfo.insuranceDetails ||
            assetData.additionalInfo.specialRights) && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Additional Information</h2>
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
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="container mx-auto p-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  </div>
);

export default AssetDetails;
