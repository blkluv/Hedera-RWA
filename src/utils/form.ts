import { Coins, FileText, ImageIcon, Settings } from "lucide-react";
// Categories data

// Constants
export const imageExtensions = [".png", ".jpg", ".jpeg"];
export const docExtensions = [".pdf", ".doc", ".docx"];
export const SUPPLY_MULTIPLIERS = [0, 3, 4, 5, 6, 7];
export const PAYOUT_OPTIONS = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Annual", value: "annual" },
];

export const FORM_STEPS = [
  {
    id: 1,
    title: "Info & Location",
    description: "Basic information and asset location",
    icon: FileText,
  },
  {
    id: 2,
    title: "Documents",
    description: "Upload images and legal documentation",
    icon: ImageIcon,
  },
  {
    id: 3,
    title: "Token Economics",
    description: "Configure pricing and dividend information",
    icon: Coins,
  },
  {
    id: 4,
    title: "Token Config & Additional Info",
    description: "Blockchain settings and additional details",
    icon: Settings,
  },
];

export const ASSET_STEPS = [
  "Upload to IPFS",
  "Create Hedera Token",
  "Publish to Registry",
  "Anchor Document Hashes",
];
// Initial form state
export const initialForm: AssetForm = {
  assetName: "",
  assetDescription: "",
  category: "",
  primaryImage: null,
  additionalImages: [],
  legalDocs: null,
  totalSupply: "",
  pricePerToken: "",
  minPurchase: "",
  dividendYield: "",
  payoutFrequency: "monthly",
  nextPayout: "",
  tokenName: "",
  tokenSymbol: "",
  decimals: "2",
  supplyType: "finite",
  kycKey: "",
  freezeKey: "",
  geolocation: { country: "", state: "", city: "" },
  valuationReport: null,
  insuranceDetails: "",
  specialRights: "",
};

// Types
export interface AssetForm {
  assetName: string;
  assetDescription: string;
  category: string;
  primaryImage: File | null;
  additionalImages: File[];
  legalDocs: File | null;
  totalSupply: string;
  pricePerToken: string;
  minPurchase: string;
  dividendYield: string;
  payoutFrequency: string;
  nextPayout: string;
  tokenName: string;
  tokenSymbol: string;
  decimals: string;
  supplyType: "finite" | "infinite";
  kycKey: string;
  freezeKey: string;
  geolocation: { country: string; state: string; city: string };
  valuationReport: File | null;
  insuranceDetails: string;
  specialRights: string;
}
// Asset Value Supply Component
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
  setAnnualIncome: (v: string) => void;
  pricePerTokenUSD: string;
  setPricePerTokenUSD: (v: string) => void;
  dividendYield: string;
  setDividendYield: (v: string) => void;
  payoutFrequency: string;
  setPayoutFrequency: (v: string) => void;
  nextPayout: string;
  setNextPayout: (v: string) => void;
  initialSupplyPercentage: string;
  setInitialSupplyPercentage: (v: string) => void;
  customInitialSupplyPercentage: string;
  setCustomInitialSupplyPercentage: (v: string) => void;
  onCalculateInitialSupply?: (totalSupply: number) => void;
}
