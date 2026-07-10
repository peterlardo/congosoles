import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { fetchAdminStores, updateStoreStatus, toggleStoreBadge } from "@/lib/admin"
import { Store, Search, MapPin, Check, X, Ban, Shield, ShieldCheck, Crown } from "lucide-react"
import { Link } from "react-router-dom"
import type { AdminStore } from "@/types/admin"

export default function AdminStores() {
  const [stores, setStores] = useState<AdminStore[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selected, setSelected] = useState<AdminStore | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  useEffect(() => {
    fetchAdminStores(statusFilter, search).then(data => { setStores(data); setLoading(false) })
  }, [search, statusFilter])

  const handleStatus = async (id: string, status: string, reason?: string) => {
    await updateStoreStatus(id, status, reason)
    setStores(prev => prev.map(s => s.id === id ? { ...s, status: status as any, rejected_reason: reason } : s))
    setSelected(null)
  }

  const handleBadge = async (id: string, badge: "verified" | "premium", value: boolean) => {
    await toggleStoreBadge(id, badge, value)
    setStores(prev => prev.map(s => s.id === id ? { ...s, [badge]: value } : s))
  }

  const statuses = ["all", "pending", "active", "suspended", "rejected"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Boutiques</h1>
          <p className="mt-1 text-sm text-ink-soft">{stores.length} boutique{stores.length > 1 ? "s" : ""} · {stores.filter(s => s.status === "pending").length} en attente</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une boutique..." className="h-10 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm text-ink outline-none transition focus:border-primary" />
        </div>
        <div className="flex gap-1.5 rounded-full border border-border bg-card p-1">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${statusFilter === s ? "bg-primary text-primary-foreground" : "text-ink-soft hover:text-ink"}`}>
              {s === "all" ? "Toutes" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />)}</div>
      ) : stores.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center shadow-card">
          <Store className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-ink-soft">Aucune boutique trouvée</p>
        </div>
      ) : (
        <div className="space-y-3">
          {stores.map(store => (
            <div key={store.id} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary text-lg font-bold">
                {store.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-ink">{store.name}</span>
                  {store.verified && <span title="Vérifiée"><ShieldCheck className="h-4 w-4 text-blue-500" /></span>}
                  {store.premium && <span title="Premium"><Crown className="h-4 w-4 text-amber-500" /></span>}
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
                    store.status === "active" ? "bg-success/10 text-success"
                    : store.status === "pending" ? "bg-amber-500/10 text-amber-500"
                    : store.status === "suspended" ? "bg-red-500/10 text-red-500"
                    : "bg-muted text-muted-foreground"
                  }`}>{store.status}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize">{store.category}</span>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {store.address && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {store.address}</span>}
                  <span>{store.promo_count || 0} promos</span>
                  <span>{store.owner_email || ""}</span>
                </div>
              </div>
              <div className="flex gap-1">
                {store.status === "pending" && (
                  <>
                    <button onClick={() => handleStatus(store.id, "active")} className="grid h-8 w-8 place-items-center rounded-lg bg-success/10 text-success transition hover:bg-success/20" title="Valider">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => { setSelected(store); setRejectReason("") }} className="grid h-8 w-8 place-items-center rounded-lg bg-red-500/10 text-red-500 transition hover:bg-red-500/20" title="Refuser">
                      <X className="h-4 w-4" />
                    </button>
                  </>
                )}
                {store.status === "active" && (
                  <button onClick={() => handleStatus(store.id, "suspended")} className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 text-amber-500 transition hover:bg-amber-500/20" title="Suspendre">
                    <Ban className="h-4 w-4" />
                  </button>
                )}
                {store.status === "suspended" && (
                  <button onClick={() => handleStatus(store.id, "active")} className="grid h-8 w-8 place-items-center rounded-lg bg-success/10 text-success transition hover:bg-success/20" title="Réactiver">
                    <Check className="h-4 w-4" />
                  </button>
                )}
                <button onClick={() => handleBadge(store.id, "verified", !store.verified)}
                  className={`grid h-8 w-8 place-items-center rounded-lg transition ${store.verified ? "bg-blue-500/10 text-blue-500" : "text-muted-foreground hover:bg-muted"}`} title="Badge vérifié">
                  <ShieldCheck className="h-4 w-4" />
                </button>
                <button onClick={() => handleBadge(store.id, "premium", !store.premium)}
                  className={`grid h-8 w-8 place-items-center rounded-lg transition ${store.premium ? "bg-amber-500/10 text-amber-500" : "text-muted-foreground hover:bg-muted"}`} title="Badge premium">
                  <Crown className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">Refuser {selected.name}</h3>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              placeholder="Motif du refus..."
              className="mt-4 h-24 w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-primary" />
            <div className="mt-4 flex gap-2">
              <button onClick={() => handleStatus(selected.id, "rejected", rejectReason)}
                className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-bold text-white">Confirmer le refus</button>
              <button onClick={() => setSelected(null)} className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold text-ink">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}