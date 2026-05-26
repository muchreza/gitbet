import Link from "next/link";

const categories = [
  {
    name: "Bitcoin",
    description: "BTC price predictions",
    icon: "₿",
    count: 423,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    name: "Ethereum",
    description: "ETH price & ecosystem bets",
    icon: "⟠",
    count: 312,
    color: "text-purple",
    bg: "bg-purple/10",
  },
  {
    name: "Altcoins",
    description: "SOL, DOGE, XRP and more",
    icon: "🪙",
    count: 187,
    color: "text-blue",
    bg: "bg-blue/10",
  },
  {
    name: "Trending",
    description: "Hottest crypto predictions",
    icon: "🔥",
    count: 325,
    color: "text-danger",
    bg: "bg-danger/10",
  },
];

export function Categories() {
  return (
    <section className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Market Categories
          </h2>
          <p className="mt-1 text-sm text-muted">
            Find crypto predictions that match your expertise
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href="/markets"
              className="group rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-accent/30 hover:bg-card-hover"
            >
              <div
                className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${cat.bg} text-xl`}
              >
                {cat.icon}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                {cat.name}
              </h3>
              <p className="mt-1 text-xs text-muted">{cat.description}</p>
              <p className={`mt-3 text-xs font-medium ${cat.color}`}>
                {cat.count} markets
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
