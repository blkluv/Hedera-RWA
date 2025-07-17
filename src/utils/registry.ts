// Helper: Publish to Registry (stub)
import {
  Client,
  TopicMessageSubmitTransaction,
  TopicId,
  PrivateKey,
  AccountId,
} from "@hashgraph/sdk";
import { getEnv } from "@/lib/utils";

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

  // Publish message to topic
  const submitMsgTx = await new TopicMessageSubmitTransaction({
    topicId,
    message: Buffer.from(message),
  }).execute(client);
  const receipt = await submitMsgTx.getReceipt(client);
  console.log(
    `📤 Registry message submitted | Status: ${receipt.status.toString()}`
  );
}
