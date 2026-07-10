import { useEffect, useState } from "react"
import { fetchActivityLogs } from "@/lib/admin"
import { History, Search } from "lucide-react"
import type { ActivityLog } from "@/types/admin"

export default function AdminActivityLog() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivityLogs(200).then(data => { setLogs(data); setLoading(false) })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Journal d'activité</h1>
        <p className="mt-1 text-sm text-ink-soft">Traçabilité de toutes les actions sensibles</p>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-14 animate-pulse rounded-2xl bg-muted" />)}</div>
      ) : (
        <div className="space-y-2">
          {logs.map(log => (
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
          {logs.length === 0 && (
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