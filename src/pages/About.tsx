import { Link } from "react-router-dom"
import { ShieldCheck, Users, TrendingUp, Heart } from "lucide-react"

export default function About() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="max-w-3xl">
        <div className="text-xs font-bold uppercase tracking-widest text-primary">À propos</div>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">Congo Soldes</h1>
        <p className="mt-6 text-lg leading-8 text-ink-soft">
          La plateforme n°1 des promotions commerciales en République du Congo.
          Notre mission est de rapprocher les consommateurs des meilleures offres de leurs commerces favoris.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Users className="h-6 w-6" /></div>
          <div className="mt-3 font-display text-2xl font-bold text-ink">62 000+</div>
          <div className="text-sm text-muted-foreground">Membres actifs</div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><TrendingUp className="h-6 w-6" /></div>
          <div className="mt-3 font-display text-2xl font-bold text-ink">3 500+</div>
          <div className="text-sm text-muted-foreground">Promos en ligne</div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><ShieldCheck className="h-6 w-6" /></div>
          <div className="mt-3 font-display text-2xl font-bold text-ink">820+</div>
          <div className="text-sm text-muted-foreground">Boutiques partenaires</div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Heart className="h-6 w-6" /></div>
          <div className="mt-3 font-display text-2xl font-bold text-ink">4</div>
          <div className="text-sm text-muted-foreground">Villes couvertes</div>
        </div>
      </div>

      <div className="mt-16 max-w-3xl space-y-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Notre histoire</h2>
          <p className="mt-3 text-ink-soft leading-8">
            Fondée en 2025 à Brazzaville, Congo Soldes est née d'un constat simple : au Congo,
            les bonnes affaires existent, mais elles sont dispersées et difficiles à trouver.
            Nous avons créé une plateforme centralisant toutes les promotions des commerces
            locaux, pour que chaque Congolais puisse accéder aux meilleurs prix.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Notre mission</h2>
          <p className="mt-3 text-ink-soft leading-8">
            Rendre l'accès aux promotions simples, rapides et accessibles à tous les Congolais.
            Nous croyons que la qualité ne devrait jamais être un luxe.
            Que vous soyez à Brazzaville, Pointe-Noire, Dolisie ou Ouesso,
            trouvez les meilleurs prix près de chez vous en quelques clics.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Pour les commerçants</h2>
          <p className="mt-3 text-ink-soft leading-8">
            Congo Soldes est aussi un levier de croissance pour les commerçants congolais.
            Grâce à notre espace pro, les boutiques peuvent publier leurs promotions,
            suivre leur performance et attirer de nouveaux clients au quotidien.
          </p>
        </div>
      </div>

      <Link to="/" className="mt-12 inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary">
        Retour à l'accueil
      </Link>
    </main>
  )
}
