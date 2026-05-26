export const CRYPTOBET_ADDRESS = (process.env.NEXT_PUBLIC_CRYPTOBET_ADDRESS || "0xa2a05208b8bd7ba6563ddeb09a2f5a251060dfe9") as `0x${string}`;

export const BASE_CHAIN_ID = 8453;
export const BASE_RPC = "https://mainnet.base.org";

export const CRYPTOBET_ABI = [
  {
    type: "function",
    name: "placeBet",
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "position", type: "bool" },
      { name: "tokenAmount", type: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getMarket",
    inputs: [{ name: "marketId", type: "uint256" }],
    outputs: [
      { name: "question", type: "string" },
      { name: "coinId", type: "string" },
      { name: "targetPrice", type: "uint256" },
      { name: "endTime", type: "uint256" },
      { name: "resolved", type: "bool" },
      { name: "outcome", type: "bool" },
      { name: "yesPool", type: "uint256" },
      { name: "noPool", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserBets",
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "user", type: "address" },
    ],
    outputs: [
      { name: "yesBet", type: "uint256" },
      { name: "noBet", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "marketCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "BetPlaced",
    inputs: [
      { name: "marketId", type: "uint256", indexed: true },
      { name: "bettor", type: "address", indexed: true },
      { name: "position", type: "bool", indexed: false },
      { name: "tokenAmount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "MarketResolved",
    inputs: [
      { name: "marketId", type: "uint256", indexed: true },
      { name: "outcome", type: "bool", indexed: false },
    ],
  },
] as const;
