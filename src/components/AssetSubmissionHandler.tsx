import React, { useState } from "react";
import { createFungibleToken } from "@/utils/token-hedera-integration";
import { getEnv } from "@/utils";
import { TopicMessageSubmitTransaction } from "@hashgraph/sdk";
import { publishToRegistry } from "@/utils/hedera-integration";

// Helper: Upload a file to IPFS via Pinata
async function uploadFileToIPFS(file: File): Promise<string> {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getEnv("VITE_PUBLIC_PINATA_JWT")}`,
    },
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload file to IPFS");
  const data = await res.json();
  return data.IpfsHash;
}

// Helper: Upload metadata (JSON) to IPFS via Pinata
async function uploadJSONToIPFS(json: any): Promise<string> {
  const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getEnv("VITE_PUBLIC_PINATA_JWT")}`,
    },
    body: JSON.stringify(json),
  });
  if (!res.ok) throw new Error("Failed to upload metadata to IPFS");
  const data = await res.json();
  return data.IpfsHash;
}

interface AssetSubmissionHandlerProps {
  form: any;
  onSuccess: () => void;
  ProgressTracker: React.ComponentType<any>;
  ASSET_STEPS: string[];
  children: (
    submit: (e: React.FormEvent<HTMLFormElement>) => void,
    loading: boolean,
    progressStep: number,
    progressError: string
  ) => React.ReactNode;
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
      console.log("Starting asset submission process...");

      // 1. Upload to IPFS (file + metadata)
      setProgressStep(0);
      // Upload all files/images to IPFS
      const ipfsCIDs: Record<string, string | string[]> = {};
      if (form.primaryImage) {
        ipfsCIDs.primaryImage = await uploadFileToIPFS(form.primaryImage);
      }
      if (form.additionalImages && Array.isArray(form.additionalImages)) {
        ipfsCIDs.additionalImages = [];
        for (const img of form.additionalImages) {
          const cid = await uploadFileToIPFS(img);
          (ipfsCIDs.additionalImages as string[]).push(cid);
        }
      }
      if (form.legalDocs) {
        ipfsCIDs.legalDocs = await uploadFileToIPFS(form.legalDocs);
      }
      if (form.valuationReport) {
        ipfsCIDs.valuationReport = await uploadFileToIPFS(form.valuationReport);
      }

      // Prepare metadata including IPFS CIDs
      const metadata = {
        ...form,
        ipfsCIDs,
      };
      const metadataCID = await uploadJSONToIPFS(metadata);

      // 2. Create Hedera Token
      setProgressStep(1);
      const tokenId = await createFungibleToken({
        name: form.tokenName,
        symbol: form.tokenSymbol,
        decimals: Number(form.decimals) || 2,
        initialSupply: Number(form.totalSupply) || 1000000,
        memo: form.assetDescription,
        supplyType: form.supplyType === "finite" ? "FINITE" : "INFINITE",
        maxSupply:
          form.supplyType === "finite" ? Number(form.totalSupply) : null,
      });

      // 3. Publish to Registry
      setProgressStep(2);
      // Publish tokenId and metadataCID to registry
      await publishToRegistry(tokenId, metadataCID);

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
      if (form.additionalImages && Array.isArray(form.additionalImages)) {
        for (const img of form.additionalImages) {
          await anchorDocumentHash(img, img.type, docTopicId, client);
        }
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
