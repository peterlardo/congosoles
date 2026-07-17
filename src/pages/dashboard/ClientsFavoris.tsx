import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { Users, Eye, Clock, Globe, Monitor } from "lucide-react"

interface ClientVisitor {
  ip_address: string
  user_agent: string
  visit_count: number
  last_visit: string
  promo_title: string
  store_name: string
}

export default function ClientsFavoris() {
  const { user, profile } = useAuth()
  const [visitors, setVisitors] = useState<ClientVisitor[]>([])
  const [loading, setLoading] = useState(true)

  const canManage = profile?.role === "vendor" || profile?.role === "super_admin" || profile?.role === "admin"

  useEffect(() => {
    if (!user || !canManage) return
    const currentUser = user

    async function fetchVisitors() {
      const { data: stores } = await supabase
        .from("stores")
        .select("id, name")
        .eq("user_id", currentUser.id)

      if (!stores || stores.length === 0) {
        setLoading(false)
        return
      }

      const storeIds = stores.map(s => s.id)

      const { data: promos } = await supabase
        .from("promotions")
        .select("id, title, store_id")
        .in("store_id", storeIds)

      if (!promos || promos.length === 0) {
        setLoading(false)
        return
      }

      const promoIds = promos.map(p => p.id)

      const { data: clicks } = await supabase
        .from("promo_clicks")
        .select("ip_address, user_agent, promo_id, created_at")
        .in("promo_id", promoIds)
        .order("created_at", { ascending: false })

      if (!clicks) {
        setLoading(false)
        return
      }

      const promoMap = new Map(promos.map(p => [p.id, p]))
      const storeMap = new Map(stores.map(s => [s.id, s.name]))

      const ipMap = new Map<string, { count: number; lastVisit: string; userAgent: string; promoTitle: string; storeName: string }>()

      for (const click of clicks) {
        if (!click.ip_address) continue
        const promo = promoMap.get(click.promo_id)
        const storeName = promo ? storeMap.get(promo.store_id) || "Inconnue" : "Inconnue"
        const existing = ipMap.get(click.ip_address)
        if (existing) {
          existing.count++
          if (click.created_at > existing.lastVisit) {
            existing.lastVisit = click.created_at
            existing.userAgent = click.user_agent || existing.userAgent
            existing.promoTitle = promo?.title || existing.promoTitle
            existing.storeName = storeName
          }
        } else {
          ipMap.set(click.ip_address, {
            count: 1,
            lastVisit: click.created_at,
            userAgent: click.user_agent || "",
            promoTitle: promo?.title || "",
            storeName,
          })
        }
      }

      const result: ClientVisitor[] = Array.from(ipMap.entries())
        .sort((a, b) => b[1].count - a[1].count)
        .map(([ip, data]) => ({
          ip_address: ip,
          user_agent: data.userAgent,
          visit_count: data.count,
          last_visit: data.lastVisit,
          promo_title: data.promoTitle,
          store_name: data.storeName,
        }))

      setVisitors(result)
      setLoading(false)
    }

    fetchVisitors()
  }, [user, canManage])

  if (!canManage) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-12 text-center shadow-card">
        <Users className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 font-semibold text-ink">Accès restreint</h3>
        <p className="mt-1 text-sm text-ink-soft">Cette page est réservée aux commerçants.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Mes clients favoris</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {visitors.length > 0
            ? `${visitors.length} visiteurs uniques ont interagi avec vos promotions.`
            : "Aucun visiteur pour le moment."}
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : visitors.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center shadow-card">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 font-semibold text-ink">Aucun visiteur</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Les visiteurs qui cliquent sur vos promotions apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visitors.map((v, i) => (
            <div key={v.ip_address} className="rounded-2xl border border-border/60 bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary text-sm font-bold">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-semibold text-ink">{v.ip_address}</span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                      {v.visit_count} visite{v.visit_count > 1 ? "s" : ""}
                    </span>
                  </div>
                  {v.store_name && (
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      Boutique : {v.store_name}
                      {v.promo_title && <> · Promo : {v.promo_title}</>}
                    </div>
                  )}
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Dernière visite : {new Date(v.last_visit).toLocaleDateString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {v.user_agent && (
                      <span className="flex items-center gap-1 truncate max-w-[300px]">
                        <Monitor className="h-3 w-3 shrink-0" />
                        {v.user_agent}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
