import { Link } from "react-router-dom"
import { Check, Zap, Crown, Rocket } from "lucide-react"

export default function Tarifs() {
  const plans = [
    {
      name: "Gratuit",
      price: "0",
      period: "pour toujours",
      description: "Idéal pour tester la plateforme et découvrir ses fonctionnalités.",
      icon: Zap,
      features: [
        "1 boutique en ligne",
        "5 promotions actives max",
        "Visibilité dans le catalogue",
        "Statistiques de base",
        "Support par email",
      ],
      cta: "Commencer gratuitement",
      highlight: false,
    },
    {
      name: "Pro",
      price: "25 000",
      period: "FCFA/mois",
      description: "Pour les commerçants qui veulent augmenter leur visibilité et leurs ventes.",
      icon: Crown,
      features: [
        "Boutique vérifiée (badge)",
        "Promotions illimitées",
        "Mise en avant dans les résultats",
        "Offres flash prioritaires",
        "Statistiques avancées",
        "Support prioritaire",
        "Newsletter partenaires",
      ],
      cta: "Choisir Pro",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Sur devis",
      period: "",
      description: "Pour les grandes enseignes avec des besoins spécifiques.",
      icon: Rocket,
      features: [
        "Tout du plan Pro",
        "Multi-boutiques",
        "API d'intégration",
        "Publicité sponsorisée",
        "Account manager dédié",
        "Rapports personnalisés",
        "Formation sur site",
      ],
      cta: "Contacter l'équipe",
      highlight: false,
    },
  ]

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-red-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_55%)] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-8 lg:py-16">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/25">
            ← Retour à l'accueil
          </Link>
          <div className="text-center">
            <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">Tarifs & abonnements</h1>
            <p className="mt-3 max-w-xl mx-auto text-lg text-white/70">Choisissez la formule adaptée à votre activité. Démarrez gratuitement.</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
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
                <p className="mt-2 text-sm text-ink-soft">{plan.description}</p>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-ink-soft">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className={`mt-6 block rounded-full py-3 text-center text-sm font-bold transition ${
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

        <div className="mt-12 rounded-2xl border border-border/60 bg-card p-8 shadow-card">
          <h2 className="font-display text-xl font-bold text-ink">Questions fréquentes</h2>
          <div className="mt-4 space-y-4">
            <div>
              <div className="text-sm font-semibold text-ink">Puis-je changer de plan à tout moment ?</div>
              <div className="text-sm text-ink-soft">Oui, vous pouvez upgrader ou downgrader votre formule à tout moment depuis votre espace pro.</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-ink">Y a-t-il des frais d'installation ?</div>
              <div className="text-sm text-ink-soft">Non, aucuns frais cachés. Vous ne payez que votre abonnement mensuel.</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-ink">Comment fonctionne l'essai gratuit ?</div>
              <div className="text-sm text-ink-soft">Le plan Gratuit est sans engagement et sans limite de temps. Testez la plateforme en toute sérénité.</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
