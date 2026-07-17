import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { fetchSubscriptionPlans, saveSubscriptionPlan } from "@/lib/admin"
import { CreditCard, Save, Edit3, X, Store, Users, TrendingUp, Crown, Zap } from "lucide-react"
import type { SubscriptionPlan } from "@/types/admin"

interface PlanStats {
  slug: string
  store_count: number
  vendor_count: number
}

export default function AdminPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [stats, setStats] = useState<PlanStats[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<SubscriptionPlan> | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const plansData = await fetchSubscriptionPlans()
    setPlans(plansData)

    const { data: stores } = await supabase
      .from("stores")
      .select("id, plan, user_id")

    if (stores) {
      const planMap = new Map<string, { stores: Set<string>; vendors: Set<string> }>()

      for (const plan of plansData) {
        planMap.set(plan.slug, { stores: new Set(), vendors: new Set() })
      }

      for (const s of stores) {
        const key = s.plan || "free"
        if (!planMap.has(key)) planMap.set(key, { stores: new Set(), vendors: new Set() })
        const entry = planMap.get(key)!
        entry.stores.add(s.id)
        if (s.user_id) entry.vendors.add(s.user_id)
      }

      setStats(
        Array.from(planMap.entries()).map(([slug, data]) => ({
          slug,
          store_count: data.stores.size,
          vendor_count: data.vendors.size,
        }))
      )
    }

    setLoading(false)
  }

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditing({ ...plan })
  }

  const handleSave = async () => {
    if (!editing) return
    const payload: any = { ...editing }
    if (typeof payload.features === "string") {
      payload.features = (payload.features as string).split("\n").map((f: string) => f.trim()).filter(Boolean)
    }
    await saveSubscriptionPlan(payload)
    setEditing(null)
    await loadData()
  }

  const totalStores = stats.reduce((a, s) => a + s.store_count, 0)
  const totalVendors = stats.reduce((a, s) => a + s.vendor_count, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Formules d'abonnement</h1>
        <p className="mt-1 text-sm text-ink-soft">Gérez les formules et consultez les statistiques d'abonnement.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total boutiques</div>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><Store className="h-4 w-4" /></div>
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-ink">{totalStores}</div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Vendeurs</div>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500/10 text-blue-500"><Users className="h-4 w-4" /></div>
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-ink">{totalVendors}</div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Formules actives</div>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 text-amber-500"><Crown className="h-4 w-4" /></div>
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-ink">{plans.filter(p => p.is_active).length}</div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Taux de conversion</div>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet-500/10 text-violet-500"><TrendingUp className="h-4 w-4" /></div>
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-ink">
            {totalVendors > 0 ? Math.round((stats.find(s => s.slug !== "free")?.store_count || 0) / totalStores * 100) + "%" : "—"}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />)}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map(plan => {
            const stat = stats.find(s => s.slug === plan.slug)
            return (
              <div key={plan.id} className={`rounded-2xl border-2 p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift ${
                plan.slug === "pro" ? "border-primary/30 bg-primary/5"
                : plan.slug === "sur-devis" ? "border-amber-200 bg-amber-50"
                : "border-border/60 bg-card"
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink">{plan.name}</h3>
                    <div className="mt-1 text-2xl font-bold text-ink">
                      {plan.slug === "sur-devis" ? "À définir"
                        : plan.price === 0 ? "Gratuit"
                        : `${plan.price.toLocaleString("fr-FR")} FCFA`}
                      {plan.price > 0 && plan.slug !== "sur-devis" && <span className="text-xs font-normal text-muted-foreground">/mois</span>}
                    </div>
                  </div>
                  <button onClick={() => handleEdit(plan)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-ink">
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Boutiques</span>
                    <span className="font-semibold text-ink">
                      {plan.max_stores === -1 ? "Illimité" : `${plan.max_stores}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Promotions</span>
                    <span className="font-semibold text-ink">
                      {plan.max_promotions === -1 ? "Illimité" : `${plan.max_promotions}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Durée</span>
                    <span className="font-semibold text-ink">{plan.duration_days} jours</span>
                  </div>
                </div>

                <div className="mt-4 border-t border-border/60 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Store className="h-3.5 w-3.5" /> Boutiques
                    </span>
                    <span className="font-bold text-ink">{stat?.store_count || 0}</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="h-3.5 w-3.5" /> Vendeurs
                    </span>
                    <span className="font-bold text-ink">{stat?.vendor_count || 0}</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${totalStores > 0 ? ((stat?.store_count || 0) / totalStores) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditing(null)}>
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">Modifier la formule</h3>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nom</label>
                <input value={editing.name || ""} onChange={e => setEditing({ ...editing, name: e.target.value })}
                  className="mt-1.5 h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-ink outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Prix (FCFA)</label>
                  <input type="number" value={editing.price || 0} onChange={e => setEditing({ ...editing, price: Number(e.target.value) })}
                    className="mt-1.5 h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-ink outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Durée (jours)</label>
                  <input type="number" value={editing.duration_days || 30} onChange={e => setEditing({ ...editing, duration_days: Number(e.target.value) })}
                    className="mt-1.5 h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-ink outline-none focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Max boutiques (-1 = illimité)
                  </label>
                  <input type="number" value={editing.max_stores ?? 1} onChange={e => setEditing({ ...editing, max_stores: Number(e.target.value) })}
                    className="mt-1.5 h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-ink outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Max promos (-1 = illimité)
                  </label>
                  <input type="number" value={editing.max_promotions ?? 0} onChange={e => setEditing({ ...editing, max_promotions: Number(e.target.value) })}
                    className="mt-1.5 h-10 w-full rounded-xl border border-border bg-background px-4 text-sm text-ink outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</label>
                <textarea value={editing.description || ""} onChange={e => setEditing({ ...editing, description: e.target.value })}
                  rows={2} className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink outline-none focus:border-primary resize-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Fonctionnalités (une par ligne)
                </label>
                <textarea value={Array.isArray(editing.features) ? editing.features.join("\n") : ""}
                  onChange={e => setEditing({ ...editing, features: e.target.value.split("\n").map(f => f.trim()).filter(Boolean) })}
                  rows={3} className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink outline-none focus:border-primary resize-none" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_active" checked={editing.is_active ?? true}
                  onChange={e => setEditing({ ...editing, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                <label htmlFor="is_active" className="text-sm text-ink">Formule active</label>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSave} className="flex items-center gap-2 rounded-full gradient-primary px-6 py-2.5 text-sm font-bold text-primary-foreground">
                  <Save className="h-4 w-4" /> Enregistrer
                </button>
                <button onClick={() => setEditing(null)} className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-ink">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
