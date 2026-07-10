import { FlashSales } from "@/components/FlashSales"
import { TodayPromos } from "@/components/TodayPromos"
import { Trending } from "@/components/Trending"

export default function Promos() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-8">
        <div className="text-xs font-bold uppercase tracking-widest text-primary">Toutes les promotions</div>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">Promotions</h1>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          Découvrez toutes les offres disponibles près de chez vous au Congo.
        </p>
      </div>
      <FlashSales />
      <TodayPromos />
      <Trending />
    </main>
  )
}
