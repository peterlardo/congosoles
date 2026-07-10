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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Promotions actives</div>
          <div className="mt-2 font-display text-3xl font-bold text-ink">12</div>
          <div className="mt-1 text-xs text-success">+3 cette semaine</div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Vues ce mois</div>
          <div className="mt-2 font-display text-3xl font-bold text-ink">2.4K</div>
          <div className="mt-1 text-xs text-success">+18% vs mois dernier</div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Clics reçus</div>
          <div className="mt-2 font-display text-3xl font-bold text-ink">847</div>
          <div className="mt-1 text-xs text-success">+12% vs mois dernier</div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Note moyenne</div>
          <div className="mt-2 font-display text-3xl font-bold text-primary">4.8</div>
          <div className="mt-1 text-xs text-muted-foreground">/5 étoiles</div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-2xl font-bold text-ink">Publier une promotion</h2>
        <p className="mt-2 text-sm text-ink-soft">Créez une nouvelle offre pour attirer plus de clients.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
            <h3 className="font-semibold text-ink">Offre flash</h3>
            <p className="mt-1 text-sm text-ink-soft">Promotion limitée dans le temps pour créer l'urgence.</p>
            <button className="mt-4 rounded-full gradient-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-glow">Créer</button>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
            <h3 className="font-semibold text-ink">Promotion standard</h3>
            <p className="mt-1 text-sm text-ink-soft">Offre classique visible sur le catalogue.</p>
            <button className="mt-4 rounded-full gradient-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-glow">Créer</button>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
            <h3 className="font-semibold text-ink">Bundle produit</h3>
            <p className="mt-1 text-sm text-ink-soft">Combiner plusieurs produits en une seule offre.</p>
            <button className="mt-4 rounded-full gradient-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-glow">Créer</button>
          </div>
        </div>
      </div>
    </main>
  )
}
