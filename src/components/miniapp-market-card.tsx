"use client";

interface MiniAppMarketCardProps {
  market: {
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
    yesPercent: number;
    volume: number;
    hot: boolean;
    end_date: string;
  };
  onBet: () => void;
  onShare: () => void;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
}

function formatPrice(price: number): string {
  if (price >= 1000) return "$" + price.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (price >= 1) return "$" + price.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (price >= 0.01) return "$" + price.toFixed(4);
  return "$" + price.toFixed(6);
}

function timeLeft(endDate: string): string {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h left`;
}

export function MiniAppMarketCard({ market, onBet, onShare }: MiniAppMarketCardProps) {
  const noPercent = 100 - market.yesPercent;
  const priceUp = market.price_change_24h >= 0;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {market.coin_image ? (
            <img
              src={market.coin_image}
              alt={market.coin_name}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full shrink-0"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-border text-xs font-bold text-foreground uppercase">
              {market.coin_symbol.slice(0, 2)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">
              {market.coin_name}
              <span className="ml-1 text-muted uppercase">{market.coin_symbol}</span>
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] font-medium text-foreground">
                {formatPrice(market.current_price)}
              </span>
              <span className={`text-[10px] font-medium ${priceUp ? "text-accent" : "text-danger"}`}>
                {priceUp ? "+" : ""}{market.price_change_24h.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {market.hot && (
            <span className="rounded-full bg-danger/10 px-1.5 py-0.5 text-[10px] font-medium text-danger">
              HOT
            </span>
          )}
          <span className="text-[10px] text-muted">{timeLeft(market.end_date)}</span>
        </div>
      </div>

      <h3 className="mt-2.5 text-sm font-semibold leading-snug text-foreground">
        {market.question}
      </h3>

      <div className="mt-1 text-[11px] text-muted">
        Target: {formatPrice(market.target_price)}
      </div>

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
          Vol: {formatNumber(market.volume)}
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
