import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const SUPPLY_MULTIPLIERS = [0, 3, 4, 5, 6, 7];

export interface AssetValueSupplyProps {
  assetValueBase: string;
  setAssetValueBase: (v: string) => void;
  assetValueMultiplier: number;
  setAssetValueMultiplier: (v: number) => void;
  supplyBase: string;
  setSupplyBase: (v: string) => void;
  supplyMultiplier: number;
  setSupplyMultiplier: (v: number) => void;
  projectedIncome: string;
  setProjectedIncome: (v: string) => void;
  annualIncome: string;
  pricePerTokenUSD: string;
  pricePerTokenHBAR: string;
  dividendYield: string;
  payoutFrequency: string;
  setPayoutFrequency: (v: string) => void;
  nextPayout: string;
  payoutOptions: { label: string; value: string }[];
}

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
  pricePerTokenUSD,
  pricePerTokenHBAR,
  dividendYield,
  payoutFrequency,
  setPayoutFrequency,
  nextPayout,
  payoutOptions,
}) => (
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
            ? Number(assetValueBase) * Math.pow(10, assetValueMultiplier)
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
            ? Number(supplyBase) * Math.pow(10, supplyMultiplier)
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
          Annual Income: {annualIncome || "-"} USD
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <Label>Price Per Token (USD)</Label>
        <Input value={pricePerTokenUSD} readOnly className="h-11" />
        {pricePerTokenHBAR && (
          <div className="text-xs text-muted-foreground mt-1">
            ≈ {pricePerTokenHBAR} HBAR
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label>Dividend Yield (%)</Label>
        <Input value={dividendYield} readOnly className="h-11" />
      </div>
      <div className="space-y-2">
        <Label>Payout Frequency</Label>
        <Select value={payoutFrequency} onValueChange={setPayoutFrequency}>
          <SelectTrigger className="h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {payoutOptions.map((opt) => (
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

export default AssetValueSupply;
