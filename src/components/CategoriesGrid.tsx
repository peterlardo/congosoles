import { Link } from "react-router-dom"
import { categories } from "@/lib/data"

export function CategoriesGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Catégories populaires</h2>
            <p className="mt-1 text-sm text-ink-soft">Trouvez votre bon plan par univers</p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to="/"
              className="group rounded-2xl border border-border/60 bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="block text-3xl transition-transform group-hover:scale-110">{cat.icon}</span>
              <span className="mt-3 block text-sm font-bold text-ink">{cat.name}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{cat.count} promos</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
