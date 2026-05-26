"use client";

interface MiniAppMarketCardProps {
  market: {
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
  };
  onBet: () => void;
  onShare: () => void;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
}

export function MiniAppMarketCard({ market, onBet, onShare }: MiniAppMarketCardProps) {
  const noPercent = 100 - market.yesPercent;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-border text-xs font-bold text-foreground">
            {market.owner[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted truncate">
              {market.owner}/{market.repo}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {market.language_color && (
                <span
                  className="inline-block h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: market.language_color }}
                />
              )}
              <span className="text-[10px] text-muted">{market.language}</span>
              <span className="text-[10px] text-muted">
                {formatNumber(market.stars)}
              </span>
            </div>
          </div>
        </div>
        {market.hot && (
          <span className="shrink-0 rounded-full bg-danger/10 px-1.5 py-0.5 text-[10px] font-medium text-danger">
            HOT
          </span>
        )}
      </div>

      <h3 className="mt-2.5 text-sm font-semibold leading-snug text-foreground">
        {market.question}
      </h3>

      {/* Progress bar */}
      <div className="mt-3 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${market.yesPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-accent">
            YES {market.yesPercent}%
          </span>
          <span className="text-[11px] font-semibold text-danger">
            NO {noPercent}%
          </span>
        </div>
        <span className="text-[10px] text-muted">
          Vol: ${formatNumber(market.volume)}
        </span>
      </div>

      {/* Action buttons */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={onBet}
          className="flex-1 rounded-lg bg-accent py-2 text-xs font-bold text-black transition-colors active:bg-accent-dim"
        >
          Predict
        </button>
        <button
          onClick={onShare}
          className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted transition-colors active:bg-card-hover"
          aria-label="Share"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        </button>
      </div>
    </div>
  );
}
