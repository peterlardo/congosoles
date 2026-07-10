import { Link } from "react-router-dom"

export default function Blog() {
  const posts = [
    { id: 1, title: "Les 10 meilleures offres de la semaine à Brazzaville", date: "8 juillet 2026", category: "Promotions", excerpt: "Découvrez nos coups de cœur de la semaine avec des réductions allant jusqu'à 50% dans les boutiques de Brazzaville." },
    { id: 2, title: "Guide : comment utiliser Congo Soldes pour économiser", date: "5 juillet 2026", category: "Guide", excerpt: "Tutoriel complet pour créer votre compte, activer les alertes et ne jamais manquer une bonne affaire." },
    { id: 3, title: "Nouvelles boutiques partenaires à Pointe-Noire", date: "1 juillet 2026", category: "Actualités", excerpt: "12 nouvelles boutiques rejoignent Congo Soldes ce mois-ci, portant notre réseau à plus de 820 commerces." },
    { id: 4, title: "Top 5 des restaurants avec les meilleures promos", date: "28 juin 2026", category: "Restaurants", excerpt: "Les adresses incontournables de Brazzaville pour manger bien et pas cher grâce à nos partenaires." },
    { id: 5, title: "Les tendances mode wax à ne pas manquer", date: "25 juin 2026", category: "Mode", excerpt: "Les pièces tendance de la saison wax sont en promotion chez nos partenaires. Voici notre sélection." },
    { id: 6, title: "Comment ouvrir votre boutique sur Congo Soldes", date: "20 juin 2026", category: "Guide", excerpt: "Guide pas-à-pas pour les commerçants souhaitant rejoindre la plateforme et booster leurs ventes." },
  ]

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-8">
        <div className="text-xs font-bold uppercase tracking-widest text-primary">Blog</div>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">Actualités</h1>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          Les dernières nouvelles, guides et conseils pour économiser au Congo.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="group flex flex-col rounded-2xl border border-border/60 bg-card shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
            <div className="flex-1 p-6">
              <div className="text-[11px] font-bold uppercase tracking-wider text-primary">{post.category}</div>
              <h2 className="mt-2 font-semibold text-ink leading-snug">{post.title}</h2>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">{post.excerpt}</p>
              <div className="mt-3 text-xs text-muted-foreground">{post.date}</div>
            </div>
            <div className="border-t border-border/60 p-4">
              <span className="text-xs font-bold text-primary transition group-hover:underline">Lire l'article →</span>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-border/60 bg-card p-8 text-center shadow-card">
        <h2 className="font-display text-xl font-bold text-ink">Restez informé</h2>
        <p className="mt-2 text-sm text-ink-soft">Recevez chaque semaine les meilleures offres directement dans votre boîte mail.</p>
        <div className="mt-4 flex max-w-md mx-auto gap-2">
          <input type="email" placeholder="Votre email" className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-ink outline-none transition focus:border-primary" />
          <button className="rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow">S'inscrire</button>
        </div>
      </div>
    </main>
  )
}
