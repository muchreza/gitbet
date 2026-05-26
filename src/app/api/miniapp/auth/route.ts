import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const INITIAL_BALANCE = 1000;

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
    .select("id, username, name, avatar_url, balance")
    .eq("github_id", farcasterKey)
    .single();

  const existing = existingData as UserRow | null;

  if (existing) {
    await supabase
      .from("users")
      .update({
        username: username || existing.username,
        name: displayName || existing.name,
        avatar_url: pfpUrl || existing.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq("github_id", farcasterKey);

    return NextResponse.json({
      id: existing.id,
      username: existing.username,
      name: existing.name,
      avatar_url: existing.avatar_url,
      balance: existing.balance,
      isNew: false,
    });
  }

  const { data: newUserData, error: insertError } = await supabase
    .from("users")
    .insert({
      github_id: farcasterKey,
      username: username || `fc_user_${fid}`,
      name: displayName || null,
      avatar_url: pfpUrl || null,
      balance: INITIAL_BALANCE,
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
  });
}
