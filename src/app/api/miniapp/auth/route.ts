import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const INITIAL_BALANCE = 1000;
const DAILY_CLAIM_LIMIT = 500;

interface AuthBody {
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

interface UserRow {
  id: string;
  username: string;
  name: string | null;
  avatar_url: string | null;
  balance: number;
  login_streak: number;
  last_login_date: string | null;
  total_bets: number;
  total_wins: number;
  referral_code: string | null;
  referred_by: string | null;
}

interface DailyClaimRow {
  claim_count: number;
}

function getTodayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function POST(request: Request) {
  const body = (await request.json()) as AuthBody;
  const { fid, username, displayName, pfpUrl } = body;

  if (!fid) {
    return NextResponse.json({ error: "Missing fid" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const farcasterKey = `fc_${fid}`;

  const { data: existingData } = await supabase
    .from("users")
    .select("id, username, name, avatar_url, balance, login_streak, last_login_date, total_bets, total_wins, referral_code, referred_by")
    .eq("github_id", farcasterKey)
    .single();

  const existing = existingData as UserRow | null;

  if (existing) {
    const today = getTodayUTC();
    const lastLogin = existing.last_login_date;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    let newStreak = existing.login_streak || 0;
    let streakBonus = 0;

    if (lastLogin !== today) {
      if (lastLogin === yesterday) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
      streakBonus = Math.min(newStreak * 10, 100);
    }

    await supabase
      .from("users")
      .update({
        username: username || existing.username,
        name: displayName || existing.name,
        avatar_url: pfpUrl || existing.avatar_url,
        updated_at: new Date().toISOString(),
        login_streak: newStreak,
        last_login_date: today,
        ...(streakBonus > 0 ? { balance: existing.balance + streakBonus } : {}),
      })
      .eq("github_id", farcasterKey);

    const badges = getBadges(existing.total_bets || 0, existing.total_wins || 0, newStreak);

    return NextResponse.json({
      id: existing.id,
      username: existing.username,
      name: existing.name,
      avatar_url: existing.avatar_url,
      balance: existing.balance + streakBonus,
      isNew: false,
      freeTokens: false,
      loginStreak: newStreak,
      streakBonus,
      badges,
      referralCode: existing.referral_code || farcasterKey,
      totalBets: existing.total_bets || 0,
      totalWins: existing.total_wins || 0,
    });
  }

  // Check daily claim limit
  const today = getTodayUTC();
  let grantFreeTokens = false;

  const { data: claimData } = await supabase
    .from("daily_claims")
    .select("claim_count")
    .eq("claim_date", today)
    .single();

  const claimRow = claimData as DailyClaimRow | null;
  const currentCount = claimRow?.claim_count ?? 0;

  if (currentCount < DAILY_CLAIM_LIMIT) {
    grantFreeTokens = true;

    if (claimRow) {
      await supabase
        .from("daily_claims")
        .update({ claim_count: currentCount + 1 })
        .eq("claim_date", today);
    } else {
      await supabase
        .from("daily_claims")
        .insert({ claim_date: today, claim_count: 1 });
    }
  }

  const referralCode = `ref_${fid}_${Date.now().toString(36)}`;

  const { data: newUserData, error: insertError } = await supabase
    .from("users")
    .insert({
      github_id: farcasterKey,
      username: username || `fc_user_${fid}`,
      name: displayName || null,
      avatar_url: pfpUrl || null,
      balance: grantFreeTokens ? INITIAL_BALANCE : 0,
      login_streak: 1,
      last_login_date: today,
      total_bets: 0,
      total_wins: 0,
      referral_code: referralCode,
    })
    .select("id, username, name, avatar_url, balance")
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const newUser = newUserData as UserRow;

  return NextResponse.json({
    id: newUser.id,
    username: newUser.username,
    name: newUser.name,
    avatar_url: newUser.avatar_url,
    balance: newUser.balance,
    isNew: true,
    freeTokens: grantFreeTokens,
    loginStreak: 1,
    streakBonus: 0,
    badges: [{ id: "newcomer", name: "Newcomer", icon: "🌟", description: "Welcome to CryptoBet!" }],
    referralCode,
    totalBets: 0,
    totalWins: 0,
  });
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

function getBadges(totalBets: number, totalWins: number, streak: number): Badge[] {
  const badges: Badge[] = [];

  badges.push({ id: "newcomer", name: "Newcomer", icon: "🌟", description: "Welcome to CryptoBet!" });

  if (totalBets >= 1) badges.push({ id: "first_bet", name: "First Bet", icon: "🎯", description: "Placed your first bet" });
  if (totalBets >= 10) badges.push({ id: "bettor_10", name: "Regular", icon: "🔥", description: "10 bets placed" });
  if (totalBets >= 50) badges.push({ id: "bettor_50", name: "Pro Bettor", icon: "💎", description: "50 bets placed" });
  if (totalBets >= 100) badges.push({ id: "bettor_100", name: "Legend", icon: "👑", description: "100 bets placed" });

  if (totalWins >= 1) badges.push({ id: "first_win", name: "Winner", icon: "🏆", description: "Won your first bet" });
  if (totalWins >= 10) badges.push({ id: "winner_10", name: "Hot Streak", icon: "⚡", description: "10 wins" });
  if (totalWins >= 50) badges.push({ id: "winner_50", name: "Oracle", icon: "🔮", description: "50 wins" });

  if (streak >= 3) badges.push({ id: "streak_3", name: "3-Day Streak", icon: "📅", description: "3 day login streak" });
  if (streak >= 7) badges.push({ id: "streak_7", name: "Weekly Warrior", icon: "🗓️", description: "7 day login streak" });
  if (streak >= 30) badges.push({ id: "streak_30", name: "Monthly Master", icon: "📆", description: "30 day login streak" });

  return badges;
}
