import { Link } from "react-router-dom"
export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2">
              <img src="https://congosoles.lovable.app/assets/logo-DGAuEYmk.png" alt="Congo Soldes" className="h-20 w-20 object-contain" />
              <div>
                <div className="font-display text-xl font-bold text-ink">Congo<span className="text-primary">Soldes</span></div>
                <div className="text-xs text-muted-foreground">La qualité au petit prix</div>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm text-ink-soft">
              La plateforme n°1 des promotions commerciales en République du Congo. Découvrez chaque jour les meilleures offres des commerces près de chez vous.
            </p>
            <form className="mt-6 flex overflow-hidden rounded-full border border-border bg-card p-1 shadow-card">
              <input placeholder="Votre email" className="flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground" />
              <button className="rounded-full gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground">S'abonner</button>
            </form>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-ink">Découvrir</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="text-ink-soft transition hover:text-primary">Promotions du jour</Link></li>
              <li><Link to="/" className="text-ink-soft transition hover:text-primary">Offres flash</Link></li>
              <li><Link to="/" className="text-ink-soft transition hover:text-primary">Grandes enseignes</Link></li>
              <li><Link to="/" className="text-ink-soft transition hover:text-primary">Boutiques populaires</Link></li>
              <li><Link to="/" className="text-ink-soft transition hover:text-primary">Catégories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-ink">Commerçants</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="text-ink-soft transition hover:text-primary">Ouvrir une boutique</Link></li>
              <li><Link to="/" className="text-ink-soft transition hover:text-primary">Tarifs & abonnements</Link></li>
              <li><Link to="/" className="text-ink-soft transition hover:text-primary">Publicité sponsorisée</Link></li>
              <li><Link to="/" className="text-ink-soft transition hover:text-primary">Guide vendeur</Link></li>
              <li><Link to="/" className="text-ink-soft transition hover:text-primary">Centre d'aide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-ink">Congo Soldes</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="text-ink-soft transition hover:text-primary">À propos</Link></li>
              <li><Link to="/" className="text-ink-soft transition hover:text-primary">Blog</Link></li>
              <li><Link to="/" className="text-ink-soft transition hover:text-primary">Presse</Link></li>
              <li><Link to="/" className="text-ink-soft transition hover:text-primary">Contact</Link></li>
              <li><Link to="/" className="text-ink-soft transition hover:text-primary">Recrutement</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© 2026 Congo Soldes - Brazzaville, République du Congo</p>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-primary">Confidentialité</Link>
            <Link to="/" className="hover:text-primary">CGU</Link>
            <Link to="/" className="hover:text-primary">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
