import { Search, Store, TrendingUp } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Recherchez",
    description: "Trouvez le produit qui vous intéresse par catégorie, marque ou près de chez vous.",
  },
  {
    icon: TrendingUp,
    title: "Comparez",
    description: "Comparez les prix des commerces locaux et repérez le meilleur bon plan.",
  },
  {
    icon: Store,
    title: "Achetez",
    description: "Rendez-vous en boutique ou commandez, et profitez de la promo.",
  },
]

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary">Comment ça marche</div>
            <h2 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">Économisez en 3 étapes</h2>
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 shadow-card">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full gradient-primary opacity-10"></div>
              <div className="relative grid h-12 w-12 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-glow">
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="relative mt-5 text-lg font-bold text-ink">{i + 1}. {step.title}</h3>
              <p className="relative mt-1 text-sm text-ink-soft">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
