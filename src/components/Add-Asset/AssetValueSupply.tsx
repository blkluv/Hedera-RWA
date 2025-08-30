import React, { useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { AssetValueSupplyProps, PAYOUT_OPTIONS } from "@/utils/form";

// Helper function to format number to readable units
const formatToUnits = (number: number) => {
  const units = ["", "Thousand", "Million", "Billion", "Trillion"];
  const order = Math.floor(Math.log10(Math.abs(number)) / 3);
  if (order < 0 || !number) return number.toString();
  const unit = units[order];
  const num = (number / Math.pow(1000, order)).toFixed(1);
  return `${num} ${unit}`;
};

// Helper function to format number with commas
const formatWithCommas = (value: string) => {
  return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Helper function to remove commas
const removeCommas = (value: string) => {
  return value.replace(/,/g, "");
};

const AssetValueSupply: React.FC<AssetValueSupplyProps> = ({
  assetValueBase,
  setAssetValueBase,
  supplyBase,
  setSupplyBase,
  projectedIncome,
  setProjectedIncome,
  annualIncome,
  setAnnualIncome,
  pricePerTokenUSD,
  setPricePerTokenUSD,
  dividendYield,
  setDividendYield,
  payoutFrequency,
  setPayoutFrequency,
  nextPayout,
  setNextPayout,
  initialSupplyPercentage,
  setInitialSupplyPercentage,
  customInitialSupplyPercentage,
  setCustomInitialSupplyPercentage,
}) => {
  // Calculate price per token
  useEffect(() => {
    const assetValue = Number(removeCommas(assetValueBase));
    const totalSupply = Number(removeCommas(supplyBase));

    if (assetValue && totalSupply) {
      setPricePerTokenUSD((assetValue / totalSupply).toFixed(2));
    } else {
      setPricePerTokenUSD("");
    }
  }, [assetValueBase, supplyBase]);

  // Calculate annual income from projected income and payout frequency
  useEffect(() => {
    const pi = Number(projectedIncome);
    let ai = 0;
    if (pi) {
      if (payoutFrequency === "monthly") ai = pi * 12;
      else if (payoutFrequency === "quarterly") ai = pi * 4;
      else ai = pi;
    }
    setAnnualIncome(ai ? ai.toString() : "");
  }, [projectedIncome, payoutFrequency]);

  // Calculate dividend yield
  useEffect(() => {
    const ai = Number(annualIncome);
    const av = Number(removeCommas(assetValueBase));

    if (ai && av) {
      setDividendYield(((ai / av) * 100).toFixed(2));
    } else {
      setDividendYield("");
    }
  }, [annualIncome, assetValueBase]);

  // Set next payout date based on frequency
  useEffect(() => {
    const now = new Date();
    const nextDate = new Date();

    if (payoutFrequency === "monthly") {
      nextDate.setMonth(now.getMonth() + 1);
    } else if (payoutFrequency === "quarterly") {
      nextDate.setMonth(now.getMonth() + 3);
    } else {
      nextDate.setFullYear(now.getFullYear() + 1);
    }

    setNextPayout(nextDate.toISOString().split("T")[0]);
  }, [payoutFrequency]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="assetValueBase">Asset Value (USD) *</Label>
          <Input
            id="assetValueBase"
            name="assetValueBase"
            value={assetValueBase}
            onChange={(e) => {
              const formattedValue = formatWithCommas(e.target.value);
              setAssetValueBase(formattedValue);
            }}
            placeholder="150,000,000"
            className="h-11"
            required
          />
          <div className="text-xs text-muted-foreground mt-1">
            {Number(removeCommas(assetValueBase)) > 0
              ? `${formatToUnits(Number(removeCommas(assetValueBase)))} USD`
              : "-"}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="supplyBase">Total Token Supply (Units) *</Label>
          <Input
            id="supplyBase"
            name="supplyBase"
            value={supplyBase}
            onChange={(e) => {
              const formattedValue = formatWithCommas(e.target.value);
              setSupplyBase(formattedValue);
            }}
            placeholder="1,000,000"
            className="h-11"
            required
          />
          <div className="text-xs text-muted-foreground mt-1">
            {Number(removeCommas(supplyBase)) > 0
              ? `${formatToUnits(Number(removeCommas(supplyBase)))} units`
              : "-"}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Projected Income (USD)</Label>
          <Input
            value={projectedIncome}
            onChange={(e) =>
              setProjectedIncome(e.target.value.replace(/[^\d.]/g, ""))
            }
            placeholder="10000"
            className="h-11"
            type="number"
            min={0}
          />
          <div className="text-xs text-muted-foreground mt-1">
            Annual Income:{" "}
            {annualIncome ? Number(annualIncome).toLocaleString() : "-"} USD
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Price Per Token (USD)</Label>
          <Input value={pricePerTokenUSD} readOnly className="h-11 bg-muted" />
        </div>
        <div className="space-y-2">
          <Label>Dividend Yield (%)</Label>
          <Input value={dividendYield} readOnly className="h-11 bg-muted" />
        </div>
        <div className="space-y-2">
          <Label>Initial Supply Percentage *</Label>
          <Select
            value={initialSupplyPercentage}
            onValueChange={setInitialSupplyPercentage}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select percentage to keep" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10%</SelectItem>
              <SelectItem value="25">25%</SelectItem>
              <SelectItem value="50">50%</SelectItem>
              <SelectItem value="60">60%</SelectItem>
              <SelectItem value="75">75%</SelectItem>
              <SelectItem value="custom">Custom Percentage</SelectItem>
            </SelectContent>
          </Select>
          {initialSupplyPercentage === "custom" && (
            <Input
              type="number"
              min="0"
              max="100"
              value={customInitialSupplyPercentage}
              onChange={(e) => {
                const value = Math.min(
                  100,
                  Math.max(0, Number(e.target.value))
                );
                setCustomInitialSupplyPercentage(value.toString());
              }}
              placeholder="Enter percentage (0-100)"
              className="h-11 mt-2"
            />
          )}
          <div className="text-xs text-muted-foreground mt-1">
            Percentage of tokens you want to keep from the total supply
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Payout Frequency *</Label>
          <Select value={payoutFrequency} onValueChange={setPayoutFrequency}>
            <SelectTrigger className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAYOUT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {nextPayout && (
            <div className="text-xs text-muted-foreground mt-1">
              Next Payout: {nextPayout}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AssetValueSupply;
