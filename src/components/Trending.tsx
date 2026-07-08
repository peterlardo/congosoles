import { ProductCard } from "@/components/ProductCard"
import { todayProducts } from "@/lib/data"

export function Trending() {
  const trending = todayProducts.filter(p => [6, 7, 8, 9].includes(p.id))
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary">Tendances</div>
            <h2 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">Les plus consultés cette semaine</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
