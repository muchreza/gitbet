"use client";

interface PolymarketCardProps {
  market: {
    id: string;
    question: string;
    description: string | null;
    image: string | null;
    yesPercent: number;
    volume: number;
    volume24hr: number;
    endDate: string;
  };
  onBet?: () => void;
}

function formatVolume(num: number): string {
  if (num >= 1_000_000) return "$" + (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return "$" + (num / 1_000).toFixed(1) + "k";
  return "$" + num.toString();
}

function timeLeft(endDate: string): string {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h left`;
}

export function PolymarketCard({ market, onBet }: PolymarketCardProps) {
  const noPercent = 100 - market.yesPercent;

  return (
    <div className="group block rounded-xl border border-border bg-card p-5 transition-all hover:border-purple-500/30 hover:bg-card-hover hover:shadow-lg hover:shadow-purple-500/5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {market.image ? (
            <img
              src={market.image}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-sm font-bold text-purple-400">
              P
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[10px] font-medium text-purple-400">
                Polymarket
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-muted">{timeLeft(market.endDate)}</span>
            </div>
          </div>
        </div>
        {market.volume24hr > 10000 && (
          <span className="shrink-0 rounded-full bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger">
            HOT
          </span>
        )}
      </div>

      <h3 className="mt-3 text-sm font-semibold leading-snug text-foreground group-hover:text-purple-400 transition-colors">
        {market.question}
      </h3>

      <div className="mt-4 flex items-center gap-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${market.yesPercent}%` }}
          />
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
          Vol: {formatVolume(market.volume)}
        </span>
      </div>

      {onBet && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBet();
          }}
          className="mt-3 w-full rounded-lg bg-purple-500/10 py-2 text-xs font-semibold text-purple-400 transition-colors hover:bg-purple-500/20"
        >
          Place Bet
        </button>
      )}
    </div>
  );
}
