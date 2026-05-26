import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { fetchRepoData } from "@/lib/github";

interface MarketRow {
  id: string;
  repo: string;
  owner: string;
  question: string;
  description: string | null;
  category: string;
  end_date: string;
  resolved: boolean;
  outcome: boolean | null;
  target_value: number | null;
  language: string | null;
  language_color: string | null;
  created_by: string | null;
  created_at: string;
}

interface BetRow {
  position: boolean;
  amount: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const supabase = getServiceClient();

  let query = supabase
    .from("markets")
    .select("*")
    .order("created_at", { ascending: false });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data: marketsData, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const markets = (marketsData || []) as MarketRow[];

  const enriched = await Promise.all(
    markets.map(async (market) => {
      const repoData = await fetchRepoData(market.owner, market.repo);

      const { data: betsData } = await supabase
        .from("bets")
        .select("position, amount")
        .eq("market_id", market.id);

      const bets = (betsData || []) as BetRow[];

      let yesTotal = 0;
      let noTotal = 0;
      let volume = 0;

      for (const bet of bets) {
        volume += bet.amount;
        if (bet.position) {
          yesTotal += bet.amount;
        } else {
          noTotal += bet.amount;
        }
      }

      const totalBets = yesTotal + noTotal;
      const yesPercent = totalBets > 0 ? Math.round((yesTotal / totalBets) * 100) : 50;

      return {
        ...market,
        stars: repoData?.stargazers_count ?? 0,
        forks: repoData?.forks_count ?? 0,
        yesPercent,
        volume,
        hot: volume > 500,
      };
    })
  );

  return NextResponse.json(enriched);
}
