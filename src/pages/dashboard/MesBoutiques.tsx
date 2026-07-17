import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { Store, Plus, Edit3, Eye, MapPin, ShoppingBag, ChevronRight, Zap } from "lucide-react"

interface StoreItem {
  id: string
  name: string
  slug: string
  category: string
  status: string
  promo_count: number
  address: string
  image: string
  created_at: string
}

export default function MesBoutiques() {
  const { user, profile } = useAuth()
  const [stores, setStores] = useState<StoreItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from("stores")
      .select("id, name, slug, category, status, promo_count, address, image, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setStores(data || [])
        setLoading(false)
      })
  }, [user])

  const canManageStore = profile && ["vendor", "super_admin", "admin"].includes(profile.role)

  if (profile && !canManageStore) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-12 text-center shadow-card">
        <Store className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 font-display text-xl font-bold text-ink">Accès réservé aux commerçants</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Seuls les vendeurs peuvent gérer des boutiques.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Mes boutiques</h1>
          <p className="mt-1 text-sm text-ink-soft">{stores.length} boutique{stores.length > 1 ? "s" : ""}</p>
        </div>
        <Link
          to="/dashboard/boutique"
          className="inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:opacity-95"
        >
          <Plus className="h-4 w-4" /> Nouvelle boutique
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : stores.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center shadow-card">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Store className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-semibold text-ink">Aucune boutique</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Créez votre première boutique pour commencer à vendre.
          </p>
          <Link
            to="/dashboard/boutique"
            className="mt-4 inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> Créer ma boutique
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {stores.map((store) => (
            <Link
              key={store.id}
              to={`/dashboard/boutique?storeId=${store.id}`}
              className="group rounded-2xl border border-border/60 bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                  {store.image ? (
                    <img src={store.image} alt={store.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-muted-foreground">
                      <Store className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-ink group-hover:text-primary transition">{store.name}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {store.category && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">{store.category}</span>
                    )}
                    <span className={`rounded-full px-2 py-0.5 font-medium ${
                      store.status === "active" ? "bg-success/10 text-success"
                        : store.status === "pending" ? "bg-amber-500/10 text-amber-600"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {store.status === "active" ? "Active" : store.status === "pending" ? "En attente" : store.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    {store.address && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {store.address}</span>}
                    <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> {store.promo_count || 0} promo{(store.promo_count || 0) > 1 ? "s" : ""}</span>
                  </div>
                </div>
                <Edit3 className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
