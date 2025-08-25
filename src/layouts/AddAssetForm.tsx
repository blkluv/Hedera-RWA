import React, { useState, useEffect } from "react";
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
  ChevronRight,
  ChevronLeft,
  Check,
  Star,
  Shield,
  Settings,
  MapPin,
  Coins,
  FileText,
  ImageIcon,
  HomeIcon,
} from "lucide-react";
import FileUploader from "@/components/FileUploader";
import { addMonths, addQuarters, addYears, format } from "date-fns";
import AssetValueSupply from "@/components/AssetValueSupply";
import { getHbarUsdPrice } from "@/utils/getHbarUsdPrice";
import { getEnv } from "@/lib/utils";
import AssetSubmissionHandler from "@/components/AssetSubmissionHandler";
import LocationSelector from "@/components/LocationSelector";
import {
  FORM_STEPS,
  SectionHeader,
  StepIndicator,
} from "@/components/StepIndicstor";
import { uploadToIPFS } from "@/utils/hedera-integration";
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
  geolocation: { country: string; state: string; city: string };
  valuationReport: File | null;
  insuranceDetails: string;
  specialRights: string;
}

const imageExtensions = [".png", ".jpg", ".jpeg"];
const docExtensions = [".pdf", ".doc", ".docx"];
const SUPPLY_MULTIPLIERS = [0, 3, 4, 5, 6, 7];
const PAYOUT_OPTIONS = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Annual", value: "annual" },
];

const ASSET_STEPS = [
  "Upload to IPFS",
  "Create Hedera Token",
  "Publish to Registry",
  "Anchor Document Hashes",
];

// --- AddAssetForm component implementation ---

const initialForm: AssetForm = {
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
  treasuryAccount: getEnv("VITE_PUBLIC_TREASURY_ACCOUNT_ID") || "",
  supplyType: "finite",
  kycKey: "",
  freezeKey: "",
  hcsTopicId: getEnv("VITE_PUBLIC_HEDERA_ASSET_TOPIC") || "",
  geolocation: { country: "", state: "", city: "" },
  valuationReport: null,
  insuranceDetails: "",
  specialRights: "",
};

const AddAssetForm: React.FC = () => {
  const [form, setForm] = useState<AssetForm>(initialForm);
  const [step, setStep] = useState(0);
  const [descError, setDescError] = useState<string>("");
  const [location, setLocation] = useState(form.geolocation);
  const [primaryImageError, setPrimaryImageError] = useState<string>("");
  const [additionalImagesError, setAdditionalImagesError] =
    useState<string>("");
  const [legalDocsError, setLegalDocsError] = useState<string>("");
  const [mediaDocRequiredError, setMediaDocRequiredError] =
    useState<string>("");
  const navigate = useNavigate();

  // Add handleDescriptionChange function
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    if (value.length > 900) {
      setDescError("Description must be less than 900 characters");
      return;
    }
    setDescError("");
    setForm((prev) => ({ ...prev, assetDescription: value }));
  };

  // Update location handling
  useEffect(() => {
    setForm((prev) => ({ ...prev, geolocation: location }));
  }, [location]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: keyof AssetForm, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Enhance file handling with validation
  const handlePrimaryImageChange = (files: File[]) => {
    if (files.length === 0) {
      setPrimaryImageError("Primary image is required");
    } else {
      setPrimaryImageError("");
      setForm((prev) => ({ ...prev, primaryImage: files[0] || null }));
    }
  };

  const handleAdditionalImagesChange = (files: File[]) => {
    if (files.length > 5) {
      setAdditionalImagesError("Maximum 5 additional images allowed");
      return;
    }
    setAdditionalImagesError("");
    setForm((prev) => ({ ...prev, additionalImages: files }));
  };

  const handleLegalDocsChange = (files: File[]) => {
    if (files.length === 0) {
      setLegalDocsError("Legal document is required");
    } else {
      setLegalDocsError("");
      setForm((prev) => ({ ...prev, legalDocs: files[0] || null }));
    }
  };

  // LocationSelector expects an object, so update accordingly
  const handleLocationChange = (loc: {
    country: string;
    state: string;
    city: string;
  }) => {
    setForm((prev) => ({ ...prev, geolocation: loc }));
  };

  // AssetValueSupply expects individual props, so map form state
  // We'll use local state for the required fields and sync with form as needed
  const [assetValueBase, setAssetValueBase] = useState("");
  const [assetValueMultiplier, setAssetValueMultiplier] = useState(0);
  const [supplyBase, setSupplyBase] = useState("");
  const [supplyMultiplier, setSupplyMultiplier] = useState(0);
  const [projectedIncome, setProjectedIncome] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [pricePerTokenUSD, setPricePerTokenUSD] = useState("");
  const [pricePerTokenHBAR, setPricePerTokenHBAR] = useState("");
  const [dividendYield, setDividendYield] = useState("");
  const [payoutFrequency, setPayoutFrequency] = useState(
    PAYOUT_OPTIONS[0].value
  );
  const [nextPayout, setNextPayout] = useState("");

  // Handle payout frequency updates
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
  // Form step validation
  const validateStep1 = () => {
    return (
      !!form.assetName &&
      !!form.category &&
      !!form.assetDescription &&
      !!form.geolocation.country &&
      !!form.geolocation.state &&
      !!form.geolocation.city
    );
  };

  const validateStep2 = () => {
    return form.primaryImage !== null && form.additionalImages.length <= 5;
  };

  const validateStep3 = () => {
    return (
      !!assetValueBase &&
      !!supplyBase &&
      !!projectedIncome &&
      !!annualIncome &&
      !!dividendYield &&
      !!payoutFrequency &&
      !!nextPayout
    );
  };

  const validateStep4 = () => {
    return (
      !!form.tokenName &&
      !!form.tokenSymbol &&
      !!form.decimals &&
      !!form.treasuryAccount &&
      !!form.supplyType
    );
  };

  // Validate current step
  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 0:
        return validateStep1();
      case 1:
        return validateStep2();
      case 2:
        return validateStep3();
      case 3:
        return validateStep4();
      default:
        return true;
    }
  };

  // Step navigation
  const nextStep = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, FORM_STEPS.length - 1));
    }
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  // Submission success handler
  const handleSuccess = () => {
    navigate("/portfolio");
  };

  // Add validation before form submission
  const validateMediaDocs = () => {
    if (!form.primaryImage) {
      setMediaDocRequiredError("Primary image is required");
      return false;
    }
    // if (!form.legalDocs) {
    //   setMediaDocRequiredError("Legal documents are required");
    //   return false;
    // }
    setMediaDocRequiredError("");
    return true;
  };

  // --- Render form steps ---
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <SectionHeader
          title="Add New Asset"
          description="Tokenize a real estate asset and publish it to the marketplace."
          icon={HomeIcon}
        />
        <StepIndicator steps={FORM_STEPS} currentStep={step + 1} />
      </CardHeader>
      <CardContent>
        <AssetSubmissionHandler
          form={form}
          onSuccess={handleSuccess}
          ProgressTracker={StepIndicator}
          ASSET_STEPS={ASSET_STEPS}
        >
          {(submit, loading, progressStep, progressError) => (
            <form className="space-y-8">
              {/* Step 1: Asset Details */}
              {step === 0 && (
                <Card>
                  <CardHeader>
                    <SectionHeader
                      icon={FileText}
                      title="Basic Information & Location"
                      description="Provide essential details about your asset and its location"
                    />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="assetName"
                          className="text-sm font-medium"
                        >
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
                        <Label
                          htmlFor="category"
                          className="text-sm font-medium"
                        >
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
                      <Label
                        htmlFor="assetDescription"
                        className="text-sm font-medium"
                      >
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
                        {descError && (
                          <span className="text-red-500">{descError}</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <Label className="text-sm font-medium">
                          Asset Location *
                        </Label>
                      </div>
                      <LocationSelector
                        value={location}
                        onChange={setLocation}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Images & Documents */}
              {step === 1 && (
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
                        <Label className="text-sm font-medium">
                          Primary Image *
                        </Label>
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
                        <Label className="text-sm font-medium">
                          Additional Images
                        </Label>
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
                        <Label className="text-sm font-medium">
                          Legal Documents
                        </Label>
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
                        <Label className="text-sm font-medium">
                          Valuation Report
                        </Label>
                        <FileUploader
                          accept="application/pdf"
                          allowedExtensions={[".pdf"]}
                          multiple={false}
                          onFilesChange={(files) =>
                            setForm((prev) => ({
                              ...prev,
                              valuationReport: files[0],
                            }))
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
              )}

              {/* Step 3: Tokenomics */}
              {step === 2 && (
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
                      setAnnualIncome={setAnnualIncome}
                      pricePerTokenUSD={pricePerTokenUSD}
                      setPricePerTokenUSD={setPricePerTokenUSD}
                      pricePerTokenHBAR={pricePerTokenHBAR}
                      dividendYield={dividendYield}
                      setDividendYield={setDividendYield}
                      payoutFrequency={payoutFrequency}
                      setPayoutFrequency={setPayoutFrequency}
                      nextPayout={nextPayout}
                      setNextPayout={setNextPayout}
                      payoutOptions={PAYOUT_OPTIONS}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Token Config & Rights */}
              {step === 3 && (
                <div className="space-y-8">
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
                          <Label
                            htmlFor="tokenName"
                            className="text-sm font-medium"
                          >
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
                          <Label
                            htmlFor="tokenSymbol"
                            className="text-sm font-medium"
                          >
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
                          <Label
                            htmlFor="decimals"
                            className="text-sm font-medium"
                          >
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
                          <Label
                            htmlFor="supplyType"
                            className="text-sm font-medium"
                          >
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
                          <Label
                            htmlFor="kycKey"
                            className="text-sm font-medium"
                          >
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
                          <Label
                            htmlFor="freezeKey"
                            className="text-sm font-medium"
                          >
                            Freeze Key
                          </Label>
                          <Input
                            id="freezeKey"
                            name="freezeKey"
                            value={form.freezeKey}
                            onChange={handleChange}
                            placeholder="Optional Freeze key"
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="hcsTopicId"
                            className="text-sm font-medium"
                          >
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
                            value={
                              form.geolocation
                                ? `${form.geolocation.country},${form.geolocation.state},${form.geolocation.city}`
                                : ""
                            }
                            onChange={handleChange}
                            placeholder="Country,State,City"
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
                            placeholder="Enter insurance details"
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="specialRights"
                            className="text-sm font-medium flex items-center gap-2"
                          >
                            <Star className="h-4 w-4" />
                            Special Rights
                          </Label>
                          <Input
                            id="specialRights"
                            name="specialRights"
                            value={form.specialRights}
                            onChange={handleChange}
                            placeholder="Describe any special rights"
                            className="h-11"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 0}
                  className={`${
                    step === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                {step < FORM_STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className={`${
                      !validateStep(step) ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!validateStep(step)}
                  >
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={loading || !validateStep(step)}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!validateStep(step)) return;
                      if (!validateMediaDocs()) return;
                      const formEvent = new Event("submit", {
                        bubbles: true,
                        cancelable: true,
                      }) as unknown as React.FormEvent<HTMLFormElement>;
                      submit(formEvent);
                    }}
                    className={`${
                      loading || !validateStep(step)
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {loading ? "Submitting..." : "Submit Asset"}
                    <Upload className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
              {progressError && (
                <div className="text-red-600 text-sm mt-2">{progressError}</div>
              )}
            </form>
          )}
        </AssetSubmissionHandler>
      </CardContent>
    </Card>
  );
};

export default AddAssetForm;
