import { useEffect, useState } from "react"
import { fetchInvoices, createInvoice, updateInvoiceStatus, deleteInvoice } from "@/lib/admin"
import { FileText, Plus, Search, Check, X, Trash2, Download } from "lucide-react"
import type { Invoice } from "@/types/admin"
import Pagination from "@/components/Pagination"

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)
  const [selected, setSelected] = useState<Invoice | null>(null)
  const pageSize = 8

  const [form, setForm] = useState({ client_name: "", client_email: "", description: "", amount: "", due_date: "", notes: "" })

  const load = () => { setLoading(true); fetchInvoices().then(d => { setInvoices(d); setLoading(false) }) }
  useEffect(() => { load() }, [])

  const filtered = invoices.filter(i => {
    const q = search.toLowerCase()
    return (!search || i.client_name.toLowerCase().includes(q) || i.client_email.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
      && (statusFilter === "all" || i.status === statusFilter)
  })
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)
  useEffect(() => { setPage(1) }, [search, statusFilter])

  const totalPending = invoices.filter(i => i.status === "pending").reduce((a, i) => a + Number(i.amount), 0)
  const totalPaid = invoices.filter(i => i.status === "paid").reduce((a, i) => a + Number(i.amount), 0)

  const handleCreate = async () => {
    if (!form.client_name || !form.client_email || !form.description || !form.amount) { alert("Remplissez tous les champs obligatoires"); return }
    const { error } = await createInvoice({
      client_name: form.client_name, client_email: form.client_email,
      description: form.description, amount: parseFloat(form.amount),
      due_date: form.due_date || undefined, notes: form.notes || undefined,
    })
    if (error) { alert("Erreur : " + error.message); return }
    setShowCreate(false)
    setForm({ client_name: "", client_email: "", description: "", amount: "", due_date: "", notes: "" })
    load()
  }

  const handleStatus = async (id: string, status: string) => {
    const { error } = await updateInvoiceStatus(id, status)
    if (error) return
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: status as any, paid_at: status === "paid" ? new Date().toISOString() : i.paid_at } : i))
    if (selected?.id === id) setSelected({ ...selected, status: status as any, paid_at: status === "paid" ? new Date().toISOString() : selected.paid_at })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette facture ?")) return
    const { error } = await deleteInvoice(id)
    if (error) return
    setInvoices(prev => prev.filter(i => i.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const formatAmount = (a: number | string) => Number(a).toLocaleString("fr-FR")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Factures clients</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {invoices.length} facture{invoices.length > 1 ? "s" : ""} ·
            <span className="text-amber-600 font-semibold ml-1">{totalPending.toLocaleString("fr-FR")} XAF en attente</span>
            <span className="text-success font-semibold ml-2">{totalPaid.toLocaleString("fr-FR")} XAF payées</span>
          </p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:opacity-95">
          <Plus className="h-4 w-4" /> Nouvelle facture
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input placeholder="Rechercher par nom, email ou description..." value={search} onChange={e => setSearch(e.target.value)}
            className="h-10 w-full rounded-full border border-border bg-background pl-9 pr-4 text-sm outline-none focus:border-primary" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="h-10 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary">
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="paid">Payée</option>
          <option value="cancelled">Annulée</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />)}</div>
      ) : paged.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center shadow-card">
          <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-ink-soft">Aucune facture trouvée</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paged.map(inv => (
            <div key={inv.id} onClick={() => setSelected(inv)}
              className="flex cursor-pointer items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
                inv.status === "paid" ? "bg-success/10 text-success"
                : inv.status === "cancelled" ? "bg-muted text-muted-foreground"
                : "bg-amber-500/10 text-amber-500"
              }`}>
                <FileText className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-ink">{inv.client_name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    inv.status === "paid" ? "bg-success/10 text-success"
                    : inv.status === "cancelled" ? "bg-muted text-muted-foreground"
                    : "bg-amber-500/10 text-amber-500"
                  }`}>
                    {inv.status === "paid" ? "Payée" : inv.status === "cancelled" ? "Annulée" : "En attente"}
                  </span>
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {inv.client_email} · {formatAmount(inv.amount)} {inv.currency} · {inv.description}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(inv.created_at).toLocaleDateString("fr-FR")}
                  {inv.due_date && ` · Échéance : ${new Date(inv.due_date).toLocaleDateString("fr-FR")}`}
                </div>
              </div>
            </div>
          ))}
          {filtered.length > pageSize && <Pagination current={page} total={filtered.length} pageSize={pageSize} onChange={setPage} />}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-ink">Facture #{selected.id.slice(0, 8)}</h3>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                selected.status === "paid" ? "bg-success/10 text-success"
                : selected.status === "cancelled" ? "bg-muted text-muted-foreground"
                : "bg-amber-500/10 text-amber-500"
              }`}>
                {selected.status === "paid" ? "Payée" : selected.status === "cancelled" ? "Annulée" : "En attente"}
              </span>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Client</span><span className="font-medium text-ink">{selected.client_name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium text-ink">{selected.client_email}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Description</span><span className="font-medium text-ink text-right max-w-xs">{selected.description}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Montant</span><span className="font-bold text-lg text-ink">{formatAmount(selected.amount)} {selected.currency}</span></div>
              {selected.due_date && <div className="flex justify-between"><span className="text-muted-foreground">Échéance</span><span className="font-medium text-ink">{new Date(selected.due_date).toLocaleDateString("fr-FR")}</span></div>}
              {selected.notes && <div className="flex justify-between"><span className="text-muted-foreground">Notes</span><span className="font-medium text-ink text-right max-w-xs">{selected.notes}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">Créée le</span><span className="font-medium text-ink">{new Date(selected.created_at).toLocaleDateString("fr-FR")}</span></div>
              {selected.paid_at && <div className="flex justify-between"><span className="text-muted-foreground">Payée le</span><span className="font-medium text-success">{new Date(selected.paid_at).toLocaleDateString("fr-FR")}</span></div>}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {selected.status !== "paid" && (
                <button onClick={() => handleStatus(selected.id, "paid")}
                  className="flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
                  <Check className="h-4 w-4" /> Marquer payée
                </button>
              )}
              {selected.status !== "cancelled" && selected.status !== "paid" && (
                <button onClick={() => handleStatus(selected.id, "cancelled")}
                  className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink">
                  <X className="h-4 w-4" /> Annuler
                </button>
              )}
              {selected.status === "paid" && (
                <button onClick={() => handleStatus(selected.id, "pending")}
                  className="flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink">
                  <X className="h-4 w-4" /> Réouvrir
                </button>
              )}
              <button onClick={() => handleDelete(selected.id)}
                className="flex items-center gap-2 rounded-full border border-red-500/30 px-5 py-2.5 text-sm font-semibold text-red-500">
                <Trash2 className="h-4 w-4" /> Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowCreate(false)}>
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">Nouvelle facture</h3>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })}
                  placeholder="Nom du client *" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
                <input value={form.client_email} onChange={e => setForm({ ...form, client_email: e.target.value })}
                  placeholder="Email du client *" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              </div>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Description de la facture *" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <div className="grid grid-cols-2 gap-3">
                <input value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                  type="number" step="0.01" placeholder="Montant * (XAF)"
                  className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
                <input value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })}
                  type="date" placeholder="Date d'échéance"
                  className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              </div>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="Notes optionnelles" rows={3}
                className="h-20 w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-primary" />
              <div className="flex gap-2 pt-2">
                <button onClick={handleCreate}
                  className="flex items-center gap-2 rounded-full gradient-primary px-6 py-2.5 text-sm font-bold text-primary-foreground">
                  <Plus className="h-4 w-4" /> Créer la facture
                </button>
                <button onClick={() => setShowCreate(false)} className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-ink">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
