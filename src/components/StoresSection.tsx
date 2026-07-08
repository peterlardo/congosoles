import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { stores } from "@/lib/data"
import { ArrowRight, MapPin, ShoppingBag } from "lucide-react"

export function StoresSection() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Grandes enseignes</h2>
            <p className="text-gray-500 mt-0.5 text-sm">Boutiques populaires</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {stores.map((store) => (
            <Link
              key={store.id}
              to="/"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-red-200 transition-all duration-200 group"
            >
              <div className="text-3xl mb-3">{store.category}</div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{store.name}</h3>
              <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                <MapPin className="h-3 w-3" />
                <span>{store.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-red-600 font-medium">{store.activePromos} promos actives</span>
                <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
