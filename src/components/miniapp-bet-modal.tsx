"use client";

import { useState } from "react";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { base } from "viem/chains";
import { CRYPTOBET_ABI, CRYPTOBET_ADDRESS } from "@/lib/contract";

interface MiniAppBetModalProps {
  market: {
    id: string;
    question: string;
    yesPercent: number;
    chain_market_id: number | null;
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
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const chainMarketId = market.chain_market_id ?? (parseInt(market.id, 10) - 1);
  const hasContract = !!CRYPTOBET_ADDRESS && chainMarketId >= 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!user || !appUser) {
      setError("Open CryptoBet from Warpcast to place bets");
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
      let txHash: string | undefined;

      if (hasContract) {
        setTxStatus("Requesting wallet approval...");

        const { sdk } = await import("@farcaster/miniapp-sdk");
        const provider = sdk.wallet.ethProvider;
        if (!provider) {
          setError("Wallet not available. Make sure you're using Warpcast.");
          setLoading(false);
          return;
        }

        const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[];
        if (!accounts || accounts.length === 0) {
          setError("No wallet account found");
          setLoading(false);
          return;
        }

        const walletClient = createWalletClient({
          chain: base,
          transport: custom(provider),
        });

        const publicClient = createPublicClient({
          chain: base,
          transport: http(),
        });

        setTxStatus("Confirm in wallet (gas fee only)...");

        const hash = await walletClient.writeContract({
          address: CRYPTOBET_ADDRESS as `0x${string}`,
          abi: CRYPTOBET_ABI,
          functionName: "placeBet",
          args: [BigInt(chainMarketId), position, BigInt(betAmount)],
          account: accounts[0] as `0x${string}`,
        });

        setTxStatus("Waiting for confirmation...");
        await publicClient.waitForTransactionReceipt({ hash });
        txHash = hash;
        setTxHash(hash);
        setTxStatus(null);
      }

      const res = await fetch("/api/miniapp/bet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fid: user.fid,
          market_id: market.id,
          position,
          amount: betAmount,
          bet_type: "token",
          ...(txHash ? { tx_hash: txHash } : {}),
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
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Transaction failed";
      if (msg.includes("rejected") || msg.includes("denied")) {
        setError("Transaction cancelled");
      } else {
        setError(msg);
      }
      setTxStatus(null);
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
            {txHash && (
              <a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-3 py-1.5 text-xs font-medium text-accent transition-colors active:bg-accent/20"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                View on Basescan
              </a>
            )}
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
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted">
                  <span>Balance:</span>
                  <span className="font-bold text-accent">{appUser.balance.toLocaleString()} pts</span>
                </div>
                {hasContract && (
                  <div className="flex items-center gap-1 text-[10px] text-muted">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
                      <path d="M12 1.75l-6.25 10.5L12 16l6.25-3.75L12 1.75zM12 17.25l-6.25-3.75L12 22.25l6.25-8.75L12 17.25z"/>
                    </svg>
                    <span>On-chain (Base) · gas fee only</span>
                  </div>
                )}
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

              {txStatus && (
                <div className="flex items-center gap-2 rounded-lg bg-card border border-border px-3 py-2">
                  <div className="h-3 w-3 animate-spin rounded-full border border-accent border-t-transparent" />
                  <span className="text-xs text-muted">{txStatus}</span>
                </div>
              )}

              {error && <p className="text-xs text-danger">{error}</p>}

              <button
                type="submit"
                disabled={loading || !amount || !appUser}
                className="w-full rounded-xl bg-accent py-3.5 text-sm font-bold text-black transition-colors active:bg-accent-dim disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : `Bet ${amount || "0"} pts on ${position ? "YES" : "NO"}`
                }
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
