import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CS</span>
              </div>
              <div>
                <span className="font-bold text-lg text-white">Congo</span>
                <span className="font-bold text-lg text-red-500">Soldes</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4 max-w-xs">
              La plateforme n°1 des promotions commerciales en République du Congo. Découvrez chaque jour les meilleures offres des commerces près de chez vous.
            </p>
            <div className="flex gap-2 max-w-xs">
              <Input
                type="email"
                placeholder="S'abonner"
                className="h-9 text-sm bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                OK
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Découvrir</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">Promotions du jour</Link></li>
              <li><Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">Offres flash</Link></li>
              <li><Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">Grandes enseignes</Link></li>
              <li><Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">Boutiques populaires</Link></li>
              <li><Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">Catégories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Commerçants</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">Ouvrir une boutique</Link></li>
              <li><Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">Tarifs & abonnements</Link></li>
              <li><Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">Publicité sponsorisée</Link></li>
              <li><Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">Guide vendeur</Link></li>
              <li><Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">Centre d'aide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Congo Soldes</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">À propos</Link></li>
              <li><Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">Presse</Link></li>
              <li><Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">Recrutement</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2026 Congo Soldes — Brazzaville, République du Congo</p>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-white transition-colors">Confidentialité</Link>
            <Link to="/" className="hover:text-white transition-colors">CGU</Link>
            <Link to="/" className="hover:text-white transition-colors">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
