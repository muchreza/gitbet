"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { MiniAppMarketCard } from "@/components/miniapp-market-card";
import { MiniAppBetModal } from "@/components/miniapp-bet-modal";

interface MarketData {
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
  category: string;
  end_date: string;
  resolved: boolean;
  outcome: boolean | null;
  chain_market_id: number | null;
  yesPercent: number;
  volume: number;
  hot: boolean;
}

interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface AppUser {
  id: string;
  username: string;
  balance: number;
  isNew: boolean;
  freeTokens: boolean;
  loginStreak?: number;
  streakBonus?: number;
  badges?: Badge[];
  referralCode?: string;
  totalBets?: number;
  totalWins?: number;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  totalBets: number;
  winRate: number;
  profit: number;
  streak: number;
}

const filters = ["All", "BTC", "ETH", "Altcoins"] as const;
type Filter = (typeof filters)[number];
type Tab = "markets" | "leaderboard" | "profile";

const MAJOR_COINS = ["bitcoin", "ethereum"];

export default function MiniAppPage() {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [selectedMarket, setSelectedMarket] = useState<MarketData | null>(null);
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("markets");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [lbLoading, setLbLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");

        const context = await sdk.context;
        if (context?.user && !cancelled) {
          const fcUser: FarcasterUser = {
            fid: context.user.fid,
            username: context.user.username ?? "",
            displayName: context.user.displayName ?? "",
            pfpUrl: context.user.pfpUrl ?? "",
          };
          setUser(fcUser);

          const res = await fetch("/api/miniapp/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fid: fcUser.fid,
              username: fcUser.username,
              displayName: fcUser.displayName,
              pfpUrl: fcUser.pfpUrl,
            }),
          });

          if (res.ok) {
            const data = (await res.json()) as AppUser;
            if (!cancelled) {
              setAppUser(data);
              if (data.isNew && data.freeTokens) {
                setShowWelcome(true);
                setTimeout(() => setShowWelcome(false), 4000);
              } else if (data.streakBonus && data.streakBonus > 0) {
                setShowStreak(true);
                setTimeout(() => setShowStreak(false), 3000);
              }
            }
          }
        }

        await sdk.actions.ready();
        if (!cancelled) setSdkReady(true);
      } catch {
        if (!cancelled) setSdkReady(true);
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  const fetchLeaderboard = useCallback(() => {
    setLbLoading(true);
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data: LeaderboardEntry[]) => setLeaderboard(data))
      .catch(() => {})
      .finally(() => setLbLoading(false));
  }, []);

  const didFetch = useRef(false);
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    let cancelled = false;
    fetch("/api/markets")
      .then((res) => res.json())
      .then((data: MarketData[]) => {
        if (!cancelled) setMarkets(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filtered = markets.filter((m) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "BTC") return m.coin_id === "bitcoin";
    if (activeFilter === "ETH") return m.coin_id === "ethereum";
    if (activeFilter === "Altcoins") return !MAJOR_COINS.includes(m.coin_id);
    return true;
  });

  const handleShare = useCallback(async (market: MarketData) => {
    try {
      const { sdk } = await import("@farcaster/miniapp-sdk");
      const domain = window.location.origin;
      await sdk.actions.composeCast({
        text: `${market.question}\n\nPredict now on CryptoBet`,
        embeds: [`${domain}/miniapp`],
      });
    } catch {
      // not in miniapp context
    }
  }, []);

  const handleBalanceUpdate = useCallback((newBalance: number) => {
    setAppUser((prev) => prev ? { ...prev, balance: newBalance } : prev);
  }, []);

  if (!sdkReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="text-sm text-muted">Loading CryptoBet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Welcome Banner */}
      {showWelcome && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-accent text-black px-4 py-3 text-center animate-in slide-in-from-top duration-300">
          <p className="text-sm font-bold">
            Welcome to CryptoBet! You got 1,000 free tokens to start predicting!
          </p>
        </div>
      )}

      {/* Streak Banner */}
      {showStreak && appUser?.streakBonus && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-yellow-500 text-black px-4 py-3 text-center animate-in slide-in-from-top duration-300">
          <p className="text-sm font-bold">
            🔥 {appUser.loginStreak}-day streak! +{appUser.streakBonus} bonus tokens!
          </p>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-black font-bold text-sm">
              C
            </div>
            <span className="text-lg font-bold tracking-tight">
              Crypto<span className="text-accent">Bet</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {appUser && (
              <div className="flex items-center gap-2">
                {appUser.loginStreak && appUser.loginStreak > 1 && (
                  <div className="flex items-center gap-1 rounded-full bg-orange-500/10 border border-orange-500/20 px-2 py-1">
                    <span className="text-[10px]">🔥</span>
                    <span className="text-[10px] font-bold text-orange-400">{appUser.loginStreak}d</span>
                  </div>
                )}
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-1 rounded-full bg-card border border-border px-2.5 py-1"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
                    <circle cx="12" cy="12" r="10" />
                    <text x="12" y="16" textAnchor="middle" fontSize="12" fill="black" fontWeight="bold">$</text>
                  </svg>
                  <span className="text-xs font-bold text-accent">{appUser.balance.toLocaleString()}</span>
                </button>
              </div>
            )}
            {user && (
              <div className="flex items-center gap-1.5">
                {user.pfpUrl && (
                  <Image
                    src={user.pfpUrl}
                    alt={user.displayName}
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full"
                  />
                )}
                <span className="text-xs text-muted">@{user.username}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Profile Panel */}
      {showProfile && appUser && (
        <div className="border-b border-border bg-card/50 backdrop-blur-sm px-4 py-4 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-foreground">Your Profile</h3>
            <button onClick={() => setShowProfile(false)} className="text-muted text-xs">Close</button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="rounded-lg bg-background border border-border p-2 text-center">
              <p className="text-lg font-bold text-accent">{appUser.balance.toLocaleString()}</p>
              <p className="text-[10px] text-muted">Tokens</p>
            </div>
            <div className="rounded-lg bg-background border border-border p-2 text-center">
              <p className="text-lg font-bold text-foreground">{appUser.totalBets ?? 0}</p>
              <p className="text-[10px] text-muted">Total Bets</p>
            </div>
            <div className="rounded-lg bg-background border border-border p-2 text-center">
              <p className="text-lg font-bold text-foreground">{appUser.loginStreak ?? 0}</p>
              <p className="text-[10px] text-muted">🔥 Streak</p>
            </div>
          </div>

          {/* Badges */}
          {appUser.badges && appUser.badges.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] font-semibold text-muted uppercase mb-1.5">Badges</p>
              <div className="flex flex-wrap gap-1.5">
                {appUser.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-1 rounded-full bg-background border border-border px-2 py-1"
                    title={badge.description}
                  >
                    <span className="text-xs">{badge.icon}</span>
                    <span className="text-[10px] text-muted">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Referral */}
          {appUser.referralCode && (
            <div>
              <p className="text-[10px] font-semibold text-muted uppercase mb-1.5">Invite Friends (+200 pts each)</p>
              <div className="flex gap-2">
                <code className="flex-1 rounded-lg bg-background border border-border px-3 py-2 text-xs text-foreground font-mono truncate">
                  {appUser.referralCode}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(appUser.referralCode || "");
                  }}
                  className="rounded-lg bg-accent px-3 py-2 text-xs font-bold text-black active:bg-accent-dim"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === "markets" && (
        <>
          {/* Filters */}
          <div className="sticky top-14 z-30 border-b border-border bg-background/90 backdrop-blur-md px-4 py-2">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeFilter === f
                      ? "bg-accent text-black"
                      : "bg-card border border-border text-muted"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Markets */}
          <div className="px-4 py-4 pb-20">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-40 animate-pulse rounded-xl border border-border bg-card" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="mt-16 text-center">
                <p className="text-sm text-muted">No markets found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((market) => (
                  <MiniAppMarketCard
                    key={market.id}
                    market={market}
                    onBet={() => setSelectedMarket(market)}
                    onShare={() => handleShare(market)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Leaderboard Tab */}
      {activeTab === "leaderboard" && (
        <div className="px-4 py-4 pb-20">
          <h2 className="text-lg font-bold text-foreground mb-4">🏆 Leaderboard</h2>
          {lbLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl border border-border bg-card" />
              ))}
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="text-4xl mb-2">🏆</p>
              <p className="text-sm text-muted">No rankings yet</p>
              <p className="text-xs text-muted mt-1">Be the first to place a bet!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-3 rounded-xl border p-3 ${
                    entry.rank <= 3
                      ? "border-accent/30 bg-accent/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold text-sm ${
                    entry.rank === 1 ? "bg-yellow-500 text-black" :
                    entry.rank === 2 ? "bg-gray-300 text-black" :
                    entry.rank === 3 ? "bg-orange-400 text-black" :
                    "bg-card border border-border text-muted"
                  }`}>
                    {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : entry.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">@{entry.username}</p>
                    <p className="text-[10px] text-muted">{entry.totalBets} bets · {entry.winRate}% win</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${entry.profit >= 0 ? "text-accent" : "text-danger"}`}>
                      {entry.profit >= 0 ? "+" : ""}{entry.profit.toLocaleString()} pts
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="px-4 py-4 pb-20">
          {appUser ? (
            <>
              {/* Profile Header */}
              <div className="flex items-center gap-3 mb-5">
                {user?.pfpUrl ? (
                  <Image src={user.pfpUrl} alt={user.displayName} width={56} height={56} className="h-14 w-14 rounded-full" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-xl font-bold text-accent">
                    {appUser.username?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <div>
                  <p className="text-lg font-bold text-foreground">@{appUser.username}</p>
                  {appUser.loginStreak && appUser.loginStreak > 0 && (
                    <p className="text-xs text-orange-400">🔥 {appUser.loginStreak}-day streak</p>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="rounded-xl bg-card border border-border p-3 text-center">
                  <p className="text-xl font-bold text-accent">{appUser.balance.toLocaleString()}</p>
                  <p className="text-[10px] text-muted">Tokens</p>
                </div>
                <div className="rounded-xl bg-card border border-border p-3 text-center">
                  <p className="text-xl font-bold text-foreground">{appUser.totalBets ?? 0}</p>
                  <p className="text-[10px] text-muted">Bets</p>
                </div>
                <div className="rounded-xl bg-card border border-border p-3 text-center">
                  <p className="text-xl font-bold text-foreground">{appUser.totalWins ?? 0}</p>
                  <p className="text-[10px] text-muted">Wins</p>
                </div>
              </div>

              {/* Badges */}
              {appUser.badges && appUser.badges.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-sm font-bold text-foreground mb-2">🎖️ Badges</h3>
                  <div className="flex flex-wrap gap-2">
                    {appUser.badges.map((badge) => (
                      <div
                        key={badge.id}
                        className="flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1.5"
                      >
                        <span className="text-sm">{badge.icon}</span>
                        <div>
                          <p className="text-[11px] font-semibold text-foreground">{badge.name}</p>
                          <p className="text-[9px] text-muted">{badge.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Referral */}
              {appUser.referralCode && (
                <div className="mb-5">
                  <h3 className="text-sm font-bold text-foreground mb-2">🎁 Invite Friends</h3>
                  <p className="text-xs text-muted mb-2">Both you and your friend get +200 pts!</p>
                  <div className="flex gap-2">
                    <code className="flex-1 rounded-lg bg-card border border-border px-3 py-2.5 text-xs text-foreground font-mono truncate">
                      {appUser.referralCode}
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(appUser.referralCode || "")}
                      className="rounded-lg bg-accent px-4 py-2.5 text-xs font-bold text-black active:bg-accent-dim"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}

              {/* Daily Rewards Info */}
              <div className="rounded-xl bg-card border border-border p-4">
                <h3 className="text-sm font-bold text-foreground mb-2">📅 Daily Rewards</h3>
                <p className="text-xs text-muted">Login setiap hari untuk dapat bonus token!</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min((appUser.loginStreak ?? 0) * 10, 100)}%` }} />
                  </div>
                  <span className="text-[10px] text-muted">{Math.min((appUser.loginStreak ?? 0) * 10, 100)} pts/day</span>
                </div>
                <p className="text-[10px] text-muted mt-1">Streak bonus: 10 pts × streak days (max 100 pts/day)</p>
              </div>
            </>
          ) : (
            <div className="mt-16 text-center">
              <p className="text-4xl mb-2">👤</p>
              <p className="text-sm text-muted">Open from Warpcast to see your profile</p>
            </div>
          )}
        </div>
      )}

      {/* Bet Modal */}
      {selectedMarket && (
        <MiniAppBetModal
          market={selectedMarket}
          user={user}
          appUser={appUser}
          onClose={() => setSelectedMarket(null)}
          onBetPlaced={handleBalanceUpdate}
        />
      )}
      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-md">
        <div className="flex h-14 items-center justify-around max-w-lg mx-auto">
          <button
            onClick={() => setActiveTab("markets")}
            className={`flex flex-col items-center gap-0.5 px-4 py-1 ${activeTab === "markets" ? "text-accent" : "text-muted"}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 4-6" />
            </svg>
            <span className="text-[10px] font-medium">Markets</span>
          </button>
          <button
            onClick={() => { setActiveTab("leaderboard"); if (leaderboard.length === 0) fetchLeaderboard(); }}
            className={`flex flex-col items-center gap-0.5 px-4 py-1 ${activeTab === "leaderboard" ? "text-accent" : "text-muted"}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 15l-2 5H6l4-4" /><path d="M12 15l2 5h4l-4-4" />
              <circle cx="12" cy="8" r="6" />
              <text x="12" y="11" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">1</text>
            </svg>
            <span className="text-[10px] font-medium">Ranking</span>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center gap-0.5 px-4 py-1 ${activeTab === "profile" ? "text-accent" : "text-muted"}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
            </svg>
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
