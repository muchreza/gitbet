"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { COLLECTION_INFO } from "@/lib/contract";

// Sample wizard images for the gallery preview (0-19)
const SAMPLE_WIZARDS = Array.from({ length: 20 }, (_, i) => i);

// Rarity color map
const RARITY_COLORS: Record<string, string> = {
  Common: "text-[var(--muted)]",
  Uncommon: "text-[var(--accent)]",
  Rare: "text-[var(--blue)]",
  Epic: "text-[var(--purple)]",
  Legendary: "text-[var(--warning)]",
};

const RARITY_BG: Record<string, string> = {
  Common: "border-[var(--border)]",
  Uncommon: "border-[var(--accent)]/40",
  Rare: "border-[var(--blue)]/40",
  Epic: "border-[var(--purple)]/40",
  Legendary: "border-[var(--warning)]/40",
};

type MintPhase = "free" | "paid";

export default function MintPage() {
  const [quantity, setQuantity] = useState(1);
  const [totalMinted, setTotalMinted] = useState(0);
  const [mintPhase, setMintPhase] = useState<MintPhase>("free");
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Auto-rotate preview
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedPreview((prev) => (prev + 1) % SAMPLE_WIZARDS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const connectWallet = useCallback(async () => {
    setError(null);
    if (typeof window === "undefined") return;

    const eth = (window as unknown as { ethereum?: { request: (args: { method: string }) => Promise<string[]>; on: (event: string, handler: (accounts: string[]) => void) => void } }).ethereum;
    if (!eth) {
      setError("Please install MetaMask or another Web3 wallet");
      return;
    }

    try {
      const accounts = await eth.request({ method: "eth_requestAccounts" });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    } catch {
      setError("Failed to connect wallet");
    }
  }, []);

  const handleMint = useCallback(async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    setIsMinting(true);
    setError(null);
    setMintSuccess(false);

    try {
      // Simulate mint for demo (replace with actual contract call)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setTotalMinted((prev) => prev + quantity);
      setMintSuccess(true);
      if (totalMinted + quantity >= COLLECTION_INFO.freeSupply) {
        setMintPhase("paid");
      }
    } catch {
      setError("Mint failed. Please try again.");
    } finally {
      setIsMinting(false);
    }
  }, [isConnected, connectWallet, quantity, totalMinted]);

  const price =
    mintPhase === "free"
      ? "FREE"
      : `${(quantity * parseFloat(COLLECTION_INFO.paidPrice)).toFixed(4)} ETH`;

  const progress = (totalMinted / COLLECTION_INFO.maxSupply) * 100;
  const freeRemaining = Math.max(0, COLLECTION_INFO.freeSupply - totalMinted);

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="text-[var(--purple)]">Ethereal</span>{" "}
          <span className="text-[var(--blue)]">Mages</span>
        </h1>
        <p className="text-[var(--muted)] text-lg md:text-xl max-w-2xl mx-auto">
          10,000 unique 8x8 pixel mage NFTs on Ethereum.
          <br />
          First {COLLECTION_INFO.freeSupply.toLocaleString()} are{" "}
          <span className="text-[var(--accent)] font-bold">FREE</span> to mint.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Preview Section */}
        <div className="flex flex-col items-center gap-6">
          {/* Main preview */}
          <div className="relative w-64 h-64 border-2 border-[var(--purple)]/30 rounded-xl overflow-hidden bg-[var(--card)] animate-pulse-glow">
            <Image
              src={`/wizards/${SAMPLE_WIZARDS[selectedPreview]}.png`}
              alt={`Ethereal Mage #${SAMPLE_WIZARDS[selectedPreview]}`}
              fill
              className="object-contain"
              style={{ imageRendering: "pixelated" }}
              unoptimized
            />
          </div>
          <p className="text-sm text-[var(--muted)]">
            Ethereal Mage #{SAMPLE_WIZARDS[selectedPreview]}
          </p>

          {/* Mini gallery */}
          <div className="grid grid-cols-10 gap-1">
            {SAMPLE_WIZARDS.map((id) => (
              <button
                key={id}
                onClick={() => setSelectedPreview(id)}
                className={`w-8 h-8 border rounded overflow-hidden transition-all ${
                  selectedPreview === id
                    ? "border-[var(--purple)] scale-110"
                    : "border-[var(--border)] opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={`/wizards/${id}.png`}
                  alt={`#${id}`}
                  width={32}
                  height={32}
                  style={{ imageRendering: "pixelated" }}
                  unoptimized
                />
              </button>
            ))}
          </div>
        </div>

        {/* Mint Section */}
        <div className="flex flex-col gap-6">
          {/* Stats card */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[var(--muted)]">Minted</span>
              <span className="font-mono text-lg">
                {totalMinted.toLocaleString()} /{" "}
                {COLLECTION_INFO.maxSupply.toLocaleString()}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[var(--background)] rounded-full h-3 mb-4">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(progress, 0.5)}%`,
                  background:
                    mintPhase === "free"
                      ? "var(--accent)"
                      : "var(--purple)",
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[var(--muted)]">Phase</span>
                <p
                  className={`font-bold ${
                    mintPhase === "free"
                      ? "text-[var(--accent)]"
                      : "text-[var(--purple)]"
                  }`}
                >
                  {mintPhase === "free" ? "FREE MINT" : "PAID MINT"}
                </p>
              </div>
              <div>
                <span className="text-[var(--muted)]">Free Remaining</span>
                <p className="font-bold">{freeRemaining.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-[var(--muted)]">Price</span>
                <p className="font-bold text-[var(--accent)]">
                  {mintPhase === "free" ? "FREE" : `${COLLECTION_INFO.paidPrice} ETH`}
                </p>
              </div>
              <div>
                <span className="text-[var(--muted)]">Max per TX</span>
                <p className="font-bold">{COLLECTION_INFO.maxPerTx}</p>
              </div>
            </div>
          </div>

          {/* Mint controls */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
            {/* Quantity selector */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-[var(--muted)]">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-[var(--background)] border border-[var(--border)] hover:border-[var(--purple)] transition-colors text-lg font-bold"
                >
                  -
                </button>
                <span className="font-mono text-2xl w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(
                      Math.min(COLLECTION_INFO.maxPerTx, quantity + 1)
                    )
                  }
                  className="w-10 h-10 rounded-lg bg-[var(--background)] border border-[var(--border)] hover:border-[var(--purple)] transition-colors text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total price */}
            <div className="flex justify-between items-center mb-6 p-3 bg-[var(--background)] rounded-lg">
              <span className="text-[var(--muted)]">Total</span>
              <span className="text-xl font-bold text-[var(--accent)]">
                {price}
              </span>
            </div>

            {/* Mint button */}
            <button
              onClick={handleMint}
              disabled={isMinting}
              className={`w-full py-4 rounded-xl text-lg font-bold transition-all ${
                isMinting
                  ? "bg-[var(--border)] cursor-not-allowed text-[var(--muted)]"
                  : "bg-gradient-to-r from-[var(--purple)] to-[var(--blue)] hover:opacity-90 text-white cursor-pointer"
              }`}
            >
              {isMinting
                ? "Minting..."
                : !isConnected
                ? "Connect Wallet"
                : `Mint ${quantity} Mage${quantity > 1 ? "s" : ""}`}
            </button>

            {/* Status messages */}
            {error && (
              <p className="mt-4 text-center text-[var(--danger)] text-sm">
                {error}
              </p>
            )}
            {mintSuccess && (
              <p className="mt-4 text-center text-[var(--accent)] text-sm">
                Successfully minted! Check your wallet.
              </p>
            )}
            {isConnected && account && (
              <p className="mt-4 text-center text-[var(--muted)] text-xs font-mono truncate">
                Connected: {account}
              </p>
            )}
          </div>

          {/* Rarity info */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6">
            <h3 className="font-bold mb-4">Rarity Tiers</h3>
            <div className="space-y-2">
              {Object.entries(RARITY_COLORS).map(([rarity, colorClass]) => (
                <div
                  key={rarity}
                  className={`flex justify-between items-center p-2 border rounded-lg ${RARITY_BG[rarity]}`}
                >
                  <span className={`font-bold ${colorClass}`}>{rarity}</span>
                  <span className="text-sm text-[var(--muted)]">
                    {rarity === "Common" && "~50%"}
                    {rarity === "Uncommon" && "~25%"}
                    {rarity === "Rare" && "~15%"}
                    {rarity === "Epic" && "~7%"}
                    {rarity === "Legendary" && "~3%"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Traits Section */}
      <div className="max-w-6xl mx-auto mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">7 Unique Traits</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {["Background", "Skin", "Hat", "Eyes", "Beard", "Robe", "Staff"].map(
            (trait) => (
              <div
                key={trait}
                className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 text-center"
              >
                <p className="text-[var(--purple)] font-bold text-sm">
                  {trait}
                </p>
                <p className="text-[var(--muted)] text-xs mt-1">
                  10 variants
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Contract info */}
      <div className="max-w-6xl mx-auto mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Contract Details</h2>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 inline-block">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-left">
            <span className="text-[var(--muted)]">Network</span>
            <span>Ethereum Mainnet</span>
            <span className="text-[var(--muted)]">Token Standard</span>
            <span>ERC-721</span>
            <span className="text-[var(--muted)]">Total Supply</span>
            <span>{COLLECTION_INFO.maxSupply.toLocaleString()}</span>
            <span className="text-[var(--muted)]">Free Mint</span>
            <span className="text-[var(--accent)]">
              {COLLECTION_INFO.freeSupply.toLocaleString()} NFTs
            </span>
            <span className="text-[var(--muted)]">Paid Price</span>
            <span>{COLLECTION_INFO.paidPrice} ETH</span>
            <span className="text-[var(--muted)]">Symbol</span>
            <span className="font-mono">{COLLECTION_INFO.symbol}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
