import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <div>
              <span className="font-bold text-lg text-gray-900">Congo</span>
              <span className="font-bold text-lg text-red-600">Soldes</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1 text-sm text-gray-500 bg-gray-50 rounded-full px-4 py-1.5">
            <MapPin className="h-4 w-4 text-red-500" />
            <span>Brazzaville</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/promos" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">Promos</Link>
            <Link to="/boutiques" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">Boutiques</Link>
            <Link to="/dashboard" className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">Espace pro</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link to="/promos" className="block text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Promos</Link>
          <Link to="/boutiques" className="block text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Boutiques</Link>
          <Link to="/dashboard" className="block text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Espace pro</Link>
        </div>
      )}
    </header>
  )
}
