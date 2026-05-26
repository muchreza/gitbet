import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const REFERRAL_BONUS = 200;

interface ReferralBody {
  fid?: number;
  referralCode?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as ReferralBody;
  const { fid, referralCode } = body;

  if (!fid || !referralCode) {
    return NextResponse.json({ error: "Missing fid or referralCode" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const farcasterKey = `fc_${fid}`;

  const { data: userData } = await supabase
    .from("users")
    .select("id, referred_by, balance")
    .eq("github_id", farcasterKey)
    .single();

  const user = userData as { id: string; referred_by: string | null; balance: number } | null;

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.referred_by) {
    return NextResponse.json({ error: "Already used a referral code" }, { status: 400 });
  }

  const { data: referrerData } = await supabase
    .from("users")
    .select("id, balance, referral_code")
    .eq("referral_code", referralCode)
    .single();

  const referrer = referrerData as { id: string; balance: number; referral_code: string } | null;

  if (!referrer) {
    return NextResponse.json({ error: "Invalid referral code" }, { status: 400 });
  }

  if (referrer.id === user.id) {
    return NextResponse.json({ error: "Cannot refer yourself" }, { status: 400 });
  }

  await supabase
    .from("users")
    .update({ referred_by: referralCode, balance: user.balance + REFERRAL_BONUS })
    .eq("id", user.id);

  await supabase
    .from("users")
    .update({ balance: referrer.balance + REFERRAL_BONUS })
    .eq("id", referrer.id);

  return NextResponse.json({
    success: true,
    bonus: REFERRAL_BONUS,
    newBalance: user.balance + REFERRAL_BONUS,
  });
}
