import Link from "next/link";

interface MarketCardProps {
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
  };
  onBet?: () => void;
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

export function MarketCard({ market, onBet }: MarketCardProps) {
  const noPercent = 100 - market.yesPercent;
  const priceUp = market.price_change_24h >= 0;

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {market.coin_image ? (
            <img
              src={market.coin_image}
              alt={market.coin_name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-border text-sm font-bold text-foreground uppercase">
              {market.coin_symbol.slice(0, 2)}
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-foreground">
              {market.coin_name}
              <span className="ml-1 text-muted uppercase">{market.coin_symbol}</span>
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-medium text-foreground">
                {formatPrice(market.current_price)}
              </span>
              <span className={`text-xs font-medium ${priceUp ? "text-accent" : "text-danger"}`}>
                {priceUp ? "+" : ""}{market.price_change_24h.toFixed(1)}%
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
      <p className="mt-1 text-xs text-muted">
        Target: {formatPrice(market.target_price)}
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
          Vol: {formatNumber(market.volume)}
        </span>
      </div>

      {onBet && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBet();
          }}
          className="mt-3 w-full rounded-lg bg-accent/10 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent/20"
        >
          Place Bet
        </button>
      )}
    </>
  );

  if (onBet) {
    return (
      <div className="group block rounded-xl border border-border bg-card p-5 transition-all hover:border-accent/30 hover:bg-card-hover hover:shadow-lg hover:shadow-accent-glow/5">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={`/markets#${market.id}`}
      className="group block rounded-xl border border-border bg-card p-5 transition-all hover:border-accent/30 hover:bg-card-hover hover:shadow-lg hover:shadow-accent-glow/5"
    >
      {content}
    </Link>
  );
}
