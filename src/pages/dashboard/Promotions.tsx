import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { Plus, Zap, Eye, Pencil, Trash2, Search, X, Save, Store, Upload, Loader2, ImageIcon } from "lucide-react"
import { fetchCategories, type CategoryFront } from "@/lib/categories"

interface DashboardPromotion {
  id: string
  title: string
  description: string
  discount: number
  status: string
  views: number
  clicks: number
  category: string
  image: string
  created_at: string
  is_flash: boolean
  expires_at: string | null
  payment_methods?: string[]
  store_id: string | null
  district: string | null
  stores?: { name: string; slug: string } | null
}

interface VendorStore {
  id: string
  name: string
  slug: string
  district: string | null
}

export default function DashboardPromotions() {
  const { user, profile } = useAuth()

  const [promos, setPromos] = useState<DashboardPromotion[]>([])
  const [stores, setStores] = useState<VendorStore[]>([])
  const [categories, setCategories] = useState<CategoryFront[]>([])
  const [cities, setCities] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "active" | "draft" | "expired">("all")
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    title: "", description: "", discount: 0, original_price: 0, sale_price: 0,
    category: "", image: "", is_flash: false, status: "active" as string,
    store_id: "", district: "", city: "", quantity: 0,
    payment_methods: ["mtn", "airtel"] as string[],
    expires_at: "",
  })

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from("stores").select("id, name, slug, district").eq("user_id", user.id).eq("status", "active"),
      fetchCategories(),
      supabase.from("districts").select("id, name").eq("is_active", true).order("display_order"),
    ]).then(([storesRes, cats, citiesRes]) => {
      setStores(storesRes.data || [])
      setCategories(cats)
      setCities(citiesRes.data || [])
      if ((storesRes.data || []).length === 1) {
        setForm(prev => ({ ...prev, store_id: storesRes.data![0].id, district: storesRes.data![0].district || "" }))
      }
    })
  }, [user])

  async function uploadImage(file: File) {
    if (!user) return
    setUploading(true)
    const ext = file.name.split(".").pop() || "jpg"
    const path = `${user.id}/promo-${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from("store-images")
      .upload(path, file, { upsert: true })
    if (error) { alert("Erreur d'upload : " + error.message); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage
      .from("store-images")
      .getPublicUrl(path)
    setForm(prev => ({ ...prev, image: publicUrl }))
    setUploading(false)
  }

  const togglePaymentMethod = (method: string) => {
    setForm(prev => ({
      ...prev,
      payment_methods: prev.payment_methods.includes(method)
        ? prev.payment_methods.filter(m => m !== method)
        : [...prev.payment_methods, method]
    }))
  }

  const handleSave = async () => {
    if (!user || !form.title || !form.store_id) return
    const expiresAt = form.is_flash && form.expires_at ? new Date(form.expires_at).toISOString() : null

    if (editingId) {
      await supabase.from("promotions").update({
        title: form.title,
        description: form.description,
        discount: form.discount,
        original_price: form.original_price,
        sale_price: form.sale_price,
        category: form.category,
        image: form.image,
        is_flash: form.is_flash,
        expires_at: expiresAt,
        status: form.status,
        payment_methods: form.payment_methods,
        district: form.district,
        city: form.city,
        quantity: form.quantity,
      }).eq("id", editingId)
    } else {
      const { data: storePlan } = await supabase
        .from("stores")
        .select("plan")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle()

      if (storePlan?.plan) {
        const { data: planDef } = await supabase
          .from("subscription_plans")
          .select("name, max_promotions")
          .eq("slug", storePlan.plan)
          .maybeSingle()

        if (planDef && planDef.max_promotions !== -1) {
          const { count } = await supabase
            .from("promotions")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
          if (count !== null && count >= planDef.max_promotions) {
            alert(`Limite atteinte : vous avez atteint la limite de ${planDef.max_promotions} promotions avec la formule ${planDef.name}. Passez à une formule supérieure pour publier plus de promotions.`)
            return
          }
        }
      }

      await supabase.from("promotions").insert({
        user_id: user.id,
        store_id: form.store_id,
        title: form.title,
        description: form.description,
        discount: form.discount,
        original_price: form.original_price,
        sale_price: form.sale_price,
        category: form.category,
        image: form.image,
        is_flash: form.is_flash,
        expires_at: expiresAt,
        status: form.status,
        payment_methods: form.payment_methods,
        district: form.district,
        city: form.city,
        quantity: form.quantity,
      })
    }

    setShowForm(false)
    setEditingId(null)
    setForm({ title: "", description: "", discount: 0, original_price: 0, sale_price: 0, category: "", image: "", is_flash: false, status: "active", store_id: "", district: "", city: "", quantity: 0, payment_methods: ["mtn", "airtel"], expires_at: "" })
    await loadPromos()
  }

  async function loadPromos() {
    if (!user) return
    let query = supabase
      .from("promotions")
      .select("*, stores!promotions_store_id_fkey(name, slug)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (filter !== "all") query = query.eq("status", filter)
    if (search) query = query.ilike("title", `%${search}%`)

    const { data } = await query
    setPromos(data || [])
    setLoading(false)
  }

  useEffect(() => { loadPromos() }, [user, filter, search])

  const handleEdit = async (promo: DashboardPromotion) => {
    setForm({
      title: promo.title,
      description: promo.description || "",
      discount: promo.discount,
      original_price: 0,
      sale_price: 0,
      category: promo.category || "",
      image: promo.image || "",
      is_flash: promo.is_flash || false,
      status: promo.status,
      store_id: promo.store_id || stores[0]?.id || "",
      district: promo.district || "",
      city: (promo as any).city || "",
      quantity: (promo as any).quantity || 0,
      payment_methods: promo.payment_methods || ["mtn", "airtel"],
      expires_at: promo.expires_at ? promo.expires_at.slice(0, 16) : "",
    })
    setEditingId(promo.id)
    setShowForm(true)
  }

  const handleToggleStatus = async (promo: DashboardPromotion) => {
    const newStatus = promo.status === "active" ? "draft" : "active"
    await supabase.from("promotions").update({ status: newStatus }).eq("id", promo.id)
    await loadPromos()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette promotion ?")) return
    const { error } = await supabase.from("promotions").delete().eq("id", id)
    if (error) {
      alert("Erreur lors de la suppression : " + error.message)
      return
    }
    setPromos((prev) => prev.filter((p) => p.id !== id))
  }

  const filters = [
    { value: "all" as const, label: "Toutes" },
    { value: "active" as const, label: "En ligne" },
    { value: "draft" as const, label: "Brouillons" },
    { value: "expired" as const, label: "Expirées" },
  ]

  const canManagePromos = profile && ["vendor", "super_admin", "admin"].includes(profile.role)

  if (profile && !canManagePromos) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-12 text-center shadow-card">
        <Zap className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 font-display text-xl font-bold text-ink">Accès réservé aux commerçants</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Seuls les vendeurs peuvent gérer des promotions. Contactez l'administration si vous souhaitez devenir commerçant.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Mes promotions</h1>
          <p className="mt-1 text-sm text-ink-soft">Gérez toutes vos offres depuis un seul endroit.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:opacity-95">
          <Plus className="h-4 w-4" /> Nouvelle promo
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une promotion..."
            className="h-10 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm text-ink outline-none transition focus:border-primary"
          />
        </div>
        <div className="flex gap-1.5 rounded-full border border-border bg-card p-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                filter === f.value ? "bg-primary text-primary-foreground" : "text-ink-soft hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : promos.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center shadow-card">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Zap className="h-6 w-6" /></div>
          <h3 className="mt-4 font-semibold text-ink">Aucune promotion trouvée</h3>
          <p className="mt-1 text-sm text-ink-soft">
            {search ? "Essayez un autre terme de recherche." : "Créez votre première promotion."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {promos.map((promo) => (
            <div key={promo.id} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                {promo.image ? (
                  <img src={promo.image} alt={promo.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-muted-foreground"><Zap className="h-5 w-5" /></div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-ink">{promo.title}</span>
                  {promo.discount > 0 && (
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">-{promo.discount}%</span>
                  )}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                  {promo.stores?.name && (
                    <span className="flex items-center gap-1"><Store className="h-3 w-3" /> {promo.stores.name}</span>
                  )}
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {promo.views || 0}</span>
                  <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> {promo.clicks || 0}</span>
                  <span>{new Date(promo.created_at).toLocaleDateString("fr-FR")}</span>
                  {promo.is_flash && <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-600">FLASH</span>}
                </div>
                {promo.payment_methods && promo.payment_methods.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {promo.payment_methods.includes("mtn") && <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] font-bold text-yellow-600">MTN</span>}
                    {promo.payment_methods.includes("airtel") && <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-600">Airtel</span>}
                    {promo.payment_methods.includes("visa") && <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600">VISA</span>}
                  </div>
                )}
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                promo.status === "active" ? "bg-success/10 text-success"
                  : promo.status === "draft" ? "bg-amber-500/10 text-amber-600"
                  : "bg-muted text-muted-foreground"
              }`}>
                {promo.status === "active" ? "En ligne" : promo.status === "draft" ? "Brouillon" : "Expirée"}
              </span>
              <div className="hidden gap-1 sm:flex">
                <button onClick={() => handleToggleStatus(promo)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-ink" title={promo.status === "active" ? "Désactiver" : "Activer"}>
                  <Zap className={`h-3.5 w-3.5 ${promo.status === "draft" ? "text-amber-500" : ""}`} />
                </button>
                <button onClick={() => handleEdit(promo)} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-ink"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => handleDelete(promo.id)} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">{editingId ? "Modifier" : "Nouvelle"} promotion</h3>
            <div className="mt-4 space-y-3">
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Titre de la promotion" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Description" className="h-20 w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-primary" />

              <select value={form.store_id} onChange={e => {
                const store = stores.find(s => s.id === e.target.value)
                setForm({ ...form, store_id: e.target.value, district: store?.district || "" })
              }}
                className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary">
                <option value="">Sélectionner une boutique</option>
                {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>

              <div className="grid grid-cols-2 gap-3">
                <input value={form.discount || ""} onChange={e => {
                  const d = parseInt(e.target.value) || 0
                  const calcSale = form.original_price - Math.round(form.original_price * d / 100)
                  setForm({ ...form, discount: d, sale_price: calcSale })
                }}
                  placeholder="Réduction %" type="number" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary">
                  <option value="">Catégorie</option>
                  {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
                <input value={form.original_price || ""} onChange={e => {
                  const op = parseInt(e.target.value) || 0
                  const calcSale = op - Math.round(op * form.discount / 100)
                  setForm({ ...form, original_price: op, sale_price: calcSale })
                }}
                  placeholder="Prix original (FCFA)" type="number" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
                <input value={form.sale_price || ""} onChange={e => setForm({ ...form, sale_price: parseInt(e.target.value) || 0 })}
                  placeholder="Prix promo (FCFA)" type="number" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                  className="col-span-1 h-10 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary">
                  <option value="">Ville</option>
                  {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <input value={form.district} onChange={e => setForm({ ...form, district: e.target.value })}
                  placeholder="Quartier" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
                <input value={form.quantity || ""} onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })}
                  placeholder="Quantité" type="number" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              </div>
              <div
                onClick={() => imageInputRef.current?.click()}
                className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/50 px-4 py-3 transition hover:border-primary/50 hover:bg-muted"
              >
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : form.image ? (
                  <>
                    <img src={form.image} alt="Article" className="h-10 w-10 rounded-lg object-cover" />
                    <span className="flex-1 truncate text-sm text-ink">Image sélectionnée</span>
                    <button onClick={(e) => { e.stopPropagation(); setForm(prev => ({ ...prev, image: "" })) }}
                      className="grid h-7 w-7 place-items-center rounded-full bg-red-500/10 text-red-500 transition hover:bg-red-500/20">
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="flex-1 text-sm text-muted-foreground">Image de l'article en promotion</span>
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </>
                )}
              </div>
              <input ref={imageInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f) }} />
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-ink">
                  <input type="checkbox" checked={form.is_flash} onChange={e => setForm({ ...form, is_flash: e.target.checked })} />
                  Offre Flash
                </label>
                {form.is_flash && (
                  <input value={form.expires_at} onChange={e => setForm({ ...form, expires_at: e.target.value })}
                    type="datetime-local" className="h-10 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
                )}
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Moyens de paiement</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["mtn", "airtel", "visa"].map(m => (
                    <button key={m} type="button" onClick={() => togglePaymentMethod(m)}
                      className={`rounded-full px-4 py-2 text-xs font-bold border transition ${
                        form.payment_methods.includes(m)
                          ? m === "mtn" ? "bg-yellow-500/10 text-yellow-600 border-yellow-200"
                            : m === "airtel" ? "bg-red-500/10 text-red-600 border-red-200"
                            : "bg-blue-500/10 text-blue-600 border-blue-200"
                          : "border-border/60 text-muted-foreground"
                      }`}>
                      {m === "mtn" ? "MTN Mobile Money" : m === "airtel" ? "Airtel Money" : "VISA"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Statut</label>
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={() => setForm({ ...form, status: "active" })}
                    className={`rounded-full px-4 py-2 text-xs font-bold border transition ${form.status === "active" ? "bg-success/10 text-success border-success/30" : "border-border/60 text-muted-foreground"}`}>
                    Publiée
                  </button>
                  <button type="button" onClick={() => setForm({ ...form, status: "draft" })}
                    className={`rounded-full px-4 py-2 text-xs font-bold border transition ${form.status === "draft" ? "bg-amber-500/10 text-amber-600 border-amber-200" : "border-border/60 text-muted-foreground"}`}>
                    Brouillon
                  </button>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSave} className="flex items-center gap-2 rounded-full gradient-primary px-6 py-2.5 text-sm font-bold text-primary-foreground">
                  <Save className="h-4 w-4" /> {editingId ? "Enregistrer" : "Publier"}
                </button>
                <button onClick={() => { setShowForm(false); setEditingId(null) }} className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-ink">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
