import { useEffect, useState } from "react"
import Pagination from "@/components/Pagination"
import { fetchPayments, updatePaymentStatus, deletePayment } from "@/lib/admin"
import { DollarSign, RotateCcw, X, Check, Trash2, Search } from "lucide-react"
import type { Payment } from "@/types/admin"

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Payment | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const pageSize = 6

  const load = () => fetchPayments().then(data => { setPayments(data); setLoading(false) })

  useEffect(() => { load() }, [])

  const total = payments.reduce((acc, p) => acc + (p.status === "completed" ? p.amount : 0), 0)

  const handleStatus = async (id: string, status: string) => {
    await updatePaymentStatus(id, status)
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: status as any } : p))
    setSelected(null)
  }

  const handleDelete = async (id: string) => {
    await deletePayment(id)
    setPayments(prev => prev.filter(p => p.id !== id))
    setSelected(null)
  }

  const filteredPayments = payments.filter(p => {
    const matchesSearch = !search || p.user_email?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || p.status === statusFilter
    return matchesSearch && matchesStatus
  })
  const paged = filteredPayments.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => setPage(1), [search, statusFilter])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Paiements</h1>
        <p className="mt-1 text-sm text-ink-soft">{payments.length} transactions · {total.toLocaleString("fr-FR")} XAF encaissés</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input placeholder="Rechercher un paiement..." value={search} onChange={e => setSearch(e.target.value)}
            className="h-10 w-full rounded-full border border-border bg-background pl-9 pr-4 text-sm outline-none focus:border-primary" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="h-10 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary">
          <option value="all">Tous les statuts</option>
          <option value="completed">Complété</option>
          <option value="pending">En attente</option>
          <option value="failed">Échoué</option>
          <option value="refunded">Remboursé</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />)}</div>
      ) : (
        <div className="space-y-3">
          {paged.map(p => (
            <div key={p.id}
              className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card cursor-pointer transition hover:-translate-y-0.5 hover:shadow-lift"
              onClick={() => setSelected(p)}>
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
          {filteredPayments.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">Aucun paiement trouvé.</p>
          )}
          {filteredPayments.length > pageSize && (
            <Pagination current={page} total={filteredPayments.length} pageSize={pageSize} onChange={setPage} />
          )}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">Détails du paiement</h3>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-muted p-3 text-sm space-y-1">
                <p><strong>Montant :</strong> {selected.amount.toLocaleString("fr-FR")} {selected.currency}</p>
                <p><strong>Statut :</strong> <span className={`font-bold ${
                  selected.status === "completed" ? "text-success"
                  : selected.status === "failed" ? "text-red-500"
                  : "text-amber-500"
                }`}>{selected.status}</span></p>
                <p><strong>Utilisateur :</strong> {selected.user_email}</p>
                <p><strong>Méthode :</strong> {selected.method} ({selected.provider})</p>
                <p><strong>Date :</strong> {new Date(selected.created_at).toLocaleDateString("fr-FR")}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {selected.status !== "completed" && (
                  <button onClick={() => handleStatus(selected.id, "completed")}
                    className="flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
                    <Check className="h-4 w-4" /> Marquer comme complété
                  </button>
                )}
                {selected.status !== "refunded" && (
                  <button onClick={() => handleStatus(selected.id, "refunded")}
                    className="flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-white">
                    <RotateCcw className="h-4 w-4" /> Rembourser
                  </button>
                )}
                {selected.status !== "failed" && (
                  <button onClick={() => handleStatus(selected.id, "failed")}
                    className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink">
                    <X className="h-4 w-4" /> Marquer comme échoué
                  </button>
                )}
                <button onClick={() => { if (confirm("Supprimer ce paiement ?")) handleDelete(selected.id) }}
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
