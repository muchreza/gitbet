import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-black font-bold text-sm">
                G
              </div>
              <span className="text-xl font-bold tracking-tight">
                Git<span className="text-accent">Bet</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted">
              The prediction market for open source. Bet on the future of GitHub repos.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Platform</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/markets" className="text-sm text-muted hover:text-foreground transition-colors">
                  Markets
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-sm text-muted hover:text-foreground transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm text-muted hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-foreground transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">
                  API Docs
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Connect</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                  id="twitter-link"
                >
                  X (Twitter)
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} GitBet. All rights reserved.
          </p>
          <p className="text-xs text-muted">
            Built with Next.js &middot; Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
