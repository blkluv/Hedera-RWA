import { Client, TopicCreateTransaction } from "@hashgraph/sdk";

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

//   useEffect(() => {
//     async function initializeTopic() {
//       try {
//         const topicId = await createTopic();
//         console.log("Topic created with ID:", topicId);
//       } catch (error) {
//         console.error("Error creating topic:", error);
//       }
//     }
//     initializeTopic();
//   }, []);
