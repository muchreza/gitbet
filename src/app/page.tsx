import { Hero } from "@/components/hero";
import { StatsBar } from "@/components/stats-bar";
import { TrendingMarkets } from "@/components/trending-markets";
import { Categories } from "@/components/categories";
import { CtaSection } from "@/components/cta-section";

export default function Home() {
  return (
    <>
      <StatsBar />
      <Hero />
      <TrendingMarkets />
      <Categories />
      <CtaSection />
    </>
  );
}
