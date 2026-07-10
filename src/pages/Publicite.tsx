import { Link } from "react-router-dom"
import { Megaphone, Target, BarChart3, Globe } from "lucide-react"

export default function Publicite() {
  const formats = [
    { name: "Bannière homepage", description: "Visible par tous les visiteurs sur la page d'accueil. Idéal pour les lancements de produits.", price: "À partir de 50 000 FCFA/mois" },
    { name: "Mise en avant catégorie", description: "Apparaîssez en haut des résultats dans une catégorie spécifique ciblée.", price: "À partir de 30 000 FCFA/mois" },
    { name: "Sponsored dans le fil", description: "Vos promos apparaissent en priorité dans le fil des promotions du jour.", price: "À partir de 20 000 FCFA/mois" },
    { name: "Newsletter partenaires", description: "Votre offre est incluse dans notre newsletter hebdomadaire envoyée à 62 000 membres.", price: "À partir de 40 000 FCFA/mois" },
  ]

  const stats = [
    { value: "62K", label: "Membres actifs", icon: Globe },
    { value: "3.5K", label: "Promos en ligne", icon: BarChart3 },
    { value: "47%", label: "Taux d'engagement", icon: Target },
    { value: "820+", label: "Boutiques partenaires", icon: Megaphone },
  ]

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-red-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_55%)] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-8 lg:py-16">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/25">
            ← Retour à l'accueil
          </Link>
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/15 text-white backdrop-blur">
              <Megaphone className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">Publicité sponsorisée</h1>
              <p className="mt-2 max-w-lg text-lg text-white/70">Boostez votre visibilité et touchez des milliers de clients potentiels au Congo.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="rounded-2xl border border-border/60 bg-card p-5 text-center shadow-card">
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
                <div className="mt-2 font-display text-2xl font-bold text-ink">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            )
          })}
        </div>

        <h2 className="mt-12 font-display text-2xl font-bold text-ink">Nos formats publicitaires</h2>
        <div className="mt-6 space-y-4">
          {formats.map((fmt) => (
            <div key={fmt.name} className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-ink">{fmt.name}</h3>
                <p className="mt-1 text-sm text-ink-soft">{fmt.description}</p>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-sm font-bold text-primary">{fmt.price}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
          <h2 className="font-display text-xl font-bold text-ink">Intéressé ?</h2>
          <p className="mt-2 text-sm text-ink-soft">Contactez notre équipe commerciale pour un devis personnalisé.</p>
          <Link to="/contact" className="mt-4 inline-flex rounded-full gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow">Demander un devis</Link>
        </div>
      </div>
    </main>
  )
}
