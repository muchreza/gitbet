import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--accent-glow)_0%,_transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm text-accent">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Live — 1,247 Active Markets
          </div>

          <h1 className="animate-fade-in mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl" style={{ animationDelay: "0.1s" }}>
            Predict the Future of{" "}
            <span className="bg-gradient-to-r from-accent to-emerald-400 bg-clip-text text-transparent">
              Crypto
            </span>
          </h1>

          <p className="animate-fade-in mt-4 text-base text-muted sm:text-lg lg:text-xl" style={{ animationDelay: "0.2s" }}>
            Bet on BTC, ETH, SOL and more. Predict crypto prices with free tokens or ETH on Base.
            The ultimate crypto prediction market on Farcaster.
          </p>

          <div className="animate-fade-in mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: "0.3s" }}>
            <Link
              href="/markets"
              className="animate-pulse-glow inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-sm font-bold text-black transition-colors hover:bg-accent-dim"
            >
              Explore Markets
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border px-8 text-sm font-medium text-foreground transition-colors hover:bg-card"
            >
              How It Works
            </Link>
          </div>

          <div className="animate-fade-in mt-8 flex items-center justify-center gap-2 text-sm text-muted" style={{ animationDelay: "0.35s" }}>
            <span>Follow us on</span>
            <a
              href="https://x.com/gitbetapp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-foreground transition-colors hover:text-accent"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @cryptobet
            </a>
          </div>

          <div className="animate-fade-in mt-10 grid grid-cols-3 gap-6 sm:gap-10" style={{ animationDelay: "0.4s" }}>
            <QuickStat value="$2.3M" label="Total Volume" />
            <QuickStat value="18.5k" label="Predictors" />
            <QuickStat value="72%" label="Avg Accuracy" />
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold text-foreground sm:text-3xl">{value}</p>
      <p className="text-xs text-muted sm:text-sm">{label}</p>
    </div>
  );
}
