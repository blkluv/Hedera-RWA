import React, { useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Settings } from "lucide-react";
import { PrivateKey } from "@hashgraph/sdk";

interface TokenConfigCardProps {
  form: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const treasuryAccount =
  import.meta.env.VITE_PUBLIC_TREASURY_ACCOUNT_ID ||
  process.env.VITE_PUBLIC_TREASURY_ACCOUNT_ID;

// Generate a new Ed25519 keypair (for demo, should be securely generated/stored in production)
const kycKey = PrivateKey.generate();
console.log("KYC Public Key:", kycKey.publicKey.toString());
console.log("KYC Private Key:", kycKey.toString());

const TokenConfigCard: React.FC<TokenConfigCardProps> = ({
  form,
  handleChange,
  handleSelectChange,
}) => {
  useEffect(() => {
    // Set treasury account from env if not already set
    if (!form.treasuryAccount && treasuryAccount) {
      handleChange({
        target: { name: "treasuryAccount", value: treasuryAccount },
      } as any);
    }
    // Set KYC key if not already set
    if (!form.kycKey && kycKey) {
      handleChange({
        target: { name: "kycKey", value: kycKey.toString() },
      } as any);
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Token Configuration</h3>
            <p className="text-sm text-muted-foreground">
              Set up token parameters and blockchain settings
            </p>
          </div>
        </div>
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
            <Label htmlFor="treasuryAccount" className="text-sm font-medium">
              Treasury Account *
            </Label>
            <Input
              id="treasuryAccount"
              name="treasuryAccount"
              value={form.treasuryAccount}
              readOnly
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
              onValueChange={(value) => handleSelectChange("supplyType", value)}
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
              readOnly
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
              readOnly
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
              readOnly
              onChange={handleChange}
              placeholder="0.0.789012"
              className="h-11"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenConfigCard;
