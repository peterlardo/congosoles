import { Search, BarChart3, ShoppingBag } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Recherchez",
    description: "Trouvez le produit qui vous intéresse par catégorie, marque ou près de chez vous.",
  },
  {
    icon: BarChart3,
    title: "Comparez",
    description: "Comparez les prix des commerces locaux et repérez le meilleur bon plan.",
  },
  {
    icon: ShoppingBag,
    title: "Achetez",
    description: "Rendez-vous en boutique ou commandez, et profitez de la promo.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Comment ça marche</h2>
          <p className="text-gray-500 mt-2 text-sm">Économisez en 3 étapes</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div key={step.title} className="text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
                <step.icon className="w-7 h-7 text-red-600" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {i + 1}
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
