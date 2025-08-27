import React from "react";
import { useState } from "react";
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
  Star,
  Shield,
  Settings,
  MapPin,
  Coins,
  FileText,
  ImageIcon,
  HomeIcon,
} from "lucide-react";
import {
  imageExtensions,
  docExtensions,
  PAYOUT_OPTIONS,
  FORM_STEPS,
  initialForm,
  AssetForm,
} from "@/utils/form";
import FileUploader from "./FileUploader";
import { SectionHeader, StepIndicator } from "./FromContent";
import LocationSelector from "./LocationSelector";
import AssetValueSupply from "./AssetValueSupply";

const AddAssetForm: React.FC = () => {
  const [form, setForm] = useState<AssetForm>(initialForm);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Asset value supply state
  const [assetValueBase, setAssetValueBase] = useState("");
  const [assetValueMultiplier, setAssetValueMultiplier] = useState(0);
  const [supplyBase, setSupplyBase] = useState("");
  const [supplyMultiplier, setSupplyMultiplier] = useState(0);
  const [projectedIncome, setProjectedIncome] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [pricePerTokenUSD, setPricePerTokenUSD] = useState("");
  const [dividendYield, setDividendYield] = useState("");
  const [payoutFrequency, setPayoutFrequency] = useState(
    PAYOUT_OPTIONS[0].value
  );
  const [nextPayout, setNextPayout] = useState("");

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle select changes
  const handleSelectChange = (name: keyof AssetForm, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle description change with validation
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    if (value.length > 900) {
      setErrors((prev) => ({
        ...prev,
        assetDescription: "Description must be less than 900 characters",
      }));
      return;
    }
    setErrors((prev) => ({ ...prev, assetDescription: "" }));
    setForm((prev) => ({ ...prev, assetDescription: value }));
  };

  // File handling
  const handlePrimaryImageChange = (files: File[]) => {
    setForm((prev) => ({ ...prev, primaryImage: files[0] || null }));
    if (files.length > 0) {
      setErrors((prev) => ({ ...prev, primaryImage: "" }));
    }
  };

  const handleAdditionalImagesChange = (files: File[]) => {
    if (files.length > 5) {
      setErrors((prev) => ({
        ...prev,
        additionalImages: "Maximum 5 additional images allowed",
      }));
      return;
    }
    setErrors((prev) => ({ ...prev, additionalImages: "" }));
    setForm((prev) => ({ ...prev, additionalImages: files }));
  };

  const handleLegalDocsChange = (files: File[]) => {
    setForm((prev) => ({ ...prev, legalDocs: files[0] || null }));
  };

  const handleValuationReportChange = (files: File[]) => {
    setForm((prev) => ({ ...prev, valuationReport: files[0] || null }));
  };

  // Location handling
  const handleLocationChange = (location: {
    country: string;
    state: string;
    city: string;
  }) => {
    setForm((prev) => ({ ...prev, geolocation: location }));
  };

  // Form validation
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!form.assetName) newErrors.assetName = "Asset name is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.assetDescription)
      newErrors.assetDescription = "Description is required";
    if (!form.geolocation.country) newErrors.country = "Country is required";
    if (!form.geolocation.state) newErrors.state = "State is required";
    if (!form.geolocation.city) newErrors.city = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!form.primaryImage)
      newErrors.primaryImage = "Primary image is required";
    if (form.additionalImages.length > 5)
      newErrors.additionalImages = "Maximum 5 additional images allowed";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!assetValueBase) newErrors.assetValueBase = "Asset value is required";
    if (!supplyBase) newErrors.supplyBase = "Token supply is required";
    if (!projectedIncome)
      newErrors.projectedIncome = "Projected income is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors: Record<string, string> = {};
    if (!form.tokenName) newErrors.tokenName = "Token name is required";
    if (!form.tokenSymbol) newErrors.tokenSymbol = "Token symbol is required";
    if (!form.decimals) newErrors.decimals = "Decimals is required";
    if (!form.treasuryAccount)
      newErrors.treasuryAccount = "Treasury account is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Form submitted:", {
        ...form,
        assetValueBase,
        assetValueMultiplier,
        supplyBase,
        supplyMultiplier,
        projectedIncome,
        annualIncome,
        pricePerTokenUSD,
        dividendYield,
        payoutFrequency,
        nextPayout,
      });

      alert("Asset created successfully!");

      // Reset form
      setForm(initialForm);
      setStep(0);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to create asset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <SectionHeader
          title="Add New Asset"
          description="Tokenize a real estate asset and publish it to the marketplace."
          icon={HomeIcon}
        />
        <StepIndicator steps={FORM_STEPS} currentStep={step + 1} />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
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
                    {errors.assetName && (
                      <div className="text-red-500 text-xs">
                        {errors.assetName}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">
                      Category *
                    </Label>
                    <Select
                      value={form.category}
                      onValueChange={(value) =>
                        handleSelectChange("category", value)
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="real-estate">Real Estate</SelectItem>
                        <SelectItem value="art">Art & Collectibles</SelectItem>
                        <SelectItem value="commodities">Commodities</SelectItem>
                        <SelectItem value="infrastructure">
                          Infrastructure
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <div className="text-red-500 text-xs">
                        {errors.category}
                      </div>
                    )}
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
                    {errors.assetDescription && (
                      <span className="text-red-500">
                        {errors.assetDescription}
                      </span>
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
                    value={form.geolocation}
                    onChange={handleLocationChange}
                  />
                  {(errors.country || errors.state || errors.city) && (
                    <div className="text-red-500 text-xs">
                      {errors.country || errors.state || errors.city}
                    </div>
                  )}
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
                  <div>
                    <FileUploader
                      accept="image/png,image/jpeg,image/jpg"
                      allowedExtensions={imageExtensions}
                      multiple={false}
                      onFilesChange={handlePrimaryImageChange}
                      inputId="primary-image-uploader"
                      label="Primary Image"
                      required
                    />
                    {errors.primaryImage && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.primaryImage}
                      </div>
                    )}
                  </div>
                  <div>
                    <FileUploader
                      accept="image/png,image/jpeg,image/jpg"
                      allowedExtensions={imageExtensions}
                      multiple={true}
                      onFilesChange={handleAdditionalImagesChange}
                      inputId="additional-images-uploader"
                      label="Additional Images (Max 5)"
                    />
                    {errors.additionalImages && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.additionalImages}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FileUploader
                      accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      allowedExtensions={docExtensions}
                      multiple={false}
                      onFilesChange={handleLegalDocsChange}
                      inputId="legal-docs-uploader"
                      label="Legal Documents"
                    />
                  </div>
                  <div>
                    <FileUploader
                      accept="application/pdf"
                      allowedExtensions={[".pdf"]}
                      multiple={false}
                      onFilesChange={handleValuationReportChange}
                      inputId="valuation-report-uploader"
                      label="Valuation Report"
                    />
                  </div>
                </div>
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
                  dividendYield={dividendYield}
                  setDividendYield={setDividendYield}
                  payoutFrequency={payoutFrequency}
                  setPayoutFrequency={setPayoutFrequency}
                  nextPayout={nextPayout}
                  setNextPayout={setNextPayout}
                />
                {(errors.assetValueBase ||
                  errors.supplyBase ||
                  errors.projectedIncome) && (
                  <div className="text-red-500 text-xs">
                    {errors.assetValueBase ||
                      errors.supplyBase ||
                      errors.projectedIncome}
                  </div>
                )}
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
                      {errors.tokenName && (
                        <div className="text-red-500 text-xs">
                          {errors.tokenName}
                        </div>
                      )}
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
                      {errors.tokenSymbol && (
                        <div className="text-red-500 text-xs">
                          {errors.tokenSymbol}
                        </div>
                      )}
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
                        placeholder="2"
                        className="h-11"
                        required
                      />
                      {errors.decimals && (
                        <div className="text-red-500 text-xs">
                          {errors.decimals}
                        </div>
                      )}
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
                      {errors.treasuryAccount && (
                        <div className="text-red-500 text-xs">
                          {errors.treasuryAccount}
                        </div>
                      )}
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
                        HCS Topic ID
                      </Label>
                      <Input
                        id="hcsTopicId"
                        name="hcsTopicId"
                        value={form.hcsTopicId}
                        onChange={handleChange}
                        placeholder="0.0.789012"
                        className="h-11"
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
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            {step < FORM_STEPS.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={Object.keys(errors).length > 0}
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={loading}>
                {" "}
                {loading ? "Creating Asset..." : "Create Asset"}
                <Upload className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddAssetForm;
