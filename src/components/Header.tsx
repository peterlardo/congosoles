import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Menu, Search, X, ChevronDown } from "lucide-react"
import { useState } from "react"
import { categories } from "@/lib/data"

const commerantsLinks = [
  { label: "Tarifs & abonnements", to: "/tarifs" },
  { label: "Publicité sponsorisée", to: "/publicite" },
  { label: "Guide vendeur", to: "/guide-vendeur" },
  { label: "Centre d'aide", to: "/contact" },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [commOpen, setCommOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/assets/logo.png" alt="Congo Soldes" className="h-40 w-40 object-contain" />
          </Link>

          <form className="hidden min-w-0 flex-1 max-w-xl items-center rounded-full border border-border bg-card p-1 shadow-card md:flex">
            <Search className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="search"
              placeholder="Rechercher une promo, une boutique..."
              className="min-w-0 flex-1 bg-transparent px-3 text-sm text-ink outline-none placeholder:text-muted-foreground"
            />
            <button className="rounded-full gradient-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-glow">
              Rechercher
            </button>
          </form>

          <nav className="hidden items-center gap-1 rounded-full border border-border bg-card p-1 shadow-card lg:flex">
            <Link to="/promos" className="rounded-full px-4 py-2 text-sm font-semibold text-ink-soft transition hover:bg-secondary hover:text-ink">Promos</Link>

            <div className="relative">
              <button
                onClick={() => { setCatOpen(!catOpen); setCommOpen(false) }}
                onBlur={() => setTimeout(() => setCatOpen(false), 150)}
                className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-ink-soft transition hover:bg-secondary hover:text-ink"
              >
                Catégories
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {catOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border bg-card p-3 shadow-lift">
                  <div className="grid grid-cols-2 gap-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/categorie/${cat.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-")}`}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink transition hover:bg-secondary"
                        onClick={() => setCatOpen(false)}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                  <Link
                    to="/promos"
                    className="mt-2 block rounded-xl bg-accent px-3 py-2 text-center text-xs font-bold text-accent-foreground transition hover:opacity-90"
                    onClick={() => setCatOpen(false)}
                  >
                    Voir toutes les promos
                  </Link>
                </div>
              )}
            </div>

            <Link to="/boutiques" className="rounded-full px-4 py-2 text-sm font-semibold text-ink-soft transition hover:bg-secondary hover:text-ink">Boutiques</Link>

            <div className="relative">
              <button
                onClick={() => { setCommOpen(!commOpen); setCatOpen(false) }}
                onBlur={() => setTimeout(() => setCommOpen(false), 150)}
                className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-ink-soft transition hover:bg-secondary hover:text-ink"
              >
                Commerçants
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {commOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border bg-card p-2 shadow-lift">
                  {commerantsLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="block rounded-xl px-4 py-2.5 text-sm text-ink transition hover:bg-secondary"
                      onClick={() => setCommOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="my-1 border-t border-border/60" />
                  <Link
                    to="/dashboard"
                    className="block rounded-xl bg-accent px-4 py-2.5 text-center text-xs font-bold text-accent-foreground transition hover:opacity-90"
                    onClick={() => setCommOpen(false)}
                  >
                    Ouvrir ma boutique
                  </Link>
                </div>
              )}
            </div>

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
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3 max-h-[80vh] overflow-y-auto">
          <form className="flex items-center rounded-full border border-border bg-card p-1 shadow-card">
            <Search className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="search"
              placeholder="Rechercher une promo, une boutique..."
              className="min-w-0 flex-1 bg-transparent px-3 text-sm text-ink outline-none placeholder:text-muted-foreground"
            />
            <button className="rounded-full gradient-primary px-4 py-2 text-xs font-bold text-primary-foreground">
              OK
            </button>
          </form>
          <Link to="/promos" className="block rounded-full px-4 py-2 text-sm font-semibold text-ink-soft" onClick={() => setMenuOpen(false)}>Promos</Link>
          <div>
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="flex items-center gap-1 w-full rounded-full px-4 py-2 text-sm font-semibold text-ink-soft text-left"
            >
              Catégories
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${catOpen ? "rotate-180" : ""}`} />
            </button>
            {catOpen && (
              <div className="ml-4 mt-1 grid grid-cols-2 gap-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/categorie/${cat.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-")}`}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs text-ink-soft transition hover:bg-secondary"
                    onClick={() => { setCatOpen(false); setMenuOpen(false) }}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/boutiques" className="block rounded-full px-4 py-2 text-sm font-semibold text-ink-soft" onClick={() => setMenuOpen(false)}>Boutiques</Link>
          <div>
            <button
              onClick={() => setCommOpen(!commOpen)}
              className="flex items-center gap-1 w-full rounded-full px-4 py-2 text-sm font-semibold text-ink-soft text-left"
            >
              Commerçants
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${commOpen ? "rotate-180" : ""}`} />
            </button>
            {commOpen && (
              <div className="ml-4 mt-1 space-y-1">
                {commerantsLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block rounded-xl px-3 py-1.5 text-xs text-ink-soft transition hover:bg-secondary"
                    onClick={() => { setCommOpen(false); setMenuOpen(false) }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/dashboard" className="block rounded-full gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground text-center" onClick={() => setMenuOpen(false)}>Espace pro</Link>
        </div>
      )}
    </header>
  )
}
