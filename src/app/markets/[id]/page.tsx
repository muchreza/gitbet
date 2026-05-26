"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";

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

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
}

function formatPrice(price: number): string {
  if (price >= 1000)
    return "$" + price.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (price >= 1)
    return "$" + price.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (price >= 0.01) return "$" + price.toFixed(4);
  return "$" + price.toFixed(6);
}

export default function MarketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [market, setMarket] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/markets")
      .then((res) => (res.ok ? (res.json() as Promise<MarketData[]>) : []))
      .then((data) => {
        if (cancelled) return;
        const found = data.find((m) => m.id === id);
        if (found) setMarket(found);
        else setError(true);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="animate-pulse text-muted">Loading market...</div>
      </div>
    );
  }

  if (error || !market) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Market Not Found</h1>
        <p className="mt-2 text-sm text-muted">
          This market doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/markets"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-accent px-6 text-sm font-bold text-black transition-colors hover:bg-accent-dim"
        >
          Back to Markets
        </Link>
      </div>
    );
  }

  const noPercent = 100 - market.yesPercent;
  const priceUp = market.price_change_24h >= 0;
  const endDate = new Date(market.end_date);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/markets"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors"
      >
        ← Back to Markets
      </Link>

      <div className="mt-6 rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {market.coin_image ? (
              <img
                src={market.coin_image}
                alt={market.coin_name}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-border text-lg font-bold text-foreground uppercase">
                {market.coin_symbol.slice(0, 2)}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-foreground">
                {market.coin_name}
                <span className="ml-1 text-muted uppercase">
                  {market.coin_symbol}
                </span>
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-medium text-foreground">
                  {formatPrice(market.current_price)}
                </span>
                <span
                  className={`text-xs font-medium ${priceUp ? "text-accent" : "text-danger"}`}
                >
                  {priceUp ? "+" : ""}
                  {market.price_change_24h.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          {market.hot && (
            <span className="shrink-0 rounded-full bg-danger/10 px-3 py-1 text-xs font-medium text-danger">
              HOT
            </span>
          )}
        </div>

        <h1 className="mt-6 text-xl font-bold tracking-tight sm:text-2xl">
          {market.question}
        </h1>
        {market.description && (
          <p className="mt-2 text-sm text-muted">{market.description}</p>
        )}

        <div className="mt-8 rounded-lg border border-border bg-background p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-accent">
              YES {market.yesPercent}%
            </span>
            <span className="font-semibold text-danger">NO {noPercent}%</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${market.yesPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-background p-3 text-center">
            <p className="text-lg font-bold text-foreground">
              {formatNumber(market.volume)}
            </p>
            <p className="text-xs text-muted">Volume</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-3 text-center">
            <p className="text-lg font-bold text-foreground">
              {formatPrice(market.current_price)}
            </p>
            <p className="text-xs text-muted">Current Price</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-3 text-center">
            <p className="text-lg font-bold text-foreground">
              {formatPrice(market.target_price)}
            </p>
            <p className="text-xs text-muted">Target Price</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-3 text-center">
            <p className="text-lg font-bold text-foreground">
              {endDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="text-xs text-muted">Ends</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button className="flex-1 rounded-xl bg-accent py-3 text-sm font-bold text-black transition-colors hover:bg-accent-dim">
            Bet YES ({market.yesPercent}%)
          </button>
          <button className="flex-1 rounded-xl border border-danger bg-danger/10 py-3 text-sm font-bold text-danger transition-colors hover:bg-danger/20">
            Bet NO ({noPercent}%)
          </button>
        </div>
      </div>
    </div>
  );
}
