import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { Plus, Zap, Eye, Pencil, Trash2, Search, Filter } from "lucide-react"
import { Link } from "react-router-dom"

interface Promotion {
  id: string
  title: string
  description: string
  discount: number
  status: string
  views: number
  clicks: number
  category: string
  image: string
  created_at: string
}

export default function DashboardPromotions() {
  const { user } = useAuth()
  const [promos, setPromos] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "active" | "draft" | "expired">("all")
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function fetchPromos() {
      if (!user) return
      let query = supabase
        .from("promotions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (filter !== "all") query = query.eq("status", filter)
      if (search) query = query.ilike("title", `%${search}%`)

      const { data } = await query
      setPromos(data || [])
      setLoading(false)
    }
    fetchPromos()
  }, [user, filter, search])

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette promotion ?")) return
    await supabase.from("promotions").delete().eq("id", id)
    setPromos((prev) => prev.filter((p) => p.id !== id))
  }

  const filters = [
    { value: "all" as const, label: "Toutes" },
    { value: "active" as const, label: "En ligne" },
    { value: "draft" as const, label: "Brouillons" },
    { value: "expired" as const, label: "Expirées" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Mes promotions</h1>
          <p className="mt-1 text-sm text-ink-soft">Gérez toutes vos offres depuis un seul endroit.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:opacity-95">
          <Plus className="h-4 w-4" /> Nouvelle promo
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une promotion..."
            className="h-10 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm text-ink outline-none transition focus:border-primary"
          />
        </div>
        <div className="flex gap-1.5 rounded-full border border-border bg-card p-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                filter === f.value ? "bg-primary text-primary-foreground" : "text-ink-soft hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : promos.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center shadow-card">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Zap className="h-6 w-6" /></div>
          <h3 className="mt-4 font-semibold text-ink">Aucune promotion trouvée</h3>
          <p className="mt-1 text-sm text-ink-soft">
            {search ? "Essayez un autre terme de recherche." : "Créez votre première promotion."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {promos.map((promo) => (
            <div key={promo.id} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                {promo.image ? (
                  <img src={promo.image} alt={promo.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-muted-foreground"><Zap className="h-5 w-5" /></div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-ink">{promo.title}</span>
                  {promo.discount > 0 && (
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">-{promo.discount}%</span>
                  )}
                </div>
                <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {promo.views || 0} vues</span>
                  <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> {promo.clicks || 0} clics</span>
                  <span>{new Date(promo.created_at).toLocaleDateString("fr-FR")}</span>
                </div>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                promo.status === "active" ? "bg-success/10 text-success"
                  : promo.status === "draft" ? "bg-amber-500/10 text-amber-600"
                  : "bg-muted text-muted-foreground"
              }`}>
                {promo.status === "active" ? "En ligne" : promo.status === "draft" ? "Brouillon" : "Expirée"}
              </span>
              <div className="hidden gap-1 sm:flex">
                <button className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-ink"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => handleDelete(promo.id)} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
