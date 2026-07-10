import { useEffect, useState } from "react"
import { fetchActivityLogs } from "@/lib/admin"
import { History, Search } from "lucide-react"
import type { ActivityLog } from "@/types/admin"
import Pagination from "@/components/Pagination"

export default function AdminActivityLog() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const pageSize = 6
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const filtered = logs.filter(log => {
    if (search) {
      const q = search.toLowerCase()
      if (!log.action.toLowerCase().includes(q) &&
          !(log.user_name || "").toLowerCase().includes(q) &&
          !(log.user_email || "").toLowerCase().includes(q) &&
          !log.entity_type.toLowerCase().includes(q)) return false
    }
    if (actionFilter !== "all" && !log.action.toLowerCase().includes(actionFilter)) return false
    return true
  })
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    fetchActivityLogs(200).then(data => { setLogs(data); setLoading(false) })
  }, [])

  useEffect(() => setPage(1), [logs])
  useEffect(() => setPage(1), [search, actionFilter])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Journal d'activité</h1>
        <p className="mt-1 text-sm text-ink-soft">Traçabilité de toutes les actions sensibles</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une action..."
            className="h-10 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-primary" />
        </div>
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value)}
          className="h-10 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary">
          <option value="all">Toutes les actions</option>
          <option value="update">Mise à jour</option>
          <option value="create">Création</option>
          <option value="delete">Suppression</option>
          <option value="toggle">Activation</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-14 animate-pulse rounded-2xl bg-muted" />)}</div>
      ) : (
        <div className="space-y-2">
          {paged.map(log => (
            <div key={log.id} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-3 shadow-card">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <History className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm text-ink">
                  <span className="font-semibold">{log.user_name || log.user_email || "Système"}</span>
                  <span className="text-muted-foreground"> a </span>
                  <span className="font-medium text-primary">{log.action.replace(/_/g, " ")}</span>
                  <span className="text-muted-foreground"> sur </span>
                  <span className="font-medium">{log.entity_type}</span>
                  {log.entity_id && <span className="text-muted-foreground"> (#{log.entity_id.slice(0, 8)})</span>}
                </div>
                <div className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString("fr-FR")}</div>
              </div>
            </div>
          ))}
          <Pagination current={page} total={filtered.length} pageSize={pageSize} onChange={setPage} />
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-border/60 bg-card p-12 text-center">
              <History className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-ink-soft">Aucune activité enregistrée</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
