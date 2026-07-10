import { Link } from "react-router-dom"
import { BarChart3, Eye, MousePointerClick, Star, Plus, Zap, Package, Layers, Clock, TrendingUp } from "lucide-react"

export default function Dashboard() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-8">
        <div className="text-xs font-bold uppercase tracking-widest text-primary">Espace pro</div>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">Tableau de bord</h1>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          Gérez vos promotions, suivez vos performances et boostez votre visibilité.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Zap className="h-3.5 w-3.5" /> Promotions actives
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-ink">12</div>
          <div className="mt-1 flex items-center gap-1 text-xs text-success">
            <TrendingUp className="h-3 w-3" /> +3 cette semaine
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Eye className="h-3.5 w-3.5" /> Vues ce mois
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-ink">2 418</div>
          <div className="mt-1 flex items-center gap-1 text-xs text-success">
            <TrendingUp className="h-3 w-3" /> +18% vs mois dernier
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <MousePointerClick className="h-3.5 w-3.5" /> Clics reçus
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-ink">847</div>
          <div className="mt-1 flex items-center gap-1 text-xs text-success">
            <TrendingUp className="h-3 w-3" /> +12% vs mois dernier
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Star className="h-3.5 w-3.5" /> Note moyenne
          </div>
          <div className="mt-2 font-display text-3xl font-bold text-primary">4.8</div>
          <div className="mt-1 text-xs text-muted-foreground">/5 étoiles · 126 avis</div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-2xl font-bold text-ink">Publier une promotion</h2>
        <p className="mt-2 text-sm text-ink-soft">Créez une nouvelle offre pour attirer plus de clients.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Zap className="h-5 w-5" /></div>
            <h3 className="mt-3 font-semibold text-ink">Offre flash</h3>
            <p className="mt-1 text-sm text-ink-soft">Promotion limitée dans le temps pour créer l'urgence. Idéal pour les ventes exceptionnelles.</p>
            <button className="mt-4 rounded-full gradient-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-glow">Créer</button>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Package className="h-5 w-5" /></div>
            <h3 className="mt-3 font-semibold text-ink">Promotion standard</h3>
            <p className="mt-1 text-sm text-ink-soft">Offre classique visible sur le catalogue. Parfaite pour les promos longue durée.</p>
            <button className="mt-4 rounded-full gradient-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-glow">Créer</button>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Layers className="h-5 w-5" /></div>
            <h3 className="mt-3 font-semibold text-ink">Bundle produit</h3>
            <p className="mt-1 text-sm text-ink-soft">Combiner plusieurs produits en une seule offre pour augmenter le panier moyen.</p>
            <button className="mt-4 rounded-full gradient-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-glow">Créer</button>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-2xl font-bold text-ink">Dernières promotions</h2>
        <div className="mt-4 space-y-3">
          {[
            { name: "Riz Basmati 25kg -31%", status: "active", views: "412 vues", time: "Il y a 2 jours" },
            { name: "Poulet braisé + attiéké -40%", status: "active", views: "287 vues", time: "Il y a 3 jours" },
            { name: "Galaxy A15 128Go -22%", status: "expired", views: "1.2K vues", time: "Expiré il y a 1 jour" },
            { name: "Fond de teint Fenty -30%", status: "active", views: "156 vues", time: "Il y a 5 jours" },
          ].map((promo, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card">
              <div className={`h-2 w-2 shrink-0 rounded-full ${promo.status === "active" ? "bg-success" : "bg-muted-foreground"}`} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-ink">{promo.name}</div>
                <div className="text-xs text-muted-foreground">{promo.views} · {promo.time}</div>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${promo.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                {promo.status === "active" ? "En ligne" : "Expirée"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-8">
        <h2 className="font-display text-xl font-bold text-ink">Besoin d'aide ?</h2>
        <p className="mt-2 text-sm text-ink-soft">Notre équipe est disponible pour vous accompagner dans l'utilisation de votre espace pro.</p>
        <div className="mt-4 flex gap-3">
          <Link to="/contact" className="rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow">Nous contacter</Link>
          <a href="#" className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary">Guide vendeur</a>
        </div>
      </div>
    </main>
  )
}
