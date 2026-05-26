const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

export interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
  market_cap: number;
}

export async function getCoinPrices(coinIds: string[]): Promise<CoinPrice[]> {
  if (coinIds.length === 0) return [];

  const ids = coinIds.join(",");
  const url = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
    headers: { accept: "application/json" },
  });

  if (!res.ok) return [];

  const data = (await res.json()) as CoinPrice[];
  return data;
}

export async function getCoinPrice(coinId: string): Promise<number | null> {
  const url = `${COINGECKO_BASE}/simple/price?ids=${coinId}&vs_currency=usd`;

  const res = await fetch(url, {
    next: { revalidate: 30 },
    headers: { accept: "application/json" },
  });

  if (!res.ok) return null;

  const data = (await res.json()) as Record<string, { usd: number }>;
  return data[coinId]?.usd ?? null;
}
