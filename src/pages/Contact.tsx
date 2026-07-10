import { Mail, MapPin, Phone } from "lucide-react"

export default function Contact() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-8">
        <div className="text-xs font-bold uppercase tracking-widest text-primary">Contact</div>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">Nous contacter</h1>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          Une question, une suggestion ? Écrivez-nous et nous vous répondrons rapidement.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nom</label>
                <input type="text" className="mt-1.5 w-full rounded-full border border-border bg-card px-4 py-2.5 text-sm text-ink outline-none transition focus:border-primary" placeholder="Votre nom" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</label>
                <input type="email" className="mt-1.5 w-full rounded-full border border-border bg-card px-4 py-2.5 text-sm text-ink outline-none transition focus:border-primary" placeholder="votre@email.com" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sujet</label>
              <select className="mt-1.5 w-full rounded-full border border-border bg-card px-4 py-2.5 text-sm text-ink outline-none transition focus:border-primary">
                <option>Choisir un sujet</option>
                <option>Question sur une promo</option>
                <option>Proposer un partenariat</option>
                <option>Espace commerçant</option>
                <option>Signal bug / erreur</option>
                <option>Autre demande</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message</label>
              <textarea className="mt-1.5 w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-ink outline-none transition focus:border-primary" rows={6} placeholder="Votre message..." />
            </div>
            <button type="submit" className="rounded-full gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow hover:opacity-95">
              Envoyer
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
            <h2 className="font-display text-lg font-bold text-ink">Nos coordonnées</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground"><MapPin className="h-5 w-5" /></div>
                <div>
                  <div className="text-sm font-semibold text-ink">Adresse</div>
                  <div className="text-sm text-ink-soft">Boulevard du 15 Août, Brazzaville, Congo</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground"><Mail className="h-5 w-5" /></div>
                <div>
                  <div className="text-sm font-semibold text-ink">Email</div>
                  <div className="text-sm text-ink-soft">contact@congosoles.cg</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground"><Phone className="h-5 w-5" /></div>
                <div>
                  <div className="text-sm font-semibold text-ink">Téléphone</div>
                  <div className="text-sm text-ink-soft">+242 06 123 45 67</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
            <h2 className="font-display text-lg font-bold text-ink">Questions fréquentes</h2>
            <div className="mt-4 space-y-3">
              <div>
                <div className="text-sm font-semibold text-ink">Comment publier une promo ?</div>
                <div className="text-sm text-ink-soft">Créez un compte vendeur depuis l'espace pro, puis ajoutez vos offres en quelques clics.</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-ink">Le service est-il gratuit ?</div>
                <div className="text-sm text-ink-soft">L'inscription est gratuite. Des formules payantes sont disponibles pour plus de visibilité.</div>
              </div>
              <div>
                <div className="text-sm font-semibold text-ink">Dans quelles villes ?</div>
                <div className="text-sm text-ink-soft">Nous couvrons Brazzaville, Pointe-Noire, Dolisie et Ouesso.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
