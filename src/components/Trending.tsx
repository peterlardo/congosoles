import { useEffect, useState } from "react"
import { ProductCard } from "@/components/ProductCard"
import { fetchActivePromotions, type PromoItem } from "@/lib/promotions"

export function Trending() {
  const [items, setItems] = useState<PromoItem[]>([])

  useEffect(() => {
    fetchActivePromotions().then(data => {
      const sorted = [...data].sort((a, b) => b.views - a.views).slice(0, 4)
      setItems(sorted)
    })
  }, [])

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
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
