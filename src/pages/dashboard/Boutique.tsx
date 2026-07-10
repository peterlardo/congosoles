import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { Store, Save, Image, MapPin, Phone, Globe } from "lucide-react"

interface Boutique {
  id: string
  name: string
  description: string
  address: string
  phone: string
  website: string
  image: string
  category: string
}

export default function DashboardBoutique() {
  const { user } = useAuth()
  const [boutique, setBoutique] = useState<Boutique | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function fetchBoutique() {
      if (!user) return
      const { data } = await supabase
        .from("stores")
        .select("*")
        .eq("user_id", user.id)
        .single()
      setBoutique(data)
      setLoading(false)
    }
    fetchBoutique()
  }, [user])

  const handleSave = async () => {
    if (!boutique || !user) return
    setSaving(true)
    await supabase
      .from("stores")
      .upsert({ ...boutique, user_id: user.id })
      .eq("user_id", user.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-muted" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Ma boutique</h1>
        <p className="mt-1 text-sm text-ink-soft">Configurez les informations de votre boutique.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card space-y-4">
            <h2 className="font-semibold text-ink">Informations générales</h2>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nom de la boutique</label>
              <div className="relative mt-1.5">
                <Store className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={boutique?.name || ""}
                  onChange={(e) => setBoutique((b) => b ? { ...b, name: e.target.value } : null)}
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-ink outline-none transition focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</label>
              <textarea
                value={boutique?.description || ""}
                onChange={(e) => setBoutique((b) => b ? { ...b, description: e.target.value } : null)}
                rows={3}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink outline-none transition focus:border-primary resize-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Adresse</label>
                <div className="relative mt-1.5">
                  <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={boutique?.address || ""}
                    onChange={(e) => setBoutique((b) => b ? { ...b, address: e.target.value } : null)}
                    className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-ink outline-none transition focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Téléphone</label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    value={boutique?.phone || ""}
                    onChange={(e) => setBoutique((b) => b ? { ...b, phone: e.target.value } : null)}
                    className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-ink outline-none transition focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Site web</label>
              <div className="relative mt-1.5">
                <Globe className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="url"
                  value={boutique?.website || ""}
                  onChange={(e) => setBoutique((b) => b ? { ...b, website: e.target.value } : null)}
                  placeholder="https://"
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-ink outline-none transition focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:opacity-95 disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> {saving ? "Enregistrement..." : saved ? "Enregistré ✓" : "Enregistrer"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
            <h2 className="font-semibold text-ink">Photo de couverture</h2>
            <div className="mt-3 aspect-video rounded-xl border-2 border-dashed border-border bg-muted flex items-center justify-center">
              <div className="text-center">
                <Image className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-xs text-muted-foreground">Cliquez pour ajouter une image</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
            <h2 className="font-semibold text-ink">Catégorie</h2>
            <select
              value={boutique?.category || ""}
              onChange={(e) => setBoutique((b) => b ? { ...b, category: e.target.value } : null)}
              className="mt-3 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-ink outline-none transition focus:border-primary"
            >
              <option value="">Choisir une catégorie</option>
              <option value="supermarches">Supermarchés</option>
              <option value="mode">Mode</option>
              <option value="chaussures">Chaussures</option>
              <option value="beaute">Beauté</option>
              <option value="telephones">Téléphones</option>
              <option value="informatique">Informatique</option>
              <option value="electromenager">Électroménager</option>
              <option value="restaurants">Restaurants</option>
              <option value="pharmacies">Pharmacies</option>
              <option value="automobile">Automobile</option>
              <option value="mobilier">Mobilier</option>
              <option value="sport">Sport</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
