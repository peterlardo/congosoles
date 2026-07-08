import { ProductCard } from "@/components/ProductCard"
import { todayProducts } from "@/lib/data"

export function Trending() {
  const trending = todayProducts.filter(p => [2, 3, 4, 6, 7].includes(p.id))
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Tendances</h2>
          <p className="text-gray-500 mt-0.5 text-sm">Les plus consultés cette semaine</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trending.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
