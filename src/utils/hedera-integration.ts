import {
  Client,
  TopicMessageSubmitTransaction,
  TopicId,
  PrivateKey,
  AccountId,
  TopicCreateTransaction,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
} from "@hashgraph/sdk";
import { getEnv } from "@/utils";

// Utility functions for Hedera, IPFS, and Mirror Node integration
// These are stubs to be filled with real logic and API keys as needed

// --- IPFS ---
export async function uploadFileToIPFS(file: File): Promise<string> {
  // TODO: Integrate with IPFS pinning service (e.g., Pinata, web3.storage)
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
  // Return the IPFS hash (CID)
  return data.IpfsHash;
}
// Helper: Upload metadata (JSON) to IPFS via Pinata
export async function uploadJSONToIPFS(json: any): Promise<string> {
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
// --- Hedera Token Service (HTS) ---
export async function createHederaToken({
  name,
  symbol,
  decimals,
  initialSupply,
  supplyType,
  maxSupply,
  adminKey, // Connected wallet's public key for admin
  supplyKey, // Connected wallet's public key for supply management
}: {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply: number;
  supplyType: "INFINITE" | "FINITE";
  maxSupply?: number | null;
  adminKey: string;
  supplyKey: string;
}): Promise<string> {
  try {
    // Load credentials from env
    const treasuryId = AccountId.fromString(
      getEnv("VITE_PUBLIC_TREASURY_ACCOUNT_ID")
    );
    const treasuryKey = PrivateKey.fromStringED25519(
      getEnv("VITE_PUBLIC_ENCODED_PRIVATE_KEY")
    );
    const client = Client.forTestnet().setOperator(treasuryId, treasuryKey);

    // Convert adminKey and supplyKey strings to PublicKey objects
    const adminPublicKey = PrivateKey.fromString(adminKey).publicKey;
    const supplyPublicKey = PrivateKey.fromString(supplyKey).publicKey;

    // Create the token create transaction
    let tokenCreateTx = await new TokenCreateTransaction()
      .setTokenName(name)
      .setTokenSymbol(symbol)
      .setTokenType(TokenType.FungibleCommon)
      .setDecimals(decimals)
      .setInitialSupply(initialSupply)
      .setTreasuryAccountId(treasuryId)
      .setAdminKey(adminPublicKey)
      .setSupplyKey(supplyPublicKey)
      .setSupplyType(
        supplyType === "INFINITE"
          ? TokenSupplyType.Infinite
          : TokenSupplyType.Finite
      );

    // If supply type is finite, set the max supply
    if (supplyType === "FINITE" && maxSupply) {
      tokenCreateTx.setMaxSupply(maxSupply);
    }

    // Freeze the transaction for signing
    const frozenTx = await tokenCreateTx.freezeWith(client);

    // Sign the transaction with the treasury key
    const signedTx = await frozenTx.sign(treasuryKey);

    // Submit the transaction
    const tokenCreateSubmit = await signedTx.execute(client);

    // Get the transaction receipt
    const tokenCreateRx = await tokenCreateSubmit.getReceipt(client);

    // Get the token ID
    const tokenId = tokenCreateRx.tokenId;

    if (!tokenId) {
      throw new Error("Token creation failed: No token ID returned");
    }

    console.log(`✅ Created token with ID: ${tokenId.toString()}`);
    return tokenId.toString();
  } catch (error: any) {
    console.error("❌ Error creating Hedera token:", error);
    throw new Error(`Failed to create token: ${error.message}`);
  }
}
// Helper: Hash a file (SHA-256)
export async function hashFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
// --- Hedera Consensus Service (HCS) ---
export async function sendHcsMessage(
  topicId: string,
  message: any
): Promise<string> {
  // TODO: Use Hedera SDK to send a message to a topic for asset registry/events
  // Return the transaction ID or message sequence
  return "mockedHcsMessageId";
}

// Helper: Publish to Registry (stub)
export async function publishToRegistry(tokenId: string, metadataCID: string) {
  // Load credentials from env
  const operatorId = AccountId.fromString(
    getEnv("VITE_PUBLIC_TREASURY_ACCOUNT_ID")
  );
  const operatorKey = PrivateKey.fromStringED25519(
    getEnv("VITE_PUBLIC_ENCODED_PRIVATE_KEY")
  );
  const client = Client.forTestnet().setOperator(operatorId, operatorKey);
  const topicId = TopicId.fromString(getEnv("VITE_PUBLIC_HEDERA_ASSET_TOPIC"));

  // Prepare message
  const message = JSON.stringify({
    type: "RealEstateAsset",
    tokenId,
    metadataCID,
    timestamp: new Date().toISOString(),
  });
  console.log("Messsge: ", message);
  // Publish message to topic
  const submitMsgTx = await new TopicMessageSubmitTransaction({
    topicId,
    message,
  }).execute(client);
  const receipt = await submitMsgTx.getReceipt(client);
  console.log(
    `📤 Registry message submitted | Status: ${receipt.status.toString()}`
  );
}

const treasuryAccountId = import.meta.env.VITE_PUBLIC_TREASURY_ACCOUNT_ID;
const encodedPrivateKey = import.meta.env.VITE_PUBLIC_ENCODED_PRIVATE_KEY;

if (!treasuryAccountId || !encodedPrivateKey) {
  throw new Error(
    "Missing Hedera environment variables: VITE_PUBLIC_TREASURY_ACCOUNT_ID or VITE_PUBLIC_ENCODED_PRIVATE_KEY"
  );
}

const client = Client.forTestnet().setOperator(
  treasuryAccountId,
  encodedPrivateKey
);

export async function createTopic() {
  const tx = new TopicCreateTransaction().setTopicMemo("Asset Registry");
  const submit = await tx.execute(client);
  const receipt = await submit.getReceipt(client);
  if (!receipt.topicId) {
    throw new Error("Failed to create topic: topicId is null");
  }
  const topicId = receipt.topicId.toString();
  console.log("New Topic ID:", topicId);
  return topicId;
}

// --- Mirror Node ---
export async function fetchAssetDataFromMirrorNode(
  tokenId: string
): Promise<any> {
  // TODO: Query Hedera Mirror Node REST API for token info, supply, transactions
  return {
    price: "$250",
    totalSupply: 10000,
    circulatingSupply: 3247,
    holders: 120,
  };
}

// --- Asset Metadata ---
export async function fetchAssetMetadataFromIPFS(cid: string): Promise<any> {
  // TODO: Fetch and parse asset metadata JSON from IPFS
  return {
    name: "Sample Asset",
    description: "A sample real estate asset.",
    image: "/placeholder.svg",
    legalDocs: ["/sample-doc.pdf"],
  };
}
