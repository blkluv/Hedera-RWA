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
import {
  AssetValueSupplyProps,
  PAYOUT_OPTIONS,
  SUPPLY_MULTIPLIERS,
} from "@/utils/form";

const AssetValueSupply: React.FC<AssetValueSupplyProps> = ({
  assetValueBase,
  setAssetValueBase,
  assetValueMultiplier,
  setAssetValueMultiplier,
  supplyBase,
  setSupplyBase,
  supplyMultiplier,
  setSupplyMultiplier,
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
}) => {
  // Calculate price per token
  useEffect(() => {
    const assetValue =
      assetValueBase && assetValueMultiplier !== undefined
        ? Number(assetValueBase) * Math.pow(10, assetValueMultiplier)
        : 0;
    const totalSupply =
      supplyBase && supplyMultiplier !== undefined
        ? Number(supplyBase) * Math.pow(10, supplyMultiplier)
        : 0;

    if (assetValue && totalSupply) {
      setPricePerTokenUSD((assetValue / totalSupply).toFixed(2));
    } else {
      setPricePerTokenUSD("");
    }
  }, [assetValueBase, assetValueMultiplier, supplyBase, supplyMultiplier]);

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
    const av =
      assetValueBase && assetValueMultiplier !== undefined
        ? Number(assetValueBase) * Math.pow(10, assetValueMultiplier)
        : 0;

    if (ai && av) {
      setDividendYield(((ai / av) * 100).toFixed(2));
    } else {
      setDividendYield("");
    }
  }, [annualIncome, assetValueBase, assetValueMultiplier]);

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
          <div className="flex gap-2">
            <Input
              id="assetValueBase"
              name="assetValueBase"
              value={assetValueBase}
              onChange={(e) =>
                setAssetValueBase(e.target.value.replace(/[^\d]/g, ""))
              }
              placeholder="1"
              className="h-11 w-24"
              required
            />
            <Select
              value={String(assetValueMultiplier)}
              onValueChange={(v) => setAssetValueMultiplier(Number(v))}
            >
              <SelectTrigger className="h-11 w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPLY_MULTIPLIERS.map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    × 10^{m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Asset Value:{" "}
            {assetValueBase && assetValueMultiplier !== undefined
              ? (
                  Number(assetValueBase) * Math.pow(10, assetValueMultiplier)
                ).toLocaleString()
              : "-"}{" "}
            USD
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="supplyBase">Token Supply *</Label>
          <div className="flex gap-2">
            <Input
              id="supplyBase"
              name="supplyBase"
              value={supplyBase}
              onChange={(e) =>
                setSupplyBase(e.target.value.replace(/[^\d]/g, ""))
              }
              placeholder="1"
              className="h-11 w-24"
              required
            />
            <Select
              value={String(supplyMultiplier)}
              onValueChange={(v) => setSupplyMultiplier(Number(v))}
            >
              <SelectTrigger className="h-11 w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPLY_MULTIPLIERS.map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    × 10^{m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Total Supply:{" "}
            {supplyBase && supplyMultiplier !== undefined
              ? (
                  Number(supplyBase) * Math.pow(10, supplyMultiplier)
                ).toLocaleString()
              : "-"}{" "}
            tokens
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
