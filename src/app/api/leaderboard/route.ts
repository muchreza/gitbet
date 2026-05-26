import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface UserRow {
  id: string;
  username: string;
  avatar_url: string | null;
  balance: number;
}

interface BetRow {
  position: boolean;
  market_id: string;
}

interface MarketRow {
  resolved: boolean;
  outcome: boolean | null;
}

export async function GET() {
  const supabase = getServiceClient();

  const { data: usersData } = await supabase
    .from("users")
    .select("id, username, avatar_url, balance")
    .order("balance", { ascending: false })
    .limit(20);

  const HIDDEN_USERS = ["muchreza"];
  const users = ((usersData || []) as UserRow[]).filter(
    (u) => !HIDDEN_USERS.includes(u.username),
  );

  if (users.length === 0) {
    return NextResponse.json([]);
  }

  const leaderboard = await Promise.all(
    users.map(async (user, index) => {
      const { data: betsData } = await supabase
        .from("bets")
        .select("position, market_id")
        .eq("user_id", user.id);

      const bets = (betsData || []) as BetRow[];
      const totalBets = bets.length;

      let wins = 0;
      for (const bet of bets) {
        const { data: marketData } = await supabase
          .from("markets")
          .select("resolved, outcome")
          .eq("id", bet.market_id)
          .single();

        const market = marketData as MarketRow | null;
        if (market?.resolved && market.outcome === bet.position) {
          wins++;
        }
      }

      const winRate = totalBets > 0 ? Math.round((wins / totalBets) * 100 * 10) / 10 : 0;

      return {
        rank: index + 1,
        username: user.username,
        avatar: user.avatar_url || user.username[0].toUpperCase(),
        totalBets,
        winRate,
        profit: user.balance - 1000,
        streak: 0,
      };
    })
  );

  return NextResponse.json(leaderboard);
}
