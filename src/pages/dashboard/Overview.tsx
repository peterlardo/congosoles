import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { Zap, Eye, MousePointerClick, Star, TrendingUp, Plus, ArrowUpRight, Package } from "lucide-react"
import { Link } from "react-router-dom"

interface Stats {
  activePromos: number
  totalViews: number
  totalClicks: number
  avgRating: number
}

interface RecentPromo {
  id: string
  title: string
  status: string
  views: number
  created_at: string
}

export default function DashboardOverview() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({ activePromos: 0, totalViews: 0, totalClicks: 0, avgRating: 0 })
  const [recentPromos, setRecentPromos] = useState<RecentPromo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (!user) return

      const { data: promos } = await supabase
        .from("promotions")
        .select("id, title, status, views, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (promos) {
        setRecentPromos(promos)
        const active = promos.filter((p) => p.status === "active").length
        const totalViews = promos.reduce((acc, p) => acc + (p.views || 0), 0)
        setStats((s) => ({ ...s, activePromos: active, totalViews }))
      }

      const { count } = await supabase
        .from("promotions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "active")

      setStats((s) => ({ ...s, activePromos: count || 0 }))
      setLoading(false)
    }

    fetchData()
  }, [user])

  const statCards = [
    { label: "Promotions actives", value: stats.activePromos, icon: Zap, color: "text-primary", bg: "bg-primary/10", change: "+2 cette semaine", changeColor: "text-success" },
    { label: "Vues totales", value: stats.totalViews.toLocaleString("fr-FR"), icon: Eye, color: "text-blue-500", bg: "bg-blue-500/10", change: "+18% ce mois", changeColor: "text-success" },
    { label: "Clics reçus", value: stats.totalClicks.toLocaleString("fr-FR"), icon: MousePointerClick, color: "text-violet-500", bg: "bg-violet-500/10", change: "+12% ce mois", changeColor: "text-success" },
    { label: "Note moyenne", value: stats.avgRating ? stats.avgRating.toFixed(1) : "—", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10", change: "/5 étoiles", changeColor: "text-muted-foreground" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink lg:text-3xl">Bonjour, {user?.user_metadata?.name || "Commerçant"} 👋</h1>
        <p className="mt-1 text-sm text-ink-soft">Voici un résumé de votre activité sur Congo Soldes.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-border/60 bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{card.label}</div>
              <div className={`grid h-8 w-8 place-items-center rounded-lg ${card.bg} ${card.color}`}><card.icon className="h-4 w-4" /></div>
            </div>
            <div className="mt-2 font-display text-2xl font-bold text-ink">{loading ? "—" : card.value}</div>
            <div className={`mt-1 flex items-center gap-1 text-xs ${card.changeColor}`}>
              <TrendingUp className="h-3 w-3" /> {card.change}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-ink">Dernières promotions</h2>
        <Link to="/dashboard/promotions" className="flex items-center gap-1 text-sm font-semibold text-primary transition hover:underline">
          Tout voir <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : recentPromos.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-card p-12 text-center shadow-card">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Package className="h-6 w-6" /></div>
            <h3 className="mt-4 font-semibold text-ink">Aucune promotion</h3>
            <p className="mt-1 text-sm text-ink-soft">Créez votre première promotion pour commencer.</p>
            <Link to="/dashboard/promotions" className="mt-4 inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow">
              <Plus className="h-4 w-4" /> Créer une promo
            </Link>
          </div>
        ) : (
          recentPromos.map((promo) => (
            <div key={promo.id} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className={`h-2 w-2 shrink-0 rounded-full ${promo.status === "active" ? "bg-success" : "bg-muted-foreground"}`} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-ink">{promo.title}</div>
                <div className="text-xs text-muted-foreground">{promo.views || 0} vues · {new Date(promo.created_at).toLocaleDateString("fr-FR")}</div>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${promo.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                {promo.status === "active" ? "En ligne" : "Brouillon"}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 lg:p-8">
        <h2 className="font-display text-lg font-bold text-ink">Besoin d'aide ?</h2>
        <p className="mt-2 text-sm text-ink-soft">Notre équipe est disponible pour vous accompagner.</p>
        <div className="mt-4 flex gap-3">
          <Link to="/contact" className="rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow">Nous contacter</Link>
          <Link to="/guide-vendeur" className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary">Guide vendeur</Link>
        </div>
      </div>
    </div>
  )
}
