import { stats } from "@/lib/mock-data";

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
}

export function StatsBar() {
  return (
    <div className="border-b border-border bg-card/50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 overflow-x-auto text-center">
          <Stat label="Active Markets" value={formatNumber(stats.totalMarkets)} />
          <Stat label="Total Volume" value={`$${formatNumber(stats.totalVolume)}`} />
          <Stat label="Users" value={formatNumber(stats.totalUsers)} />
          <Stat label="Active Bets" value={formatNumber(stats.activeBets)} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="shrink-0">
      <p className="text-sm font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
