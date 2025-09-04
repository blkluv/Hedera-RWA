"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TradingPanelProps {
  tokenomics: {
    pricePerTokenUSD: number;
    tokenSupply: number;
    assetValue: number;
    dividendYield: number;
  };
  tokenSymbol: string;
}

// Mock price data for the chart
const generatePriceData = (currentPrice: number) => {
  const data = [];
  const basePrice = currentPrice * 0.9; // Start 10% below current price

  for (let i = 0; i < 30; i++) {
    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
    const price =
      basePrice + (currentPrice - basePrice) * (i / 29) + basePrice * variation;
    data.push({
      day: i + 1,
      price: Math.max(0, Number(price.toFixed(2))),
      date: new Date(
        Date.now() - (29 - i) * 24 * 60 * 60 * 1000
      ).toLocaleDateString(),
    });
  }

  return data;
};

export const TradingPanel = ({
  tokenomics,
  tokenSymbol,
}: TradingPanelProps) => {
  const [amount, setAmount] = useState<string>("");
  const [priceData, setPriceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Generate mock price data
    const data = generatePriceData(tokenomics.pricePerTokenUSD);
    setPriceData(data);
  }, [tokenomics.pricePerTokenUSD]);

  const handleBuy = async () => {
    if (!amount || Number(amount) <= 0) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Buy order placed for ${amount} ${tokenSymbol} tokens`);
    setIsLoading(false);
  };

  const handleSell = async () => {
    if (!amount || Number(amount) <= 0) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Sell order placed for ${amount} ${tokenSymbol} tokens`);
    setIsLoading(false);
  };

  const totalValue = Number(amount) * tokenomics.pricePerTokenUSD;
  const priceChange =
    priceData.length > 1
      ? ((priceData[priceData.length - 1].price -
          priceData[priceData.length - 2].price) /
          priceData[priceData.length - 2].price) *
        100
      : 0;

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Trading</h2>

        {/* Price Chart */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">
            30-Day Price Chart
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={["dataMin - 0.1", "dataMax + 0.1"]}
                />
                <Tooltip
                  formatter={(value: number) => [`$${value}`, "Price"]}
                  labelFormatter={(label) => `Day ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Current Price */}
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-500">Current Price</h3>
          <div className="flex items-center space-x-2">
            <p className="text-2xl font-bold">${tokenomics.pricePerTokenUSD}</p>
            <span
              className={`text-sm px-2 py-1 rounded ${
                priceChange >= 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {priceChange >= 0 ? "+" : ""}
              {priceChange.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-500">Available Supply</h4>
            <p className="font-semibold">
              {tokenomics.tokenSupply.toLocaleString()}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-500">Dividend Yield</h4>
            <p className="font-semibold">{tokenomics.dividendYield}%</p>
          </div>
        </div>

        {/* Trading Form */}
        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount of Tokens</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              max={tokenomics.tokenSupply}
            />
            {amount && Number(amount) > 0 && (
              <p className="text-sm text-gray-600">
                Total: $
                {totalValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Button
              className="w-full"
              size="lg"
              onClick={handleBuy}
              disabled={!amount || Number(amount) <= 0 || isLoading}
            >
              {isLoading ? "Processing..." : "Buy Tokens"}
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              size="lg"
              onClick={handleSell}
              disabled={!amount || Number(amount) <= 0 || isLoading}
            >
              {isLoading ? "Processing..." : "Sell Tokens"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
