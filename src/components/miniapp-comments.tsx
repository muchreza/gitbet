"use client";

import { useState, useEffect, useCallback } from "react";

interface Comment {
  id: string;
  market_id: string;
  username: string;
  avatar_url: string | null;
  content: string;
  created_at: string;
}

interface MiniAppCommentsProps {
  marketId: string;
  user: { fid: number; username: string; pfpUrl: string } | null;
  onClose: () => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

export function MiniAppComments({ marketId, user, onClose }: MiniAppCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  const fetchComments = useCallback(() => {
    fetch(`/api/miniapp/comments?marketId=${marketId}`)
      .then((r) => r.json())
      .then((data: Comment[]) => setComments(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [marketId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handlePost() {
    if (!user || !text.trim()) return;
    setPosting(true);

    try {
      const res = await fetch("/api/miniapp/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marketId,
          fid: user.fid,
          username: user.username,
          avatarUrl: user.pfpUrl,
          content: text.trim(),
        }),
      });

      if (res.ok) {
        const newComment = (await res.json()) as Comment;
        setComments((prev) => [newComment, ...prev]);
        setText("");
      }
    } catch {
      // ignore
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-t-2xl border-t border-x border-border bg-background animate-in slide-in-from-bottom duration-300 flex flex-col" style={{ maxHeight: "70vh" }}>
        <div className="p-4 border-b border-border shrink-0">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">💬 Discussion</h2>
            <button onClick={onClose} className="text-muted text-xs active:text-foreground">Close</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-card" />
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-2xl mb-1">💬</p>
              <p className="text-xs text-muted">No comments yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[10px] font-bold text-accent">
                    {c.avatar_url ? (
                      <img src={c.avatar_url} alt="" className="h-7 w-7 rounded-full" />
                    ) : (
                      c.username[0]?.toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-foreground">@{c.username}</span>
                      <span className="text-[10px] text-muted">{timeAgo(c.created_at)}</span>
                    </div>
                    <p className="text-xs text-muted mt-0.5 break-words">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {user ? (
          <div className="p-3 border-t border-border shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a comment..."
                maxLength={280}
                className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
                onKeyDown={(e) => { if (e.key === "Enter" && !posting) handlePost(); }}
              />
              <button
                onClick={handlePost}
                disabled={posting || !text.trim()}
                className="rounded-lg bg-accent px-3 py-2 text-xs font-bold text-black disabled:opacity-50 active:bg-accent-dim"
              >
                {posting ? "..." : "Send"}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 border-t border-border text-center shrink-0">
            <p className="text-[10px] text-muted">Open from Warpcast to comment</p>
          </div>
        )}
      </div>
    </div>
  );
}
