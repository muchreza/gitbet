import { leaderboard } from "@/lib/mock-data";

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="mt-1 text-sm text-muted">
          Top predictors ranked by profit and accuracy
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted">
                  Predictor
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted">
                  Total Bets
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted">
                  Win Rate
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted">
                  Profit
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted">
                  Streak
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr
                  key={entry.rank}
                  className="border-b border-border transition-colors hover:bg-card-hover"
                >
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        entry.rank === 1
                          ? "bg-warning/20 text-warning"
                          : entry.rank === 2
                            ? "bg-foreground/10 text-foreground"
                            : entry.rank === 3
                              ? "bg-orange-500/20 text-orange-400"
                              : "bg-border text-muted"
                      }`}
                    >
                      {entry.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                        {entry.avatar}
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {entry.username}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-muted">
                    {entry.totalBets}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`text-sm font-medium ${
                        entry.winRate >= 70
                          ? "text-accent"
                          : entry.winRate >= 60
                            ? "text-warning"
                            : "text-muted"
                      }`}
                    >
                      {entry.winRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-accent">
                    +${entry.profit.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 text-sm text-warning">
                      🔥 {entry.streak}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
