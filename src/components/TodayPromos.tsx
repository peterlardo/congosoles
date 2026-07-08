import { Link } from "react-router-dom"
import { ProductCard } from "@/components/ProductCard"
import { todayProducts } from "@/lib/data"
import { ArrowRight } from "lucide-react"

export function TodayPromos() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary">Aujourd'hui</div>
            <h2 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">Promotions du jour</h2>
            <p className="mt-1 text-sm text-ink-soft">Sélectionnées près de vous · Brazzaville</p>
          </div>
          <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary">Tout voir <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {todayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
