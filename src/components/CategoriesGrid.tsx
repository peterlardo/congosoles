import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { fetchCategories, type CategoryFront } from "@/lib/categories"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function CategoriesGrid() {
  const [categories, setCategories] = useState<CategoryFront[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    fetchCategories().then(setCategories)
  }, [])

  const updateScrollButtons = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollButtons()
    el.addEventListener("scroll", updateScrollButtons)
    return () => el.removeEventListener("scroll", updateScrollButtons)
  }, [categories])

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const cardW = el.querySelector("a")?.offsetWidth || 180
    const gap = 12
    el.scrollBy({ left: dir === "left" ? -(cardW + gap) * 2 : (cardW + gap) * 2, behavior: "smooth" })
  }

  if (categories.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Catégories populaires</h2>
            <p className="mt-1 text-sm text-ink-soft">Trouvez votre bon plan par univers</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scroll("left")} disabled={!canScrollLeft}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-ink shadow-sm transition hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => scroll("right")} disabled={!canScrollRight}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-ink shadow-sm transition hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div ref={scrollRef} className="mt-8 flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categorie/${cat.slug}`}
              className="group w-[calc((100%-3*12px)/4)] min-w-[140px] shrink-0 snap-start rounded-2xl border border-border/60 bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift sm:min-w-[160px] lg:min-w-[180px]"
            >
              <span className="block text-3xl transition-transform group-hover:scale-110">{cat.icon}</span>
              <span className="mt-3 block text-sm font-bold text-ink">{cat.name}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{cat.count} promos</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
