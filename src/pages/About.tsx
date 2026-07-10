import { Link } from "react-router-dom"

export default function About() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">À propos</h1>
        <div className="mt-6 space-y-6 text-ink-soft">
          <p className="text-lg leading-8">
            Congo Soldes est la plateforme n°1 des promotions commerciales en République du Congo.
            Notre mission est de rapprocher les consommateurs des meilleures offres de leurs commerces favoris.
          </p>
          <p>
            Fondée à Brazzaville, Congo Soldes recense chaque jour des milliers de promotions
            dans des catégories variées : supermarchés, mode, restaurants, téléphones, informatique et bien plus.
          </p>
          <p>
            Que vous soyez à Brazzaville, Pointe-Noire, Dolisie ou Ouesso, trouvez les meilleurs prix
            près de chez vous en quelques clics.
          </p>
          <h2 className="font-display text-2xl font-bold text-ink">Notre mission</h2>
          <p>
            Rendre l'accès aux promotions simples, rapides et accessibles à tous les Congolais.
            Nous croyons que la qualité ne devrait jamais être un luxe.
          </p>
        </div>
        <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary">
          Retour à l'accueil
        </Link>
      </div>
    </main>
  )
}
