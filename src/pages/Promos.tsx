import { Link } from "react-router-dom"
import { FlashSales } from "@/components/FlashSales"
import { TodayPromos } from "@/components/TodayPromos"
import { Trending } from "@/components/Trending"
import { allProducts, flashProducts } from "@/lib/data"
import { Zap, TrendingUp, Tag, Store } from "lucide-react"

const totalDiscount = Math.round(allProducts.reduce((acc, p) => acc + p.discountPercent, 0) / allProducts.length)
const uniqueStores = new Set(allProducts.map((p) => p.store)).size

export default function Promos() {
  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 via-primary/75 to-primary/55">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_55%)] opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,white,transparent_40%)] opacity-5" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-8 lg:py-16">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/25">
            ← Retour à l'accueil
          </Link>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                <Zap className="h-3 w-3" />
                +{allProducts.length} offres disponibles
              </div>
              <h1 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">Promotions</h1>
              <p className="mt-2 max-w-lg text-lg font-medium text-white/80">
                Toutes les meilleures offres des commerces près de chez vous au Congo.
              </p>
              <p className="mt-1 max-w-lg text-sm leading-relaxed text-white/55">
                Offres flash, promos du jour et tendances — ne manquez aucune bonne affaire.
              </p>
            </div>

            <div className="flex shrink-0 gap-3">
              <div className="rounded-2xl bg-white/15 px-5 py-3 text-center backdrop-blur">
                <div className="flex items-center justify-center gap-1 text-white">
                  <Tag className="h-4 w-4" />
                  <span className="font-display text-2xl font-bold">−{totalDiscount}%</span>
                </div>
                <div className="text-xs text-white/60">Réduction moy.</div>
              </div>
              <div className="rounded-2xl bg-white/15 px-5 py-3 text-center backdrop-blur">
                <div className="flex items-center justify-center gap-1 text-white">
                  <Zap className="h-4 w-4" />
                  <span className="font-display text-2xl font-bold">{flashProducts.length}</span>
                </div>
                <div className="text-xs text-white/60">Offres flash</div>
              </div>
              <div className="rounded-2xl bg-white/15 px-5 py-3 text-center backdrop-blur">
                <div className="flex items-center justify-center gap-1 text-white">
                  <Store className="h-4 w-4" />
                  <span className="font-display text-2xl font-bold">{uniqueStores}</span>
                </div>
                <div className="text-xs text-white/60">Boutiques</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <FlashSales />
        <TodayPromos />
        <Trending />
      </div>
    </main>
  )
}
