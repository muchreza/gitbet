export interface Market {
  id: string;
  repo: string;
  owner: string;
  question: string;
  description: string;
  yesPercent: number;
  volume: number;
  endDate: string;
  category: "stars" | "forks" | "releases" | "trending";
  stars: number;
  forks: number;
  language: string;
  languageColor: string;
  hot: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  totalBets: number;
  winRate: number;
  profit: number;
  streak: number;
}

export const markets: Market[] = [
  {
    id: "1",
    repo: "next.js",
    owner: "vercel",
    question: "Will next.js reach 140k stars by end of 2026?",
    description: "Currently at 132k stars, growing steadily. Will it hit 140k?",
    yesPercent: 72,
    volume: 24500,
    endDate: "2026-12-31",
    category: "stars",
    stars: 132000,
    forks: 28400,
    language: "TypeScript",
    languageColor: "#3178c6",
    hot: true,
  },
  {
    id: "2",
    repo: "react",
    owner: "facebook",
    question: "Will React release v20 before July 2026?",
    description: "React 19 was a major release. When will v20 land?",
    yesPercent: 35,
    volume: 18200,
    endDate: "2026-07-01",
    category: "releases",
    stars: 234000,
    forks: 47800,
    language: "JavaScript",
    languageColor: "#f1e05a",
    hot: true,
  },
  {
    id: "3",
    repo: "bun",
    owner: "oven-sh",
    question: "Will Bun overtake Deno in GitHub stars?",
    description: "Bun is growing fast. Can it surpass Deno's star count?",
    yesPercent: 68,
    volume: 15800,
    endDate: "2026-06-30",
    category: "stars",
    stars: 76000,
    forks: 2100,
    language: "Zig",
    languageColor: "#ec915c",
    hot: false,
  },
  {
    id: "4",
    repo: "rust",
    owner: "rust-lang",
    question: "Will Rust reach 105k stars by Q3 2026?",
    description: "Rust continues to gain popularity. Star growth prediction.",
    yesPercent: 81,
    volume: 12400,
    endDate: "2026-09-30",
    category: "stars",
    stars: 101000,
    forks: 13200,
    language: "Rust",
    languageColor: "#dea584",
    hot: false,
  },
  {
    id: "5",
    repo: "svelte",
    owner: "sveltejs",
    question: "Will Svelte 6 be announced in 2026?",
    description: "After the Svelte 5 runes revolution, what's next?",
    yesPercent: 45,
    volume: 9800,
    endDate: "2026-12-31",
    category: "releases",
    stars: 82000,
    forks: 4300,
    language: "JavaScript",
    languageColor: "#f1e05a",
    hot: false,
  },
  {
    id: "6",
    repo: "devin",
    owner: "cognition-labs",
    question: "Will AI coding agents trend #1 on GitHub in 2026?",
    description: "AI coding agents are exploding. Will they dominate GitHub trending?",
    yesPercent: 89,
    volume: 31200,
    endDate: "2026-12-31",
    category: "trending",
    stars: 45000,
    forks: 3200,
    language: "Python",
    languageColor: "#3572A5",
    hot: true,
  },
  {
    id: "7",
    repo: "tailwindcss",
    owner: "tailwindlabs",
    question: "Will Tailwind CSS v4 reach 90k stars?",
    description: "Tailwind v4 dropped with huge changes. Will stars follow?",
    yesPercent: 58,
    volume: 8900,
    endDate: "2026-12-31",
    category: "stars",
    stars: 86000,
    forks: 4300,
    language: "TypeScript",
    languageColor: "#3178c6",
    hot: false,
  },
  {
    id: "8",
    repo: "ollama",
    owner: "ollama",
    question: "Will Ollama surpass 120k stars by mid-2026?",
    description: "Local LLMs are booming. Ollama is leading the charge.",
    yesPercent: 76,
    volume: 21600,
    endDate: "2026-06-30",
    category: "stars",
    stars: 112000,
    forks: 8500,
    language: "Go",
    languageColor: "#00ADD8",
    hot: true,
  },
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, username: "stargazer_dev", avatar: "S", totalBets: 342, winRate: 78.4, profit: 12450, streak: 14 },
  { rank: 2, username: "repo_oracle", avatar: "R", totalBets: 289, winRate: 74.2, profit: 9800, streak: 8 },
  { rank: 3, username: "git_whale", avatar: "G", totalBets: 456, winRate: 71.8, profit: 8920, streak: 5 },
  { rank: 4, username: "fork_master", avatar: "F", totalBets: 198, winRate: 69.5, profit: 7340, streak: 11 },
  { rank: 5, username: "merge_prophet", avatar: "M", totalBets: 321, winRate: 67.2, profit: 6210, streak: 3 },
  { rank: 6, username: "commit_king", avatar: "C", totalBets: 267, winRate: 65.8, profit: 5890, streak: 7 },
  { rank: 7, username: "pr_predictor", avatar: "P", totalBets: 412, winRate: 63.1, profit: 4670, streak: 2 },
  { rank: 8, username: "branch_boss", avatar: "B", totalBets: 178, winRate: 61.9, profit: 3980, streak: 6 },
  { rank: 9, username: "diff_dealer", avatar: "D", totalBets: 345, winRate: 59.4, profit: 3210, streak: 4 },
  { rank: 10, username: "push_prophet", avatar: "P", totalBets: 234, winRate: 57.8, profit: 2560, streak: 1 },
];

export const stats = {
  totalMarkets: 1247,
  totalVolume: 2340000,
  totalUsers: 18500,
  activeBets: 5620,
};
