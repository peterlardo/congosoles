import { Hero } from "@/components/Hero"
import { CategoriesGrid } from "@/components/CategoriesGrid"
import { FlashSales } from "@/components/FlashSales"
import { TodayPromos } from "@/components/TodayPromos"
import { StoresSection } from "@/components/StoresSection"
import { HowItWorks } from "@/components/HowItWorks"
import { ForBusiness } from "@/components/ForBusiness"
import { Trending } from "@/components/Trending"

export default function Home() {
  return (
    <main>
      <Hero />
      <CategoriesGrid />
      <FlashSales />
      <TodayPromos />
      <StoresSection />
      <HowItWorks />
      <ForBusiness />
      <Trending />
    </main>
  )
}
