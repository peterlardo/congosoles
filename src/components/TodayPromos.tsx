import { Link } from "react-router-dom"
import { ProductCard } from "@/components/ProductCard"
import { todayProducts } from "@/lib/data"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

const allValue = "Toutes"
const perPage = 12

const cities = [allValue, ...Array.from(new Set(todayProducts.map((product) => product.location)))]
const categories = [allValue, ...Array.from(new Set(todayProducts.map((product) => product.category)))]
const shops = [allValue, ...Array.from(new Set(todayProducts.map((product) => product.store)))]

export function TodayPromos() {
  const [city, setCity] = useState(allValue)
  const [category, setCategory] = useState(allValue)
  const [shop, setShop] = useState(allValue)
  const [page, setPage] = useState(1)

  const filteredProducts = todayProducts.filter((product) => {
    return (
      (city === allValue || product.location === city) &&
      (category === allValue || product.category === category) &&
      (shop === allValue || product.store === shop)
    )
  })

  const totalPages = Math.ceil(filteredProducts.length / perPage)
  const paginatedProducts = filteredProducts.slice((page - 1) * perPage, page * perPage)

  const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
    setter(value)
    setPage(1)
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary">Aujourd'hui</div>
            <h2 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">Promotions du jour</h2>
            <p className="mt-1 text-sm text-ink-soft">Sélectionnées près de vous · Brazzaville</p>
          </div>
          <Link to="/promos" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary">Tout voir <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-6 rounded-3xl bg-gradient-to-br from-orange-500 via-orange-500 to-red-500 p-4 shadow-lg sm:p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span className="px-1 text-[11px] font-bold uppercase tracking-widest text-white/70">Ville</span>
              <select
                value={city}
                onChange={(e) => handleFilterChange(setCity)(e.target.value)}
                className="h-11 rounded-full border border-white/20 bg-white/15 px-4 text-sm font-semibold text-white outline-none backdrop-blur transition placeholder:text-white/50 focus:border-white/50 focus:bg-white/25"
              >
                {cities.map((option) => (
                  <option key={option} value={option} className="text-ink">{option}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="px-1 text-[11px] font-bold uppercase tracking-widest text-white/70">Catégorie</span>
              <select
                value={category}
                onChange={(e) => handleFilterChange(setCategory)(e.target.value)}
                className="h-11 rounded-full border border-white/20 bg-white/15 px-4 text-sm font-semibold text-white outline-none backdrop-blur transition placeholder:text-white/50 focus:border-white/50 focus:bg-white/25"
              >
                {categories.map((option) => (
                  <option key={option} value={option} className="text-ink">{option}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="px-1 text-[11px] font-bold uppercase tracking-widest text-white/70">Boutique</span>
              <select
                value={shop}
                onChange={(e) => handleFilterChange(setShop)(e.target.value)}
                className="h-11 rounded-full border border-white/20 bg-white/15 px-4 text-sm font-semibold text-white outline-none backdrop-blur transition placeholder:text-white/50 focus:border-white/50 focus:bg-white/25"
              >
                {shops.map((option) => (
                  <option key={option} value={option} className="text-ink">{option}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className="mt-4 text-sm font-medium text-ink-soft">
          {filteredProducts.length} promotion{filteredProducts.length > 1 ? "s" : ""} trouvée{filteredProducts.length > 1 ? "s" : ""}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="mt-8 rounded-3xl border border-border/60 bg-card p-8 text-center shadow-card">
            <div className="font-display text-2xl font-bold text-ink">Aucune promotion trouvée</div>
            <p className="mt-2 text-sm text-ink-soft">Essayez une autre ville, catégorie ou boutique.</p>
          </div>
        )}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-ink transition hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`grid h-10 w-10 place-items-center rounded-full text-sm font-bold transition ${
                  p === page
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "border border-border bg-card text-ink hover:border-primary hover:text-primary"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-ink transition hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
