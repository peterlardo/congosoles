import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, ShoppingBag } from "lucide-react"
import type { Product } from "@/lib/data"

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-red-200 transition-all duration-300 cursor-pointer">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <div className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            −{product.discountPercent}%
          </div>
          {product.isFlash && (
            <Badge variant="flash" className="text-[10px] shadow-lg">
              Flash
            </Badge>
          )}
        </div>
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium text-gray-700 shadow">
          {product.subcategory}
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.brand}·{product.category}</p>
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2">
          {product.title}
        </h3>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-red-600">{product.discountPrice.toLocaleString()} FCFA</span>
          <span className="text-xs text-gray-400 line-through">{product.originalPrice.toLocaleString()} FCFA</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-gray-400" />
            <span>{product.store} · {product.storeDistance}</span>
          </div>
          {product.isFlash && product.flashEnd && (
            <div className="flex items-center gap-1 text-red-500 font-medium">
              <Clock className="h-3 w-3" />
              <span>Fin dans{product.flashEnd}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
