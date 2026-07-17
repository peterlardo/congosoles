import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { fetchAdminPromotions, updatePromoStatus, togglePromoFeature, deletePromotion } from "@/lib/admin"
import { Zap, Eye, MousePointerClick, Search, Store, Check, X, Trash2, Star, AlertTriangle } from "lucide-react"
import type { AdminPromotion } from "@/types/admin"
import Pagination from "@/components/Pagination"

export default function AdminAllPromotions() {
  const [promos, setPromos] = useState<AdminPromotion[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [rejectTarget, setRejectTarget] = useState<AdminPromotion | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchAdminPromotions(filter, search).then(data => { setPromos(data); setLoading(false) })
  }, [filter, search])

  const pageSize = 6
  const totalPages = Math.ceil(promos.length / pageSize)
  const paged = promos.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => { setPage(1) }, [search, filter])

  const handleStatus = async (id: string, status: string, reason?: string) => {
    await updatePromoStatus(id, status, reason)
    setPromos(prev => prev.map(p => p.id === id ? { ...p, status: status as any, rejection_reason: reason } : p))
    setRejectTarget(null)
  }

  const handleFeature = async (id: string, featured: boolean) => {
    await togglePromoFeature(id, featured)
    setPromos(prev => prev.map(p => p.id === id ? { ...p, featured } : p))
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette promotion ?")) return
    const { error } = await deletePromotion(id)
    if (error) {
      alert("Erreur lors de la suppression : " + error.message)
      return
    }
    setPromos(prev => prev.filter(p => p.id !== id))
  }

  const filters = [
    { value: "all", label: "Toutes" },
    { value: "active", label: "En ligne" },
    { value: "draft", label: "Brouillons" },
    { value: "expired", label: "Expirées" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Promotions</h1>
          <p className="mt-1 text-sm text-ink-soft">{promos.length} promotion{promos.length > 1 ? "s" : ""} · {promos.filter(p => p.flagged).length} signalée{promos.filter(p => p.flagged).length > 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une promotion..." className="h-10 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm text-ink outline-none transition focus:border-primary" />
        </div>
        <div className="flex gap-1.5 rounded-full border border-border bg-card p-1">
          {filters.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${filter === f.value ? "bg-primary text-primary-foreground" : "text-ink-soft hover:text-ink"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />)}</div>
      ) : promos.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center shadow-card">
          <Zap className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-ink-soft">Aucune promotion trouvée</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paged.map(promo => (
            <div key={promo.id} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                {promo.image ? <img src={promo.image} alt={promo.title} className="h-full w-full object-cover" />
                : <div className="grid h-full w-full place-items-center text-muted-foreground"><Zap className="h-5 w-5" /></div>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-ink">{promo.title}</span>
                  {promo.discount > 0 && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">-{promo.discount}%</span>}
                  {promo.featured && <Star className="h-3.5 w-3.5 text-amber-500" />}
                  {promo.flagged && <span title="Signalée"><AlertTriangle className="h-3.5 w-3.5 text-red-500" /></span>}
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    promo.status === "active" ? "bg-success/10 text-success"
                    : promo.status === "draft" ? "bg-amber-500/10 text-amber-600"
                    : "bg-muted text-muted-foreground"
                  }`}>{promo.status === "active" ? "En ligne" : promo.status === "draft" ? "Brouillon" : "Expirée"}</span>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Store className="h-3 w-3" /> {promo.store_name}</span>
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {promo.views || 0}</span>
                  <span className="flex items-center gap-1"><MousePointerClick className="h-3 w-3" /> {promo.clicks || 0}</span>
                  <span>{new Date(promo.created_at).toLocaleDateString("fr-FR")}</span>
                </div>
                {promo.payment_methods && promo.payment_methods.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {promo.payment_methods.includes("mtn") && <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] font-bold text-yellow-600">MTN</span>}
                    {promo.payment_methods.includes("airtel") && <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-600">Airtel</span>}
                    {promo.payment_methods.includes("visa") && <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600">VISA</span>}
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                {promo.status !== "expired" && (
                  <button onClick={() => handleStatus(promo.id, promo.status === "active" ? "draft" : "active")}
                    className={`grid h-8 w-8 place-items-center rounded-lg transition ${promo.status === "active" ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" : "bg-success/10 text-success hover:bg-success/20"}`}
                    title={promo.status === "active" ? "Désactiver" : "Activer"}>
                    {promo.status === "active" ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  </button>
                )}
                {promo.flagged && (
                  <button onClick={() => handleStatus(promo.id, "draft", "Signalement traité")}
                    className="grid h-8 w-8 place-items-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20" title="Traiter le signalement">
                    <AlertTriangle className="h-4 w-4" />
                  </button>
                )}
                <button onClick={() => handleFeature(promo.id, !promo.featured)}
                  className={`grid h-8 w-8 place-items-center rounded-lg transition ${promo.featured ? "bg-amber-500/10 text-amber-500" : "text-muted-foreground hover:bg-muted"}`}
                  title="Mettre en avant">
                  <Star className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(promo.id)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-red-50 hover:text-red-500" title="Supprimer">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          <Pagination current={page} total={promos.length} pageSize={pageSize} onChange={setPage} />
        </div>
      )}
    </div>
  )
}
