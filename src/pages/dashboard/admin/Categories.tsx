import { useEffect, useState } from "react"
import { fetchCategories, saveCategory, saveSubcategory, deleteCategory, deleteSubcategory } from "@/lib/admin"
import { Layers, Plus, Edit3, Trash2, X, Check, ChevronDown, ChevronRight } from "lucide-react"
import type { AdminCategory, AdminSubcategory } from "@/types/admin"

export default function AdminCategories() {
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<AdminCategory | null>(null)
  const [newSub, setNewSub] = useState<{ categoryId: string; name: string } | null>(null)
  const [expanded, setExpanded] = useState<string[]>([])
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [editingSub, setEditingSub] = useState<AdminSubcategory | null>(null)

  useEffect(() => {
    fetchCategories().then(data => { setCategories(data); setLoading(false) })
  }, [])

  const toggleExpand = (id: string) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handleSave = async () => {
    if (!editing) return
    await saveCategory(editing)
    const data = await fetchCategories()
    setCategories(data)
    setEditing(null)
  }

  const handleAddSub = async () => {
    if (!newSub) return
    await saveSubcategory({
      category_id: newSub.categoryId,
      name: newSub.name,
      slug: newSub.name.toLowerCase().replace(/\s+/g, "-"),
    })
    const data = await fetchCategories()
    setCategories(data)
    setNewSub(null)
  }

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id)
    const data = await fetchCategories()
    setCategories(data)
    setConfirmDelete(null)
  }

  const handleDeleteSub = async (id: string) => {
    await deleteSubcategory(id)
    const data = await fetchCategories()
    setCategories(data)
  }

  const handleSaveSub = async () => {
    if (!editingSub) return
    await saveSubcategory({
      id: editingSub.id,
      category_id: editingSub.category_id,
      name: editingSub.name,
      slug: editingSub.name.toLowerCase().replace(/\s+/g, "-"),
    })
    const data = await fetchCategories()
    setCategories(data)
    setEditingSub(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Catégories</h1>
          <p className="mt-1 text-sm text-ink-soft">{categories.length} catégories</p>
        </div>
        <button onClick={() => setEditing({ id: "", name: "", slug: "", display_order: categories.length + 1, is_active: true } as any)}
          className="inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
          <Plus className="h-4 w-4" /> Nouvelle catégorie
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />)}</div>
      ) : (
        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat.id} className="rounded-2xl border border-border/60 bg-card shadow-card">
              <div className="flex items-center gap-3 p-4">
                <button onClick={() => toggleExpand(cat.id)} className="text-muted-foreground">
                  {expanded.includes(cat.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary text-sm font-bold">
                  {cat.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-semibold text-ink">{cat.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{cat.subcategories?.length || 0} sous-catégories</span>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${cat.is_active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                  {cat.is_active ? "Actif" : "Inactif"}
                </span>
                <button onClick={() => setEditing(cat)} className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-ink">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button onClick={() => setConfirmDelete(cat.id)} className="rounded-lg p-2 text-muted-foreground transition hover:bg-red-50 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {expanded.includes(cat.id) && (
                <div className="border-t border-border/60 px-4 pb-4 pt-3 space-y-2">
                  {cat.subcategories?.map(sub => (
                    <div key={sub.id} className="flex items-center gap-3 rounded-xl bg-muted px-3 py-2">
                      {editingSub?.id === sub.id ? (
                        <>
                          <input value={editingSub.name} onChange={e => setEditingSub({ ...editingSub, name: e.target.value })}
                            className="h-7 flex-1 rounded-full border border-border bg-background px-3 text-sm outline-none"
                            onKeyDown={e => { if (e.key === "Enter") handleSaveSub(); if (e.key === "Escape") setEditingSub(null) }}
                            autoFocus
                          />
                          <button onClick={handleSaveSub} className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground">
                            <Check className="h-3 w-3" />
                          </button>
                          <button onClick={() => setEditingSub(null)} className="grid h-7 w-7 place-items-center rounded-full border border-border text-muted-foreground">
                            <X className="h-3 w-3" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => setEditingSub(sub)} className="flex-1 text-left text-sm text-ink hover:text-primary transition">
                            {sub.name}
                          </button>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${sub.is_active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                            {sub.is_active ? "Actif" : "Inactif"}
                          </span>
                          <button onClick={() => handleDeleteSub(sub.id)} className="rounded-lg p-1 text-muted-foreground transition hover:bg-red-50 hover:text-red-500">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                  <button onClick={() => setNewSub({ categoryId: cat.id, name: "" })}
                    className="flex items-center gap-2 text-sm text-primary font-semibold transition hover:underline">
                    <Plus className="h-3 w-3" /> Ajouter une sous-catégorie
                  </button>
                  {newSub?.categoryId === cat.id && (
                    <div className="flex gap-2">
                      <input value={newSub.name} onChange={e => setNewSub({ ...newSub, name: e.target.value })}
                        placeholder="Nom de la sous-catégorie"
                        className="h-9 flex-1 rounded-full border border-border bg-background px-3 text-sm outline-none"
                        onKeyDown={e => e.key === "Enter" && handleAddSub()}
                        autoFocus
                      />
                      <button onClick={handleAddSub} className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={() => setNewSub(null)} className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditing(null)}>
          <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">{editing.id ? "Modifier" : "Nouvelle"} catégorie</h3>
            <div className="mt-4 space-y-3">
              <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                placeholder="Nom" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <input value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })}
                placeholder="Slug" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <input value={editing.display_order} type="number" onChange={e => setEditing({ ...editing, display_order: parseInt(e.target.value) })}
                placeholder="Ordre d'affichage" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={editing.is_active} onChange={e => setEditing({ ...editing, is_active: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-primary" />
                Catégorie active
              </label>
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex-1 rounded-full gradient-primary py-2.5 text-sm font-bold text-primary-foreground">
                  Enregistrer
                </button>
                <button onClick={() => setEditing(null)} className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold text-ink">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setConfirmDelete(null)}>
          <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">Supprimer la catégorie</h3>
            <p className="mt-2 text-sm text-ink-soft">Cette action est irréversible. Toutes les sous-catégories associées seront également supprimées.</p>
            <div className="mt-5 flex gap-2">
              <button onClick={() => handleDeleteCategory(confirmDelete)}
                className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600">
                Supprimer
              </button>
              <button onClick={() => setConfirmDelete(null)}
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
