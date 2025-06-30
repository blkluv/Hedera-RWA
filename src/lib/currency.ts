export async function fetchHbarUsdRate(): Promise<number> {
  // Example using public API, replace with a more reliable source if needed
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=hedera-hashgraph&vs_currencies=usd"
  );
  if (!res.ok) throw new Error("Failed to fetch HBAR price");
  const data = await res.json();
  return data["hedera-hashgraph"]?.usd || 0;
}

export function usdToHbar(usd: number, rate: number): number {
  return usd / rate;
}

export function hbarToUsd(hbar: number, rate: number): number {
  return hbar * rate;
}
