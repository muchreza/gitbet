-- GitBet Database Schema
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- Users table (synced from GitHub OAuth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  email TEXT,
  balance INTEGER NOT NULL DEFAULT 1000,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Markets table
CREATE TABLE IF NOT EXISTS markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo TEXT NOT NULL,
  owner TEXT NOT NULL,
  question TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('stars', 'forks', 'releases', 'trending')),
  end_date TIMESTAMPTZ NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT false,
  outcome BOOLEAN,
  target_value INTEGER,
  language TEXT,
  language_color TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bets table
CREATE TABLE IF NOT EXISTS bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  market_id UUID NOT NULL REFERENCES markets(id),
  position BOOLEAN NOT NULL, -- true = YES, false = NO
  amount INTEGER NOT NULL CHECK (amount > 0),
  tx_hash TEXT, -- on-chain transaction hash for ETH bets
  bet_type TEXT NOT NULL DEFAULT 'token' CHECK (bet_type IN ('token', 'eth')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, market_id)
);

-- Migration: add tx_hash and bet_type columns if table already exists
-- ALTER TABLE bets ADD COLUMN IF NOT EXISTS tx_hash TEXT;
-- ALTER TABLE bets ADD COLUMN IF NOT EXISTS bet_type TEXT NOT NULL DEFAULT 'token' CHECK (bet_type IN ('token', 'eth'));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_markets_category ON markets(category);
CREATE INDEX IF NOT EXISTS idx_markets_resolved ON markets(resolved);
CREATE INDEX IF NOT EXISTS idx_bets_user_id ON bets(user_id);
CREATE INDEX IF NOT EXISTS idx_bets_market_id ON bets(market_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- RLS Policies: markets
CREATE POLICY "Markets are viewable by everyone" ON markets FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create markets" ON markets FOR INSERT WITH CHECK (true);

-- RLS Policies: bets
CREATE POLICY "Bets are viewable by everyone" ON bets FOR SELECT USING (true);
CREATE POLICY "Authenticated users can place bets" ON bets FOR INSERT WITH CHECK (true);

-- Seed some initial markets
INSERT INTO markets (repo, owner, question, description, category, end_date, target_value, language, language_color) VALUES
  ('next.js', 'vercel', 'Will next.js reach 140k stars by end of 2026?', 'Currently at 132k stars, growing steadily. Will it hit 140k?', 'stars', '2026-12-31', 140000, 'TypeScript', '#3178c6'),
  ('react', 'facebook', 'Will React release v20 before July 2026?', 'React 19 was a major release. When will v20 land?', 'releases', '2026-07-01', NULL, 'JavaScript', '#f1e05a'),
  ('bun', 'oven-sh', 'Will Bun overtake Deno in GitHub stars?', 'Bun is growing fast. Can it surpass Deno''s star count?', 'stars', '2026-06-30', NULL, 'Zig', '#ec915c'),
  ('rust', 'rust-lang', 'Will Rust reach 105k stars by Q3 2026?', 'Rust continues to gain popularity. Star growth prediction.', 'stars', '2026-09-30', 105000, 'Rust', '#dea584'),
  ('svelte', 'sveltejs', 'Will Svelte 6 be announced in 2026?', 'After the Svelte 5 runes revolution, what''s next?', 'releases', '2026-12-31', NULL, 'JavaScript', '#f1e05a'),
  ('devin', 'cognition-labs', 'Will AI coding agents trend #1 on GitHub in 2026?', 'AI coding agents are exploding. Will they dominate GitHub trending?', 'trending', '2026-12-31', NULL, 'Python', '#3572A5'),
  ('tailwindcss', 'tailwindlabs', 'Will Tailwind CSS v4 reach 90k stars?', 'Tailwind v4 dropped with huge changes. Will stars follow?', 'stars', '2026-12-31', 90000, 'TypeScript', '#3178c6'),
  ('ollama', 'ollama', 'Will Ollama surpass 120k stars by mid-2026?', 'Local LLMs are booming. Ollama is leading the charge.', 'stars', '2026-06-30', 120000, 'Go', '#00ADD8')
ON CONFLICT DO NOTHING;
