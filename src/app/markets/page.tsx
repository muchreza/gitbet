"use client";

import { useState } from "react";
import { markets } from "@/lib/mock-data";
import { MarketCard } from "@/components/market-card";

const filters = ["All", "Stars", "Releases", "Forks", "Trending"] as const;
type Filter = (typeof filters)[number];

export default function MarketsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");

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

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-lg font-medium text-muted">No markets found</p>
          <p className="mt-1 text-sm text-muted">
            Try a different filter or search term
          </p>
        </div>
      )}
    </div>
  );
}
