import { Heart, MapPin, Store, Zap, Eye, Phone, CreditCard } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"
import type { PromoItem } from "@/lib/promotions"
import { PaymentModal } from "@/components/PaymentModal"
import { trackPromoClick, trackPurchase } from "@/lib/tracking"
import { supabase } from "@/lib/supabase"

const formatPrice = (price: number) => new Intl.NumberFormat("fr-FR").format(price)

function PayButton({ label, bg, icon, onClick }: { label: string; bg: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClick() }}
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold leading-none text-white transition hover:opacity-80 active:scale-95"
      style={{ backgroundColor: bg }}
    >
      {icon}{label}
    </button>
  )
}

export function ProductCard({ product }: { product: PromoItem }) {
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-border/60 transition-all hover:-translate-y-0.5 hover:shadow-lift">
      <Link to={`/promo/${product.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 rounded-full gradient-primary px-2.5 py-1 text-xs font-bold text-primary-foreground shadow-glow">
            -{product.discountPercent}%
          </div>
          {product.isFlash && (
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-ink px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              <Zap className="h-3 w-3 fill-primary text-primary" /> Flash
            </div>
          )}
          <button aria-label="Ajouter aux favoris" className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-background/90 text-ink shadow-card backdrop-blur transition hover:bg-primary hover:text-primary-foreground">
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/promo/${product.id}`}>
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            <span>{product.brand}</span><span>·</span><span>{product.category}</span>
          </div>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink group-hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">{formatPrice(product.discountPrice)} FCFA</span>
          <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)} FCFA</span>
        </div>
        <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Store className="h-3.5 w-3.5" />
            <span className="max-w-[8rem] truncate">{product.store}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{product.storeDistance}</span>
          </div>
        </div>
        {product.isFlash && product.flashEnd && (
          <div className="flex items-center justify-between rounded-lg bg-accent/60 px-2.5 py-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">Fin dans</span>
            <span className="font-mono text-xs font-semibold tabular-nums">{product.flashEnd}</span>
          </div>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1">
            {product.paymentMethods?.includes("mtn") && (
              <PayButton label="MTN" bg="#F5A623" icon={<Phone className="h-2.5 w-2.5" />} onClick={() => setPaymentMethod("mtn")} />
            )}
            {product.paymentMethods?.includes("airtel") && (
              <PayButton label="AIRTEL" bg="#E53935" icon={<Phone className="h-2.5 w-2.5" />} onClick={() => setPaymentMethod("airtel")} />
            )}
            {product.paymentMethods?.includes("visa") && (
              <PayButton label="VISA" bg="#1A237E" icon={<CreditCard className="h-2.5 w-2.5" />} onClick={() => setPaymentMethod("visa")} />
            )}
          </div>
          <Link
            to={`/promo/${product.id}`}
            onClick={() => trackPromoClick(product.id)}
            className="inline-flex items-center gap-1.5 rounded-full gradient-primary px-3.5 py-1.5 text-[11px] font-bold text-primary-foreground shadow-glow transition hover:opacity-90"
          >
            <Eye className="h-3 w-3" />
            Voir détails
          </Link>
        </div>
      </div>
      {paymentMethod && (
        <PaymentModal product={product} method={paymentMethod} onClose={() => setPaymentMethod(null)} />
      )}
    </article>
  )
}
