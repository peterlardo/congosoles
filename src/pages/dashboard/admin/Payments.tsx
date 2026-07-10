import { useEffect, useState } from "react"
import { fetchPayments } from "@/lib/admin"
import { DollarSign, Search } from "lucide-react"
import type { Payment } from "@/types/admin"

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayments().then(data => { setPayments(data); setLoading(false) })
  }, [])

  const total = payments.reduce((acc, p) => acc + (p.status === "completed" ? p.amount : 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Paiements</h1>
        <p className="mt-1 text-sm text-ink-soft">{payments.length} transactions · {total.toLocaleString("fr-FR")} XAF encaissés</p>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />)}</div>
      ) : (
        <div className="space-y-3">
          {payments.map(p => (
            <div key={p.id} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card">
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                p.status === "completed" ? "bg-success/10 text-success"
                : p.status === "failed" ? "bg-red-500/10 text-red-500"
                : "bg-amber-500/10 text-amber-500"
              }`}>
                <DollarSign className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink">{p.amount.toLocaleString("fr-FR")} {p.currency}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    p.status === "completed" ? "bg-success/10 text-success"
                    : p.status === "failed" ? "bg-red-500/10 text-red-500"
                    : "bg-amber-500/10 text-amber-500"
                  }`}>{p.status}</span>
                </div>
                <div className="text-xs text-muted-foreground">{p.user_email} · {p.method} ({p.provider}) · {new Date(p.created_at).toLocaleDateString("fr-FR")}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}