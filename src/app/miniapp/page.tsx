"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { MiniAppMarketCard } from "@/components/miniapp-market-card";
import { MiniAppBetModal } from "@/components/miniapp-bet-modal";

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

interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
}

const filters = ["All", "Stars", "Forks", "Trending"] as const;
type Filter = (typeof filters)[number];

export default function MiniAppPage() {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [selectedMarket, setSelectedMarket] = useState<MarketData | null>(null);
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");

        const context = await sdk.context;
        if (context?.user && !cancelled) {
          setUser({
            fid: context.user.fid,
            username: context.user.username ?? "",
            displayName: context.user.displayName ?? "",
            pfpUrl: context.user.pfpUrl ?? "",
          });
        }

        await sdk.actions.ready();
        if (!cancelled) setSdkReady(true);
      } catch {
        if (!cancelled) setSdkReady(true);
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  const didFetch = useRef(false);
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    let cancelled = false;
    fetch("/api/markets")
      .then((res) => res.json())
      .then((data: MarketData[]) => {
        if (!cancelled) setMarkets(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filtered = markets.filter((m) =>
    activeFilter === "All" || m.category.toLowerCase() === activeFilter.toLowerCase()
  );

  const handleShare = useCallback(async (market: MarketData) => {
    try {
      const { sdk } = await import("@farcaster/miniapp-sdk");
      const domain = window.location.origin;
      await sdk.actions.composeCast({
        text: `${market.question}\n\nPredict now on GitBet`,
        embeds: [`${domain}/miniapp`],
      });
    } catch {
      // not in miniapp context
    }
  }, []);

  if (!sdkReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="text-sm text-muted">Loading GitBet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-black font-bold text-sm">
              G
            </div>
            <span className="text-lg font-bold tracking-tight">
              Git<span className="text-accent">Bet</span>
            </span>
          </div>
          {user && (
            <div className="flex items-center gap-2">
              {user.pfpUrl && (
                <Image
                  src={user.pfpUrl}
                  alt={user.displayName}
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full"
                />
              )}
              <span className="text-xs text-muted">@{user.username}</span>
            </div>
          )}
        </div>
      </header>

      {/* Filters */}
      <div className="sticky top-14 z-30 border-b border-border bg-background/90 backdrop-blur-md px-4 py-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activeFilter === f
                  ? "bg-accent text-black"
                  : "bg-card border border-border text-muted"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Markets */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-36 animate-pulse rounded-xl border border-border bg-card" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-sm text-muted">No markets found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((market) => (
              <MiniAppMarketCard
                key={market.id}
                market={market}
                onBet={() => setSelectedMarket(market)}
                onShare={() => handleShare(market)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bet Modal */}
      {selectedMarket && (
        <MiniAppBetModal
          market={selectedMarket}
          user={user}
          onClose={() => setSelectedMarket(null)}
          onBetPlaced={() => {
            setSelectedMarket(null);
          }}
        />
      )}
    </div>
  );
}
