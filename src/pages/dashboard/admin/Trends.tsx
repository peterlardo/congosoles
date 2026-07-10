import { useEffect, useState } from "react"
import { fetchAdminStats } from "@/lib/admin"
import {
  TrendingUp, Store, Zap, Eye, MousePointerClick, Users,
  ShoppingBag, AlertTriangle, MessageSquare, Crown, CreditCard
} from "lucide-react"
import type { AdminStats } from "@/types/admin"

export default function AdminTrends() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminStats().then(data => { setStats(data); setLoading(false) })
  }, [])

  if (loading) return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {[1,2,3,4,5,6].map(i => <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />)}
      </div>
      <div className="mt-6 h-64 animate-pulse rounded-2xl bg-muted" />
    </div>
  )

  if (!stats) return null

  const cards = [
    { label: "Boutiques", value: stats.totalStores, icon: Store, color: "text-primary", bg: "bg-primary/10" },
    { label: "Promotions", value: stats.totalPromos, icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Utilisateurs", value: stats.totalUsers, icon: Users, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Abonnements actifs", value: stats.activeSubscriptions, icon: Crown, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Signalements", value: stats.pendingReports, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "Tickets", value: stats.pendingTickets, icon: MessageSquare, color: "text-rose-500", bg: "bg-rose-500/10" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Tendances & Analytics</h1>
        <p className="mt-1 text-sm text-ink-soft">Analyse globale de la plateforme Congo Soldes.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map(card => (
          <div key={card.label} className="rounded-2xl border border-border/60 bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{card.label}</div>
              <div className={`grid h-8 w-8 place-items-center rounded-lg ${card.bg} ${card.color}`}><card.icon className="h-4 w-4" /></div>
            </div>
            <div className="mt-2 font-display text-2xl font-bold text-ink">{loading ? "—" : card.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <h3 className="font-display text-lg font-bold text-ink">Boutiques par statut</h3>
          <div className="mt-4 space-y-3">
            {stats.storesByStatus.map(item => {
              const maxCount = Math.max(...stats.storesByStatus.map(s => s.count), 1)
              return (
                <div key={item.status}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink capitalize">{item.status}</span>
                    <span className="text-muted-foreground">{item.count}</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full transition-all ${item.status === "active" ? "bg-success" : item.status === "pending" ? "bg-amber-500" : item.status === "suspended" ? "bg-red-500" : "bg-muted-foreground"}`}
                      style={{ width: `${(item.count / maxCount) * 100}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <h3 className="font-display text-lg font-bold text-ink">Promotions par statut</h3>
          <div className="mt-4 space-y-3">
            {["active", "draft", "expired"].map(status => {
              const count = stats.promosByStatus.find(s => s.status === status)?.count || 0
              const total = stats.promosByStatus.reduce((a, s) => a + s.count, 0) || 1
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink capitalize">{status === "active" ? "En ligne" : status === "draft" ? "Brouillon" : "Expiré"}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full transition-all ${status === "active" ? "bg-success" : status === "draft" ? "bg-amber-500" : "bg-muted-foreground"}`}
                      style={{ width: `${(count / total) * 100}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <h3 className="font-display text-lg font-bold text-ink">En attente</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink">Boutiques à valider</span>
              <span className="text-2xl font-bold text-amber-500">{stats.pendingStores}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink">Signalements ouverts</span>
              <span className="text-2xl font-bold text-red-500">{stats.pendingReports}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink">Tickets en cours</span>
              <span className="text-2xl font-bold text-rose-500">{stats.pendingTickets}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink">Documents à vérifier</span>
              <span className="text-2xl font-bold text-blue-500">{stats.pendingDocuments}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <h3 className="font-display text-lg font-bold text-ink">Promotions par catégorie</h3>
          <div className="mt-4 space-y-3">
            {stats.promosByCategory.map(item => {
              const maxCount = stats.promosByCategory[0]?.count || 1
              return (
                <div key={item.category}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink capitalize">{item.category || "Non catégorisé"}</span>
                    <span className="text-muted-foreground">{item.count}</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(item.count / maxCount) * 100}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <h3 className="font-display text-lg font-bold text-ink">Boutiques par catégorie</h3>
          <div className="mt-4 space-y-3">
            {stats.storesByCategory.map(item => {
              const maxCount = stats.storesByCategory[0]?.count || 1
              return (
                <div key={item.category}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink capitalize">{item.category || "Non catégorisé"}</span>
                    <span className="text-muted-foreground">{item.count}</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${(item.count / maxCount) * 100}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}