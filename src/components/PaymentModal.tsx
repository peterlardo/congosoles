import { X, Phone, CreditCard, Loader2, CheckCircle, AlertCircle, Smartphone, Store, Truck, MapPin, Receipt, Printer } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { PromoItem } from "@/lib/promotions"
import { trackPurchase } from "@/lib/tracking"

const methodInfo: Record<string, { label: string; icon: React.ReactNode; placeholder: string }> = {
  mtn: {
    label: "MTN Mobile Money",
    icon: <Phone className="h-5 w-5" />,
    placeholder: "+242 XXXX XXXX",
  },
  airtel: {
    label: "Airtel Money",
    icon: <Phone className="h-5 w-5" />,
    placeholder: "+242 XXXX XXXX",
  },
  visa: {
    label: "Carte VISA",
    icon: <CreditCard className="h-5 w-5" />,
    placeholder: "Numéro de carte",
  },
}

interface Props {
  product: PromoItem
  method: string
  onClose: () => void
}

type Step = "form" | "ussd" | "success" | "error"

export function PaymentModal({ product, method, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const info = methodInfo[method]
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<Step>("form")
  const [reference, setReference] = useState("")
  const [receiptRef, setReceiptRef] = useState("")
  const [deliveryOption, setDeliveryOption] = useState("pickup")
  const [deliveryCity, setDeliveryCity] = useState("")
  const [deliveryDistrict, setDeliveryDistrict] = useState("")
  const [deliveryNeighborhood, setDeliveryNeighborhood] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [deliveryInstructions, setDeliveryInstructions] = useState("")
  const pollRef = useRef<ReturnType<typeof setInterval>>()
  const purchaseRef = useRef({ phone: "", email: "", name: "" })

  useEffect(() => {
    if (step === "success" && product) {
      trackPurchase({
        promo_id: product.id,
        amount: product.discountPrice,
        payment_method: method,
        phone: purchaseRef.current.phone,
        buyer_name: purchaseRef.current.name,
        buyer_email: purchaseRef.current.email,
        delivery_option: deliveryOption,
        delivery_city: deliveryOption === "delivery" ? deliveryCity : "",
        delivery_district: deliveryOption === "delivery" ? deliveryDistrict : "",
        delivery_neighborhood: deliveryOption === "delivery" ? deliveryNeighborhood : "",
        delivery_address: deliveryOption === "delivery" ? deliveryAddress : "",
        delivery_instructions: deliveryOption === "delivery" ? deliveryInstructions : "",
      })
    }
  }, [step, product, method])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && step === "form") onClose() }
    document.addEventListener("keydown", handler)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
    }
  }, [onClose, step])

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [])

  const pollStatus = (ref: string) => {
    pollRef.current = setInterval(async () => {
      try {
        const r = await fetch(`/api/pay?reference=${ref}`)
        const d = await r.json()
        if (d.status === "SUCCESSFUL") {
          clearInterval(pollRef.current)
          setStep("success")
        }
      } catch { /* keep polling */ }
    }, 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    purchaseRef.current = { phone, email, name }

    try {
      const body: Record<string, unknown> = {
        amount: product.discountPrice,
        title: product.title,
        store: product.store,
        payment_method: method,
        customer: { email, name, phone },
      }
      if (method === "visa") {
        body.customer = { ...body.customer as object, card_number: cardNumber }
      }

      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur de paiement")

      setReference(data.reference)
      setReceiptRef(data.receipt || "")

      if (method === "visa") {
        if (data.link) setTimeout(() => { window.location.href = data.link }, 1000)
      } else {
        setStep("ussd")
        pollStatus(data.reference)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
      onClick={(e) => { if (e.target === overlayRef.current && step === "form") onClose() }}
    >
      <div className="relative w-full max-w-lg rounded-t-3xl bg-card p-6 shadow-2xl sm:rounded-3xl sm:p-8">
        <button
          onClick={onClose}
          disabled={step === "ussd"}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-secondary text-ink-soft transition hover:bg-border hover:text-ink disabled:opacity-40"
        >
          <X className="h-4 w-4" />
        </button>

        {/* ── USSD waiting ── */}
        {step === "ussd" && (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="relative">
              <Smartphone className="h-20 w-20 text-primary" />
              <Loader2 className="absolute -right-1 -top-1 h-7 w-7 animate-spin text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-ink">Demande envoyée</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Un message USSD a été envoyé à <strong className="text-ink">{phone}</strong>.
              Ouvrez-le et entrez votre code PIN pour autoriser le paiement.
            </p>
            <div className="mt-4 rounded-2xl bg-secondary/50 p-4 w-full">
              <div className="flex justify-between text-sm">
                <span className="text-ink-soft">Montant</span>
                <span className="font-bold text-primary">{product.discountPrice.toLocaleString("fr-FR")} FCFA</span>
              </div>
              <div className="mt-1 flex justify-between text-sm">
                <span className="text-ink-soft">Boutique</span>
                <span className="font-semibold text-ink">{product.store}</span>
              </div>
              <div className="mt-1 flex justify-between text-sm">
                <span className="text-ink-soft">Réf</span>
                <span className="font-mono text-[10px] text-ink">{reference.slice(-10)}</span>
              </div>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              En attente de confirmation...
            </p>
          </div>
        )}

        {/* ── Success ── */}
        {step === "success" && (
          <div className="py-6">
            <div className="flex flex-col items-center text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-ink">Paiement réussi !</h3>
              <p className="mt-1 text-sm text-muted-foreground">Merci pour votre achat</p>
            </div>
            <div className="mt-6 rounded-2xl border border-border bg-secondary/30 p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Boutique</span>
                <span className="font-semibold text-ink text-right">{product.store}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Article</span>
                <span className="font-semibold text-ink text-right max-w-[200px]">{product.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Montant</span>
                <span className="font-bold text-primary">{Math.round(product.discountPrice).toLocaleString("fr-FR")} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Moyen</span>
                <span className="font-semibold text-ink">{method === "mtn" ? "MTN Mobile Money" : method === "airtel" ? "Airtel Money" : "Carte bancaire"}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="text-muted-foreground">N° Facture</span>
                <span className="font-mono text-xs font-bold text-ink">{receiptRef || reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="text-ink">{new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => window.print()}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-ink transition hover:bg-muted">
                <Printer className="h-4 w-4" /> Imprimer
              </button>
              <button onClick={onClose}
                className="flex flex-1 items-center justify-center gap-2 rounded-full gradient-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow hover:opacity-90">
                <CheckCircle className="h-4 w-4" /> Terminé
              </button>
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {step === "error" && (
          <div className="flex flex-col items-center py-6 text-center">
            <AlertCircle className="h-16 w-16 text-red-500" />
            <h3 className="mt-4 text-xl font-bold text-ink">Paiement échoué</h3>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <div className="mt-6 flex gap-3">
              <button onClick={onClose} className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink hover:border-primary hover:text-primary">
                Annuler
              </button>
              <button onClick={() => { setStep("form"); setError("") }} className="rounded-full gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow hover:opacity-90">
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* ── Form ── */}
        {step === "form" && (
          <form onSubmit={handleSubmit}>
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                {info.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink">Payer avec {info.label}</h3>
                <p className="text-sm text-muted-foreground">{product.store} · {product.discountPrice.toLocaleString("fr-FR")} FCFA</p>
              </div>
            </div>

            <div className="mb-4 rounded-2xl bg-secondary/50 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-ink-soft">Article</span>
                <span className="font-semibold text-ink">{product.title}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-ink-soft">Montant</span>
                <span className="font-bold text-primary">{product.discountPrice.toLocaleString("fr-FR")} FCFA</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Nom complet</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Votre nom"
                  className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-ink outline-none transition focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="exemple@email.com"
                  className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-ink outline-none transition focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {method === "visa" ? "Numéro de carte" : "Téléphone MTN / Airtel"}
                </label>
                <input type={method === "visa" ? "text" : "tel"} required
                  value={method === "visa" ? cardNumber : phone}
                  onChange={e => method === "visa" ? setCardNumber(e.target.value) : setPhone(e.target.value)}
                  placeholder={info.placeholder}
                  className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-ink outline-none transition focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Mode de réception</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setDeliveryOption("pickup")}
                  className={`flex flex-1 items-center gap-2 rounded-xl border p-3 text-sm font-semibold transition ${
                    deliveryOption === "pickup" ? "border-primary bg-primary/5 text-primary" : "border-border text-ink-soft hover:border-primary/50"
                  }`}>
                  <Store className="h-4 w-4" /> Retrait en boutique
                </button>
                <button type="button" onClick={() => setDeliveryOption("delivery")}
                  className={`flex flex-1 items-center gap-2 rounded-xl border p-3 text-sm font-semibold transition ${
                    deliveryOption === "delivery" ? "border-primary bg-primary/5 text-primary" : "border-border text-ink-soft hover:border-primary/50"
                  }`}>
                  <Truck className="h-4 w-4" /> Livraison à domicile
                </button>
              </div>
            </div>

            {deliveryOption === "delivery" && (
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Ville</label>
                    <input type="text" value={deliveryCity} onChange={e => setDeliveryCity(e.target.value)}
                      placeholder="Brazzaville" className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-ink outline-none transition focus:border-primary" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-muted-foreground">District</label>
                    <input type="text" value={deliveryDistrict} onChange={e => setDeliveryDistrict(e.target.value)}
                      placeholder="Mfilou" className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-ink outline-none transition focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Quartier</label>
                  <input type="text" value={deliveryNeighborhood} onChange={e => setDeliveryNeighborhood(e.target.value)}
                    placeholder="Moukondo" className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-ink outline-none transition focus:border-primary" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Adresse complète</label>
                  <input type="text" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)}
                    placeholder="12 rue X, numéro maison" className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-ink outline-none transition focus:border-primary" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-muted-foreground">Instructions (optionnel)</label>
                  <input type="text" value={deliveryInstructions} onChange={e => setDeliveryInstructions(e.target.value)}
                    placeholder="À côté du marché, sonner à l'interphone" className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-ink outline-none transition focus:border-primary" />
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow transition hover:opacity-90 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Envoi de la demande USSD..." : `Payer ${product.discountPrice.toLocaleString("fr-FR")} FCFA`}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
