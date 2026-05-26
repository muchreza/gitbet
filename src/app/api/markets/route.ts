import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { getCoinPrices } from "@/lib/coingecko";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface MarketRow {
  id: string;
  question: string;
  description: string | null;
  coin_id: string;
  coin_symbol: string;
  coin_name: string;
  coin_image: string | null;
  target_price: number;
  category: string;
  end_date: string;
  resolved: boolean;
  outcome: boolean | null;
  chain_market_id: number | null;
  created_at: string;
}

interface BetRow {
  position: boolean;
  amount: number;
}

export async function GET(request: Request) {
  try {
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

    const coinIds = [...new Set(markets.map((m) => m.coin_id))];
    const prices = await getCoinPrices(coinIds);
    const priceMap = new Map(prices.map((p) => [p.id, p]));

    const enriched = await Promise.all(
      markets.map(async (market) => {
        const coinData = priceMap.get(market.coin_id);

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
          id: market.id,
          question: market.question,
          description: market.description,
          coin_id: market.coin_id,
          coin_symbol: market.coin_symbol,
          coin_name: market.coin_name,
          coin_image: coinData?.image || market.coin_image,
          target_price: market.target_price,
          current_price: coinData?.current_price ?? 0,
          price_change_24h: coinData?.price_change_percentage_24h ?? 0,
          category: market.category,
          end_date: market.end_date,
          resolved: market.resolved,
          outcome: market.outcome,
          chain_market_id: market.chain_market_id,
          yesPercent,
          volume,
          hot: volume > 500,
        };
      })
    );

    return NextResponse.json(enriched);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
