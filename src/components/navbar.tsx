"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (pathname?.startsWith("/miniapp")) return null;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-black font-bold text-sm">
            G
          </div>
          <span className="text-xl font-bold tracking-tight">
            Git<span className="text-accent">Bet</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/markets"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            Markets
          </Link>
          <Link
            href="/leaderboard"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            Leaderboard
          </Link>
          <Link
            href="/how-it-works"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            How It Works
          </Link>
          {status === "loading" ? (
            <div className="h-9 w-32 animate-pulse rounded-lg bg-border" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-accent font-semibold">
                {session.user.balance?.toLocaleString() ?? 0} pts
              </span>
              <div className="flex items-center gap-2">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                    {session.user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <span className="text-sm font-medium text-foreground">
                  {session.user.name}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:text-foreground hover:border-foreground"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => signIn("github")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-black transition-colors hover:bg-accent-dim"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </button>
              <button
                onClick={() => signIn("twitter")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-2 text-sm font-semibold text-background transition-colors hover:bg-foreground/80"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X
              </button>
              <button
                onClick={() => {
                  const fid = prompt("Enter your Farcaster FID:");
                  if (!fid) return;
                  fetch(`/api/auth/farcaster?fid=${fid}`)
                    .then((r) => r.json())
                    .then((data: { fid?: number; username?: string; displayName?: string; pfpUrl?: string; error?: string }) => {
                      if (data.error || !data.fid) {
                        alert("Farcaster user not found. Check your FID.");
                        return;
                      }
                      signIn("credentials", {
                        fid: String(data.fid),
                        username: data.username,
                        displayName: data.displayName,
                        pfpUrl: data.pfpUrl || "",
                      });
                    })
                    .catch(() => alert("Failed to connect Farcaster"));
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-500"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                Farcaster
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            {mobileOpen ? (
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            ) : (
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-3 pt-3">
            <Link
              href="/markets"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Markets
            </Link>
            <Link
              href="/leaderboard"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              Leaderboard
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              How It Works
            </Link>
            {session ? (
              <>
                <div className="flex items-center gap-2 pt-2">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                      {session.user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {session.user.name}
                  </span>
                  <span className="text-xs text-accent font-semibold">
                    {session.user.balance?.toLocaleString() ?? 0} pts
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="mt-1 rounded-lg border border-border px-4 py-2 text-sm text-muted transition-colors hover:text-foreground"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={() => signIn("github")}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-accent-dim"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Connect GitHub
                </button>
                <button
                  onClick={() => signIn("twitter")}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-foreground/80"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Connect X
                </button>
                <button
                  onClick={() => {
                    const fid = prompt("Enter your Farcaster FID:");
                    if (!fid) return;
                    fetch(`/api/auth/farcaster?fid=${fid}`)
                      .then((r) => r.json())
                      .then((data: { fid?: number; username?: string; displayName?: string; pfpUrl?: string; error?: string }) => {
                        if (data.error || !data.fid) {
                          alert("Farcaster user not found. Check your FID.");
                          return;
                        }
                        signIn("credentials", {
                          fid: String(data.fid),
                          username: data.username,
                          displayName: data.displayName,
                          pfpUrl: data.pfpUrl || "",
                        });
                      })
                      .catch(() => alert("Failed to connect Farcaster"));
                  }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-500"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                  Connect Farcaster
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
