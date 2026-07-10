import { useEffect, useState } from "react"
import { fetchDistricts, saveDistrict, deleteDistrict, saveNeighborhood, deleteNeighborhood } from "@/lib/admin"
import { MapPin, Plus, Edit3, Trash2, X, Check, ChevronDown, ChevronRight } from "lucide-react"
import type { District, Neighborhood } from "@/types/admin"

export default function AdminLocations() {
  const [districts, setDistricts] = useState<District[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string[]>([])
  const [newNeighborhood, setNewNeighborhood] = useState<{ districtId: string; name: string } | null>(null)
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null)
  const [confirmDeleteDistrict, setConfirmDeleteDistrict] = useState<string | null>(null)
  const [editingNeighborhood, setEditingNeighborhood] = useState<Neighborhood | null>(null)
  const [confirmDeleteNeighborhood, setConfirmDeleteNeighborhood] = useState<string | null>(null)

  useEffect(() => {
    fetchDistricts().then(data => { setDistricts(data); setLoading(false) })
  }, [])

  const addNeighborhood = async () => {
    if (!newNeighborhood) return
    await saveNeighborhood({
      district_id: newNeighborhood.districtId,
      name: newNeighborhood.name,
      slug: newNeighborhood.name.toLowerCase().replace(/\s+/g, "-"),
    })
    setDistricts(await fetchDistricts())
    setNewNeighborhood(null)
  }

  const handleSaveDistrict = async () => {
    if (!editingDistrict) return
    await saveDistrict({
      ...editingDistrict,
      slug: editingDistrict.name.toLowerCase().replace(/\s+/g, "-"),
    })
    setDistricts(await fetchDistricts())
    setEditingDistrict(null)
  }

  const handleDeleteDistrict = async (id: string) => {
    await deleteDistrict(id)
    setDistricts(await fetchDistricts())
    setConfirmDeleteDistrict(null)
  }

  const handleSaveNeighborhood = async () => {
    if (!editingNeighborhood) return
    await saveNeighborhood({
      ...editingNeighborhood,
      slug: editingNeighborhood.name.toLowerCase().replace(/\s+/g, "-"),
    })
    setDistricts(await fetchDistricts())
    setEditingNeighborhood(null)
  }

  const handleDeleteNeighborhood = async (id: string) => {
    await deleteNeighborhood(id)
    setDistricts(await fetchDistricts())
    setConfirmDeleteNeighborhood(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Localisations</h1>
          <p className="mt-1 text-sm text-ink-soft">{districts.length} arrondissements</p>
        </div>
        <button onClick={() => setEditingDistrict({ id: "", name: "", slug: "", display_order: districts.length + 1, is_active: true } as any)}
          className="inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
          <Plus className="h-4 w-4" /> Nouvel arrondissement
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />)}</div>
      ) : (
        <div className="space-y-2">
          {districts.map(dist => (
            <div key={dist.id} className="rounded-2xl border border-border/60 bg-card shadow-card">
              <div className="flex items-center gap-3 p-4">
                <button onClick={() => setExpanded(p => p.includes(dist.id) ? p.filter(i => i !== dist.id) : [...p, dist.id])} className="text-muted-foreground">
                  {expanded.includes(dist.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                <MapPin className="h-5 w-5 text-primary" />
                <span className="flex-1 text-sm font-semibold text-ink">{dist.name}</span>
                <span className="text-xs text-muted-foreground">{dist.neighborhoods?.length || 0} quartiers</span>
                <button onClick={() => setEditingDistrict(dist)} className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-ink">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button onClick={() => setConfirmDeleteDistrict(dist.id)} className="rounded-lg p-2 text-muted-foreground transition hover:bg-red-50 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {expanded.includes(dist.id) && (
                <div className="border-t border-border/60 px-4 pb-4 pt-3 space-y-2">
                  {dist.neighborhoods?.map(n => (
                    <div key={n.id} className="flex items-center gap-3 rounded-xl bg-muted px-3 py-2">
                      {editingNeighborhood?.id === n.id ? (
                        <>
                          <input value={editingNeighborhood.name} onChange={e => setEditingNeighborhood({ ...editingNeighborhood, name: e.target.value })}
                            className="h-7 flex-1 rounded-full border border-border bg-background px-3 text-sm outline-none"
                            onKeyDown={e => { if (e.key === "Enter") handleSaveNeighborhood(); if (e.key === "Escape") setEditingNeighborhood(null) }}
                            autoFocus
                          />
                          <button onClick={handleSaveNeighborhood} className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground">
                            <Check className="h-3 w-3" />
                          </button>
                          <button onClick={() => setEditingNeighborhood(null)} className="grid h-7 w-7 place-items-center rounded-full border border-border text-muted-foreground">
                            <X className="h-3 w-3" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => setEditingNeighborhood(n)} className="flex-1 text-left text-sm text-ink hover:text-primary transition">
                            {n.name}
                          </button>
                          <button onClick={() => setConfirmDeleteNeighborhood(n.id)} className="rounded-lg p-1 text-muted-foreground transition hover:bg-red-50 hover:text-red-500">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                  <button onClick={() => setNewNeighborhood({ districtId: dist.id, name: "" })}
                    className="flex items-center gap-2 text-sm text-primary font-semibold"><Plus className="h-3 w-3" /> Ajouter un quartier</button>
                  {newNeighborhood?.districtId === dist.id && (
                    <div className="flex gap-2">
                      <input value={newNeighborhood.name} onChange={e => setNewNeighborhood({ ...newNeighborhood, name: e.target.value })}
                        placeholder="Nom du quartier" className="h-9 flex-1 rounded-full border border-border bg-background px-3 text-sm outline-none"
                        onKeyDown={e => e.key === "Enter" && addNeighborhood()} autoFocus />
                      <button onClick={addNeighborhood} className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="h-4 w-4" /></button>
                      <button onClick={() => setNewNeighborhood(null)} className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground"><X className="h-4 w-4" /></button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editingDistrict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditingDistrict(null)}>
          <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">{editingDistrict.id ? "Modifier" : "Nouvel"} arrondissement</h3>
            <div className="mt-4 space-y-3">
              <input value={editingDistrict.name} onChange={e => setEditingDistrict({ ...editingDistrict, name: e.target.value })}
                placeholder="Nom" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <input value={editingDistrict.display_order} type="number" onChange={e => setEditingDistrict({ ...editingDistrict, display_order: parseInt(e.target.value) })}
                placeholder="Ordre d'affichage" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={editingDistrict.is_active} onChange={e => setEditingDistrict({ ...editingDistrict, is_active: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-primary" />
                Arrondissement actif
              </label>
              <div className="flex gap-2">
                <button onClick={handleSaveDistrict} className="flex-1 rounded-full gradient-primary py-2.5 text-sm font-bold text-primary-foreground">
                  Enregistrer
                </button>
                <button onClick={() => setEditingDistrict(null)} className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold text-ink">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteDistrict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setConfirmDeleteDistrict(null)}>
          <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">Supprimer l'arrondissement</h3>
            <p className="mt-2 text-sm text-ink-soft">Cette action est irréversible. Tous les quartiers associés seront également supprimés.</p>
            <div className="mt-5 flex gap-2">
              <button onClick={() => handleDeleteDistrict(confirmDeleteDistrict)}
                className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600">
                Supprimer
              </button>
              <button onClick={() => setConfirmDeleteDistrict(null)}
                className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold text-ink">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteNeighborhood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setConfirmDeleteNeighborhood(null)}>
          <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">Supprimer le quartier</h3>
            <p className="mt-2 text-sm text-ink-soft">Cette action est irréversible.</p>
            <div className="mt-5 flex gap-2">
              <button onClick={() => handleDeleteNeighborhood(confirmDeleteNeighborhood)}
                className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600">
                Supprimer
              </button>
              <button onClick={() => setConfirmDeleteNeighborhood(null)}
                className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold text-ink">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
