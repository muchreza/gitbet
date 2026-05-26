import type { Metadata } from "next";

const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || "https://gitbetapp.vercel.app";

const miniappEmbed = JSON.stringify({
  version: "1",
  imageUrl: `${DOMAIN}/og-miniapp`,
  button: {
    title: "Predict Now",
    action: {
      type: "launch_miniapp",
      name: "GitBet",
      url: `${DOMAIN}/miniapp`,
      splashImageUrl: `${DOMAIN}/icon-200`,
      splashBackgroundColor: "#0a0a0f",
    },
  },
});

export const metadata: Metadata = {
  title: "GitBet — Farcaster Mini App",
  description: "Predict the future of open source. Bet on GitHub repo stars, forks, and trends.",
  other: {
    "fc:miniapp": miniappEmbed,
    "fc:frame": miniappEmbed.replace("launch_miniapp", "launch_frame"),
  },
};

export default function MiniAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
