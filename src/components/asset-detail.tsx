import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, MapPin, FileText, DollarSign } from "lucide-react";
import Image from "next/image";
import React from "react";

// Placeholder for asset detail props
type AssetDetailProps = {
  asset: {
    id: number;
    name: string;
    location: string;
    price: string;
    tokenPrice: string;
    totalTokens: string;
    availableTokens: string;
    yield: string;
    image: string;
    status: string;
    description: string;
    legalDocs: string[];
    supplyHistory: Array<{ date: string; price: number }>;
    ownershipDistribution: Array<{ owner: string; tokens: number }>;
    userBalance: number;
    nextDividend: string;
    lastDividend: string;
  };
};

export function AssetDetail({ asset }: AssetDetailProps) {
  return (
    <section className="py-10 max-w-4xl mx-auto">
      <Card className="overflow-hidden shadow-2xl border-2 border-primary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Image
              src={asset.image || "/placeholder.svg"}
              alt={asset.name}
              width={500}
              height={350}
              className="w-full h-72 object-cover rounded-lg border"
            />
            <div className="flex gap-2 mt-4">
              <Badge>{asset.status}</Badge>
              <Badge variant="secondary">{asset.yield} Yield</Badge>
            </div>
          </div>
          <div>
            <CardHeader>
              <CardTitle className="text-2xl mb-2 text-primary">
                {asset.name}
              </CardTitle>
              <div className="flex items-center text-muted-foreground mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                {asset.location}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-lg font-semibold text-primary">
                {asset.price}
              </div>
              <div className="flex gap-4 text-sm">
                <span>
                  Token Price:{" "}
                  <span className="font-medium">{asset.tokenPrice}</span>
                </span>
                <span>
                  Supply: {asset.availableTokens}/{asset.totalTokens}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="font-bold mb-1">Description</h3>
                <p className="text-muted-foreground text-sm">
                  {asset.description}
                </p>
              </div>
              <div className="mt-4">
                <h3 className="font-bold mb-1">Legal Documents</h3>
                <ul className="list-disc ml-5">
                  {asset.legalDocs.map((doc, i) => (
                    <li key={i}>
                      <a
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline flex items-center gap-1"
                      >
                        <FileText className="h-4 w-4" /> Document {i + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="font-bold mb-1">Token Economics</h3>
                <div className="flex gap-4 text-sm">
                  <span>Total Supply: {asset.totalTokens}</span>
                  <span>Price/Token: {asset.tokenPrice}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-bold mb-1">Your Balance</h3>
                <span className="text-green-600 font-semibold">
                  {asset.userBalance} tokens
                </span>
              </div>
              <div className="mt-4">
                <h3 className="font-bold mb-1">Dividends</h3>
                <div className="flex gap-4 text-sm">
                  <span>Last: {asset.lastDividend}</span>
                  <span>Next: {asset.nextDividend}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="default" className="w-28">
                  Buy
                </Button>
                <Button variant="outline" className="w-28">
                  Sell
                </Button>
              </div>
              {/* Placeholder for charts and ownership visualization */}
              <div className="mt-8">
                <h3 className="font-bold mb-1">Performance Chart</h3>
                <div className="bg-gray-100 dark:bg-gray-800 h-32 rounded flex items-center justify-center text-muted-foreground">
                  [Chart Placeholder]
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-bold mb-1">Ownership Distribution</h3>
                <div className="bg-gray-100 dark:bg-gray-800 h-24 rounded flex items-center justify-center text-muted-foreground">
                  [Ownership Pie Chart Placeholder]
                </div>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </section>
  );
}
