import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  current: number
  total: number
  pageSize: number
  onChange: (page: number) => void
}

export default function Pagination({ current, total, pageSize, onChange }: PaginationProps) {
  const pages = Math.ceil(total / pageSize)
  if (pages <= 1) return null

  const range: number[] = []
  const start = Math.max(1, current - 2)
  const end = Math.min(pages, current + 2)
  for (let i = start; i <= end; i++) range.push(i)

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button onClick={() => onChange(current - 1)} disabled={current <= 1}
        className="grid h-9 w-9 place-items-center rounded-full border border-border/60 text-ink-soft transition hover:bg-muted hover:text-ink disabled:opacity-30 disabled:pointer-events-none">
        <ChevronLeft className="h-4 w-4" />
      </button>
      {start > 1 && (
        <>
          <button onClick={() => onChange(1)} className="grid h-9 w-9 place-items-center rounded-full border border-border/60 text-sm text-ink-soft transition hover:bg-muted hover:text-ink">1</button>
          {start > 2 && <span className="text-xs text-muted-foreground">...</span>}
        </>
      )}
      {range.map(i => (
        <button key={i} onClick={() => onChange(i)}
          className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold transition ${
            i === current ? "bg-primary text-primary-foreground" : "border border-border/60 text-ink-soft hover:bg-muted hover:text-ink"
          }`}>{i}</button>
      ))}
      {end < pages && (
        <>
          {end < pages - 1 && <span className="text-xs text-muted-foreground">...</span>}
          <button onClick={() => onChange(pages)} className="grid h-9 w-9 place-items-center rounded-full border border-border/60 text-sm text-ink-soft transition hover:bg-muted hover:text-ink">{pages}</button>
        </>
      )}
      <button onClick={() => onChange(current + 1)} disabled={current >= pages}
        className="grid h-9 w-9 place-items-center rounded-full border border-border/60 text-ink-soft transition hover:bg-muted hover:text-ink disabled:opacity-30 disabled:pointer-events-none">
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
