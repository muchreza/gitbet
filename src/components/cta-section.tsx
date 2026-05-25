import Link from "next/link";

export function CtaSection() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 via-card to-card p-10 text-center sm:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--accent-glow)_0%,_transparent_70%)] opacity-50" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to make your{" "}
              <span className="text-accent">predictions</span>?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted sm:text-base">
              Join thousands of developers betting on the future of open source.
              Connect your GitHub and start predicting today.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/markets"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-sm font-bold text-black transition-colors hover:bg-accent-dim"
              >
                Start Predicting
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-border px-8 text-sm font-medium text-foreground transition-colors hover:bg-card-hover"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
