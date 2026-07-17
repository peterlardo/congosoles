import { Link } from "react-router-dom"
import { ProductCard } from "@/components/ProductCard"
import { fetchActivePromotions, type PromoItem } from "@/lib/promotions"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"

const allValue = "Toutes"
const perPage = 8

export function TodayPromos() {
  const [allItems, setAllItems] = useState<PromoItem[]>([])
  const [searchName, setSearchName] = useState("")
  const [category, setCategory] = useState(allValue)
  const [discount, setDiscount] = useState(allValue)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchActivePromotions().then(setAllItems)
  }, [])

  const categories = [allValue, ...Array.from(new Set(allItems.map(p => p.category)))]
  const discounts = [allValue, "-10%", "-20%", "-30%", "-40%", "-50%", "+50%"]

  const filteredProducts = allItems.filter((product) => {
    const d = product.discountPercent
    const matchesDiscount = discount === allValue ||
      (discount === "-10%" && d >= 0 && d < 20) ||
      (discount === "-20%" && d >= 20 && d < 30) ||
      (discount === "-30%" && d >= 30 && d < 40) ||
      (discount === "-40%" && d >= 40 && d < 50) ||
      (discount === "-50%" && d >= 50 && d < 60) ||
      (discount === "+50%" && d >= 60)
    return (
      (!searchName || product.store.toLowerCase().includes(searchName.toLowerCase())) &&
      (category === allValue || product.category === category) &&
      matchesDiscount
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
              <span className="px-1 text-[11px] font-bold uppercase tracking-widest text-white/70">Nom de la boutique</span>
              <input
                type="text"
                value={searchName}
                onChange={(e) => { setSearchName(e.target.value); setPage(1) }}
                placeholder="Rechercher..."
                className="h-11 rounded-full border border-white/30 bg-white px-4 text-sm font-semibold text-ink outline-none transition focus:ring-2 focus:ring-white/50"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="px-1 text-[11px] font-bold uppercase tracking-widest text-white/70">Catégorie</span>
              <select
                value={category}
                onChange={(e) => handleFilterChange(setCategory)(e.target.value)}
                className="h-11 rounded-full border border-white/30 bg-white px-4 text-sm font-semibold text-ink outline-none transition focus:ring-2 focus:ring-white/50"
              >
                {categories.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="px-1 text-[11px] font-bold uppercase tracking-widest text-white/70">Réduction</span>
              <select
                value={discount}
                onChange={(e) => handleFilterChange(setDiscount)(e.target.value)}
                className="h-11 rounded-full border border-white/30 bg-white px-4 text-sm font-semibold text-ink outline-none transition focus:ring-2 focus:ring-white/50"
              >
                {discounts.map((option) => (
                  <option key={option} value={option}>{option}</option>
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
            <p className="mt-2 text-sm text-ink-soft">Essayez une autre catégorie ou boutique.</p>
          </div>
        )}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" /> Précédent
            </button>
            <span className="text-sm text-muted-foreground">Page {page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Suivant <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
