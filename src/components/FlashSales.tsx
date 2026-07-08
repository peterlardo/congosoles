import { Link } from "react-router-dom"
import { ProductCard } from "@/components/ProductCard"
import { flashProducts } from "@/lib/data"
import { ArrowRight, Zap } from "lucide-react"

export function FlashSales() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary"><Zap className="h-4 w-4 fill-primary" />Offres flash</div>
            <h2 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">Ça se termine bientôt !</h2>
            <p className="mt-2 text-sm text-ink-soft">Des remises jusqu'à −50% pour quelques heures seulement.</p>
          </div>
          <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary">Voir tout <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {flashProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
