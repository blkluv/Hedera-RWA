"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Upload,
  ImageIcon,
  FileText,
  Coins,
  Settings,
  MapPin,
  Shield,
  Star,
} from "lucide-react";
import { Country, State, City } from "country-state-city";
import FileUploader from "@/components/FileUploader";
import { addMonths, addQuarters, addYears, format } from "date-fns";
import AssetValueSupply from "@/components/AssetValueSupply";

interface AssetForm {
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
  treasuryAccount: string;
  supplyType: "finite" | "infinite";
  kycKey: string;
  freezeKey: string;
  hcsTopicId: string;
  geolocation: string;
  valuationReport: File | null;
  insuranceDetails: string;
  specialRights: string;
}

const LocationSelector = ({
  value,
  onChange,
}: {
  value: { country: string; state: string; city: string };
  onChange: (v: { country: string; state: string; city: string }) => void;
}) => {
  const { country, state, city } = value;
  const [countries, setCountries] = useState<
    { name: string; isoCode: string }[]
  >([]);
  const [states, setStates] = useState<{ name: string; isoCode: string }[]>([]);
  const [cities, setCities] = useState<{ name: string }[]>([]);
  const [countrySearch, setCountrySearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (country) {
      setStates(State.getStatesOfCountry(country));
    } else {
      setStates([]);
    }
    setCities([]);
    setStateSearch("");
    setCitySearch("");
  }, [country]);

  useEffect(() => {
    if (country && state) {
      setCities(City.getCitiesOfState(country, state));
    } else {
      setCities([]);
    }
    setCitySearch("");
  }, [country, state]);

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );
  const filteredStates = states.filter((s) =>
    s.name.toLowerCase().includes(stateSearch.toLowerCase())
  );
  const filteredCities = cities.filter((c) =>
    c.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <div>
        <Label>Country *</Label>
        <Select
          value={country}
          onValueChange={(v) => onChange({ country: v, state: "", city: "" })}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <div className="px-2 py-1">
              <Input
                placeholder="Type to filter country"
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                className="mb-2"
              />
            </div>
            {filteredCountries.map((c) => (
              <SelectItem key={c.isoCode} value={c.isoCode}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>State *</Label>
        <Select
          value={state}
          onValueChange={(v) => onChange({ country, state: v, city: "" })}
          disabled={!country}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            <div className="px-2 py-1">
              <Input
                placeholder="Type to filter state"
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                className="mb-2"
                disabled={!country}
              />
            </div>
            {filteredStates.map((s) => (
              <SelectItem key={s.isoCode} value={s.isoCode}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>City *</Label>
        <Select
          value={city}
          onValueChange={(v) => onChange({ country, state, city: v })}
          disabled={!state}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            <div className="px-2 py-1">
              <Input
                placeholder="Type to filter city"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="mb-2"
                disabled={!state}
              />
            </div>
            {filteredCities.map((c) => (
              <SelectItem key={c.name} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const imageExtensions = [".png", ".jpg", ".jpeg"];
const docExtensions = [".pdf", ".doc", ".docx"];
const SUPPLY_MULTIPLIERS = [0, 3, 4, 5, 6, 7];
const PAYOUT_OPTIONS = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Annual", value: "annual" },
];

const AddAssetForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<AssetForm>({
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
    payoutFrequency: "",
    nextPayout: "",
    tokenName: "",
    tokenSymbol: "",
    decimals: "",
    treasuryAccount: "",
    supplyType: "finite",
    kycKey: "",
    freezeKey: "",
    hcsTopicId: "",
    geolocation: "",
    valuationReport: null,
    insuranceDetails: "",
    specialRights: "",
  });
  const [location, setLocation] = useState({
    country: "",
    state: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);
  const [descError, setDescError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [primaryImageError, setPrimaryImageError] = useState("");
  const [additionalImagesError, setAdditionalImagesError] = useState("");
  const [legalDocsError, setLegalDocsError] = useState("");
  const [mediaDocRequiredError, setMediaDocRequiredError] = useState("");
  const [assetValue, setAssetValue] = useState("");
  const [supplyBase, setSupplyBase] = useState("");
  const [supplyMultiplier, setSupplyMultiplier] = useState(0);
  const [projectedIncome, setProjectedIncome] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [pricePerTokenUSD, setPricePerTokenUSD] = useState("");
  const [pricePerTokenHBAR, setPricePerTokenHBAR] = useState("");
  const [dividendYield, setDividendYield] = useState("");
  const [payoutFrequency, setPayoutFrequency] = useState("monthly");
  const [nextPayout, setNextPayout] = useState("");
  const [assetValueBase, setAssetValueBase] = useState("");
  const [assetValueMultiplier, setAssetValueMultiplier] = useState(0);

  // Calculate derived values
  useEffect(() => {
    const assetVal =
      Number(assetValueBase) * Math.pow(10, assetValueMultiplier);
    const totalSupply = Number(supplyBase) * Math.pow(10, supplyMultiplier);
    if (totalSupply && assetVal) {
      const priceUSD = assetVal / totalSupply;
      setPricePerTokenUSD(priceUSD.toFixed(6));
      // For demo, assume 1 USD = 10 HBAR (replace with real rate)
      setPricePerTokenHBAR((priceUSD * 10).toFixed(6));
    } else {
      setPricePerTokenUSD("");
      setPricePerTokenHBAR("");
    }
  }, [assetValueBase, assetValueMultiplier, supplyBase, supplyMultiplier]);

  useEffect(() => {
    // Calculate annual income from projected income and payout frequency
    const pi = Number(projectedIncome);
    let ai = 0;
    if (pi) {
      if (payoutFrequency === "monthly") ai = pi * 12;
      else if (payoutFrequency === "quarterly") ai = pi * 4;
      else ai = pi;
    }
    setAnnualIncome(ai ? ai.toString() : "");
  }, [projectedIncome, payoutFrequency]);

  useEffect(() => {
    // Dividend yield = (annualIncome / assetValue) * 100
    const ai = Number(annualIncome);
    const av = Number(assetValue);
    if (ai && av) {
      setDividendYield(((ai / av) * 100).toFixed(2));
    } else {
      setDividendYield("");
    }
  }, [annualIncome, assetValue]);

  useEffect(() => {
    // Calculate next payout date
    let next;
    const today = new Date("2025-06-30");
    if (payoutFrequency === "monthly") {
      next = addMonths(today, 1);
    } else if (payoutFrequency === "quarterly") {
      next = addQuarters(today, 1);
    } else if (payoutFrequency === "annual") {
      next = addYears(today, 1);
    }
    setNextPayout(next ? format(next, "yyyy-MM-dd") : "");
  }, [payoutFrequency]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    if (value.length > 900) {
      setDescError("Description must be 900 characters or less.");
    } else {
      setDescError("");
    }
    setForm((prev) => ({ ...prev, assetDescription: value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && (isNaN(Number(value)) || Number(value) < 0.001)) {
      setPriceError("Price per token must be at least 0.001");
    } else {
      setPriceError("");
    }
    setForm((prev) => ({ ...prev, pricePerToken: value }));
  };

  const handlePrimaryImageChange = (files: File[]) => {
    if (files.length === 0) {
      setForm((prev) => ({ ...prev, primaryImage: null }));
      setPrimaryImageError("");
      return;
    }
    const file = files[0];
    if (!imageExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))) {
      setPrimaryImageError("Only PNG, JPG, JPEG files are allowed.");
      setForm((prev) => ({ ...prev, primaryImage: null }));
    } else {
      setPrimaryImageError("");
      setForm((prev) => ({ ...prev, primaryImage: file }));
    }
  };

  const handleAdditionalImagesChange = (files: File[]) => {
    if (files.length === 0) {
      setForm((prev) => ({ ...prev, additionalImages: [] }));
      setAdditionalImagesError("");
      return;
    }
    const invalid = files.find(
      (file) =>
        !imageExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
    );
    if (invalid) {
      setAdditionalImagesError("Only PNG, JPG, JPEG files are allowed.");
      setForm((prev) => ({ ...prev, additionalImages: [] }));
    } else {
      setAdditionalImagesError("");
      setForm((prev) => ({ ...prev, additionalImages: files }));
    }
  };

  const handleLegalDocsChange = (files: File[]) => {
    console.log("Legal Docs Files:", files);
    if (files.length === 0) {
      setForm((prev) => ({ ...prev, legalDocs: null }));
      setLegalDocsError("");
      return;
    }
    const file = files[0];
    if (!docExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))) {
      setLegalDocsError("Only PDF, DOC, DOCX files are allowed.");
      setForm((prev) => ({ ...prev, legalDocs: null }));
    } else {
      setLegalDocsError("");
      setForm((prev) => ({ ...prev, legalDocs: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Validation: require at least one image or doc
    if (
      !form.primaryImage &&
      form.additionalImages.length === 0 &&
      !form.legalDocs
    ) {
      setMediaDocRequiredError(
        "At least one image or legal document is required."
      );
      setLoading(false);
      return;
    } else {
      setMediaDocRequiredError("");
    }
    // TODO: Upload files to IPFS, collect CIDs, and construct mapping JSON
    // TODO: Call backend or smart contract to publish asset
    setTimeout(() => {
      setLoading(false);
      navigate("/portfolio");
    }, 2000);
  };

  const SectionHeader = ({
    icon: Icon,
    title,
    description,
  }: {
    icon: any;
    title: string;
    description: string;
  }) => (
    <div className="flex items-start gap-3 mb-6">
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Add New Asset</h1>
        <p className="text-muted-foreground">
          Create a new tokenized asset for your portfolio
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <SectionHeader
              icon={FileText}
              title="Basic Information"
              description="Provide essential details about your asset"
            />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="assetName" className="text-sm font-medium">
                  Asset Name *
                </Label>
                <Input
                  id="assetName"
                  name="assetName"
                  value={form.assetName}
                  onChange={handleChange}
                  placeholder="e.g., Downtown Office Building"
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category *
                </Label>
                <Input
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g., Real Estate, Art, Commodities"
                  className="h-11"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assetDescription" className="text-sm font-medium">
                Asset Description *
              </Label>
              <Textarea
                id="assetDescription"
                name="assetDescription"
                value={form.assetDescription}
                onChange={handleDescriptionChange}
                placeholder="Provide a detailed description of the asset, its features, and investment potential..."
                className="min-h-[120px] resize-none"
                maxLength={900}
                required
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{form.assetDescription.length}/900</span>
                {descError && <span className="text-red-500">{descError}</span>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Section */}
        <Card>
          <CardHeader>
            <SectionHeader
              icon={MapPin}
              title="Location"
              description="Select where the asset is located"
            />
          </CardHeader>
          <CardContent className="space-y-6">
            <LocationSelector value={location} onChange={setLocation} />
          </CardContent>
        </Card>

        {/* Media & Documents */}
        <Card>
          <CardHeader>
            <SectionHeader
              icon={ImageIcon}
              title="Media & Documents"
              description="Upload images and legal documentation"
            />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Primary Image *</Label>
                <FileUploader
                  accept="image/png,image/jpeg,image/jpg"
                  allowedExtensions={imageExtensions}
                  multiple={false}
                  onFilesChange={handlePrimaryImageChange}
                  inputId="primary-image-uploader"
                />
                {primaryImageError && (
                  <div className="text-red-500 text-xs mt-1">
                    {primaryImageError}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Additional Images</Label>
                <FileUploader
                  accept="image/png,image/jpeg,image/jpg"
                  allowedExtensions={imageExtensions}
                  multiple={true}
                  onFilesChange={handleAdditionalImagesChange}
                  inputId="additional-images-uploader"
                />
                {additionalImagesError && (
                  <div className="text-red-500 text-xs mt-1">
                    {additionalImagesError}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Legal Documents</Label>
                <FileUploader
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  allowedExtensions={docExtensions}
                  multiple={false}
                  onFilesChange={handleLegalDocsChange}
                  inputId="legal-docs-uploader"
                />
                {legalDocsError && (
                  <div className="text-red-500 text-xs mt-1">
                    {legalDocsError}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Valuation Report</Label>
                <FileUploader
                  accept="application/pdf"
                  allowedExtensions={[".pdf"]}
                  multiple={false}
                  onFilesChange={(files) =>
                    setForm((prev) => ({ ...prev, valuationReport: files[0] }))
                  }
                  inputId="valuation-report-uploader"
                />
              </div>
            </div>
            {mediaDocRequiredError && (
              <div className="text-red-500 text-xs mt-1">
                {mediaDocRequiredError}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Token Economics */}
        <Card>
          <CardHeader>
            <SectionHeader
              icon={Coins}
              title="Token Economics"
              description="Configure pricing, supply, and dividend information"
            />
          </CardHeader>
          <CardContent className="space-y-6">
            <AssetValueSupply
              assetValueBase={assetValueBase}
              setAssetValueBase={setAssetValueBase}
              assetValueMultiplier={assetValueMultiplier}
              setAssetValueMultiplier={setAssetValueMultiplier}
              supplyBase={supplyBase}
              setSupplyBase={setSupplyBase}
              supplyMultiplier={supplyMultiplier}
              setSupplyMultiplier={setSupplyMultiplier}
              projectedIncome={projectedIncome}
              setProjectedIncome={setProjectedIncome}
              annualIncome={annualIncome}
              pricePerTokenUSD={pricePerTokenUSD}
              pricePerTokenHBAR={pricePerTokenHBAR}
              dividendYield={dividendYield}
              payoutFrequency={payoutFrequency}
              setPayoutFrequency={setPayoutFrequency}
              nextPayout={nextPayout}
              payoutOptions={PAYOUT_OPTIONS}
            />
          </CardContent>
        </Card>

        {/* Token Configuration */}
        <Card>
          <CardHeader>
            <SectionHeader
              icon={Settings}
              title="Token Configuration"
              description="Set up token parameters and blockchain settings"
            />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tokenName" className="text-sm font-medium">
                  Token Name *
                </Label>
                <Input
                  id="tokenName"
                  name="tokenName"
                  value={form.tokenName}
                  onChange={handleChange}
                  placeholder="Downtown Office Token"
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tokenSymbol" className="text-sm font-medium">
                  Token Symbol *
                </Label>
                <Input
                  id="tokenSymbol"
                  name="tokenSymbol"
                  value={form.tokenSymbol}
                  onChange={handleChange}
                  placeholder="DOT"
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="decimals" className="text-sm font-medium">
                  Decimals *
                </Label>
                <Input
                  id="decimals"
                  name="decimals"
                  value={form.decimals}
                  onChange={handleChange}
                  placeholder="8"
                  className="h-11"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="treasuryAccount"
                  className="text-sm font-medium"
                >
                  Treasury Account *
                </Label>
                <Input
                  id="treasuryAccount"
                  name="treasuryAccount"
                  value={form.treasuryAccount}
                  onChange={handleChange}
                  placeholder="0.0.123456"
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplyType" className="text-sm font-medium">
                  Supply Type *
                </Label>
                <Select
                  value={form.supplyType}
                  onValueChange={(value) =>
                    handleSelectChange("supplyType", value)
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="finite">Finite</SelectItem>
                    <SelectItem value="infinite">Infinite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="kycKey" className="text-sm font-medium">
                  KYC Key
                </Label>
                <Input
                  id="kycKey"
                  name="kycKey"
                  value={form.kycKey}
                  onChange={handleChange}
                  placeholder="Optional KYC key"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="freezeKey" className="text-sm font-medium">
                  Freeze Key
                </Label>
                <Input
                  id="freezeKey"
                  name="freezeKey"
                  value={form.freezeKey}
                  onChange={handleChange}
                  placeholder="Optional freeze key"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hcsTopicId" className="text-sm font-medium">
                  HCS Topic ID *
                </Label>
                <Input
                  id="hcsTopicId"
                  name="hcsTopicId"
                  value={form.hcsTopicId}
                  onChange={handleChange}
                  placeholder="0.0.789012"
                  className="h-11"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <SectionHeader
              icon={Star}
              title="Additional Information"
              description="Optional details to enhance your asset listing"
            />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="geolocation"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Geolocation (lat,lng)
                </Label>
                <Input
                  id="geolocation"
                  name="geolocation"
                  value={form.geolocation}
                  onChange={handleChange}
                  placeholder="40.7128,-74.0060"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="insuranceDetails"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Insurance Details
                </Label>
                <Input
                  id="insuranceDetails"
                  name="insuranceDetails"
                  value={form.insuranceDetails}
                  onChange={handleChange}
                  placeholder="Insurance provider and coverage"
                  className="h-11"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialRights" className="text-sm font-medium">
                Special Rights
              </Label>
              <Input
                id="specialRights"
                name="specialRights"
                value={form.specialRights}
                onChange={handleChange}
                placeholder="Any special rights or privileges for token holders"
                className="h-11"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="px-12 h-12 text-base font-medium"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating Asset...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Create Asset
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddAssetForm;
