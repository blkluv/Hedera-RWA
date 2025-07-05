// utils/getHbarUsdPrice.ts

export async function getHbarUsdPrice(): Promise<number> {
  // Use CoinGecko API for real-time HBAR/USD price
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=hedera-hashgraph&vs_currencies=usd"
  );
  const data = await res.json();
  if (!data["hedera-hashgraph"] || !data["hedera-hashgraph"].usd)
    throw new Error("Could not fetch HBAR price");
  return data["hedera-hashgraph"].usd;
}
