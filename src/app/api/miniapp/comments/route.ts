import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface CommentRow {
  id: string;
  market_id: string;
  username: string;
  avatar_url: string | null;
  content: string;
  created_at: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const marketId = searchParams.get("marketId");

  if (!marketId) {
    return NextResponse.json({ error: "Missing marketId" }, { status: 400 });
  }

  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("comments")
    .select("id, market_id, username, avatar_url, content, created_at")
    .eq("market_id", marketId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json([]);
  }

  return NextResponse.json((data || []) as CommentRow[]);
}

interface PostBody {
  marketId?: string;
  fid?: number;
  username?: string;
  avatarUrl?: string;
  content?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as PostBody;
  const { marketId, fid, username, content, avatarUrl } = body;

  if (!marketId || !fid || !username || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (content.length > 280) {
    return NextResponse.json({ error: "Comment too long (max 280)" }, { status: 400 });
  }

  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("comments")
    .insert({
      market_id: marketId,
      fid,
      username,
      avatar_url: avatarUrl || null,
      content: content.trim(),
    })
    .select("id, market_id, username, avatar_url, content, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }

  return NextResponse.json(data as CommentRow);
}
