import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Menu, Search, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-56 w-56 overflow-hidden rounded-full" style={{ mixBlendMode: 'multiply' }}>
              <img src="/assets/logo.png" alt="Congo Soldes" className="h-full w-full object-contain" />
            </div>
            <div>
              <div className="font-display text-xl font-bold leading-tight text-ink">Congo<span className="text-primary">Soldes</span></div>
              <div className="text-xs text-muted-foreground">La qualité au petit prix</div>
            </div>
          </Link>

          <form className="hidden min-w-0 flex-1 max-w-sm items-center rounded-full border border-border bg-card p-1 shadow-card md:flex">
            <Search className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="search"
              placeholder="Rechercher"
              className="min-w-0 flex-1 bg-transparent px-3 text-sm text-ink outline-none placeholder:text-muted-foreground"
            />
            <button className="rounded-full gradient-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-glow">
              Rechercher
            </button>
          </form>

          <nav className="hidden items-center gap-1 rounded-full border border-border bg-card p-1 shadow-card lg:flex">
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
          <form className="flex items-center rounded-full border border-border bg-card p-1 shadow-card">
            <Search className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="search"
              placeholder="Rechercher"
              className="min-w-0 flex-1 bg-transparent px-3 text-sm text-ink outline-none placeholder:text-muted-foreground"
            />
            <button className="rounded-full gradient-primary px-4 py-2 text-xs font-bold text-primary-foreground">
              OK
            </button>
          </form>
          <Link to="/promos" className="block rounded-full px-4 py-2 text-sm font-semibold text-ink-soft" onClick={() => setMenuOpen(false)}>Promos</Link>
          <Link to="/boutiques" className="block rounded-full px-4 py-2 text-sm font-semibold text-ink-soft" onClick={() => setMenuOpen(false)}>Boutiques</Link>
          <Link to="/dashboard" className="block rounded-full gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground" onClick={() => setMenuOpen(false)}>Espace pro</Link>
        </div>
      )}
    </header>
  )
}
