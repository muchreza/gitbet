import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SessionProvider } from "@/components/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitBet — Predict the Future of Open Source",
  description:
    "Bet on GitHub repos, predict stars, forks, and trends. The prediction market for open source developers.",
  keywords: ["github", "prediction market", "open source", "betting", "developer"],
  metadataBase: new URL("https://gitbetapp.vercel.app"),
  openGraph: {
    title: "GitBet — Predict the Future of Open Source",
    description:
      "Bet on GitHub repos, predict stars, forks, and trends. The prediction market for open source developers.",
    url: "https://gitbetapp.vercel.app",
    siteName: "GitBet",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitBet — Predict the Future of Open Source",
    description:
      "Bet on GitHub repos, predict stars, forks, and trends. The prediction market for open source developers.",
    creator: "@gitbetfun",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
