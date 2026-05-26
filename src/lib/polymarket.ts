const GAMMA_API = "https://gamma-api.polymarket.com";

export interface PolymarketEvent {
  id: string;
  title: string;
  description: string;
  image: string;
  endDate: string;
  active: boolean;
  closed: boolean;
  volume: number;
  volume24hr: number;
  liquidity: number;
  markets: PolymarketMarket[];
}

export interface PolymarketMarket {
  id: string;
  question: string;
  description: string;
  outcomes: string;
  outcomePrices: string;
  volume: string;
  volumeNum: number;
  liquidity: string;
  liquidityNum: number;
  endDate: string;
  active: boolean;
  closed: boolean;
  image: string;
  icon: string;
  groupItemTitle: string;
  volume24hr: number;
}

export interface PolymarketMarketFormatted {
  id: string;
  question: string;
  description: string | null;
  image: string | null;
  yesPrice: number;
  noPrice: number;
  yesPercent: number;
  volume: number;
  volume24hr: number;
  endDate: string;
  active: boolean;
  source: "polymarket";
}

function parseOutcomes(raw: string): string[] {
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function parsePrices(raw: string): number[] {
  try {
    return (JSON.parse(raw) as string[]).map(Number);
  } catch {
    return [];
  }
}

export async function getPolymarketTrending(
  limit = 20,
): Promise<PolymarketMarketFormatted[]> {
  const url = `${GAMMA_API}/markets?limit=${limit}&active=true&closed=false&order=volumeNum&ascending=false`;

  const res = await fetch(url, {
    next: { revalidate: 120 },
    headers: { accept: "application/json" },
  });

  if (!res.ok) return [];

  const raw = (await res.json()) as PolymarketMarket[];

  return raw
    .filter((m) => {
      const outcomes = parseOutcomes(m.outcomes);
      return outcomes.length === 2 && m.volumeNum > 1000;
    })
    .map((m) => {
      const prices = parsePrices(m.outcomePrices);
      const yesPrice = prices[0] ?? 0.5;
      const noPrice = prices[1] ?? 0.5;

      return {
        id: `poly_${m.id}`,
        question: m.question,
        description: m.description || null,
        image: m.image || m.icon || null,
        yesPrice,
        noPrice,
        yesPercent: Math.round(yesPrice * 100),
        volume: Math.round(m.volumeNum),
        volume24hr: Math.round(m.volume24hr || 0),
        endDate: m.endDate,
        active: m.active,
        source: "polymarket" as const,
      };
    });
}
