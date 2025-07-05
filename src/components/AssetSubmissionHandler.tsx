import React, { useState } from "react";
import { createFungibleToken } from "@/utils/tokenCreate";
import { getEnv } from "@/lib/utils";
import { TopicMessageSubmitTransaction } from "@hashgraph/sdk";

interface AssetSubmissionHandlerProps {
  form: any;
  onSuccess: () => void;
  ProgressTracker: React.ComponentType<any>;
  ASSET_STEPS: string[];
  children: (submit: (e: React.FormEvent<HTMLFormElement>) => void, loading: boolean, progressStep: number, progressError: string) => React.ReactNode;
}

// Helper: Hash a file (SHA-256)
async function hashFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Helper: Anchor file hash to HCS
async function anchorDocumentHash(
  file: File,
  fileType: string,
  topicId: string,
  client: any
) {
  const fileHash = await hashFile(file);
  const hashPayload = {
    fileHash,
    fileType,
    timestamp: new Date().toISOString(),
  };
  const tx = new TopicMessageSubmitTransaction()
    .setTopicId(topicId)
    .setMessage(JSON.stringify(hashPayload));
  const submit = await tx.execute(client);
  const receipt = await submit.getReceipt(client);
  return {
    fileHash,
    status: receipt.status.toString(),
  };
}

const AssetSubmissionHandler: React.FC<AssetSubmissionHandlerProps> = ({
  form,
  onSuccess,
  ProgressTracker,
  ASSET_STEPS,
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState(-1);
  const [progressError, setProgressError] = useState("");

  const handleAssetSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setProgressStep(0);
    setProgressError("");
    try {
      // 1. Upload to IPFS (file + metadata)
      setProgressStep(0);
      // TODO: Replace with real upload logic
      // const { metadataCID } = await uploadAssetToIPFS(...);
      const metadataCID = "demo-metadata-cid";

      // 2. Create Hedera Token
      setProgressStep(1);
      const tokenId = await createFungibleToken({
        name: form.tokenName,
        symbol: form.tokenSymbol,
        decimals: Number(form.decimals) || 2,
        initialSupply: Number(form.totalSupply) || 1000000,
        memo: form.assetDescription,
        supplyType: form.supplyType === "finite" ? "FINITE" : "INFINITE",
        maxSupply: form.supplyType === "finite" ? Number(form.totalSupply) : null,
      });

      // 3. Publish to Registry (stub)
      setProgressStep(2);
      // await publishToRegistry(tokenId, metadataCID, ...);

      // 4. Anchor document hash for each file (primary, additional, legal, valuation)
      setProgressStep(3);
      const { Client } = await import("@hashgraph/sdk");
      const client = Client.forTestnet().setOperator(
        getEnv("VITE_PUBLIC_TREASURY_ACCOUNT_ID"),
        getEnv("VITE_PUBLIC_ENCODED_PRIVATE_KEY")
      );
      const docTopicId = getEnv("VITE_PUBLIC_HEDERA_ASSET_TOPIC");
      if (form.primaryImage) {
        await anchorDocumentHash(
          form.primaryImage,
          form.primaryImage.type,
          docTopicId,
          client
        );
      }
      for (const img of form.additionalImages) {
        await anchorDocumentHash(img, img.type, docTopicId, client);
      }
      if (form.legalDocs) {
        await anchorDocumentHash(
          form.legalDocs,
          form.legalDocs.type,
          docTopicId,
          client
        );
      }
      if (form.valuationReport) {
        await anchorDocumentHash(
          form.valuationReport,
          form.valuationReport.type,
          docTopicId,
          client
        );
      }
      setProgressStep(ASSET_STEPS.length);
      setLoading(false);
      onSuccess();
    } catch (err: any) {
      setProgressError(err.message || "Submission failed");
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <ProgressTracker
          currentStep={progressStep}
          steps={ASSET_STEPS}
          error={progressError}
        />
      )}
      {children(handleAssetSubmission, loading, progressStep, progressError)}
    </>
  );
};

export default AssetSubmissionHandler;
