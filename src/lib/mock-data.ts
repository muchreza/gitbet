export interface Market {
  id: string;
  question: string;
  description: string;
  coin_id: string;
  coin_symbol: string;
  coin_name: string;
  coin_image: string | null;
  target_price: number;
  current_price: number;
  price_change_24h: number;
  category: "price_above" | "price_below" | "price_change" | "general";
  end_date: string;
  resolved: boolean;
  outcome: boolean | null;
  chain_market_id: number | null;
  yesPercent: number;
  volume: number;
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
    question: "Will BTC be above $110,000 by June 30, 2026?",
    description: "Bitcoin is currently trading near $107k. Can it push past $110k?",
    coin_id: "bitcoin",
    coin_symbol: "btc",
    coin_name: "Bitcoin",
    coin_image: null,
    target_price: 110000,
    current_price: 107000,
    price_change_24h: 2.4,
    category: "price_above",
    end_date: "2026-06-30",
    resolved: false,
    outcome: null,
    chain_market_id: 0,
    yesPercent: 72,
    volume: 24500,
    hot: true,
  },
  {
    id: "2",
    question: "Will ETH hit $4,000 before August 2026?",
    description: "Ethereum has been consolidating. Will the next rally push it to $4k?",
    coin_id: "ethereum",
    coin_symbol: "eth",
    coin_name: "Ethereum",
    coin_image: null,
    target_price: 4000,
    current_price: 2580,
    price_change_24h: -1.2,
    category: "price_above",
    end_date: "2026-08-01",
    resolved: false,
    outcome: null,
    chain_market_id: 1,
    yesPercent: 45,
    volume: 18200,
    hot: true,
  },
  {
    id: "3",
    question: "Will SOL reach $300 by end of 2026?",
    description: "Solana has seen massive growth. Can it hit $300?",
    coin_id: "solana",
    coin_symbol: "sol",
    coin_name: "Solana",
    coin_image: null,
    target_price: 300,
    current_price: 172,
    price_change_24h: 3.8,
    category: "price_above",
    end_date: "2026-12-31",
    resolved: false,
    outcome: null,
    chain_market_id: 2,
    yesPercent: 58,
    volume: 15800,
    hot: false,
  },
  {
    id: "4",
    question: "Will DOGE reach $0.50 this year?",
    description: "Dogecoin has been volatile. Can meme power push it to 50 cents?",
    coin_id: "dogecoin",
    coin_symbol: "doge",
    coin_name: "Dogecoin",
    coin_image: null,
    target_price: 0.5,
    current_price: 0.22,
    price_change_24h: 5.1,
    category: "price_above",
    end_date: "2026-12-31",
    resolved: false,
    outcome: null,
    chain_market_id: 3,
    yesPercent: 35,
    volume: 12400,
    hot: false,
  },
  {
    id: "5",
    question: "Will XRP stay above $2.00 through July 2026?",
    description: "XRP has been holding strong. Will it maintain above $2?",
    coin_id: "ripple",
    coin_symbol: "xrp",
    coin_name: "XRP",
    coin_image: null,
    target_price: 2.0,
    current_price: 2.34,
    price_change_24h: -0.8,
    category: "price_above",
    end_date: "2026-07-31",
    resolved: false,
    outcome: null,
    chain_market_id: 4,
    yesPercent: 62,
    volume: 9800,
    hot: false,
  },
  {
    id: "6",
    question: "Will BNB hit $800 by Q4 2026?",
    description: "Binance Coin has been steadily climbing. $800 target.",
    coin_id: "binancecoin",
    coin_symbol: "bnb",
    coin_name: "BNB",
    coin_image: null,
    target_price: 800,
    current_price: 660,
    price_change_24h: 1.5,
    category: "price_above",
    end_date: "2026-12-31",
    resolved: false,
    outcome: null,
    chain_market_id: 5,
    yesPercent: 55,
    volume: 8900,
    hot: false,
  },
  {
    id: "7",
    question: "Will AVAX reach $50 by September 2026?",
    description: "Avalanche ecosystem growing. Can AVAX hit $50?",
    coin_id: "avalanche-2",
    coin_symbol: "avax",
    coin_name: "Avalanche",
    coin_image: null,
    target_price: 50,
    current_price: 24,
    price_change_24h: 4.2,
    category: "price_above",
    end_date: "2026-09-30",
    resolved: false,
    outcome: null,
    chain_market_id: 6,
    yesPercent: 42,
    volume: 7600,
    hot: false,
  },
  {
    id: "8",
    question: "Will BTC drop below $90,000 in June 2026?",
    description: "Is a major correction coming? Could BTC dip below $90k?",
    coin_id: "bitcoin",
    coin_symbol: "btc",
    coin_name: "Bitcoin",
    coin_image: null,
    target_price: 90000,
    current_price: 107000,
    price_change_24h: 2.4,
    category: "price_below",
    end_date: "2026-06-30",
    resolved: false,
    outcome: null,
    chain_market_id: 7,
    yesPercent: 22,
    volume: 31200,
    hot: true,
  },
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, username: "crypto_whale", avatar: "C", totalBets: 342, winRate: 78.4, profit: 12450, streak: 14 },
  { rank: 2, username: "moon_caller", avatar: "M", totalBets: 289, winRate: 74.2, profit: 9800, streak: 8 },
  { rank: 3, username: "degen_king", avatar: "D", totalBets: 456, winRate: 71.8, profit: 8920, streak: 5 },
  { rank: 4, username: "eth_maxi", avatar: "E", totalBets: 198, winRate: 69.5, profit: 7340, streak: 11 },
  { rank: 5, username: "sol_prophet", avatar: "S", totalBets: 321, winRate: 67.2, profit: 6210, streak: 3 },
  { rank: 6, username: "btc_bishop", avatar: "B", totalBets: 267, winRate: 65.8, profit: 5890, streak: 7 },
  { rank: 7, username: "alt_hunter", avatar: "A", totalBets: 412, winRate: 63.1, profit: 4670, streak: 2 },
  { rank: 8, username: "base_builder", avatar: "B", totalBets: 178, winRate: 61.9, profit: 3980, streak: 6 },
  { rank: 9, username: "chart_reader", avatar: "C", totalBets: 345, winRate: 59.4, profit: 3210, streak: 4 },
  { rank: 10, username: "hodl_master", avatar: "H", totalBets: 234, winRate: 57.8, profit: 2560, streak: 1 },
];

export const stats = {
  totalMarkets: 1247,
  totalVolume: 2340000,
  totalUsers: 18500,
  activeBets: 5620,
};
