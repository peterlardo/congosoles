export default function Contact() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="max-w-2xl">
        <div className="text-xs font-bold uppercase tracking-widest text-primary">Contact</div>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">Nous contacter</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Une question, une suggestion ? Écrivez-nous et nous vous répondrons rapidement.
        </p>

        <form className="mt-8 space-y-4">
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
            <input type="text" className="mt-1.5 w-full rounded-full border border-border bg-card px-4 py-2.5 text-sm text-ink outline-none transition focus:border-primary" placeholder="Sujet de votre message" />
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
    </main>
  )
}
