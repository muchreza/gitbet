import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Connect Your GitHub",
    description:
      "Sign in with your GitHub account. Your profile, repos, and activity feed your predictor reputation.",
    icon: "🔗",
  },
  {
    number: "02",
    title: "Browse Markets",
    description:
      "Explore prediction markets on popular repos. Will React hit 250k stars? When will the next major release drop?",
    icon: "🔍",
  },
  {
    number: "03",
    title: "Place Your Bets",
    description:
      "Buy YES or NO shares on any market. Prices reflect the crowd's probability estimate.",
    icon: "💰",
  },
  {
    number: "04",
    title: "Win & Climb",
    description:
      "When markets resolve, accurate predictors earn rewards. Climb the leaderboard and build your reputation.",
    icon: "🏆",
  },
];

const faqs = [
  {
    q: "Is this real money?",
    a: "No! GitBet uses virtual points for prediction markets. It's all about bragging rights and proving your open source knowledge.",
  },
  {
    q: "How do markets resolve?",
    a: "Markets resolve automatically using the GitHub API. When the deadline passes, we check the actual GitHub data to determine the outcome.",
  },
  {
    q: "Can I create my own market?",
    a: "Yes! Any user with a reputation score above 100 can propose new markets. The community votes on which markets go live.",
  },
  {
    q: "How is the win rate calculated?",
    a: "Your win rate is the percentage of resolved bets where your prediction was correct. Only resolved markets count.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          How <span className="text-accent">GitBet</span> Works
        </h1>
        <p className="mt-3 text-sm text-muted sm:text-base">
          Predict the future of open source in four simple steps
        </p>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/30 hover:bg-card-hover"
          >
            <div className="text-3xl">{step.icon}</div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs font-bold text-accent">
                {step.number}
              </span>
              <h3 className="text-sm font-semibold text-foreground">
                {step.title}
              </h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-20">
        <h2 className="text-center text-2xl font-bold tracking-tight">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto mt-10 max-w-2xl space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-xl border border-border bg-card p-5"
            >
              <h3 className="text-sm font-semibold text-foreground">
                {faq.q}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/markets"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-sm font-bold text-black transition-colors hover:bg-accent-dim"
        >
          Start Predicting Now
        </Link>
      </div>
    </div>
  );
}
