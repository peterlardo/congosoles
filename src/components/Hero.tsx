import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"

const cities = ["Brazzaville", "Pointe-Noire", "Dolisie", "Ouesso"]
const searchTerms = ["Riz", "Smartphones", "Sneakers", "Wax", "Restaurants", "Frigo"]

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=70&auto=format"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                +3 500 promotions actives · Congo
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Toutes les promotions,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">au même endroit.</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-xl">
              Découvrez chaque jour les meilleures offres des commerces près de chez vous à Brazzaville, Pointe-Noire et partout au Congo. La qualité au petit prix.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {cities.map((city) => (
                <button
                  key={city}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-sm px-4 py-2 rounded-full transition-colors"
                >
                  <MapPin className="h-3.5 w-3.5 text-red-400" />
                  {city}
                </button>
              ))}
            </div>

            <div className="relative max-w-xl mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher un produit, une marque, un commerce..."
                className="pl-10 pr-28 h-12 bg-white text-gray-900 border-0 rounded-xl"
              />
              <Button className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 bg-red-600 hover:bg-red-700 rounded-lg text-xs px-4">
                Rechercher
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {searchTerms.map((term) => (
                <button
                  key={term}
                  className="text-xs bg-white/5 hover:bg-white/10 text-gray-300 px-3 py-1.5 rounded-full transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80&auto=format"
              alt="Marché"
              className="rounded-2xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
        </div>

        <div className="relative mt-12 grid grid-cols-2 sm:grid-cols-4 gap-8 border-t border-white/10 pt-8">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">−47%</div>
            <div className="text-sm text-gray-400 mt-1">Moyenne des offres flash</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white">3.5K</div>
            <div className="text-sm text-gray-400 mt-1">Promos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white">820</div>
            <div className="text-sm text-gray-400 mt-1">Boutiques</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white">62K</div>
            <div className="text-sm text-gray-400 mt-1">Membres</div>
          </div>
        </div>
      </div>
    </section>
  )
}
