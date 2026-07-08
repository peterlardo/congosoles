import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Clock, Store, TrendingUp, CreditCard } from "lucide-react"

const stats = [
  { icon: Clock, value: "5 min", label: "pour publier une promo" },
  { icon: Store, value: "820+", label: "commerces déjà inscrits" },
  { icon: TrendingUp, value: "×3.2", label: "de trafic en boutique" },
  { icon: CreditCard, value: "0 FCFA", label: "pour commencer" },
]

export function ForBusiness() {
  return (
    <section className="py-12 sm:py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Pour les commerçants</h2>
            <p className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400 mb-4">
              Vendez plus. Attirez vos voisins.
            </p>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Publiez vos promotions en quelques minutes, gérez votre catalogue, mesurez vos performances et boostez votre visibilité à Brazzaville, Pointe-Noire et partout au Congo.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-red-600 hover:bg-red-700 text-white" asChild>
                <Link to="/dashboard">Ouvrir ma boutique</Link>
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
                <Link to="/">Voir les tarifs</Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <stat.icon className="w-6 h-6 text-amber-400 mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
