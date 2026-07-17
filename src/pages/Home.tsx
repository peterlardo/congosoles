import { Hero } from "@/components/Hero"
import { CategoriesGrid } from "@/components/CategoriesGrid"
import { FlashSales } from "@/components/FlashSales"
import { TodayPromos } from "@/components/TodayPromos"
import { StoresSection } from "@/components/StoresSection"
import { HowItWorks } from "@/components/HowItWorks"
import { ForBusiness } from "@/components/ForBusiness"
import { Trending } from "@/components/Trending"
import { PricingSection } from "@/components/PricingSection"
import { StoresFilter } from "@/components/StoresFilter"

export default function Home() {
  return (
    <main>
      <Hero />
      <StoresFilter />
      <CategoriesGrid />
      <FlashSales />
      <TodayPromos />
      <StoresSection />
      <HowItWorks />
      <ForBusiness />
      <Trending />
      <PricingSection />
    </main>
  )
}
