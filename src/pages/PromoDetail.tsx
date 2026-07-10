import { useParams, Link } from "react-router-dom"
import { allProducts } from "@/lib/data"

export default function PromoDetail() {
  const { id } = useParams<{ id: string }>()
  const product = allProducts.find((p) => p.id === Number(id))

  if (!product) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="rounded-3xl border border-border/60 bg-card p-8 text-center shadow-card">
          <div className="font-display text-2xl font-bold text-ink">Promotion introuvable</div>
          <Link to="/promos" className="mt-4 inline-flex text-sm text-primary hover:underline">Retour aux promos</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <Link to="/promos" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-ink">
        ← Retour aux promotions
      </Link>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-muted">
          <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
        </div>
        <div>
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            <span>{product.brand}</span>
            <span>·</span>
            <span>{product.category}</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">{product.title}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-primary">{product.discountPrice.toLocaleString("fr-FR")} FCFA</span>
            <span className="text-sm text-muted-foreground line-through">{product.originalPrice.toLocaleString("fr-FR")} FCFA</span>
            <span className="rounded-full gradient-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">-{product.discountPercent}%</span>
          </div>
          <div className="mt-6 space-y-3 text-sm text-ink-soft">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-ink">Boutique :</span> {product.store}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-ink">Distance :</span> {product.storeDistance}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-ink">Ville :</span> {product.location}
            </div>
          </div>
          {product.isFlash && product.flashEnd && (
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-accent/60 px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-foreground">Fin dans</span>
              <span className="font-mono text-sm font-semibold tabular-nums text-accent-foreground">{product.flashEnd}</span>
            </div>
          )}
          <button className="mt-8 w-full rounded-full gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow hover:opacity-95">
            Voir l'offre
          </button>
        </div>
      </div>
    </main>
  )
}
