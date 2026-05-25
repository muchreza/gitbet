import { NextResponse } from "next/server";

interface GitHubRepo {
  full_name: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  description: string | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get("repo");

  if (!repo) {
    return NextResponse.json({ error: "Missing repo parameter" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Repo not found" }, { status: 404 });
    }

    const data = (await res.json()) as GitHubRepo;

    return NextResponse.json({
      name: data.full_name,
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language,
      description: data.description,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch repo" }, { status: 500 });
  }
}
