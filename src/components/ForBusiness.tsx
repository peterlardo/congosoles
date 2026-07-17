import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

const stats = [
  { value: "5 min", label: "pour publier une promo" },
  { value: "820+", label: "commerces déjà inscrits" },
  { value: "×3.2", label: "de trafic en boutique" },
  { value: "0 FCFA", label: "pour commencer" },
]

export function ForBusiness() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-ink p-8 sm:p-12 lg:p-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary),transparent_55%)] opacity-40"></div>
        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="text-primary-foreground">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium">Pour les commerçants</div>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl lg:text-5xl">Vendez plus. <span className="text-gradient-primary">Attirez vos voisins.</span></h2>
            <p className="mt-4 max-w-xl text-white/80">
              Publiez vos promotions en quelques minutes, gérez votre catalogue, mesurez vos performances et boostez votre visibilité à Brazzaville, Pointe-Noire et partout au Congo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow">Ouvrir ma boutique <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-primary-foreground backdrop-blur">Voir les tarifs</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white/10 p-4">
                <div className="font-display text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
