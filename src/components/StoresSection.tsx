import { Link } from "react-router-dom"
import { stores } from "@/lib/data"
import { BadgeCheck } from "lucide-react"

export function StoresSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary">Grandes enseignes</div>
            <h2 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">Boutiques populaires</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <div
              key={store.id}
              className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card transition hover:shadow-lift"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-2xl">{store.category}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <div className="truncate font-semibold text-ink">{store.name}</div>
                  {store.id !== 4 && <BadgeCheck className="h-4 w-4 text-primary" />}
                </div>
                <div className="text-xs text-muted-foreground">{store.location} · {store.activePromos} promos actives</div>
              </div>
              <Link to="/" className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-primary hover:text-primary">Visiter</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
