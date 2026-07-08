import { Link } from "react-router-dom"
import { ProductCard } from "@/components/ProductCard"
import { todayProducts } from "@/lib/data"
import { ArrowRight } from "lucide-react"
import { useState } from "react"

const allValue = "Toutes"

const cities = [allValue, ...Array.from(new Set(todayProducts.map((product) => product.location)))]
const categories = [allValue, ...Array.from(new Set(todayProducts.map((product) => product.category)))]
const shops = [allValue, ...Array.from(new Set(todayProducts.map((product) => product.store)))]

export function TodayPromos() {
  const [city, setCity] = useState(allValue)
  const [category, setCategory] = useState(allValue)
  const [shop, setShop] = useState(allValue)

  const filteredProducts = todayProducts.filter((product) => {
    return (
      (city === allValue || product.location === city) &&
      (category === allValue || product.category === category) &&
      (shop === allValue || product.store === shop)
    )
  })

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary">Aujourd'hui</div>
            <h2 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">Promotions du jour</h2>
            <p className="mt-1 text-sm text-ink-soft">Sélectionnées près de vous · Brazzaville</p>
          </div>
          <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary">Tout voir <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-6 grid max-w-3xl gap-3 rounded-3xl border border-border/60 bg-card p-3 shadow-card sm:grid-cols-3">
          <label className="flex flex-col gap-1.5">
            <span className="px-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Ville</span>
            <select
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="h-11 rounded-full border border-border bg-background px-4 text-sm font-semibold text-ink outline-none transition focus:border-primary"
            >
              {cities.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="px-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Catégorie</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-11 rounded-full border border-border bg-background px-4 text-sm font-semibold text-ink outline-none transition focus:border-primary"
            >
              {categories.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="px-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Boutique</span>
            <select
              value={shop}
              onChange={(event) => setShop(event.target.value)}
              className="h-11 rounded-full border border-border bg-background px-4 text-sm font-semibold text-ink outline-none transition focus:border-primary"
            >
              {shops.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4 text-sm font-medium text-ink-soft">
          {filteredProducts.length} promotion{filteredProducts.length > 1 ? "s" : ""} trouvée{filteredProducts.length > 1 ? "s" : ""}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="mt-8 rounded-3xl border border-border/60 bg-card p-8 text-center shadow-card">
            <div className="font-display text-2xl font-bold text-ink">Aucune promotion trouvée</div>
            <p className="mt-2 text-sm text-ink-soft">Essayez une autre ville, catégorie ou boutique.</p>
          </div>
        )}
      </div>
    </section>
  )
}
