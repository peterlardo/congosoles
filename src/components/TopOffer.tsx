import { ArrowRight } from "lucide-react"

export function TopOffer() {
  return (
    <section className="mx-auto max-w-7xl px-4 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl gradient-primary p-5 text-primary-foreground shadow-glow sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)] opacity-25" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-white/80">Top offre du jour</div>
            <h3 className="mt-1 font-display text-2xl font-bold">Poulet braisé + attiéké + boisson</h3>
            <div className="mt-2 flex items-center gap-3 text-sm"><span className="text-xl font-bold">3 900 FCFA</span><span className="line-through opacity-75">6 500 FCFA</span><span className="rounded-full bg-white/15 px-2 py-1 text-xs font-bold">−40%</span></div>
          </div>
          <a href="/" className="inline-flex items-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-bold text-primary shadow-card">Explorer <ArrowRight className="h-4 w-4" /></a>
        </div>
      </div>
    </section>
  )
}
