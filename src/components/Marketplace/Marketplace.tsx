import { fetchDataFromDatabase } from "@/utils/supabase";
import { fetchAssetMetadataFromIPFS } from "@/utils/hedera-integration";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Asset } from "@/utils/assets";
import { Link } from "react-router-dom";

const Marketplace = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDataFromDatabase();

        // Fetch metadata for each asset
        const assetsWithMetadata = await Promise.all(
          data.map(async (item: Asset) => {
            try {
              const metadata = await fetchAssetMetadataFromIPFS(
                item.metadataCID
              );
              return { ...item, metadata };
            } catch (error) {
              console.error(`Error fetching metadata for ${item.id}:`, error);
              return item;
            }
          })
        );

        setAssets(assetsWithMetadata);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Adding Asset...
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Marketplace</h1>

        {!isLoading && assets.length === 0 ? (
          <div className="text-center text-gray-500">No assets found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <Link
                to={`/marketplace/${asset.metadataCID}`}
                key={asset.id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
              >
                {asset.metadata ? (
                  <>
                    {asset.metadata.files?.primaryImage && (
                      <img
                        src={`https://ipfs.io/ipfs/${asset.metadata.files.primaryImage.cid}`}
                        alt={asset.metadata.name}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    )}
                    <h2 className="text-xl font-semibold mb-2">
                      {asset.metadata.name || "Unnamed Asset"}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                      {asset.metadata.description || "No description available"}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded">
                        {asset.metadata.category}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400 font-semibold">
                        ${asset.metadata.tokenomics?.pricePerTokenUSD || "0"}
                        /token
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500">Metadata not available</div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
