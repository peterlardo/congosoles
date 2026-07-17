import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { StoreLogo } from "@/components/StoreLogo"
import { Search, MapPin, Grid3X3, ChevronLeft, ChevronRight, Store, BadgeCheck } from "lucide-react"
import type { StoreFront } from "@/lib/stores"

const PER_PAGE = 6

export function StoresFilter() {
  const [stores, setStores] = useState<StoreFront[]>([])
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([])
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>([])
  const [search, setSearch] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from("categories").select("slug, name").eq("is_active", true).order("display_order"),
      supabase.from("districts").select("id, name").eq("is_active", true).order("display_order"),
      supabase.from("stores").select("id, name, slug, image, category, district, promo_count, logo_url, banner_url, logo_initial, logo_color, logo_gradient").eq("status", "active"),
    ]).then(([catRes, distRes, storeRes]) => {
      if (catRes.data) setCategories(catRes.data)
      if (distRes.data) setDistricts(distRes.data)
      if (storeRes.data) {
        setStores(storeRes.data.map(s => ({
          id: s.id,
          name: s.name,
          category: s.category,
          location: s.district || "Brazzaville",
          activePromos: s.promo_count || 0,
          image: s.image || "",
          bannerUrl: s.banner_url || "",
          logoUrl: s.logo_url || "",
          logoInitial: s.logo_initial || s.name.charAt(0).toUpperCase(),
          logoColor: s.logo_color || "text-white",
          logoGradient: s.logo_gradient || "bg-gradient-to-br from-primary to-primary/70",
          slug: s.slug || "",
        })))
      }
      setLoading(false)
    })
  }, [])

  const filtered = stores.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
    if (selectedCity && s.location !== selectedCity) return false
    if (selectedCategory && s.category !== selectedCategory) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  useEffect(() => { setPage(1) }, [search, selectedCity, selectedCategory])

  const catLabels = Object.fromEntries(categories.map(c => [c.slug, c.name]))

  return (
    <section style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }} className="py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Trouvez votre boutique</h2>
          <p className="mt-2 text-white/80">{filtered.length} boutique{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}</p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une boutique..."
              className="h-12 w-full rounded-xl border border-white/20 bg-white/10 pl-10 pr-4 text-sm text-white outline-none transition focus:bg-white/20 placeholder:text-white/50" />
          </div>
          <div className="relative flex-1">
            <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
            <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
              className="h-12 w-full appearance-none rounded-xl border border-white/20 bg-white/10 pl-10 pr-4 text-sm text-white outline-none transition focus:bg-white/20">
              <option value="" className="text-ink">Toutes les villes</option>
              {districts.map(d => (
                <option key={d.id} value={d.name} className="text-ink">{d.name}</option>
              ))}
            </select>
          </div>
          <div className="relative flex-1">
            <Grid3X3 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
              className="h-12 w-full appearance-none rounded-xl border border-white/20 bg-white/10 pl-10 pr-4 text-sm text-white outline-none transition focus:bg-white/20">
              <option value="" className="text-ink">Toutes les catégories</option>
              {categories.map(c => (
                <option key={c.slug} value={c.slug} className="text-ink">{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/10" />
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="rounded-2xl bg-white/10 p-12 text-center">
              <Store className="mx-auto h-12 w-12 text-white/50" />
              <h3 className="mt-4 font-semibold text-white">Aucune boutique trouvée</h3>
              <p className="mt-1 text-sm text-white/60">Essayez de modifier vos filtres.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paginated.map(store => (
                <div key={store.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
                  <StoreLogo store={store} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <div className="truncate font-semibold text-ink">{store.name}</div>
                      <BadgeCheck className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {catLabels[store.category] || store.category}
                      {store.location && <> · {store.location}</>}
                      {store.activePromos > 0 && <> · {store.activePromos} promo{store.activePromos > 1 ? "s" : ""}</>}
                    </div>
                  </div>
                  <Link to={`/store/${store.slug}`} className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-primary hover:text-primary">
                    Visiter
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button disabled={safePage <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}
              className="flex items-center gap-1 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronLeft className="h-4 w-4" /> Précédent
            </button>
            <span className="text-sm text-white/70">
              {safePage} / {totalPages}
            </span>
            <button disabled={safePage >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="flex items-center gap-1 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed">
              Suivant <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
