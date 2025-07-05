import {
  Client,
  PrivateKey,
  AccountId,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
} from "@hashgraph/sdk";

// Configure your operator account and client
const operatorId = AccountId.fromString(
  import.meta.env.VITE_PUBLIC_TREASURY_ACCOUNT_ID
);
const operatorKey = PrivateKey.fromStringED25519(
  import.meta.env.VITE_PUBLIC_TREASURY_HEX_PRIVATE_KEY
);
const client = Client.forTestnet().setOperator(operatorId, operatorKey);

interface CreateFungibleTokenParams {
  name: string;
  symbol: string;
  decimals: number;
  initialSupply?: number;
  memo?: string;
  supplyType?: "INFINITE" | "FINITE";
  maxSupply?: number | null;
}

export async function createFungibleToken({
  name,
  symbol,
  decimals,
  initialSupply = 1000000,
  memo = "",
  supplyType = "INFINITE",
  maxSupply = null,
}: CreateFungibleTokenParams) {
  // Create the token create transaction
  const tokenCreateTx = await new TokenCreateTransaction()
    .setTokenName(name)
    .setTokenSymbol(symbol)
    .setTokenType(TokenType.FungibleCommon)
    .setDecimals(decimals)
    .setInitialSupply(initialSupply) // 10,000 units with 2 decimals
    .setTreasuryAccountId(operatorId)
    .setAdminKey(operatorKey)
    .setSupplyKey(operatorKey);

  if (
    supplyType === "FINITE" &&
    maxSupply !== null &&
    maxSupply !== undefined
  ) {
    tokenCreateTx.setSupplyType(TokenSupplyType.Finite).setMaxSupply(maxSupply); // FINITE
  } else {
    tokenCreateTx.setSupplyType(TokenSupplyType.Infinite);
  }

  await tokenCreateTx.freezeWith(client);

  // Sign the transaction with the operator's private key
  const tokenCreateTxSigned = await tokenCreateTx.sign(operatorKey);

  // Submit the signed transaction to the Hedera network
  const tokenCreateTxSubmitted = await tokenCreateTxSigned.execute(client);

  // Get the transaction receipt
  const tokenCreateTxReceipt = await tokenCreateTxSubmitted.getReceipt(client);

  // Get and log the newly created token ID
  const tokenId = tokenCreateTxReceipt.tokenId;
  if (!tokenId) throw new Error("Token creation failed");
  console.log("The new token ID is " + tokenId);
  return tokenId.toString();
}
