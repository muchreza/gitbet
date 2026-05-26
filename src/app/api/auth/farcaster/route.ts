import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface NeynarUser {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
}

interface NeynarResponse {
  result?: {
    user?: NeynarUser;
  };
  user?: NeynarUser;
  users?: NeynarUser[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");

  if (!fid) {
    return NextResponse.json({ error: "FID required" }, { status: 400 });
  }

  const apiKey = process.env.NEYNAR_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Neynar not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      headers: { accept: "application/json", api_key: apiKey },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch user" }, { status: 400 });
    }

    const data = (await res.json()) as NeynarResponse;
    const user = data.users?.[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      fid: user.fid,
      username: user.username,
      displayName: user.display_name,
      pfpUrl: user.pfp_url,
    });
  } catch {
    return NextResponse.json({ error: "Failed to verify" }, { status: 500 });
  }
}
