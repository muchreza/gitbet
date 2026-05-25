import { markets } from "@/lib/mock-data";
import { MarketCard } from "./market-card";
import Link from "next/link";

export function TrendingMarkets() {
  const hotMarkets = markets.filter((m) => m.hot);

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
        {hotMarkets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>
    </section>
  );
}
