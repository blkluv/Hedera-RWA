import {
  Client,
  AccountId,
  PrivateKey,
  TokenId,
  TransactionReceipt,
  AccountUpdateTransaction,
  TokenAssociateTransaction,
} from "@hashgraph/sdk";

interface AssociateAccountWithTokenParams {
  client: Client;
  accountId: AccountId | string;
  accountKey: PrivateKey;
  tokenId: TokenId | string;
  maxAutoAssociations?: number;
}

// Attempts to auto-associate, falls back to manual association if needed
export async function associateAccountWithToken({
  client,
  accountId,
  accountKey,
  tokenId,
  maxAutoAssociations = 10,
}: AssociateAccountWithTokenParams): Promise<void> {
  try {
    // 1. Try to set auto-association (if not already set)
    let autoAssocTx: AccountUpdateTransaction =
      await new AccountUpdateTransaction()
        .setAccountId(accountId)
        .setMaxAutomaticTokenAssociations(maxAutoAssociations)
        .freezeWith(client)
        .sign(accountKey);

    let autoAssocTxSubmit = await autoAssocTx.execute(client);
    let autoAssocRx: TransactionReceipt = await autoAssocTxSubmit.getReceipt(
      client
    );

    if (autoAssocRx.status.toString() === "SUCCESS") {
      console.log(`Auto-association set for account ${accountId}`);
      // Now, when you transfer the token, it will be auto-associated
      return;
    }
  } catch (err) {
    // If auto-association fails (e.g., not supported, already set, or not enough slots), fall back to manual
    console.log(
      "Auto-association not possible or already set, falling back to manual association."
    );
  }

  // 2. Manual association
  let manualAssocTx: TokenAssociateTransaction =
    await new TokenAssociateTransaction()
      .setAccountId(accountId)
      .setTokenIds([tokenId])
      .freezeWith(client)
      .sign(accountKey);

  let manualAssocTxSubmit = await manualAssocTx.execute(client);
  let manualAssocRx = await manualAssocTxSubmit.getReceipt(client);

  if (manualAssocRx.status.toString() === "SUCCESS") {
    console.log(
      `Manual association successful for account ${accountId} and token ${tokenId}`
    );
  } else {
    throw new Error(
      `Manual association failed: ${manualAssocRx.status.toString()}`
    );
  }
}
