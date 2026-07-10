import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { fetchSubscriptions } from "@/lib/admin"
import { CreditCard, Search, Check, X } from "lucide-react"
import type { Subscription } from "@/types/admin"

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscriptions().then(data => { setSubscriptions(data); setLoading(false) })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Abonnements</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {subscriptions.filter(s => s.status === "active").length} actifs · {subscriptions.length} total
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />)}</div>
      ) : (
        <div className="space-y-3">
          {subscriptions.map(sub => (
            <div key={sub.id} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink">{sub.plan_name || "Plan inconnu"}</span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
                    sub.status === "active" ? "bg-success/10 text-success"
                    : sub.status === "expired" ? "bg-red-500/10 text-red-500"
                    : sub.status === "cancelled" ? "bg-amber-500/10 text-amber-500"
                    : "bg-muted text-muted-foreground"
                  }`}>{sub.status}</span>
                </div>
                <div className="text-xs text-muted-foreground">{sub.user_email} · {new Date(sub.starts_at).toLocaleDateString("fr-FR")} → {new Date(sub.expires_at).toLocaleDateString("fr-FR")}</div>
              </div>
              <span className="text-xs text-muted-foreground">{sub.auto_renew ? "Renouvellement auto" : "Manuel"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}