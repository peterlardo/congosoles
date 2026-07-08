import { Link } from "react-router-dom"
import { categories } from "@/lib/data"

export function CategoriesGrid() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Catégories populaires</h2>
            <p className="text-gray-500 mt-1 text-sm">Trouvez votre bon plan par univers</p>
          </div>
          <Link to="/categories" className="text-sm font-medium text-red-600 hover:text-red-700">
            Voir tout
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to="/"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-md hover:bg-red-50/30 transition-all duration-200 group"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-sm font-medium text-gray-800 text-center">{cat.name}</span>
              <span className="text-xs text-gray-400">{cat.count} promos</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
