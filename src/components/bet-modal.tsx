"use client";

import { useState } from "react";

interface BetModalProps {
  market: {
    id: string;
    question: string;
    yesPercent: number;
  };
  onClose: () => void;
  onBetPlaced: () => void;
}

export function BetModal({ market, onClose, onBetPlaced }: BetModalProps) {
  const [position, setPosition] = useState<boolean>(true);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const betAmount = parseInt(amount, 10);
    if (!betAmount || betAmount <= 0) {
      setError("Enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/bets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          market_id: market.id,
          position,
          amount: betAmount,
        }),
      });

      const data = (await res.json()) as { error?: string; success?: boolean };

      if (!res.ok) {
        setError(data.error || "Failed to place bet");
        return;
      }

      onBetPlaced();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-border bg-background p-6">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold text-foreground">Place Your Bet</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          </button>
        </div>

        <p className="mt-2 text-sm text-muted">{market.question}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-2">
              Your Prediction
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPosition(true)}
                className={`rounded-lg py-3 text-sm font-bold transition-all ${
                  position
                    ? "bg-accent text-black ring-2 ring-accent/50"
                    : "bg-card border border-border text-muted hover:text-foreground"
                }`}
              >
                YES ({market.yesPercent}%)
              </button>
              <button
                type="button"
                onClick={() => setPosition(false)}
                className={`rounded-lg py-3 text-sm font-bold transition-all ${
                  !position
                    ? "bg-danger text-white ring-2 ring-danger/50"
                    : "bg-card border border-border text-muted hover:text-foreground"
                }`}
              >
                NO ({100 - market.yesPercent}%)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-2">
              Amount (points)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount..."
              min="1"
              className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <div className="mt-2 flex gap-2">
              {[10, 50, 100, 250].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAmount(String(v))}
                  className="rounded-md bg-card border border-border px-2 py-1 text-xs text-muted hover:text-foreground transition-colors"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs text-danger">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !amount}
            className="w-full rounded-lg bg-accent py-3 text-sm font-bold text-black transition-colors hover:bg-accent-dim disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Placing bet..." : `Bet ${amount || "0"} points on ${position ? "YES" : "NO"}`}
          </button>
        </form>
      </div>
    </div>
  );
}
