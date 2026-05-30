// EtherealMages contract configuration
// Deploy the contract from contracts/EtherealMages.sol and update the address below

export const ETHEREAL_MAGES_ADDRESS = "0x0000000000000000000000000000000000000000"; // TODO: Update after deployment

export const ETHEREAL_MAGES_ABI = [
  {
    inputs: [{ name: "baseURI", type: "string" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  // Read functions
  {
    inputs: [],
    name: "MAX_SUPPLY",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "FREE_SUPPLY",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PAID_PRICE",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_PER_TX",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalMinted",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mintActive",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isFreePhase",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mintPrice",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "remainingFree",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Write functions
  {
    inputs: [{ name: "quantity", type: "uint256" }],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
] as const;

export const COLLECTION_INFO = {
  name: "Ethereal Mages",
  symbol: "EMAGE",
  maxSupply: 10000,
  freeSupply: 8888,
  paidPrice: "0.0001",
  maxPerTx: 10,
  chain: "Ethereum",
  chainId: 1,
} as const;
