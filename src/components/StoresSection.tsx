import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { fetchStores, type StoreFront } from "@/lib/stores"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function StoresSection() {
  const [stores, setStores] = useState<StoreFront[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchStores().then(setStores)
  }, [])

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    const amount = 640
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
  }

  if (stores.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary">Grandes enseignes</div>
            <h2 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">Boutiques populaires</h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button onClick={() => scroll("left")} className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-ink transition hover:border-primary hover:text-primary">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => scroll("right")} className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-ink transition hover:border-primary hover:text-primary">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div ref={scrollRef} className="mt-8 flex gap-6 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden">
          {stores.map((store) => (
            <Link
              key={store.id}
              to={`/store/${store.slug}`}
              className="flex shrink-0 flex-col items-center gap-2"
            >
              <div className="flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card transition hover:shadow-lift">
                {store.logoUrl ? (
                  <img src={store.logoUrl} alt={store.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-primary/70 text-2xl font-black text-white">
                    {store.logoInitial}
                  </div>
                )}
              </div>
              <span className="max-w-[100px] truncate text-center text-xs font-semibold text-ink">{store.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
