"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { MarketCard } from "@/components/market-card";
import { BetModal } from "@/components/bet-modal";

interface MarketData {
  id: string;
  repo: string;
  owner: string;
  question: string;
  description: string | null;
  category: "stars" | "forks" | "releases" | "trending";
  end_date: string;
  resolved: boolean;
  outcome: boolean | null;
  language: string | null;
  language_color: string | null;
  stars: number;
  forks: number;
  yesPercent: number;
  volume: number;
  hot: boolean;
}

const filters = ["All", "Stars", "Releases", "Forks", "Trending"] as const;
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

  const filtered = markets.filter((m) => {
    const matchesFilter =
      activeFilter === "All" ||
      m.category.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch =
      m.question.toLowerCase().includes(search.toLowerCase()) ||
      m.repo.toLowerCase().includes(search.toLowerCase()) ||
      m.owner.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Markets</h1>
        <p className="mt-1 text-sm text-muted">
          Browse and bet on open source predictions
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
          placeholder="Search markets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:w-64"
        />
      </div>

      {loading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl border border-border bg-card" />
          ))}
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

      {!loading && filtered.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-lg font-medium text-muted">No markets found</p>
          <p className="mt-1 text-sm text-muted">
            Try a different filter or search term
          </p>
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
