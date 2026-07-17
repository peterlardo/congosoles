import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { FileText, CheckCircle, XCircle, Clock, Download } from "lucide-react"
import type { Invoice } from "@/types/admin"

export default function ClientInvoices() {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Invoice | null>(null)

  useEffect(() => {
    if (!user) return
    supabase.from("invoices").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => { setInvoices((data as any[]) || []); setLoading(false) })
  }, [user])

  const formatAmount = (a: number | string) => Number(a).toLocaleString("fr-FR")

  if (loading) return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-xl bg-muted" />
      <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />)}</div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Mes factures</h1>
        <p className="mt-1 text-sm text-ink-soft">{invoices.length} facture{invoices.length > 1 ? "s" : ""}</p>
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center shadow-card">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 font-semibold text-ink">Aucune facture</h3>
          <p className="mt-1 text-sm text-ink-soft">Vous n'avez pas encore de facture émise par Congo Soldes.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map(inv => (
            <div key={inv.id} onClick={() => setSelected(inv)}
              className="flex cursor-pointer items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
                inv.status === "paid" ? "bg-success/10 text-success"
                : inv.status === "cancelled" ? "bg-muted text-muted-foreground"
                : "bg-amber-500/10 text-amber-500"
              }`}>
                {inv.status === "paid" ? <CheckCircle className="h-6 w-6" />
                  : inv.status === "cancelled" ? <XCircle className="h-6 w-6" />
                  : <Clock className="h-6 w-6" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink">{inv.description}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    inv.status === "paid" ? "bg-success/10 text-success"
                    : inv.status === "cancelled" ? "bg-muted text-muted-foreground"
                    : "bg-amber-500/10 text-amber-500"
                  }`}>
                    {inv.status === "paid" ? "Payée" : inv.status === "cancelled" ? "Annulée" : "En attente"}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-bold text-lg text-ink">{formatAmount(inv.amount)} {inv.currency}</span>
                  <span>· {new Date(inv.created_at).toLocaleDateString("fr-FR")}</span>
                  {inv.due_date && <span>· Échéance : {new Date(inv.due_date).toLocaleDateString("fr-FR")}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-ink">Facture #{selected.id.slice(0, 8)}</h3>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                selected.status === "paid" ? "bg-success/10 text-success"
                : selected.status === "cancelled" ? "bg-muted text-muted-foreground"
                : "bg-amber-500/10 text-amber-500"
              }`}>
                {selected.status === "paid" ? "Payée" : selected.status === "cancelled" ? "Annulée" : "En attente"}
              </span>
            </div>

            <div className="rounded-2xl border border-border/60 p-6 text-center mb-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Montant total</p>
              <p className="mt-1 font-display text-4xl font-bold text-ink">{formatAmount(selected.amount)} <span className="text-lg text-muted-foreground">{selected.currency}</span></p>
              {selected.due_date && (
                <p className="mt-2 text-sm text-muted-foreground">
                  À payer avant le <strong>{new Date(selected.due_date).toLocaleDateString("fr-FR")}</strong>
                </p>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Description</span><span className="font-medium text-ink text-right max-w-xs">{selected.description}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Date d'émission</span><span className="font-medium text-ink">{new Date(selected.created_at).toLocaleDateString("fr-FR")}</span></div>
              {selected.paid_at && <div className="flex justify-between"><span className="text-muted-foreground">Payée le</span><span className="font-medium text-success">{new Date(selected.paid_at).toLocaleDateString("fr-FR")}</span></div>}
              {selected.notes && <div className="flex justify-between"><span className="text-muted-foreground">Notes</span><span className="font-medium text-ink text-right max-w-xs">{selected.notes}</span></div>}
            </div>

            <button onClick={() => setSelected(null)} className="mt-6 w-full rounded-full border border-border py-2.5 text-sm font-semibold text-ink transition hover:bg-muted">
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
