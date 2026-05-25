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
              Open Source
            </span>
          </h1>

          <p className="animate-fade-in mt-4 text-base text-muted sm:text-lg lg:text-xl" style={{ animationDelay: "0.2s" }}>
            Bet on GitHub repos, predict stars, forks, releases, and trends.
            The ultimate prediction market for developers.
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

          <div className="animate-fade-in mt-12 grid grid-cols-3 gap-6 sm:gap-10" style={{ animationDelay: "0.4s" }}>
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
