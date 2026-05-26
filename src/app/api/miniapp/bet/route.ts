import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface BetBody {
  fid?: number;
  market_id?: string;
  position?: boolean;
  amount?: number;
  tx_hash?: string;
  bet_type?: "token" | "eth";
}

interface UserRow {
  id: string;
  balance: number;
}

interface MarketRow {
  id: string;
  resolved: boolean;
  end_date: string;
}

interface BetRow {
  id: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as BetBody;
  const { fid, market_id, position, amount, tx_hash, bet_type = "token" } = body;

  if (!fid) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!market_id || position === undefined || !amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid bet parameters" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const farcasterKey = `fc_${fid}`;

  const { data: userData } = await supabase
    .from("users")
    .select("id, balance")
    .eq("github_id", farcasterKey)
    .single();

  const user = userData as UserRow | null;

  if (!user) {
    return NextResponse.json({ error: "User not found. Please sign in first." }, { status: 404 });
  }

  // For token bets, check balance
  if (bet_type === "token" && user.balance < amount) {
    return NextResponse.json(
      { error: `Insufficient balance. You have ${user.balance} pts.` },
      { status: 400 },
    );
  }

  // For ETH bets, require tx_hash
  if (bet_type === "eth" && !tx_hash) {
    return NextResponse.json({ error: "Transaction hash required for ETH bets" }, { status: 400 });
  }

  const { data: marketData } = await supabase
    .from("markets")
    .select("id, resolved, end_date")
    .eq("id", market_id)
    .single();

  const market = marketData as MarketRow | null;

  if (!market) {
    return NextResponse.json({ error: "Market not found" }, { status: 404 });
  }

  if (market.resolved) {
    return NextResponse.json({ error: "Market already resolved" }, { status: 400 });
  }

  if (new Date(market.end_date) < new Date()) {
    return NextResponse.json({ error: "Market has ended" }, { status: 400 });
  }

  const { data: existingBetData } = await supabase
    .from("bets")
    .select("id")
    .eq("user_id", user.id)
    .eq("market_id", market_id)
    .single();

  const existingBet = existingBetData as BetRow | null;

  if (existingBet) {
    return NextResponse.json({ error: "You already bet on this market" }, { status: 400 });
  }

  const { error: betError } = await supabase.from("bets").insert({
    user_id: user.id,
    market_id,
    position,
    amount,
    tx_hash: tx_hash || null,
  });

  if (betError) {
    return NextResponse.json({ error: betError.message }, { status: 500 });
  }

  let newBalance = user.balance;
  if (bet_type === "token") {
    newBalance = user.balance - amount;
    await supabase
      .from("users")
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq("id", user.id);
  }

  return NextResponse.json({ success: true, newBalance });
}
