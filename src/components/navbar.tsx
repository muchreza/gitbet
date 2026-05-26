"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();

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
            <button
              onClick={() => signIn("github")}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-accent-dim"
            >
              Connect GitHub
            </button>
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
              <button
                onClick={() => signIn("github")}
                className="mt-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-accent-dim"
              >
                Connect GitHub
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
