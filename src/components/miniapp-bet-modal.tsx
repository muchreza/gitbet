"use client";

import { useState } from "react";

interface MiniAppBetModalProps {
  market: {
    id: string;
    question: string;
    yesPercent: number;
  };
  user: { fid: number; username: string } | null;
  appUser: { id: string; balance: number } | null;
  onClose: () => void;
  onBetPlaced: (newBalance: number) => void;
}

export function MiniAppBetModal({ market, user, appUser, onClose, onBetPlaced }: MiniAppBetModalProps) {
  const [position, setPosition] = useState<boolean>(true);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!user || !appUser) {
      setError("Open GitBet from Warpcast to place bets");
      return;
    }

    const betAmount = parseInt(amount, 10);
    if (!betAmount || betAmount <= 0) {
      setError("Enter a valid amount");
      return;
    }

    if (betAmount > appUser.balance) {
      setError(`Insufficient balance. You have ${appUser.balance} pts.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/miniapp/bet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fid: user.fid,
          market_id: market.id,
          position,
          amount: betAmount,
        }),
      });

      const data = (await res.json()) as { error?: string; success?: boolean; newBalance?: number };

      if (!res.ok) {
        setError(data.error || "Failed to place bet");
        return;
      }

      setSuccess(true);
      if (data.newBalance !== undefined) {
        setTimeout(() => onBetPlaced(data.newBalance as number), 1200);
      } else {
        setTimeout(() => onBetPlaced(appUser.balance - betAmount), 1200);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-lg rounded-t-2xl border-t border-x border-border bg-background p-5 pb-8 animate-in slide-in-from-bottom duration-300"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />

        {success ? (
          <div className="flex flex-col items-center py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="mt-3 text-lg font-bold text-foreground">Bet Placed!</p>
            <p className="mt-1 text-sm text-muted">
              {amount} pts on {position ? "YES" : "NO"}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <h2 className="text-base font-bold text-foreground">Place Your Bet</h2>
              <button
                onClick={onClose}
                className="text-muted active:text-foreground"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                </svg>
              </button>
            </div>

            <p className="mt-2 text-sm text-muted leading-snug">{market.question}</p>

            {appUser && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                <span>Balance:</span>
                <span className="font-bold text-accent">{appUser.balance.toLocaleString()} pts</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPosition(true)}
                  className={`rounded-xl py-3.5 text-sm font-bold transition-all ${
                    position
                      ? "bg-accent text-black ring-2 ring-accent/50"
                      : "bg-card border border-border text-muted"
                  }`}
                >
                  YES {market.yesPercent}%
                </button>
                <button
                  type="button"
                  onClick={() => setPosition(false)}
                  className={`rounded-xl py-3.5 text-sm font-bold transition-all ${
                    !position
                      ? "bg-danger text-white ring-2 ring-danger/50"
                      : "bg-card border border-border text-muted"
                  }`}
                >
                  NO {100 - market.yesPercent}%
                </button>
              </div>

              <div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount (points)"
                  min="1"
                  max={appUser?.balance}
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <div className="mt-2 flex gap-2">
                  {[10, 50, 100, 250].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAmount(String(v))}
                      disabled={appUser ? v > appUser.balance : false}
                      className="flex-1 rounded-lg bg-card border border-border py-1.5 text-xs text-muted active:bg-card-hover disabled:opacity-30"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-xs text-danger">{error}</p>}

              <button
                type="submit"
                disabled={loading || !amount || !appUser}
                className="w-full rounded-xl bg-accent py-3.5 text-sm font-bold text-black transition-colors active:bg-accent-dim disabled:opacity-50"
              >
                {loading ? "Placing..." : `Bet ${amount || "0"} pts on ${position ? "YES" : "NO"}`}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
