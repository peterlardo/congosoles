import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { MapPin, Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="https://congosoles.lovable.app/assets/logo-DGAuEYmk.png" alt="Congo Soldes" className="h-11 w-11 object-contain" />
            <div>
              <div className="font-display text-xl font-bold leading-tight text-ink">Congo<span className="text-primary">Soldes</span></div>
              <div className="text-xs text-muted-foreground">La qualité au petit prix</div>
            </div>
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium text-ink-soft shadow-card md:flex">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Brazzaville</span>
          </div>

          <nav className="hidden items-center gap-1 rounded-full border border-border bg-card p-1 shadow-card md:flex">
            <Link to="/promos" className="rounded-full px-4 py-2 text-sm font-semibold text-ink-soft transition hover:bg-secondary hover:text-ink">Promos</Link>
            <Link to="/boutiques" className="rounded-full px-4 py-2 text-sm font-semibold text-ink-soft transition hover:bg-secondary hover:text-ink">Boutiques</Link>
            <Link to="/dashboard" className="rounded-full gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">Espace pro</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden rounded-full" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          <Link to="/promos" className="block rounded-full px-4 py-2 text-sm font-semibold text-ink-soft" onClick={() => setMenuOpen(false)}>Promos</Link>
          <Link to="/boutiques" className="block rounded-full px-4 py-2 text-sm font-semibold text-ink-soft" onClick={() => setMenuOpen(false)}>Boutiques</Link>
          <Link to="/dashboard" className="block rounded-full gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground" onClick={() => setMenuOpen(false)}>Espace pro</Link>
        </div>
      )}
    </header>
  )
}
