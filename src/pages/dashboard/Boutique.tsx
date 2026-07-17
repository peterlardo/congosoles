import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { Store, Save, Image, MapPin, Phone, Globe, Plus, X, Upload, Loader2, ArrowLeft } from "lucide-react"

interface Boutique {
  id: string
  name: string
  description: string
  address: string
  phone: string
  website: string
  image: string
  banner_url: string
  logo_url: string
  category: string
  slug?: string
  social_instagram: string
  social_facebook: string
  social_twitter: string
  social_whatsapp: string
  currency: string
  status?: string
  plan?: string
  payment_method?: string
  payment_phone?: string
}

const EMPTY_BOUTIQUE: Boutique = { id: "", name: "", description: "", address: "", phone: "", website: "", image: "", banner_url: "", logo_url: "", category: "", social_instagram: "", social_facebook: "", social_twitter: "", social_whatsapp: "", currency: "XAF", payment_method: "", payment_phone: "" }

const PLAN_LIMITS: Record<string, number> = {
  gratuit: 2,
  pro: 50,
  "sur-devis": 999999,
}

async function getPlanStoresLimit(userId: string): Promise<{ limit: number; planName: string }> {
  const { data: store } = await supabase
    .from("stores")
    .select("plan")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle()

  const plan = store?.plan || "gratuit"
  const { data: dbPlan } = await supabase
    .from("subscription_plans")
    .select("name, max_stores")
    .eq("slug", plan)
    .maybeSingle()

  if (dbPlan) {
    return { limit: dbPlan.max_stores === -1 ? 999999 : dbPlan.max_stores, planName: dbPlan.name }
  }
  return { limit: PLAN_LIMITS[plan] || 2, planName: plan === "gratuit" ? "Gratuite" : plan }
}

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

export default function DashboardBoutique() {
  const { user, profile } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const storeId = searchParams.get("storeId")
  const [boutique, setBoutique] = useState<Boutique>(EMPTY_BOUTIQUE)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [newStore, setNewStore] = useState({ name: "", address: "", phone: "", category: "", description: "", plan: "gratuit" })
  const [uploading, setUploading] = useState<"cover" | "logo" | "banner" | null>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const [planInfo, setPlanInfo] = useState<Record<string, { price: number; name: string }>>({})
  const [planList, setPlanList] = useState<{ slug: string; name: string; price: number; max_stores: number }[]>([])
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentPhone, setPaymentPhone] = useState("")

  useEffect(() => {
    supabase.from("subscription_plans").select("slug, name, price, max_stores").eq("is_active", true).then(({ data }) => {
      if (data) {
        setPlanList(data)
        const map: Record<string, { price: number; name: string }> = {}
        data.forEach(p => { map[p.slug] = { price: p.price, name: p.name } })
        setPlanInfo(map)
      }
    })
  }, [])

  function validatePayment(): string | null {
    if (!paymentMethod) return "Veuillez sélectionner un moyen de paiement"
    if (!paymentPhone) return "Veuillez entrer votre numéro de téléphone"
    if (paymentMethod === "mtn" && !paymentPhone.startsWith("06") && !paymentPhone.startsWith("+24206")) return "Le numéro MTN doit commencer par 06"
    if (paymentMethod === "airtel" && !paymentPhone.startsWith("05") && !paymentPhone.startsWith("04") && !paymentPhone.startsWith("+24205") && !paymentPhone.startsWith("+24204")) return "Le numéro Airtel doit commencer par 05 ou 04"
    return null
  }

  async function uploadImage(file: File, field: "image" | "logo_url" | "banner_url") {
    if (!user) return
    setUploading(field === "image" ? "cover" : field === "banner_url" ? "banner" : "logo")
    const ext = file.name.split(".").pop() || "jpg"
    const path = `${user.id}/${field}-${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from("store-images")
      .upload(path, file, { upsert: true })
    if (error) { alert("Erreur d'upload : " + error.message); setUploading(null); return }
    const { data: { publicUrl } } = supabase.storage
      .from("store-images")
      .getPublicUrl(path)
    setBoutique(b => ({ ...b, [field]: publicUrl }))
    setUploading(null)
  }

  useEffect(() => {
    async function fetchBoutique() {
      if (!user) return
      let query = supabase.from("stores").select("*")
      if (storeId) {
        query = query.eq("id", storeId)
      } else {
        query = query.eq("user_id", user.id)
      }
      const { data } = await query.maybeSingle()
      if (data) setBoutique(data)
      setLoading(false)
    }
    fetchBoutique()
  }, [user, storeId])

  const handleSave = async () => {
    if (!user || !boutique.name) return

    const selectedPlan = boutique.plan || "gratuit"
    if (selectedPlan === "pro" || selectedPlan === "sur-devis") {
      const validErr = validatePayment()
      if (validErr) { alert(validErr); return }
    }

    setSaving(true)
    const payload: Record<string, any> = {
      name: boutique.name, description: boutique.description,
      address: boutique.address, phone: boutique.phone, website: boutique.website,
      image: boutique.image, banner_url: boutique.banner_url, logo_url: boutique.logo_url, category: boutique.category,
      social_instagram: boutique.social_instagram, social_facebook: boutique.social_facebook,
      social_twitter: boutique.social_twitter, social_whatsapp: boutique.social_whatsapp,
      currency: boutique.currency,
      plan: selectedPlan,
      payment_method: (selectedPlan === "pro" || selectedPlan === "sur-devis") ? paymentMethod : null,
      payment_phone: (selectedPlan === "pro" || selectedPlan === "sur-devis") ? paymentPhone : null,
    }
    if (!boutique.id) {
      const { limit, planName } = await getPlanStoresLimit(user.id)
      const { count } = await supabase
        .from("stores")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
      if (count !== null && count >= limit) {
        setSaving(false)
        alert(`Limite atteinte : vous ne pouvez pas créer plus de ${limit === 999999 ? "boutiques (formule illimitée)" : `${limit} boutique${limit > 1 ? "s" : ""}`} avec la formule ${planName}. Passez à une formule supérieure pour augmenter cette limite.`)
        return
      }
    }
    let error: any = null
    if (!boutique.id) {
      const res = await supabase.from("stores").insert({
        ...payload,
        user_id: user.id,
        slug: slugify(boutique.name) + "-" + Date.now().toString(36),
        status: "pending", verified: false,
      }).select("id").single()
      error = res.error

      if (!error && res.data) {
        const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_2ozZiLj1qz4DgI91-M4mVQ_cglWOEq_"
        const funcBase = "https://eerfjupbfrmiwijablqi.functions.supabase.co"
        try {
          await fetch(`${funcBase}/notify-new-store`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${anonKey}` },
            body: JSON.stringify({
              id: res.data.id, name: boutique.name,
              owner_name: profile?.name || user.email, owner_email: user.email,
              category: boutique.category, created_at: new Date().toISOString(),
              plan: selectedPlan, plan_label: planInfo[selectedPlan]?.name || selectedPlan,
            }),
          })
        } catch (e) { console.log("Notification admin non envoyée") }

        if (selectedPlan === "pro" || selectedPlan === "sur-devis") {
          try {
            await fetch(`${funcBase}/send-invoice`, {
              method: "POST",
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${anonKey}` },
              body: JSON.stringify({
                store_name: boutique.name, owner_name: profile?.name || user.email,
                owner_email: user.email, plan: selectedPlan,
                plan_name: planInfo[selectedPlan]?.name || selectedPlan,
                price: planInfo[selectedPlan]?.price || 0,
                payment_method: paymentMethod, payment_phone: paymentPhone,
                created_at: new Date().toISOString(),
              }),
            })
          } catch (e) { console.log("Email facture non envoyé") }
        }
      }
    } else {
      const res = await supabase.from("stores").update(payload).eq("id", boutique.id)
      error = res.error
    }
    setSaving(false)
    if (error) { alert("Erreur : " + error.message); return }
    setSaved(true)
    if (!boutique.id) {
      alert("Boutique créée avec succès ✓")
      navigate("/dashboard/mes-boutiques")
      return
    }
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

  const canManageStore = profile && ["vendor", "super_admin", "admin"].includes(profile.role)

  if (profile && !canManageStore) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-12 text-center shadow-card">
        <Store className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 font-display text-xl font-bold text-ink">Accès réservé aux commerçants</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Seuls les vendeurs peuvent gérer une boutique. Contactez l'administration si vous souhaitez devenir commerçant.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {storeId && (
            <Link to="/dashboard/mes-boutiques" className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-ink">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Ma boutique</h1>
            <p className="mt-1 text-sm text-ink-soft">Configurez les informations de votre boutique.</p>
          </div>
        </div>
        {canManageStore && !storeId && (
        <div className="flex gap-2">
          <Link to="/dashboard/mes-boutiques"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-muted">
            <Store className="h-4 w-4" /> Mes boutiques
          </Link>
          <button onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:opacity-95">
            <Plus className="h-4 w-4" /> Nouvelle boutique
          </button>
        </div>
        )}
      </div>

      {boutique?.id && boutique?.status === "pending" && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-semibold">⏳ En attente de validation</p>
          <p className="mt-1 text-amber-700">
            Votre boutique est en cours d'examen par l'équipe Congo Soldes. Elle sera visible sur le site une fois approuvée.
            Vous pouvez modifier ses informations en attendant.
          </p>
        </div>
      )}

      {boutique?.id && boutique?.status === "rejected" && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-semibold">✕ Boutique non approuvée</p>
          <p className="mt-1 text-red-700">
            Votre boutique n'a pas été validée. Veuillez contacter l'administration pour plus d'informations.
          </p>
        </div>
      )}

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
                  onChange={(e) => setBoutique((b) => ({ ...b, name: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-ink outline-none transition focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</label>
              <textarea
                value={boutique?.description || ""}
                  onChange={(e) => setBoutique((b) => ({ ...b, description: e.target.value }))}
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
                    onChange={(e) => setBoutique((b) => ({ ...b, address: e.target.value }))}
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
                    onChange={(e) => setBoutique((b) => ({ ...b, phone: e.target.value }))}
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
                    onChange={(e) => setBoutique((b) => ({ ...b, website: e.target.value }))}
                  placeholder="https://"
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-ink outline-none transition focus:border-primary"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Formule</label>
                <select value={boutique?.plan || "gratuit"} onChange={e => setBoutique(b => ({ ...b, plan: e.target.value }))}
                  className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-ink outline-none transition focus:border-primary">
                  {planList.length > 0 ? planList.map(p => (
                    <option key={p.slug} value={p.slug}>{p.name}</option>
                  )) : (
                    <>
                      <option value="gratuit">Gratuit</option>
                      <option value="pro">Pro</option>
                      <option value="sur-devis">Sur devis</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Monnaie</label>
                <select value={boutique?.currency || "XAF"} onChange={e => setBoutique(b => ({ ...b, currency: e.target.value }))}
                  className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-ink outline-none transition focus:border-primary">
                  <option value="XAF">XAF (Franc CFA)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="USD">USD (Dollar US)</option>
                  <option value="GBP">GBP (Livre Sterling)</option>
                  <option value="NGN">NGN (Naira Nigérian)</option>
                  <option value="CDF">CDF (Franc Congolais)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Catégorie</label>
                <select
                  value={boutique?.category || ""}
                  onChange={(e) => setBoutique((b) => ({ ...b, category: e.target.value }))}
                  className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-ink outline-none transition focus:border-primary"
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

            {(boutique?.plan === "pro" || boutique?.plan === "sur-devis") && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 mt-4 space-y-4">
                <h3 className="font-semibold text-blue-900">
                  {boutique.plan === "pro" ? "Paiement - Offre Pro" : "Paiement - Offre Sur devis"}
                </h3>
                <p className="text-sm text-blue-700">
                  {boutique.plan === "pro"
                    ? `Montant : ${(planInfo["pro"]?.price || 25000).toLocaleString("fr-FR")} FCFA / mois`
                    : "Un devis personnalisé vous sera envoyé après validation de votre boutique."}
                </p>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-blue-800">Moyen de paiement</label>
                  <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-blue-300 bg-white px-4 text-sm text-ink outline-none transition focus:border-primary">
                    <option value="">Choisir un moyen</option>
                    <option value="mtn">MTN Mobile Money</option>
                    <option value="airtel">Airtel Money</option>
                  </select>
                </div>
                {paymentMethod && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-blue-800">
                      Numéro de téléphone
                      {paymentMethod === "mtn" ? " (MTN - doit commencer par 06)" : " (Airtel - doit commencer par 05 ou 04)"}
                    </label>
                    <input type="tel" value={paymentPhone} onChange={e => setPaymentPhone(e.target.value)}
                      placeholder={paymentMethod === "mtn" ? "06 XX XX XX XX" : "05 XX XX XX XX"}
                      className="mt-1.5 h-11 w-full rounded-xl border border-blue-300 bg-white px-4 text-sm text-ink outline-none transition focus:border-primary" />
                  </div>
                )}
              </div>
            )}
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
            <p className="mt-1 text-xs text-ink-soft">Format bannière recommandé (3:1) — comme une couverture Facebook</p>
            <div className="mt-3 space-y-3">
              <div
                onClick={() => coverInputRef.current?.click()}
                className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50 transition hover:border-primary/50 hover:bg-muted aspect-[3/1]"
              >
                {uploading === "cover" ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : boutique?.image ? (
                  <img src={boutique.image} alt="Couverture" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <Upload className="h-6 w-6" />
                    <span className="text-xs font-medium">Cliquez pour uploader une image</span>
                  </div>
                )}
                {boutique?.image && (
                  <button onClick={(e) => { e.stopPropagation(); setBoutique(b => ({ ...b, image: "" })) }}
                    className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white transition hover:bg-black/80">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <input ref={coverInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f, "image") }} />
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
            <h2 className="font-semibold text-ink">Bannière</h2>
            <p className="mt-1 text-xs text-ink-soft">Image large affichée en haut de la page boutique — idéal : 1200×400 px</p>
            <div className="mt-3 space-y-3">
              <div
                onClick={() => bannerInputRef.current?.click()}
                className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50 transition hover:border-primary/50 hover:bg-muted aspect-[3/1]"
              >
                {uploading === "banner" ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : boutique?.banner_url ? (
                  <img src={boutique.banner_url} alt="Bannière" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <Upload className="h-6 w-6" />
                    <span className="text-xs font-medium">Cliquez pour uploader une bannière</span>
                  </div>
                )}
                {boutique?.banner_url && (
                  <button onClick={(e) => { e.stopPropagation(); setBoutique(b => ({ ...b, banner_url: "" })) }}
                    className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white transition hover:bg-black/80">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <input ref={bannerInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f, "banner_url") }} />
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
            <h2 className="font-semibold text-ink">Logo</h2>
            <div className="mt-3 space-y-3">
              <div
                onClick={() => logoInputRef.current?.click()}
                className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/50 transition hover:border-primary/50 hover:bg-muted aspect-square max-w-40"
              >
                {uploading === "logo" ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : boutique?.logo_url ? (
                  <img src={boutique.logo_url} alt="Logo" className="h-full w-full rounded-xl object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <Upload className="h-6 w-6" />
                    <span className="text-xs font-medium">Logo</span>
                  </div>
                )}
                {boutique?.logo_url && (
                  <button onClick={(e) => { e.stopPropagation(); setBoutique(b => ({ ...b, logo_url: "" })) }}
                    className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white transition hover:bg-black/80">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <input ref={logoInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f, "logo_url") }} />
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
            <h2 className="font-semibold text-ink">Réseaux sociaux</h2>
            <div className="mt-3 space-y-3">
              <input value={boutique?.social_instagram || ""} onChange={e => setBoutique(b => ({ ...b, social_instagram: e.target.value }))}
                placeholder="Instagram (URL)"
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-ink outline-none transition focus:border-primary" />
              <input value={boutique?.social_facebook || ""} onChange={e => setBoutique(b => ({ ...b, social_facebook: e.target.value }))}
                placeholder="Facebook (URL)"
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-ink outline-none transition focus:border-primary" />
              <input value={boutique?.social_twitter || ""} onChange={e => setBoutique(b => ({ ...b, social_twitter: e.target.value }))}
                placeholder="Twitter / X (URL)"
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-ink outline-none transition focus:border-primary" />
              <input value={boutique?.social_whatsapp || ""} onChange={e => setBoutique(b => ({ ...b, social_whatsapp: e.target.value }))}
                placeholder="WhatsApp (numéro avec indicatif, ex: +242...)"
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-ink outline-none transition focus:border-primary" />
            </div>
          </div>


        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowCreate(false)}>
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">Nouvelle boutique</h3>
            <div className="mt-4 space-y-3">
              <input value={newStore.name} onChange={e => setNewStore({ ...newStore, name: e.target.value })}
                placeholder="Nom *" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <select value={newStore.category} onChange={e => setNewStore({ ...newStore, category: e.target.value })}
                className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary">
                <option value="">Catégorie *</option>
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
              <select value={newStore.plan || "gratuit"} onChange={e => setNewStore({ ...newStore, plan: e.target.value })}
                className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary">
                {planList.length > 0 ? planList.map(p => (
                  <option key={p.slug} value={p.slug}>{p.name}</option>
                )) : (
                  <>
                    <option value="gratuit">Gratuit</option>
                    <option value="pro">Pro</option>
                    <option value="sur-devis">Sur devis</option>
                  </>
                )}
              </select>
              <input value={newStore.address} onChange={e => setNewStore({ ...newStore, address: e.target.value })}
                placeholder="Adresse" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <input value={newStore.phone} onChange={e => setNewStore({ ...newStore, phone: e.target.value })}
                placeholder="Téléphone" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <textarea value={newStore.description} onChange={e => setNewStore({ ...newStore, description: e.target.value })}
                placeholder="Description" className="h-24 w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-primary" />
              <div className="flex gap-2 pt-2">
                <button onClick={async () => {
                  if (!newStore.name || !newStore.category || !user) return
                  const { error } = await supabase.from("stores").insert({
                    user_id: user.id, name: newStore.name, category: newStore.category,
                    slug: slugify(newStore.name) + "-" + Date.now().toString(36),
                    address: newStore.address || null, phone: newStore.phone || null,
                    description: newStore.description || null, status: "pending", currency: "XAF", plan: "gratuit",
                  })
                  if (error) { alert("Erreur : " + error.message); return }
                  setShowCreate(false)
                  navigate("/dashboard/mes-boutiques")
                }} className="flex items-center gap-2 rounded-full gradient-primary px-6 py-2.5 text-sm font-bold text-primary-foreground">
                  <Plus className="h-4 w-4" /> Créer
                </button>
                <button onClick={() => setShowCreate(false)} className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-ink">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
