import { Link } from "react-router-dom"
import { ProductCard } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { todayProducts } from "@/lib/data"

export function TodayPromos() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Aujourd'hui</h2>
            <p className="text-gray-500 mt-0.5 text-sm">Promotions du jour</p>
            <p className="text-xs text-gray-400 mt-0.5">Sélectionnées près de vous · Brazzaville</p>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm">Tout voir</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {todayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
