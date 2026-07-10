import { Heart, MapPin, Store, Zap } from "lucide-react"
import { Link } from "react-router-dom"
import type { PromoItem } from "@/lib/promotions"

const formatPrice = (price: number) => new Intl.NumberFormat("fr-FR").format(price)

export function ProductCard({ product }: { product: PromoItem }) {
  return (
    <Link to={`/promo/${product.id}`}>
      <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-border/60 transition-all hover:-translate-y-0.5 hover:shadow-lift">
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
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <span>{product.brand}</span><span>·</span><span>{product.category}</span>
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink">
          {product.title}
        </h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">{formatPrice(product.discountPrice)} FCFA</span>
          <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)} FCFA</span>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Store className="h-3.5 w-3.5" />
            <span className="max-w-[8rem] truncate">{product.store}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{product.storeDistance}</span>
          </div>
        </div>
        {product.paymentMethods && product.paymentMethods.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.paymentMethods.includes("mtn") && (
              <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] font-bold text-yellow-600">MTN</span>
            )}
            {product.paymentMethods.includes("airtel") && (
              <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-600">Airtel</span>
            )}
            {product.paymentMethods.includes("visa") && (
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600">VISA</span>
            )}
          </div>
        )}
        {product.isFlash && product.flashEnd && (
          <div className="flex items-center justify-between rounded-lg bg-accent/60 px-2.5 py-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">Fin dans</span>
            <span className="font-mono text-xs font-semibold tabular-nums">{product.flashEnd}</span>
          </div>
        )}
      </div>
      </article>
    </Link>
  )
}
