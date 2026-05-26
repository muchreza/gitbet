"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { MarketCard } from "@/components/market-card";
import { BetModal } from "@/components/bet-modal";
import { PolymarketCard } from "@/components/polymarket-card";

interface PolymarketData {
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

interface MarketData {
  id: string;
  question: string;
  description: string | null;
  coin_id: string;
  coin_symbol: string;
  coin_name: string;
  coin_image: string | null;
  target_price: number;
  current_price: number;
  price_change_24h: number;
  category: string;
  end_date: string;
  resolved: boolean;
  outcome: boolean | null;
  yesPercent: number;
  volume: number;
  hot: boolean;
}

const MAJOR_COINS = ["bitcoin", "ethereum"];
const filters = ["All", "BTC", "ETH", "Altcoins", "Polymarket"] as const;
type Filter = (typeof filters)[number];

async function loadMarkets(): Promise<MarketData[]> {
  const res = await fetch("/api/markets");
  if (!res.ok) return [];
  return res.json() as Promise<MarketData[]>;
}

export default function MarketsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarket, setSelectedMarket] = useState<MarketData | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: session } = useSession();
  const didLoad = useRef(false);
  const [polymarkets, setPolymarkets] = useState<PolymarketData[]>([]);
  const [polyLoading, setPolyLoading] = useState(false);
  const polyFetched = useRef(false);

  useEffect(() => {
    if (didLoad.current && refreshKey === 0) return;
    didLoad.current = true;
    let cancelled = false;
    setLoading(true);
    loadMarkets()
      .then((data) => { if (!cancelled) setMarkets(data); })
      .catch(() => { /* fall back silently */ })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [refreshKey]);

  useEffect(() => {
    if (activeFilter !== "Polymarket" || polyFetched.current) return;
    polyFetched.current = true;
    setPolyLoading(true);
    fetch("/api/polymarket")
      .then((res) => res.json())
      .then((data: PolymarketData[]) => setPolymarkets(data))
      .catch(() => {})
      .finally(() => setPolyLoading(false));
  }, [activeFilter]);

  const filteredPoly = polymarkets.filter((m) =>
    m.question.toLowerCase().includes(search.toLowerCase())
  );

  const filtered = markets.filter((m) => {
    let matchesFilter = true;
    if (activeFilter === "BTC") matchesFilter = m.coin_id === "bitcoin";
    else if (activeFilter === "ETH") matchesFilter = m.coin_id === "ethereum";
    else if (activeFilter === "Altcoins") matchesFilter = !MAJOR_COINS.includes(m.coin_id);
    else if (activeFilter === "Polymarket") return false;

    const matchesSearch =
      m.question.toLowerCase().includes(search.toLowerCase()) ||
      m.coin_name.toLowerCase().includes(search.toLowerCase()) ||
      m.coin_symbol.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Crypto Markets</h1>
        <p className="mt-1 text-sm text-muted">
          Browse and bet on crypto price predictions
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeFilter === f
                  ? "bg-accent text-black"
                  : "bg-card border border-border text-muted hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search coins..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:w-64"
        />
      </div>

      {activeFilter === "Polymarket" ? (
        polyLoading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl border border-border bg-card" />
            ))}
          </div>
        ) : filteredPoly.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-lg font-medium text-muted">No Polymarket markets found</p>
            <p className="mt-1 text-sm text-muted">Try a different search term</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPoly.map((pm) => (
              <PolymarketCard
                key={pm.id}
                market={pm}
                onBet={session ? () => setSelectedMarket({
                  id: pm.id,
                  question: pm.question,
                  description: pm.description,
                  coin_id: "polymarket",
                  coin_symbol: "POLY",
                  coin_name: "Polymarket",
                  coin_image: pm.image,
                  target_price: 0,
                  current_price: pm.yesPrice,
                  price_change_24h: 0,
                  category: "general",
                  end_date: pm.endDate,
                  resolved: false,
                  outcome: null,
                  yesPercent: pm.yesPercent,
                  volume: pm.volume,
                  hot: pm.volume24hr > 10000,
                }) : undefined}
              />
            ))}
          </div>
        )
      ) : loading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl border border-border bg-card" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-lg font-medium text-muted">No markets found</p>
          <p className="mt-1 text-sm text-muted">
            Try a different filter or search term
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((market) => (
            <MarketCard
              key={market.id}
              market={market}
              onBet={session ? () => setSelectedMarket(market) : undefined}
            />
          ))}
        </div>
      )}

      {selectedMarket && (
        <BetModal
          market={selectedMarket}
          onClose={() => setSelectedMarket(null)}
          onBetPlaced={() => {
            setSelectedMarket(null);
            setRefreshKey((k) => k + 1);
          }}
        />
      )}
    </div>
  );
}
