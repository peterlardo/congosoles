import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { updateStoreStatus } from "@/lib/admin"
import { Store, Check, X, Clock, Search } from "lucide-react"
import type { AdminStore } from "@/types/admin"

export default function AdminStoresPending() {
  const [stores, setStores] = useState<AdminStore[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [rejectModal, setRejectModal] = useState<AdminStore | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchPending()
  }, [])

  async function fetchPending() {
    const { data } = await supabase
      .from("stores")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    if (data) {
      setStores(data as unknown as AdminStore[])
    }
    setLoading(false)
  }

  const handleStatus = async (id: string, status: string, reason?: string) => {
    setActionLoading(id)
    await updateStoreStatus(id, status, reason)
    setStores(prev => prev.filter(s => s.id !== id))
    setActionLoading(null)
    setRejectModal(null)
    setRejectReason("")
  }

  const filtered = search
    ? stores.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    : stores

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Boutiques à valider</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {loading ? "" : `${stores.length} boutique${stores.length > 1 ? "s" : ""} en attente de validation`}
          </p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="h-10 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm text-ink outline-none transition focus:border-primary" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center shadow-card">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-success/10 text-success">
            <Check className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-semibold text-ink">Aucune boutique en attente</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Toutes les boutiques ont été validées.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(store => (
            <div key={store.id} className="rounded-2xl border border-border/60 bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
                  <Clock className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-ink">{store.name}</h3>
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-600">En attente</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {store.category && <span>Catégorie : {store.category}</span>}
                    {store.owner_email && <span>Email : {store.owner_email}</span>}
                    {store.address && <span>Adresse : {store.address}</span>}
                    <span>Créée le {new Date(store.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => handleStatus(store.id, "active")}
                    disabled={actionLoading === store.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-4 py-2 text-xs font-bold text-success transition hover:bg-success/20 disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" /> Approuver
                  </button>
                  <button
                    onClick={() => setRejectModal(store)}
                    disabled={actionLoading === store.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-4 py-2 text-xs font-bold text-red-500 transition hover:bg-red-500/20 disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" /> Rejeter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setRejectModal(null)}>
          <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">Rejeter la boutique</h3>
            <p className="mt-1 text-sm text-muted-foreground">Pourquoi rejetez-vous la boutique <strong>{rejectModal.name}</strong> ?</p>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              placeholder="Motif du rejet (optionnel)"
              rows={3}
              className="mt-4 w-full rounded-xl border border-border bg-background p-3 text-sm text-ink outline-none transition focus:border-primary resize-none" />
            <div className="mt-4 flex gap-2">
              <button onClick={() => handleStatus(rejectModal.id, "rejected", rejectReason || undefined)}
                className="flex items-center gap-2 rounded-full bg-red-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-red-600">
                <X className="h-4 w-4" /> Rejeter
              </button>
              <button onClick={() => setRejectModal(null)}
                className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-ink">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
