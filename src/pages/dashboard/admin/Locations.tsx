import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { fetchDistricts } from "@/lib/admin"
import { MapPin, Plus, Check, X, ChevronDown, ChevronRight } from "lucide-react"
import type { District } from "@/types/admin"

export default function AdminLocations() {
  const [districts, setDistricts] = useState<District[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string[]>([])
  const [newNeighborhood, setNewNeighborhood] = useState<{ districtId: string; name: string } | null>(null)

  useEffect(() => {
    fetchDistricts().then(data => { setDistricts(data); setLoading(false) })
  }, [])

  const addNeighborhood = async () => {
    if (!newNeighborhood) return
    await supabase.from("neighborhoods").insert({
      district_id: newNeighborhood.districtId, name: newNeighborhood.name,
      slug: newNeighborhood.name.toLowerCase().replace(/\s+/g, "-")
    })
    setDistricts(await fetchDistricts())
    setNewNeighborhood(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Localisations</h1>
        <p className="mt-1 text-sm text-ink-soft">{districts.length} arrondissements</p>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />)}</div>
      ) : (
        <div className="space-y-2">
          {districts.map(dist => (
            <div key={dist.id} className="rounded-2xl border border-border/60 bg-card shadow-card">
              <div className="flex items-center gap-3 p-4">
                <button onClick={() => setExpanded(p => p.includes(dist.id) ? p.filter(i => i !== dist.id) : [...p, dist.id])} className="text-muted-foreground">
                  {expanded.includes(dist.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                <MapPin className="h-5 w-5 text-primary" />
                <span className="flex-1 text-sm font-semibold text-ink">{dist.name}</span>
                <span className="text-xs text-muted-foreground">{dist.neighborhoods?.length || 0} quartiers</span>
              </div>
              {expanded.includes(dist.id) && (
                <div className="border-t border-border/60 px-4 pb-4 pt-3 space-y-2">
                  {dist.neighborhoods?.map(n => (
                    <div key={n.id} className="rounded-xl bg-muted px-3 py-2 text-sm text-ink">{n.name}</div>
                  ))}
                  <button onClick={() => setNewNeighborhood({ districtId: dist.id, name: "" })}
                    className="flex items-center gap-2 text-sm text-primary font-semibold"><Plus className="h-3 w-3" /> Ajouter un quartier</button>
                  {newNeighborhood?.districtId === dist.id && (
                    <div className="flex gap-2">
                      <input value={newNeighborhood.name} onChange={e => setNewNeighborhood({ ...newNeighborhood, name: e.target.value })}
                        placeholder="Nom du quartier" className="h-9 flex-1 rounded-full border border-border bg-background px-3 text-sm outline-none"
                        onKeyDown={e => e.key === "Enter" && addNeighborhood()} autoFocus />
                      <button onClick={addNeighborhood} className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="h-4 w-4" /></button>
                      <button onClick={() => setNewNeighborhood(null)} className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground"><X className="h-4 w-4" /></button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}