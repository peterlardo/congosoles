import { Link } from "react-router-dom"
import { Newspaper, ExternalLink } from "lucide-react"

export default function Presse() {
  const articles = [
    { id: 1, title: "Congo Soldes : la plateforme qui révolutionne le commerce au Congo", source: "Congo Tribune", date: "5 juillet 2026", url: "#" },
    { id: 2, title: "62 000 membres : le succès de Congo Soldes en un an", source: "InfoCongo", date: "28 juin 2026", url: "#" },
    { id: 3, title: "Comment Congo Soldes aide les petits commerçants à se digitaliser", source: "Business Congo", date: "15 juin 2026", url: "#" },
    { id: 4, title: "Lancement de l'espace pro : un outil gratuit pour les vendeurs", source: "Congo Business", date: "1 juin 2026", url: "#" },
    { id: 5, title: "Congo Soldes s'étend à Ouesso et Dolisie", source: "Congo Tribune", date: "20 mai 2026", url: "#" },
    { id: 6, title: "Les chiffres clés du commerce en ligne au Congo en 2026", source: "Africa Tech", date: "10 mai 2026", url: "#" },
  ]

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-indigo-900/70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_55%)] opacity-8" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-8 lg:py-16">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/25">
            ← Retour à l'accueil
          </Link>
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/15 text-white backdrop-blur">
              <Newspaper className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">Presse</h1>
              <p className="mt-2 max-w-lg text-lg text-white/70">Retrouvez les articles et communiqués sur Congo Soldes.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <div className="space-y-4">
          {articles.map((article) => (
            <article key={article.id} className="group flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-ink leading-snug group-hover:text-primary">{article.title}</h2>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium">{article.source}</span>
                  <span>·</span>
                  <span>{article.date}</span>
                </div>
              </div>
              <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-border/60 bg-card p-8 text-center shadow-card">
          <h2 className="font-display text-xl font-bold text-ink">Vous êtes journaliste ?</h2>
          <p className="mt-2 text-sm text-ink-soft">Contactez-nous pour obtenir des informations exclusives ou un accréditation presse.</p>
          <Link to="/contact" className="mt-4 inline-flex rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow">Nous contacter</Link>
        </div>
      </div>
    </main>
  )
}
