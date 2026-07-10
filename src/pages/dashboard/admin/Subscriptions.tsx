import { useEffect, useState } from "react"
import { fetchSubscriptions, cancelSubscription, updateSubscription, fetchSubscriptionPlans, saveSubscriptionPlan, deleteSubscriptionPlan } from "@/lib/admin"
import { CreditCard, Search, Plus, Trash2, Edit3, X, Check } from "lucide-react"
import type { Subscription, SubscriptionPlan } from "@/types/admin"

type Tab = "subscriptions" | "plans"

export default function AdminSubscriptions() {
  const [tab, setTab] = useState<Tab>("subscriptions")
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null)
  const [confirmDeletePlan, setConfirmDeletePlan] = useState<string | null>(null)

  const loadSubscriptions = async () => {
    setSubscriptions(await fetchSubscriptions())
  }

  const loadPlans = async () => {
    setPlans(await fetchSubscriptionPlans())
  }

  useEffect(() => {
    Promise.all([fetchSubscriptions(), fetchSubscriptionPlans()]).then(([subs, plns]) => {
      setSubscriptions(subs)
      setPlans(plns)
      setLoading(false)
    })
  }, [])

  const handleCancelSubscription = async (id: string) => {
    await cancelSubscription(id)
    await loadSubscriptions()
    setConfirmCancel(null)
  }

  const handleSavePlan = async () => {
    if (!editingPlan) return
    const payload: any = { ...editingPlan }
    if (!payload.id) delete payload.id
    if (typeof payload.features === "string") {
      payload.features = (payload.features as string).split("\n").map(f => f.trim()).filter(Boolean)
    }
    await saveSubscriptionPlan(payload)
    await loadPlans()
    setEditingPlan(null)
  }

  const handleDeletePlan = async (id: string) => {
    await deleteSubscriptionPlan(id)
    await loadPlans()
    setConfirmDeletePlan(null)
  }

  const filteredSubs = statusFilter === "all" ? subscriptions : subscriptions.filter(s => s.status === statusFilter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Abonnements</h1>
        <span className="text-sm text-ink-soft">
          {subscriptions.filter(s => s.status === "active").length} actifs · {subscriptions.length} total
        </span>
      </div>

      <div className="flex gap-1 rounded-2xl bg-muted p-1">
        <button onClick={() => setTab("subscriptions")}
          className={`flex-1 rounded-xl py-2 text-sm font-bold transition ${tab === "subscriptions" ? "bg-card text-ink shadow-sm" : "text-muted-foreground hover:text-ink"}`}>
          Abonnements
        </button>
        <button onClick={() => setTab("plans")}
          className={`flex-1 rounded-xl py-2 text-sm font-bold transition ${tab === "plans" ? "bg-card text-ink shadow-sm" : "text-muted-foreground hover:text-ink"}`}>
          Plans
        </button>
      </div>

      {tab === "subscriptions" && (
        <>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="Rechercher..." className="h-10 w-full rounded-full border border-border bg-background pl-9 pr-4 text-sm outline-none focus:border-primary" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="h-10 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary">
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="expired">Expiré</option>
              <option value="cancelled">Annulé</option>
              <option value="suspended">Suspendu</option>
            </select>
          </div>

          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />)}</div>
          ) : (
            <div className="space-y-3">
              {filteredSubs.map(sub => (
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
                  {sub.status === "active" && (
                    <button onClick={() => setConfirmCancel(sub.id)}
                      className="shrink-0 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white">
                      Annuler
                    </button>
                  )}
                </div>
              ))}
              {filteredSubs.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">Aucun abonnement trouvé.</p>
              )}
            </div>
          )}
        </>
      )}

      {tab === "plans" && (
        <>
          <button onClick={() => setEditingPlan({
            id: "", name: "", slug: "", description: "", price: 0, max_promotions: 0, max_stores: 0, duration_days: 30, features: [], is_active: true
          } as any)}
            className="inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
            <Plus className="h-4 w-4" /> Nouveau plan
          </button>

          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />)}</div>
          ) : (
            <div className="space-y-2">
              {plans.map(plan => (
                <div key={plan.id} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-ink">{plan.name}</span>
                      <span className="text-sm font-bold text-primary">{plan.price.toLocaleString("fr-FR")} FCFA</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${plan.is_active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                        {plan.is_active ? "Actif" : "Inactif"}
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{plan.duration_days} jours · {plan.features?.length || 0} fonctionnalités</div>
                  </div>
                  <button onClick={() => setEditingPlan({
                    ...plan,
                    features: plan.features || []
                  })} className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-ink">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setConfirmDeletePlan(plan.id)} className="rounded-lg p-2 text-muted-foreground transition hover:bg-red-50 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {plans.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">Aucun plan trouvé.</p>
              )}
            </div>
          )}
        </>
      )}

      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditingPlan(null)}>
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">{editingPlan.id ? "Modifier" : "Nouveau"} plan</h3>
            <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto">
              <input value={editingPlan.name} onChange={e => setEditingPlan({ ...editingPlan, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                placeholder="Nom du plan" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <textarea value={editingPlan.description} onChange={e => setEditingPlan({ ...editingPlan, description: e.target.value })}
                placeholder="Description" rows={3} className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary resize-none" />
              <div className="flex gap-3">
                <input value={editingPlan.price} type="number" onChange={e => setEditingPlan({ ...editingPlan, price: parseFloat(e.target.value) || 0 })}
                  placeholder="Prix (FCFA)" className="h-10 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
                <input value={editingPlan.duration_days} type="number" onChange={e => setEditingPlan({ ...editingPlan, duration_days: parseInt(e.target.value) || 0 })}
                  placeholder="Durée (jours)" className="h-10 w-32 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              </div>
              <div className="flex gap-3">
                <input value={editingPlan.max_stores} type="number" onChange={e => setEditingPlan({ ...editingPlan, max_stores: parseInt(e.target.value) || 0 })}
                  placeholder="Max magasins" className="h-10 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
                <input value={editingPlan.max_promotions} type="number" onChange={e => setEditingPlan({ ...editingPlan, max_promotions: parseInt(e.target.value) || 0 })}
                  placeholder="Max promotions" className="h-10 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-soft">Fonctionnalités (une par ligne)</label>
                <textarea value={Array.isArray(editingPlan.features) ? editingPlan.features.join("\n") : editingPlan.features || ""}
                  onChange={e => setEditingPlan({ ...editingPlan, features: e.target.value.split("\n").map(f => f.trim()).filter(Boolean) })}
                  placeholder="Fonctionnalité 1&#10;Fonctionnalité 2&#10;Fonctionnalité 3"
                  rows={4} className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary resize-none" />
              </div>
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={editingPlan.is_active} onChange={e => setEditingPlan({ ...editingPlan, is_active: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-primary" />
                Plan actif
              </label>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSavePlan} className="flex-1 rounded-full gradient-primary py-2.5 text-sm font-bold text-primary-foreground">
                  Enregistrer
                </button>
                <button onClick={() => setEditingPlan(null)} className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold text-ink">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setConfirmCancel(null)}>
          <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">Annuler l'abonnement</h3>
            <p className="mt-2 text-sm text-ink-soft">L'abonnement sera désactivé et le renouvellement automatique désactivé. Cette action peut être réversible en réactivant l'abonnement.</p>
            <div className="mt-5 flex gap-2">
              <button onClick={() => handleCancelSubscription(confirmCancel)}
                className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600">
                Confirmer l'annulation
              </button>
              <button onClick={() => setConfirmCancel(null)}
                className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold text-ink">
                Retour
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeletePlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setConfirmDeletePlan(null)}>
          <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">Supprimer le plan</h3>
            <p className="mt-2 text-sm text-ink-soft">Cette action est irréversible. Les abonnements liés à ce plan ne seront pas affectés.</p>
            <div className="mt-5 flex gap-2">
              <button onClick={() => handleDeletePlan(confirmDeletePlan)}
                className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600">
                Supprimer
              </button>
              <button onClick={() => setConfirmDeletePlan(null)}
                className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold text-ink">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
