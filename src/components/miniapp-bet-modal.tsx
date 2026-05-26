"use client";

import { useState } from "react";
import { createPublicClient, createWalletClient, custom, http, parseEther } from "viem";
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

type BetMode = "token" | "eth";

export function MiniAppBetModal({ market, user, appUser, onClose, onBetPlaced }: MiniAppBetModalProps) {
  const [position, setPosition] = useState<boolean>(true);
  const [amount, setAmount] = useState("");
  const [ethAmount, setEthAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [betMode, setBetMode] = useState<BetMode>("token");
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const hasContract = !!CRYPTOBET_ADDRESS && market.chain_market_id !== null;
  const hasTokenBalance = appUser && appUser.balance > 0;

  async function handleTokenBet() {
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
      const res = await fetch("/api/miniapp/bet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fid: user.fid,
          market_id: market.id,
          position,
          amount: betAmount,
          bet_type: "token",
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

  async function handleEthBet() {
    if (!user) {
      setError("Open CryptoBet from Warpcast to place bets");
      return;
    }

    if (!hasContract) {
      setError("On-chain betting not available for this market");
      return;
    }

    const ethVal = parseFloat(ethAmount);
    if (!ethVal || ethVal <= 0) {
      setError("Enter a valid ETH amount");
      return;
    }

    if (ethVal < 0.0001) {
      setError("Minimum bet is 0.0001 ETH");
      return;
    }

    setLoading(true);
    setTxStatus("Requesting wallet approval...");

    try {
      const { sdk } = await import("@farcaster/miniapp-sdk");

      const provider = sdk.wallet.ethProvider;
      if (!provider) {
        setError("Wallet not available. Make sure you're using Warpcast.");
        return;
      }

      const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[];
      if (!accounts || accounts.length === 0) {
        setError("No wallet account found");
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

      setTxStatus("Confirm transaction in your wallet...");

      const hash = await walletClient.writeContract({
        address: CRYPTOBET_ADDRESS as `0x${string}`,
        abi: CRYPTOBET_ABI,
        functionName: "placeBet",
        args: [BigInt(market.chain_market_id as number), position],
        value: parseEther(ethAmount),
        account: accounts[0] as `0x${string}`,
      });

      setTxStatus("Waiting for confirmation...");

      await publicClient.waitForTransactionReceipt({ hash });

      // Record bet in database
      await fetch("/api/miniapp/bet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fid: user.fid,
          market_id: market.id,
          position,
          amount: ethVal,
          tx_hash: hash,
          bet_type: "eth",
        }),
      });

      setSuccess(true);
      setTxStatus(null);
      setTimeout(() => onBetPlaced(appUser?.balance ?? 0), 1200);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (betMode === "eth") {
      await handleEthBet();
    } else {
      await handleTokenBet();
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
              {betMode === "eth" ? `${ethAmount} ETH` : `${amount} pts`} on {position ? "YES" : "NO"}
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

            {/* Bet mode toggle */}
            {hasContract && (
              <div className="mt-3 flex rounded-lg bg-card border border-border p-0.5">
                <button
                  type="button"
                  onClick={() => setBetMode("token")}
                  disabled={!hasTokenBalance}
                  className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
                    betMode === "token"
                      ? "bg-accent text-black"
                      : "text-muted"
                  } disabled:opacity-30`}
                >
                  Free Tokens
                </button>
                <button
                  type="button"
                  onClick={() => setBetMode("eth")}
                  className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
                    betMode === "eth"
                      ? "bg-accent text-black"
                      : "text-muted"
                  }`}
                >
                  ETH (Base)
                </button>
              </div>
            )}

            {betMode === "token" && appUser && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                <span>Balance:</span>
                <span className="font-bold text-accent">{appUser.balance.toLocaleString()} pts</span>
              </div>
            )}

            {betMode === "eth" && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
                  <path d="M12 1.75l-6.25 10.5L12 16l6.25-3.75L12 1.75zM12 17.25l-6.25-3.75L12 22.25l6.25-8.75L12 17.25z"/>
                </svg>
                <span>Pay with ETH on Base chain (gas fee ~$0.001)</span>
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
                {betMode === "token" ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <input
                      type="number"
                      value={ethAmount}
                      onChange={(e) => setEthAmount(e.target.value)}
                      placeholder="Amount (ETH)"
                      step="0.0001"
                      min="0.0001"
                      className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <div className="mt-2 flex gap-2">
                      {[0.001, 0.005, 0.01, 0.05].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setEthAmount(String(v))}
                          className="flex-1 rounded-lg bg-card border border-border py-1.5 text-xs text-muted active:bg-card-hover"
                        >
                          {v} ETH
                        </button>
                      ))}
                    </div>
                  </>
                )}
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
                disabled={loading || (betMode === "token" ? !amount : !ethAmount) || !appUser}
                className="w-full rounded-xl bg-accent py-3.5 text-sm font-bold text-black transition-colors active:bg-accent-dim disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : betMode === "eth"
                    ? `Bet ${ethAmount || "0"} ETH on ${position ? "YES" : "NO"}`
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
