"use client";

import { useState, useEffect } from "react";
import { markets as mockMarkets } from "@/lib/mock-data";
import { MarketCard } from "./market-card";
import Link from "next/link";

interface ApiMarket {
  id: string;
  repo: string;
  owner: string;
  question: string;
  description: string | null;
  language: string | null;
  language_color: string | null;
  stars: number;
  yesPercent: number;
  volume: number;
  hot: boolean;
}

export function TrendingMarkets() {
  const [markets, setMarkets] = useState<ApiMarket[]>([]);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    fetch("/api/markets")
      .then((res) => {
        if (!res.ok) throw new Error("API unavailable");
        return res.json() as Promise<ApiMarket[]>;
      })
      .then((data) => {
        const hot = data.filter((m) => m.hot);
        setMarkets(hot.length > 0 ? hot : data.slice(0, 4));
      })
      .catch(() => {
        setUseFallback(true);
      });
  }, []);

  const fallbackMarkets = mockMarkets.filter((m) => m.hot).map((m) => ({
    id: m.id,
    repo: m.repo,
    owner: m.owner,
    question: m.question,
    description: m.description,
    language: m.language,
    language_color: m.languageColor,
    stars: m.stars,
    yesPercent: m.yesPercent,
    volume: m.volume,
    hot: m.hot,
  }));

  const displayMarkets = useFallback ? fallbackMarkets : markets;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Trending Markets
          </h2>
          <p className="mt-1 text-sm text-muted">
            The hottest predictions right now
          </p>
        </div>
        <Link
          href="/markets"
          className="text-sm font-medium text-accent hover:text-accent-dim transition-colors"
        >
          View All →
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayMarkets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>
    </section>
  );
}
