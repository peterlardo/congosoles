import { StoresSection } from "@/components/StoresSection"

export default function Boutiques() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-8">
        <div className="text-xs font-bold uppercase tracking-widest text-primary">Grandes enseignes</div>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">Boutiques</h1>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          Trouvez les meilleures boutiques et commerces près de chez vous.
        </p>
      </div>
      <StoresSection />
    </main>
  )
}
