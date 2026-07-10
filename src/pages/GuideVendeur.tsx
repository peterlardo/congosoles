import { Link } from "react-router-dom"
import { BookOpen, ChevronRight, FileText, Image, BarChart3 } from "lucide-react"

export default function GuideVendeur() {
  const steps = [
    { step: 1, title: "Créez votre compte", description: "Rendez-vous sur l'espace pro et créez votre compte vendeur en quelques minutes. Renseignez les informations de votre boutique." },
    { step: 2, title: "Paramétrez votre boutique", description: "Ajoutez votre logo, vos photos, votre description et vos horaires d'ouverture pour donner envie aux clients." },
    { step: 3, title: "Publiez vos promotions", description: "Créez vos offres flash ou promos standard. Ajoutez photos, prix, dates de validité et catégories." },
    { step: 4, title: "Suivez vos performances", description: "Consultez vos statistiques : vues, clics, conversions. Optimisez vos offres grâce aux données." },
  ]

  const tips = [
    { icon: Image, title: "Photos de qualité", description: "Utilisez des images claires et bien éclairées. Les produits avec photos ont 3x plus de clics." },
    { icon: FileText, title: "Descriptions précises", description: "Mentionnez le prix, la marque, la taille, la couleur. Plus l'info est complète, plus le client est rassuré." },
    { icon: BarChart3, title: "Analysez vos données", description: "Consultez régulièrement vos stats pour comprendre ce qui marche et ajuster votre stratégie." },
  ]

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-600/90 via-orange-500/80 to-yellow-500/70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_55%)] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-8 lg:py-16">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/25">
            ← Retour à l'accueil
          </Link>
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/15 text-white backdrop-blur">
              <BookOpen className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">Guide vendeur</h1>
              <p className="mt-2 max-w-lg text-lg text-white/70">Tout ce qu'il faut savoir pour réussir sur Congo Soldes.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <h2 className="font-display text-2xl font-bold text-ink">Comment ça marche</h2>
        <div className="mt-6 space-y-4">
          {steps.map((s) => (
            <div key={s.step} className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-card">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-primary text-lg font-bold text-primary-foreground shadow-glow">{s.step}</div>
              <div>
                <h3 className="font-semibold text-ink">{s.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{s.description}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-display text-2xl font-bold text-ink">Conseils pour maximiser vos ventes</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {tips.map((tip) => {
            const Icon = tip.icon
            return (
              <div key={tip.title} className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-3 font-semibold text-ink">{tip.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{tip.description}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
          <h2 className="font-display text-xl font-bold text-ink">Prêt à commencer ?</h2>
          <p className="mt-2 text-sm text-ink-soft">Créez votre compte vendeur en 2 minutes et publiez votre première promo.</p>
          <Link to="/dashboard" className="mt-4 inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow">
            Ouvrir ma boutique <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  )
}
