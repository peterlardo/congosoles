import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { fetchActivePromotions, type PromoItem } from "@/lib/promotions"
import { MapPin, BadgeCheck, ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Store {
  id: string
  name: string
  slug: string
  logo: string | null
  address: string | null
  district: string | null
  created_at: string
}

const storeMeta: Record<string, { tagline: string; description: string; gradient: string; accent: string }> = {
  "Casino Brazza": {
    tagline: "Le leader de la grande distribution",
    description: "Retrouvez chaque jour des milliers de produits à prix cassés dans notre hypermarché de Brazzaville.",
    gradient: "from-red-600/90 via-red-500/80 to-orange-500/70",
    accent: "text-red-500",
  },
  "SportZone": {
    tagline: "L'adresse du sport au Congo",
    description: "Équipements, chaussures et accessoires sportifs pour toutes les disciplines, à prix doux.",
    gradient: "from-green-600/90 via-emerald-500/80 to-teal-500/70",
    accent: "text-emerald-600",
  },
  "TechCongo": {
    tagline: "La tech accessible à tous",
    description: "Smartphones, ordinateurs, tablettes et accessoires des plus grandes marques mondiales.",
    gradient: "from-blue-600/90 via-blue-500/80 to-cyan-500/70",
    accent: "text-blue-600",
  },
  "Nzinga Store": {
    tagline: "Mode africaine & contemporaine",
    description: "Robes wax, prêt-à-porter et accessoires pour homme et femme, coupes uniques et tendance.",
    gradient: "from-purple-600/90 via-fuchsia-500/80 to-pink-500/70",
    accent: "text-fuchsia-600",
  },
  "MaxiElec": {
    tagline: "L'électroménager au meilleur prix",
    description: "Téléviseurs, climatiseurs, machines à laver et tout l'électroménager pour votre maison.",
    gradient: "from-slate-700/90 via-slate-600/80 to-zinc-500/70",
    accent: "text-slate-600",
  },
  "Glow Cosmetics": {
    tagline: "La beauté révélée",
    description: "Maquillage, soins et produits de beauté pour sublimer toutes les peaux, marques premium.",
    gradient: "from-rose-600/90 via-pink-500/80 to-fuchsia-500/70",
    accent: "text-rose-600",
  },
  "Super U Congo": {
    tagline: "Tout pour la maison au meilleur prix",
    description: "Alimentation, produits frais, hygiène et entretien : tout votre quotidien à prix compétitifs.",
    gradient: "from-blue-700/90 via-indigo-600/80 to-violet-500/70",
    accent: "text-indigo-600",
  },
  "MaisonPlus": {
    tagline: "L'art de vivre chez soi",
    description: "Mobilier, décoration et articles de maison pour transformer votre intérieur avec style.",
    gradient: "from-amber-600/90 via-orange-500/80 to-yellow-500/70",
    accent: "text-amber-600",
  },
  "Fashion Hub": {
    tagline: "Les tendances à portée de pas",
    description: "Chaussures, vêtements et accessoires mode pour toute la famille, marques internationales.",
    gradient: "from-violet-600/90 via-purple-500/80 to-indigo-500/70",
    accent: "text-violet-600",
  },
  "Pharma Congo": {
    tagline: "Votre santé, notre priorité",
    description: "Pharmacie complète avec parapharmacie, compléments et produits de bien-être.",
    gradient: "from-teal-600/90 via-emerald-500/80 to-green-500/70",
    accent: "text-teal-600",
  },
  "NSIA Brazza": {
    tagline: "Protéger ce qui compte",
    description: "Assurances auto, habitation et vie : des couvertures adaptées à vos besoins au Congo.",
    gradient: "from-gray-700/90 via-slate-600/80 to-blue-800/70",
    accent: "text-gray-700",
  },
  "Chez Mama Poto-Poto": {
    tagline: "La cuisine congolaise authentique",
    description: "Poulet braisé, attiéké, plats traditionnels : la saveur du Congo dans chaque assiette.",
    gradient: "from-orange-600/90 via-red-500/80 to-amber-500/70",
    accent: "text-orange-600",
  },
}

const defaultMeta = {
  tagline: "Les meilleures promos au Congo",
  description: "Découvrez les offres exclusives de cette boutique.",
  gradient: "from-primary/90 via-primary/70 to-primary/50",
  accent: "text-primary",
}

export default function StoreDetail() {
  const { name: slug } = useParams<{ name: string }>()
  const decodedSlug = decodeURIComponent(slug || "")
  const [store, setStore] = useState<Store | null>(null)
  const [products, setProducts] = useState<PromoItem[]>([])

  useEffect(() => {
    if (!decodedSlug) return
    supabase.from("stores").select("*").eq("slug", decodedSlug).single().then(({ data }) => {
      setStore(data)
    })
    fetchActivePromotions().then(data => {
      setProducts(data.filter(p => p.store_slug === decodedSlug))
    })
  }, [decodedSlug])

  const decodedName = store?.name || decodedSlug
  const meta = storeMeta[decodedName] || defaultMeta
  const activePromos = products.length

  return (
    <main>
      <section className={`relative overflow-hidden bg-gradient-to-br ${meta.gradient}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_55%)] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-8 lg:py-16">
          <Link to="/boutiques" className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/25">
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour aux boutiques
          </Link>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-start gap-5">
              {store?.logo && (
                <img src={store.logo} alt={store.name} className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/30" />
              )}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">{decodedName}</h1>
                  <BadgeCheck className="h-7 w-7 text-white/80" />
                </div>
                <p className="mt-1 text-lg font-medium text-white/80">{meta.tagline}</p>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/60">{meta.description}</p>
              </div>
            </div>

            <div className="flex shrink-0 gap-4">
              <div className="rounded-2xl bg-white/15 px-5 py-3 text-center backdrop-blur">
                <div className="font-display text-2xl font-bold text-white">{activePromos}</div>
                <div className="text-xs text-white/60">Promos actives</div>
              </div>
              <div className="rounded-2xl bg-white/15 px-5 py-3 text-center backdrop-blur">
                <div className="flex items-center justify-center gap-1 text-white">
                  <MapPin className="h-4 w-4" />
                  <span className="font-display text-lg font-bold">{store?.district || "Brazzaville"}</span>
                </div>
                <div className="text-xs text-white/60">Localisation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-ink">
            Promotions {decodedName}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            {products.length} offre{products.length > 1 ? "s" : ""} disponible{products.length > 1 ? "s" : ""}
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link key={product.id} to={`/promo/${product.id}`} className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-border/60 transition-all hover:-translate-y-0.5 hover:shadow-lift">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img src={product.image} alt={product.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute left-3 top-3 rounded-full gradient-primary px-2.5 py-1 text-xs font-bold text-primary-foreground shadow-glow">
                    -{product.discountPercent}%
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink">{product.title}</h3>
                  <div className="mt-auto flex items-baseline gap-2">
                    <span className="text-lg font-bold text-primary">{product.discountPrice.toLocaleString("fr-FR")} FCFA</span>
                    <span className="text-xs text-muted-foreground line-through">{product.originalPrice.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{product.storeDistance}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-border/60 bg-card p-8 text-center shadow-card">
            <div className="font-display text-2xl font-bold text-ink">Aucune promotion</div>
            <p className="mt-2 text-sm text-ink-soft">Cette boutique n'a pas encore de promotions actives.</p>
            <Link to="/boutiques" className="mt-4 inline-flex rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary">
              Voir d'autres boutiques
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
