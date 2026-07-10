import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { fetchAdminStores, updateStoreStatus, toggleStoreBadge, deleteStore } from "@/lib/admin"
import { Store, Search, MapPin, Check, X, Ban, ShieldCheck, Crown, Trash2, Edit3, Save, Plus } from "lucide-react"
import { Link } from "react-router-dom"
import type { AdminStore } from "@/types/admin"
import Pagination from "@/components/Pagination"

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

export default function AdminStores() {
  const [stores, setStores] = useState<AdminStore[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selected, setSelected] = useState<AdminStore | null>(null)
  const [editing, setEditing] = useState<AdminStore | null>(null)
  const [rejectModal, setRejectModal] = useState<AdminStore | null>(null)
  const [deleteModal, setDeleteModal] = useState<AdminStore | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newStore, setNewStore] = useState({ name: "", address: "", phone: "", category: "", description: "", district: "", neighborhood: "" })

  useEffect(() => {
    fetchAdminStores(statusFilter, search).then(data => { setStores(data); setLoading(false) })
  }, [search, statusFilter])

  const pageSize = 6
  const totalPages = Math.ceil(stores.length / pageSize)
  const paged = stores.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => { setPage(1) }, [search, statusFilter])

  const handleStatus = async (id: string, status: string, reason?: string) => {
    await updateStoreStatus(id, status, reason)
    setStores(prev => prev.map(s => s.id === id ? { ...s, status: status as any, rejected_reason: reason } : s))
    if (editing?.id === id) setEditing(prev => prev ? { ...prev, status: status as any, rejected_reason: reason } : prev)
    setRejectModal(null)
  }

  const handleBadge = async (id: string, badge: "verified" | "premium", value: boolean) => {
    await toggleStoreBadge(id, badge, value)
    setStores(prev => prev.map(s => s.id === id ? { ...s, [badge]: value } : s))
    if (editing?.id === id) setEditing(prev => prev ? { ...prev, [badge]: value } : prev)
  }

  const handleDelete = async (id: string) => {
    await deleteStore(id)
    setStores(prev => prev.filter(s => s.id !== id))
    setDeleteModal(null)
    if (editing?.id === id) setEditing(null)
    if (selected?.id === id) setSelected(null)
  }

  const handleSaveEdit = async () => {
    if (!editing) return
    const { error } = await supabase.from("stores").update({
      name: editing.name,
      address: editing.address,
      phone: editing.phone,
      category: editing.category,
      description: editing.description,
      district: editing.district,
      neighborhood: editing.neighborhood,
      gps_lat: editing.gps_lat,
      gps_lng: editing.gps_lng,
    }).eq("id", editing.id)
    if (!error) {
      setStores(prev => prev.map(s => s.id === editing.id ? editing : s))
      setSelected(editing)
    }
  }

  const statuses = ["all", "pending", "active", "suspended", "rejected"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Boutiques</h1>
          <p className="mt-1 text-sm text-ink-soft">{stores.length} boutique{stores.length > 1 ? "s" : ""} · {stores.filter(s => s.status === "pending").length} en attente</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:opacity-95">
          <Plus className="h-4 w-4" /> Nouvelle boutique
        </button>
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
          {paged.map(store => (
            <div key={store.id} onClick={() => setSelected(store)}
              className="flex cursor-pointer items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
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
              <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                {store.status === "pending" && (
                  <>
                    <button onClick={() => handleStatus(store.id, "active")} className="grid h-8 w-8 place-items-center rounded-lg bg-success/10 text-success transition hover:bg-success/20" title="Valider">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => { setRejectModal(store); setRejectReason("") }} className="grid h-8 w-8 place-items-center rounded-lg bg-red-500/10 text-red-500 transition hover:bg-red-500/20" title="Refuser">
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
                <button onClick={() => setDeleteModal(store)} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-red-500/10 hover:text-red-500" title="Supprimer">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          <Pagination current={page} total={stores.length} pageSize={pageSize} onChange={setPage} />
        </div>
      )}

      {selected && !editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setSelected(null); setEditing(null) }}>
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-ink">{selected.name}</h3>
              <button onClick={() => setEditing(selected)} className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-ink">
                <Edit3 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Statut</span> <span className="font-medium text-ink">{selected.status}</span></div>
              {selected.address && <div className="flex justify-between"><span className="text-muted-foreground">Adresse</span> <span className="font-medium text-ink text-right">{selected.address}</span></div>}
              {selected.phone && <div className="flex justify-between"><span className="text-muted-foreground">Téléphone</span> <span className="font-medium text-ink">{selected.phone}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Catégorie</span> <span className="font-medium text-ink">{selected.category}</span></div>
              {selected.description && <div className="flex justify-between"><span className="text-muted-foreground">Description</span> <span className="font-medium text-ink text-right max-w-xs">{selected.description}</span></div>}
              {selected.district && <div className="flex justify-between"><span className="text-muted-foreground">District</span> <span className="font-medium text-ink">{selected.district}</span></div>}
              {selected.neighborhood && <div className="flex justify-between"><span className="text-muted-foreground">Quartier</span> <span className="font-medium text-ink">{selected.neighborhood}</span></div>}
              {(selected.gps_lat || selected.gps_lng) && (
                <div className="flex justify-between"><span className="text-muted-foreground">GPS</span> <span className="font-medium text-ink">{selected.gps_lat}, {selected.gps_lng}</span></div>
              )}
            </div>
            <button onClick={() => { setSelected(null); setEditing(null) }} className="mt-6 w-full rounded-full border border-border py-2.5 text-sm font-semibold text-ink">Fermer</button>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">Modifier : {editing.name}</h3>
            <div className="mt-4 space-y-3">
              <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })}
                placeholder="Nom" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <input value={editing.address || ""} onChange={e => setEditing({ ...editing, address: e.target.value })}
                placeholder="Adresse" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <input value={editing.phone || ""} onChange={e => setEditing({ ...editing, phone: e.target.value })}
                placeholder="Téléphone" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <input value={editing.category || ""} onChange={e => setEditing({ ...editing, category: e.target.value })}
                placeholder="Catégorie" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <textarea value={editing.description || ""} onChange={e => setEditing({ ...editing, description: e.target.value })}
                placeholder="Description" className="h-24 w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-primary" />
              <input value={editing.district || ""} onChange={e => setEditing({ ...editing, district: e.target.value })}
                placeholder="District" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <input value={editing.neighborhood || ""} onChange={e => setEditing({ ...editing, neighborhood: e.target.value })}
                placeholder="Quartier" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <div className="flex gap-2">
                <input value={editing.gps_lat || ""} onChange={e => setEditing({ ...editing, gps_lat: parseFloat(e.target.value) || undefined })}
                  placeholder="Latitude" type="number" step="any" className="h-10 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
                <input value={editing.gps_lng || ""} onChange={e => setEditing({ ...editing, gps_lng: parseFloat(e.target.value) || undefined })}
                  placeholder="Longitude" type="number" step="any" className="h-10 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveEdit} className="flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
                  <Save className="h-4 w-4" /> Enregistrer
                </button>
                <button onClick={() => setEditing(null)} className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink">
                  <X className="h-4 w-4" /> Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setRejectModal(null)}>
          <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">Refuser {rejectModal.name}</h3>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              placeholder="Motif du refus..."
              className="mt-4 h-24 w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-primary" />
            <div className="mt-4 flex gap-2">
              <button onClick={() => handleStatus(rejectModal.id, "rejected", rejectReason)}
                className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-bold text-white">Confirmer le refus</button>
              <button onClick={() => setRejectModal(null)} className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold text-ink">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDeleteModal(null)}>
          <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">Supprimer la boutique</h3>
            <p className="mt-2 text-sm text-ink-soft">Voulez-vous vraiment supprimer <strong>{deleteModal.name}</strong> ? Toutes les données associées (promotions, avis) seront supprimées. Cette action est irréversible.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => handleDelete(deleteModal.id)} className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-bold text-white">Supprimer</button>
              <button onClick={() => setDeleteModal(null)} className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold text-ink">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {saved && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-success px-5 py-3 text-sm font-bold text-white shadow-lg">
          ✓ Boutique créée avec succès
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowCreate(false)}>
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">Nouvelle boutique</h3>
            <div className="mt-4 space-y-3">
              <input value={newStore.name} onChange={e => setNewStore({ ...newStore, name: e.target.value })}
                placeholder="Nom *" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <input value={newStore.category} onChange={e => setNewStore({ ...newStore, category: e.target.value })}
                placeholder="Catégorie *" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <input value={newStore.address} onChange={e => setNewStore({ ...newStore, address: e.target.value })}
                placeholder="Adresse" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <input value={newStore.phone} onChange={e => setNewStore({ ...newStore, phone: e.target.value })}
                placeholder="Téléphone" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <textarea value={newStore.description} onChange={e => setNewStore({ ...newStore, description: e.target.value })}
                placeholder="Description" className="h-24 w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-primary" />
              <div className="grid grid-cols-2 gap-3">
                <input value={newStore.district} onChange={e => setNewStore({ ...newStore, district: e.target.value })}
                  placeholder="District" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
                <input value={newStore.neighborhood} onChange={e => setNewStore({ ...newStore, neighborhood: e.target.value })}
                  placeholder="Quartier" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={async () => {
                  if (!newStore.name || !newStore.category) return
                  const { data: userData } = await supabase.auth.getUser()
                  const { error } = await supabase.from("stores").insert({
                    user_id: userData.user?.id,
                    name: newStore.name,
                    slug: slugify(newStore.name) + "-" + Date.now().toString(36),
                    category: newStore.category,
                    address: newStore.address || null,
                    phone: newStore.phone || null,
                    description: newStore.description || null,
                    district: newStore.district || null,
                    neighborhood: newStore.neighborhood || null,
                    status: "active",
                    verified: true,
                  })
                  if (error) { alert("Erreur : " + error.message); return }
                  setShowCreate(false)
                  setNewStore({ name: "", address: "", phone: "", category: "", description: "", district: "", neighborhood: "" })
                  setSaved(true)
                  setTimeout(() => setSaved(false), 3000)
                  const data = await fetchAdminStores(statusFilter, search)
                  setStores(data)
                }} className="flex items-center gap-2 rounded-full gradient-primary px-6 py-2.5 text-sm font-bold text-primary-foreground">
                  <Plus className="h-4 w-4" /> Créer
                </button>
                <button onClick={() => setShowCreate(false)} className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-ink">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
