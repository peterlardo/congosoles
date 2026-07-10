import { useEffect, useState } from "react"
import Pagination from "@/components/Pagination"
import { supabase } from "@/lib/supabase"
import { fetchReports, updateReportStatus, deleteReport } from "@/lib/admin"
import { AlertTriangle, Trash2, Search, Check, X, Eye, MessageCircle, Flag } from "lucide-react"
import type { Report } from "@/types/admin"

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("pending")
  const [selected, setSelected] = useState<Report | null>(null)
  const [notes, setNotes] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 6

  useEffect(() => {
    fetchReports().then(data => { setReports(data); setLoading(false) })
  }, [])

  const filtered = filter === "all" ? reports : reports.filter(r => r.status === filter)
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => setPage(1), [filter])

  const handleResolve = async (id: string, status: string) => {
    await updateReportStatus(id, status, notes)
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: status as any, resolution_notes: notes } : r))
    setSelected(null)
    setNotes("")
  }

  const handleDelete = async (id: string) => {
    await deleteReport(id)
    setReports(prev => prev.filter(r => r.id !== id))
    setSelected(null)
    setNotes("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Signalements</h1>
        <p className="mt-1 text-sm text-ink-soft">{reports.filter(r => r.status === "pending").length} en attente</p>
      </div>

      <div className="flex gap-1.5 rounded-full border border-border bg-card p-1 w-fit">
        {["pending", "investigating", "resolved", "dismissed", "all"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${filter === s ? "bg-primary text-primary-foreground" : "text-ink-soft hover:text-ink"}`}>
            {s === "all" ? "Tous" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />)}</div>
      ) : (
        <div className="space-y-3">
          {paged.map(report => (
            <div key={report.id}
              className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card cursor-pointer transition hover:-translate-y-0.5 hover:shadow-lift"
              onClick={() => { setSelected(report); setNotes(report.resolution_notes || "") }}>
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                report.status === "pending" ? "bg-red-500/10 text-red-500"
                : report.status === "investigating" ? "bg-amber-500/10 text-amber-500"
                : "bg-green-500/10 text-green-500"
              }`}>
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink capitalize">{report.reason.replace(/_/g, " ")}</span>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{report.target_type}</span>
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {report.description || "Aucune description"} · par {report.reporter_name || "Anonyme"}
                </div>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                report.status === "pending" ? "bg-red-500/10 text-red-500"
                : report.status === "investigating" ? "bg-amber-500/10 text-amber-500"
                : report.status === "resolved" ? "bg-green-500/10 text-green-500"
                : "bg-muted text-muted-foreground"
              }`}>{report.status}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-border/60 bg-card p-12 text-center">
              <Flag className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-ink-soft">Aucun signalement</p>
            </div>
          )}
          {filtered.length > pageSize && (
            <Pagination current={page} total={filtered.length} pageSize={pageSize} onChange={setPage} />
          )}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">Traiter le signalement</h3>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-muted p-3 text-sm">
                <p><strong>Type :</strong> {selected.target_type}</p>
                <p><strong>Raison :</strong> <span className="capitalize">{selected.reason.replace(/_/g, " ")}</span></p>
                <p><strong>Signaleur :</strong> {selected.reporter_name || "Anonyme"}</p>
                <p className="mt-2">{selected.description || "Aucune description"}</p>
              </div>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Notes de résolution..."
                className="h-24 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none transition focus:border-primary"
              />
              <div className="flex gap-2">
                <button onClick={() => handleResolve(selected.id, "resolved")}
                  className="flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
                  <Check className="h-4 w-4" /> Résoudre
                </button>
                <button onClick={() => handleResolve(selected.id, "dismissed")}
                  className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink">
                  <X className="h-4 w-4" /> Ignorer
                </button>
                <button onClick={() => handleResolve(selected.id, "investigating")}
                  className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink">
                  <Eye className="h-4 w-4" /> En cours
                </button>
                <button onClick={() => { if (confirm("Supprimer ce signalement ?")) handleDelete(selected.id) }}
                  className="flex items-center gap-2 rounded-full border border-red-500/30 px-5 py-2.5 text-sm font-semibold text-red-500">
                  <Trash2 className="h-4 w-4" /> Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
