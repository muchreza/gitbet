import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { markets as mockMarkets } from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = getServiceClient();

    const { count: userCount } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    const { data: betsData } = await supabase
      .from("bets")
      .select("amount, position");

    const totalBets = betsData?.length ?? 0;
    let totalVolume = 0;
    let yesBets = 0;

    for (const bet of betsData ?? []) {
      totalVolume += (bet as { amount: number; position: boolean }).amount;
      if ((bet as { position: boolean }).position) yesBets++;
    }

    const totalMarkets = mockMarkets.length;

    return NextResponse.json({
      totalMarkets,
      totalVolume,
      totalUsers: userCount ?? 0,
      totalBets,
      avgAccuracy: totalBets > 0 ? Math.round((yesBets / totalBets) * 100) : 50,
    });
  } catch {
    return NextResponse.json({
      totalMarkets: 8,
      totalVolume: 0,
      totalUsers: 0,
      totalBets: 0,
      avgAccuracy: 50,
    });
  }
}
