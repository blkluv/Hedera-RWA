"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
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
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  ImageIcon,
  FileText,
  Coins,
  Settings,
  MapPin,
  Shield,
  Star,
  CheckCircle,
} from "lucide-react";

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
  const [loading, setLoading] = useState(false);

  // Dropzone configurations
  const primaryImageDropzone = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (files) => setForm((prev) => ({ ...prev, primaryImage: files[0] })),
  });

  const additionalImagesDropzone = useDropzone({
    accept: { "image/*": [] },
    multiple: true,
    onDrop: (files) =>
      setForm((prev) => ({ ...prev, additionalImages: files })),
  });

  const legalDocsDropzone = useDropzone({
    accept: { "application/pdf": [] },
    multiple: false,
    onDrop: (files) => setForm((prev) => ({ ...prev, legalDocs: files[0] })),
  });

  const valuationReportDropzone = useDropzone({
    accept: { "application/pdf": [] },
    multiple: false,
    onDrop: (files) =>
      setForm((prev) => ({ ...prev, valuationReport: files[0] })),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const removeFile = (fileType: keyof AssetForm) => {
    setForm((prev) => ({ ...prev, [fileType]: null }));
  };

  const removeAdditionalImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Upload files to IPFS, collect CIDs, and construct mapping JSON
    // TODO: Call backend or smart contract to publish asset
    setTimeout(() => {
      setLoading(false);
      navigate("/portfolio");
    }, 2000);
  };

  const DropzoneArea = ({
    dropzone,
    file,
    files,
    placeholder,
    icon: Icon,
    multiple = false,
  }: {
    dropzone: any;
    file?: File | null;
    files?: File[];
    placeholder: string;
    icon: any;
    multiple?: boolean;
  }) => (
    <div
      {...dropzone.getRootProps()}
      className={`
        relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
        ${
          dropzone.isDragActive
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
        }
        ${
          file || (files && files.length > 0)
            ? "border-green-500 bg-green-50 dark:bg-green-950/20"
            : ""
        }
      `}
    >
      <input {...dropzone.getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <Icon
          className={`h-8 w-8 ${
            file || (files && files.length > 0)
              ? "text-green-600"
              : "text-muted-foreground"
          }`}
        />
        {file ? (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              {file.name}
            </span>
          </div>
        ) : files && files.length > 0 ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                {files.length} file{files.length > 1 ? "s" : ""} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {files.map((f, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {f.name}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-medium">{placeholder}</p>
            <p className="text-xs text-muted-foreground">
              {dropzone.isDragActive
                ? "Drop files here"
                : "Drag & drop or click to browse"}
            </p>
          </div>
        )}
      </div>
    </div>
  );

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
                onChange={handleChange}
                placeholder="Provide a detailed description of the asset, its features, and investment potential..."
                className="min-h-[120px] resize-none"
                required
              />
            </div>
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
                <DropzoneArea
                  dropzone={primaryImageDropzone}
                  file={form.primaryImage}
                  placeholder="Upload primary image"
                  icon={ImageIcon}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Additional Images</Label>
                <DropzoneArea
                  dropzone={additionalImagesDropzone}
                  files={form.additionalImages}
                  placeholder="Upload additional images"
                  icon={ImageIcon}
                  multiple
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Legal Documents</Label>
                <DropzoneArea
                  dropzone={legalDocsDropzone}
                  file={form.legalDocs}
                  placeholder="Upload legal documents"
                  icon={FileText}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Valuation Report</Label>
                <DropzoneArea
                  dropzone={valuationReportDropzone}
                  file={form.valuationReport}
                  placeholder="Upload valuation report"
                  icon={FileText}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token Economics */}
        <Card>
          <CardHeader>
            <SectionHeader
              icon={Coins}
              title="Token Economics"
              description="Configure pricing and dividend information"
            />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="totalSupply" className="text-sm font-medium">
                  Total Token Supply *
                </Label>
                <Input
                  id="totalSupply"
                  name="totalSupply"
                  value={form.totalSupply}
                  onChange={handleChange}
                  placeholder="1000000"
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePerToken" className="text-sm font-medium">
                  Price Per Token (HBAR) *
                </Label>
                <Input
                  id="pricePerToken"
                  name="pricePerToken"
                  value={form.pricePerToken}
                  onChange={handleChange}
                  placeholder="0.50"
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minPurchase" className="text-sm font-medium">
                  Minimum Purchase *
                </Label>
                <Input
                  id="minPurchase"
                  name="minPurchase"
                  value={form.minPurchase}
                  onChange={handleChange}
                  placeholder="100"
                  className="h-11"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dividendYield" className="text-sm font-medium">
                  Dividend Yield (%)
                </Label>
                <Input
                  id="dividendYield"
                  name="dividendYield"
                  value={form.dividendYield}
                  onChange={handleChange}
                  placeholder="5.5"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="payoutFrequency"
                  className="text-sm font-medium"
                >
                  Payout Frequency
                </Label>
                <Input
                  id="payoutFrequency"
                  name="payoutFrequency"
                  value={form.payoutFrequency}
                  onChange={handleChange}
                  placeholder="Monthly"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextPayout" className="text-sm font-medium">
                  Next Payout Date
                </Label>
                <Input
                  id="nextPayout"
                  type="date"
                  name="nextPayout"
                  value={form.nextPayout}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>
            </div>
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
