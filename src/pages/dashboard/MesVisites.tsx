import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { BarChart3, Eye, MousePointerClick, TrendingUp, Calendar, Globe, Monitor, Clock, ShoppingCart, CreditCard, Wallet, Store, Truck, MapPin } from "lucide-react"

interface VisitStats {
  totalClicks: number
  todayClicks: number
  weekClicks: number
  monthClicks: number
  uniqueIps: number
  totalRevenue: number
  totalPurchases: number
}

interface ClickRecord {
  id: string
  ip_address: string
  user_agent: string
  created_at: string
  promo_title: string
  store_name: string
  click_type: string
  amount: number | null
  payment_method: string | null
  buyer_name: string | null
  buyer_email: string | null
  phone: string | null
  delivery_option: string | null
  delivery_city: string | null
  delivery_district: string | null
  delivery_neighborhood: string | null
  delivery_address: string | null
  delivery_instructions: string | null
}

const PAYMENT_LABELS: Record<string, string> = {
  mtn: "MTN Mobile Money",
  airtel: "Airtel Money",
}

const formatPrice = (price: number) => new Intl.NumberFormat("fr-FR").format(price) + " FCFA"

export default function MesVisites() {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState<VisitStats>({ totalClicks: 0, todayClicks: 0, weekClicks: 0, monthClicks: 0, uniqueIps: 0, totalRevenue: 0, totalPurchases: 0 })
  const [recentClicks, setRecentClicks] = useState<ClickRecord[]>([])
  const [loading, setLoading] = useState(true)

  const canManage = profile?.role === "vendor" || profile?.role === "super_admin" || profile?.role === "admin"

  useEffect(() => {
    if (!user || !canManage) return
    const currentUser = user

    async function fetchData() {
      const { data: stores } = await supabase
        .from("stores")
        .select("id, name")
        .eq("user_id", currentUser.id)

      if (!stores || stores.length === 0) {
        setLoading(false)
        return
      }

      const storeIds = stores.map(s => s.id)
      const storeMap = new Map(stores.map(s => [s.id, s.name]))

      const { data: promos } = await supabase
        .from("promotions")
        .select("id, title, store_id")
        .in("store_id", storeIds)

      if (!promos || promos.length === 0) {
        setLoading(false)
        return
      }

      const promoIds = promos.map(p => p.id)
      const promoMap = new Map(promos.map(p => [p.id, p]))

      const { data: clicks } = await supabase
        .from("promo_clicks")
        .select("id, ip_address, user_agent, promo_id, created_at, click_type, amount, payment_method, buyer_name, buyer_email, phone, delivery_option, delivery_city, delivery_district, delivery_neighborhood, delivery_address, delivery_instructions")
        .in("promo_id", promoIds)
        .order("created_at", { ascending: false })

      if (!clicks) {
        setLoading(false)
        return
      }

      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

      let todayCount = 0
      let weekCount = 0
      let monthCount = 0
      const uniqueIps = new Set<string>()
      let totalRevenue = 0
      let totalPurchases = 0

      for (const click of clicks) {
        if (click.ip_address) uniqueIps.add(click.ip_address)
        if (click.created_at >= today) todayCount++
        if (click.created_at >= weekAgo) weekCount++
        if (click.created_at >= monthAgo) monthCount++
        if (click.click_type === "purchase" && click.amount) {
          totalRevenue += Number(click.amount)
          totalPurchases++
        }
      }

      setStats({
        totalClicks: clicks.length,
        todayClicks: todayCount,
        weekClicks: weekCount,
        monthClicks: monthCount,
        uniqueIps: uniqueIps.size,
        totalRevenue,
        totalPurchases,
      })

      setRecentClicks(
        clicks.slice(0, 50).map(c => {
          const promo = promoMap.get(c.promo_id)
          return {
            id: c.id,
            ip_address: c.ip_address || "Inconnue",
            user_agent: c.user_agent || "",
            created_at: c.created_at,
            promo_title: promo?.title || "",
            store_name: promo ? storeMap.get(promo.store_id) || "" : "",
            click_type: c.click_type || "click",
            amount: c.amount ? Number(c.amount) : null,
            payment_method: c.payment_method,
            buyer_name: c.buyer_name,
            buyer_email: c.buyer_email,
            phone: c.phone,
            delivery_option: c.delivery_option,
            delivery_city: c.delivery_city,
            delivery_district: c.delivery_district,
            delivery_neighborhood: c.delivery_neighborhood,
            delivery_address: c.delivery_address,
            delivery_instructions: c.delivery_instructions,
          }
        })
      )

      setLoading(false)
    }

    fetchData()
  }, [user, canManage])

  if (!canManage) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-12 text-center shadow-card">
        <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 font-semibold text-ink">Accès restreint</h3>
        <p className="mt-1 text-sm text-ink-soft">Cette page est réservée aux commerçants.</p>
      </div>
    )
  }

  const statCards = [
    { label: "Clics aujourd'hui", value: stats.todayClicks, icon: Eye, color: "text-primary", bg: "bg-primary/10" },
    { label: "Cette semaine", value: stats.weekClicks, icon: Calendar, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Ce mois", value: stats.monthClicks, icon: TrendingUp, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Total clics", value: stats.totalClicks, icon: MousePointerClick, color: "text-amber-500", bg: "bg-amber-500/10" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Mes visites</h1>
        <p className="mt-1 text-sm text-ink-soft">Statistiques de visites, clics et ventes sur vos promotions.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(card => (
          <div key={card.label} className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{card.label}</div>
              <div className={`grid h-8 w-8 place-items-center rounded-lg ${card.bg} ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 font-display text-2xl font-bold text-ink">
              {loading ? "—" : card.value.toLocaleString("fr-FR")}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Visiteurs uniques</div>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-muted text-muted-foreground"><Globe className="h-4 w-4" /></div>
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-ink">
            {loading ? "—" : stats.uniqueIps.toLocaleString("fr-FR")}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Adresses IP uniques</div>
        </div>
        <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest text-green-700">Revenus totaux</div>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-green-100 text-green-600"><Wallet className="h-4 w-4" /></div>
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-green-700">
            {loading ? "—" : formatPrice(stats.totalRevenue)}
          </div>
          <div className="mt-1 text-xs text-green-600">{stats.totalPurchases} achat{stats.totalPurchases > 1 ? "s" : ""} effectué{stats.totalPurchases > 1 ? "s" : ""}</div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Taux de conversion</div>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-muted text-muted-foreground"><ShoppingCart className="h-4 w-4" /></div>
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-ink">
            {loading ? "—" : stats.totalClicks > 0 ? `${((stats.totalPurchases / stats.totalClicks) * 100).toFixed(1)}%` : "0%"}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{stats.totalPurchases} achat{stats.totalPurchases > 1 ? "s" : ""} / {stats.totalClicks} clic{stats.totalClicks > 1 ? "s" : ""}</div>
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg font-bold text-ink">Dernières activités</h2>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : recentClicks.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center shadow-card">
          <MousePointerClick className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 font-semibold text-ink">Aucune visite</h3>
          <p className="mt-1 text-sm text-ink-soft">Les clics et achats sur vos promotions apparaîtront ici.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {recentClicks.map(click => (
            <div key={click.id} className={`flex items-start gap-3 rounded-2xl border p-3 shadow-card text-sm ${click.click_type === "purchase" ? "border-green-200 bg-green-50/50" : "border-border/60 bg-card"}`}>
              <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${click.click_type === "purchase" ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}>
                {click.click_type === "purchase" ? <CreditCard className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-ink">
                    {click.click_type === "purchase" 
                      ? (click.buyer_name || click.ip_address)
                      : click.ip_address}
                  </span>
                  {click.click_type === "purchase" && click.amount && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                      {formatPrice(click.amount)}
                    </span>
                  )}
                  {click.click_type === "purchase" && click.payment_method && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {PAYMENT_LABELS[click.payment_method] || click.payment_method}
                    </span>
                  )}
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${click.click_type === "purchase" ? "bg-green-100 text-green-700" : click.click_type === "view" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
                    {click.click_type === "purchase" ? "Achat" : click.click_type === "view" ? "Vue" : "Clic"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    <Clock className="mr-1 inline h-3 w-3" />
                    {new Date(click.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {click.store_name && <>Boutique : {click.store_name}</>}
                  {click.store_name && click.promo_title && <> · </>}
                  {click.promo_title && <>Promo : {click.promo_title}</>}
                </div>
                {click.click_type === "purchase" && click.buyer_email && (
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    Client : {click.buyer_email} {click.phone && <>· Tél : {click.phone}</>}
                  </div>
                )}
                {click.click_type === "purchase" && click.delivery_option && (
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    {click.delivery_option === "delivery" ? (
                      <>
                        <Truck className="h-3 w-3" /> Livraison : {[click.delivery_city, click.delivery_district, click.delivery_neighborhood].filter(Boolean).join(", ")}
                        {click.delivery_address && <> · {click.delivery_address}</>}
                      </>
                    ) : (
                      <><Store className="h-3 w-3" /> Retrait en boutique</>
                    )}
                  </div>
                )}
                {click.user_agent && click.click_type !== "purchase" && (
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground truncate max-w-full">
                    <Monitor className="h-3 w-3 shrink-0" />
                    <span className="truncate">{click.user_agent}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
