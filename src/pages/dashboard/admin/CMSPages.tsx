import { useEffect, useState } from "react"
import { fetchCMSPages } from "@/lib/admin"
import { supabase } from "@/lib/supabase"
import { FileText, Edit3, Save, X } from "lucide-react"
import type { CMSPage } from "@/types/admin"

export default function AdminCMSPages() {
  const [pages, setPages] = useState<CMSPage[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<CMSPage | null>(null)

  useEffect(() => {
    fetchCMSPages().then(data => { setPages(data); setLoading(false) })
  }, [])

  const handleSave = async () => {
    if (!editing) return
    await supabase.from("cms_pages").update({
      title: editing.title,
      content: editing.content,
      meta_title: editing.meta_title,
      meta_description: editing.meta_description,
      is_published: editing.is_published,
    }).eq("id", editing.id)
    setPages(prev => prev.map(p => p.id === editing.id ? editing : p))
    setEditing(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Pages CMS</h1>
        <p className="mt-1 text-sm text-ink-soft">{pages.length} pages</p>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />)}</div>
      ) : (
        <div className="space-y-2">
          {pages.map(page => (
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
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditing(null)}>
          <div className="w-full max-w-2xl rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">Modifier : {editing.title}</h3>
            <div className="mt-4 space-y-3">
              <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })}
                className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <textarea value={editing.content} onChange={e => setEditing({ ...editing, content: e.target.value })}
                className="h-48 w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-primary font-mono" />
              <input value={editing.meta_title} onChange={e => setEditing({ ...editing, meta_title: e.target.value })}
                placeholder="Meta title (SEO)" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <input value={editing.meta_description} onChange={e => setEditing({ ...editing, meta_description: e.target.value })}
                placeholder="Meta description (SEO)" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={editing.is_published} onChange={e => setEditing({ ...editing, is_published: e.target.checked })} />
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
    </div>
  )
}