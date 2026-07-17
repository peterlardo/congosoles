import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"
import { supabase } from "@/lib/supabase"

const cities = ["Brazzaville", "Pointe-Noire", "Dolisie", "Ouesso"]

export function Hero() {
  const [promosCount, setPromosCount] = useState(3500)
  const [storesCount, setStoresCount] = useState(820)
  const [membersCount, setMembersCount] = useState(62000)
  const [avgFlashDiscount, setAvgFlashDiscount] = useState(47)

  useEffect(() => {
    Promise.all([
      supabase.from("promotions").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("stores").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("promotions").select("discount").eq("status", "active").eq("is_flash", true),
    ]).then(([promos, stores, profiles, flashPromos]) => {
      if (promos.count !== null) setPromosCount(promos.count)
      if (stores.count !== null) setStoresCount(stores.count)
      if (profiles.count !== null) setMembersCount(profiles.count)
      if (flashPromos.data && flashPromos.data.length > 0) {
        const total = flashPromos.data.reduce((acc: number, p: any) => acc + (Number(p.discount) || 0), 0)
        setAvgFlashDiscount(Math.round(total / flashPromos.data.length))
      }
    })
  }, [])

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary),transparent_55%)] opacity-10" />
      <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                <span className="h-2 w-2 rounded-full bg-success"></span>
                +{promosCount.toLocaleString("fr-FR")} promotions actives · Congo
              </span>
            </div>
            <h1 className="font-display text-5xl font-bold leading-[.95] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Toutes les promotions,<br />
              <span className="text-gradient-primary">au même endroit.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-soft">
              Découvrez chaque jour les meilleures offres des commerces près de chez vous à Brazzaville, Pointe-Noire et partout au Congo. La qualité au petit prix.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {cities.map((city) => (
                <button
                  key={city}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
                >
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -inset-4 rounded-[2rem] gradient-primary opacity-20 blur-2xl" />
            <img src="https://congosoles.lovable.app/assets/hero-market-BkvzFEJE.jpg" alt="" className="relative aspect-[4/3] w-full rounded-[2rem] object-cover shadow-lift" />
            <div className="absolute -bottom-6 left-8 rounded-3xl bg-card p-5 shadow-lift ring-1 ring-border/60">
              <div className="text-xs font-bold uppercase tracking-widest text-primary">Économies aujourd'hui</div>
              <div className="mt-1 font-display text-4xl font-bold text-ink">−{avgFlashDiscount} %</div>
              <div className="text-sm text-muted-foreground">Moyenne des offres flash</div>
            </div>
          </div>
        </div>

        <div className="relative mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-primary sm:text-4xl">−{avgFlashDiscount} %</div>
            <div className="mt-1 text-sm text-muted-foreground">Moyenne des offres flash</div>
          </div>
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-ink sm:text-4xl">{promosCount.toLocaleString("fr-FR")}</div>
            <div className="mt-1 text-sm text-muted-foreground">Promos</div>
          </div>
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-ink sm:text-4xl">{storesCount.toLocaleString("fr-FR")}</div>
            <div className="mt-1 text-sm text-muted-foreground">Boutiques</div>
          </div>
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-ink sm:text-4xl">{membersCount.toLocaleString("fr-FR")}</div>
            <div className="mt-1 text-sm text-muted-foreground">Membres</div>
          </div>
        </div>
      </div>
    </section>
  )
}
