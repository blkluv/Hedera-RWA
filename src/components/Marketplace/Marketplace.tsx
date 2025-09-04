"use client";

import { fetchDataFromDatabase } from "@/utils/supabase";
import { fetchAssetMetadataFromIPFS } from "@/utils/hedera-integration";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import type { Asset } from "@/utils/assets";

const Marketplace = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = (await fetchDataFromDatabase()) as Asset[];

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
        <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-6 rounded-xl shadow-lg border border-red-200 dark:border-red-800 animate-in fade-in duration-300">
          <div className="text-center">
            <div className="text-red-600 dark:text-red-400 font-semibold">
              Error
            </div>
            <div className="text-sm mt-1">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-center border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-300">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary mb-4" />
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              Loading Assets...
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-12 text-gray-900 dark:text-white animate-in slide-in-from-top duration-500">
          Marketplace
        </h1>

        {!isLoading && assets.length === 0 ? (
          <div className="text-center text-gray-500 py-16 animate-in fade-in duration-500">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-12 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-lg font-medium mb-2">No assets found</div>
              <div className="text-sm text-gray-400">
                Check back later for new listings
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assets.map((asset, index) => (
              <div
                key={asset.id}
                onClick={() => navigate(`/marketplace/${asset.metadataCID}`)}
                className="group border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 hover:scale-[1.02] hover:-translate-y-1 animate-in fade-in slide-in-from-bottom duration-500 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {asset.metadata ? (
                  <>
                    {asset.metadata.files?.primaryImage && (
                      <div className="relative overflow-hidden rounded-xl mb-6 shadow-md">
                        <img
                          src={`https://ipfs.io/ipfs/${asset.metadata.files.primaryImage.cid}`}
                          alt={asset.metadata.name}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    )}
                    <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-200">
                      {asset.metadata.name || "Unnamed Asset"}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-6 leading-relaxed">
                      {asset.metadata.description || "No description available"}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-700 dark:text-blue-200 px-3 py-2 rounded-full font-medium shadow-sm border border-blue-200 dark:border-blue-700 transition-all duration-200 group-hover:shadow-md">
                        {asset.metadata.category}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-full shadow-sm border border-green-200 dark:border-green-700 transition-all duration-200 group-hover:shadow-md group-hover:scale-105">
                        ${asset.metadata.tokenomics?.pricePerTokenUSD || "0"}
                        /token
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500 text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="font-medium">Metadata not available</div>
                    <div className="text-sm mt-1 text-gray-400">
                      Unable to load asset details
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
