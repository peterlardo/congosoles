import { Link } from "react-router-dom"
import { ProductCard } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import { flashProducts } from "@/lib/data"
import { Zap } from "lucide-react"

export function FlashSales() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-amber-400 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Offres flash</h2>
              <p className="text-gray-500 mt-0.5 text-sm">Ça se termine bientôt !</p>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm">Voir tout</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
