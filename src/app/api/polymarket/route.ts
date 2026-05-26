import { NextResponse } from "next/server";
import { getPolymarketTrending } from "@/lib/polymarket";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const markets = await getPolymarketTrending(20);
    return NextResponse.json(markets);
  } catch {
    return NextResponse.json([]);
  }
}
