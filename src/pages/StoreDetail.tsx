import { useParams, Link } from "react-router-dom"
import { allProducts } from "@/lib/data"

export default function StoreDetail() {
  const { name } = useParams<{ name: string }>()
  const decodedName = decodeURIComponent(name || "")
  const products = allProducts.filter((p) => p.store === decodedName)

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <Link to="/boutiques" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-ink">
        ← Retour aux boutiques
      </Link>
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">{decodedName}</h1>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          {products.length} promotion{products.length > 1 ? "s" : ""} active{products.length > 1 ? "s" : ""}
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Link key={product.id} to={`/promo/${product.id}`} className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-border/60 transition-all hover:-translate-y-0.5 hover:shadow-lift">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img src={product.image} alt={product.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink">{product.title}</h3>
                <div className="mt-auto flex items-baseline gap-2">
                  <span className="text-lg font-bold text-primary">{product.discountPrice.toLocaleString("fr-FR")} FCFA</span>
                  <span className="text-xs text-muted-foreground line-through">{product.originalPrice.toLocaleString("fr-FR")} FCFA</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-border/60 bg-card p-8 text-center shadow-card">
          <div className="font-display text-2xl font-bold text-ink">Aucune promotion</div>
          <p className="mt-2 text-sm text-ink-soft">Cette boutique n'a pas encore de promotions actives.</p>
        </div>
      )}
    </main>
  )
}
