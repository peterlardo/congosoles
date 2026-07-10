import { useEffect, useState } from "react"
import { fetchCMSPages, saveCMSPage, deleteCMSPage } from "@/lib/admin"
import { FileText, Plus, Edit3, Trash2, Save, X, Search } from "lucide-react"
import type { CMSPage } from "@/types/admin"

export default function AdminCMSPages() {
  const [pages, setPages] = useState<CMSPage[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<CMSPage> | null>(null)
  const [deleting, setDeleting] = useState<CMSPage | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all")

  useEffect(() => {
    fetchCMSPages().then(data => { setPages(data); setLoading(false) })
  }, [])

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all"
      || (statusFilter === "published" && page.is_published)
      || (statusFilter === "draft" && !page.is_published)
    return matchesSearch && matchesStatus
  })

  const handleSave = async () => {
    if (!editing) return
    await saveCMSPage(editing)
    if (editing.id) {
      setPages(prev => prev.map(p => p.id === editing.id ? { ...p, ...editing } as CMSPage : p))
    } else {
      fetchCMSPages().then(data => setPages(data))
    }
    setEditing(null)
  }

  const handleDelete = async (id: string) => {
    await deleteCMSPage(id)
    setPages(prev => prev.filter(p => p.id !== id))
    setDeleting(null)
  }

  const startCreate = () => {
    setEditing({ title: "", content: "", meta_title: "", meta_description: "", is_published: false, slug: "" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Pages CMS</h1>
          <p className="mt-1 text-sm text-ink-soft">{filteredPages.length} pages</p>
        </div>
        <button onClick={startCreate} className="flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
          <Plus className="h-4 w-4" /> Nouvelle page
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une page..."
            className="h-10 w-full rounded-full border border-border bg-background pl-9 pr-4 text-sm outline-none focus:border-primary" />
        </div>
        <div className="flex gap-1.5 rounded-full border border-border bg-card p-1">
          {(["all", "published", "draft"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${statusFilter === s ? "bg-primary text-primary-foreground" : "text-ink-soft hover:text-ink"}`}>
              {s === "all" ? "Toutes" : s === "published" ? "Publiées" : "Brouillons"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />)}</div>
      ) : (
        <div className="space-y-2">
          {filteredPages.map(page => (
            <div key={page.id} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink">{page.title}</span>
                  <span className="text-xs text-muted-foreground">/{page.slug}</span>
                </div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${page.is_published ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                {page.is_published ? "Publiée" : "Brouillon"}
              </span>
              <button onClick={() => setEditing(page)} className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-ink">
                <Edit3 className="h-4 w-4" />
              </button>
              <button onClick={() => setDeleting(page)} className="rounded-lg p-2 text-muted-foreground transition hover:bg-red-500/10 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditing(null)}>
          <div className="w-full max-w-2xl rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">{editing.id ? "Modifier" : "Nouvelle page"} : {editing.title || "Sans titre"}</h3>
            <div className="mt-4 space-y-3">
              <input value={editing.title || ""} onChange={e => setEditing({ ...editing, title: e.target.value })}
                placeholder="Titre" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <input value={editing.slug || ""} onChange={e => setEditing({ ...editing, slug: e.target.value })}
                placeholder="Slug (URL)" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <textarea value={editing.content || ""} onChange={e => setEditing({ ...editing, content: e.target.value })}
                placeholder="Contenu HTML" className="h-48 w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-primary font-mono" />
              <input value={editing.meta_title || ""} onChange={e => setEditing({ ...editing, meta_title: e.target.value })}
                placeholder="Meta title (SEO)" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <input value={editing.meta_description || ""} onChange={e => setEditing({ ...editing, meta_description: e.target.value })}
                placeholder="Meta description (SEO)" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={!!editing.is_published} onChange={e => setEditing({ ...editing, is_published: e.target.checked })} />
                Publiée
              </label>
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
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

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDeleting(null)}>
          <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">Supprimer la page</h3>
            <p className="mt-2 text-sm text-ink-soft">Voulez-vous vraiment supprimer la page <strong>{deleting.title}</strong> ? Cette action est irréversible.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => handleDelete(deleting.id)} className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-bold text-white">Supprimer</button>
              <button onClick={() => setDeleting(null)} className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold text-ink">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
