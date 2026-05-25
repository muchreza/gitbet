import Link from "next/link";
import type { Market } from "@/lib/mock-data";

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
}

export function MarketCard({ market }: { market: Market }) {
  const noPercent = 100 - market.yesPercent;

  return (
    <Link
      href={`/markets#${market.id}`}
      className="group block rounded-xl border border-border bg-card p-5 transition-all hover:border-accent/30 hover:bg-card-hover hover:shadow-lg hover:shadow-accent-glow/5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-border text-sm font-bold text-foreground">
            {market.owner[0].toUpperCase()}
          </div>
          <div>
            <p className="text-xs text-muted">
              {market.owner}/{market.repo}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: market.languageColor }}
              />
              <span className="text-xs text-muted">{market.language}</span>
              <span className="text-xs text-muted">
                ★ {formatNumber(market.stars)}
              </span>
            </div>
          </div>
        </div>
        {market.hot && (
          <span className="shrink-0 rounded-full bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger">
            HOT
          </span>
        )}
      </div>

      <h3 className="mt-3 text-sm font-semibold leading-snug text-foreground group-hover:text-accent transition-colors">
        {market.question}
      </h3>
      <p className="mt-1 text-xs text-muted line-clamp-2">
        {market.description}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${market.yesPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-accent">
            YES {market.yesPercent}%
          </span>
          <span className="text-xs font-semibold text-danger">
            NO {noPercent}%
          </span>
        </div>
        <span className="text-xs text-muted">
          Vol: ${formatNumber(market.volume)}
        </span>
      </div>
    </Link>
  );
}
