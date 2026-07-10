import { Link } from "react-router-dom"
import { Check, Zap, Crown, Rocket } from "lucide-react"

const plans = [
  {
    name: "Gratuit",
    price: "0",
    period: "pour toujours",
    icon: Zap,
    features: [
      "1 boutique en ligne",
      "5 promotions max",
      "Visibilité catalogue",
      "Statistiques de base",
    ],
    cta: "Commencer",
    highlight: false,
  },
  {
    name: "Pro",
    price: "25 000",
    period: "FCFA/mois",
    icon: Crown,
    features: [
      "Boutique vérifiée",
      "Promos illimitées",
      "Mise en avant résultats",
      "Offres flash prioritaires",
      "Statistiques avancées",
      "Support prioritaire",
    ],
    cta: "Choisir Pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Sur devis",
    period: "",
    icon: Rocket,
    features: [
      "Tout du plan Pro",
      "Multi-boutiques",
      "Publicité sponsorisée",
      "Account manager dédié",
    ],
    cta: "Contacter",
    highlight: false,
  },
]

export function PricingSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-primary">Tarifs</div>
        <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">Tarifs & abonnements</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-ink-soft">Choisissez la formule adaptée à votre activité. Démarrez gratuitement.</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon
          return (
            <div key={plan.name} className={`relative flex flex-col rounded-2xl border p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift ${
              plan.highlight
                ? "border-primary bg-card ring-2 ring-primary/20"
                : "border-border/60 bg-card"
            }`}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-primary px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-glow">
                  Populaire
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground"><Icon className="h-5 w-5" /></div>
                <h3 className="font-display text-xl font-bold text-ink">{plan.name}</h3>
              </div>
              <div className="mt-4">
                <span className="font-display text-4xl font-bold text-ink">{plan.price}</span>
                {plan.period && <span className="ml-1 text-sm text-muted-foreground">{plan.period}</span>}
              </div>
              <ul className="mt-5 flex-1 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-ink-soft">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/tarifs" className={`mt-6 block rounded-full py-3 text-center text-sm font-bold transition ${
                plan.highlight
                  ? "gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
                  : "border border-border text-ink hover:border-primary hover:text-primary"
              }`}>
                {plan.cta}
              </Link>
            </div>
          )
        })}
      </div>

      <div className="mt-8 text-center">
        <Link to="/tarifs" className="text-sm font-semibold text-primary transition hover:underline">
          Voir tous les détails et la FAQ →
        </Link>
      </div>
    </section>
  )
}
