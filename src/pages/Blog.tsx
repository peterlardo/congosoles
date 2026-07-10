export default function Blog() {
  const posts = [
    { id: 1, title: "Les 10 meilleures offres de la semaine à Brazzaville", date: "8 juillet 2026", category: "Promotions" },
    { id: 2, title: "Guide : comment utiliser Congo Soldes pour économiser", date: "5 juillet 2026", category: "Guide" },
    { id: 3, title: "Nouvelles boutiques partenaires à Pointe-Noire", date: "1 juillet 2026", category: "Actualités" },
    { id: 4, title: "Top 5 des restaurants avec les meilleures promos", date: "28 juin 2026", category: "Restaurants" },
    { id: 5, title: "Les tendances mode wax à ne pas manquer", date: "25 juin 2026", category: "Mode" },
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
          <article key={post.id} className="group rounded-2xl border border-border/60 bg-card p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
            <div className="text-[11px] font-bold uppercase tracking-wider text-primary">{post.category}</div>
            <h2 className="mt-2 font-semibold text-ink leading-snug">{post.title}</h2>
            <div className="mt-3 text-xs text-muted-foreground">{post.date}</div>
          </article>
        ))}
      </div>
    </main>
  )
}
