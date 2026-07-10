import { supabase } from "./supabase"

export interface PromoItem {
  id: string
  title: string
  category: string
  brand: string
  store: string
  storeDistance: string
  originalPrice: number
  discountPrice: number
  discountPercent: number
  image: string
  isFlash: boolean
  flashEnd?: string
  location: string
  paymentMethods: string[]
  views: number
  clicks: number
  description: string
  store_slug: string
}

export async function fetchActivePromotions(): Promise<PromoItem[]> {
  const { data } = await supabase
    .from("promotions")
    .select("*, stores!promotions_store_id_fkey(name, slug, address, district)")
    .eq("status", "active")
    .order("created_at", { ascending: false })

  return ((data as any[]) || []).map(p => {
    const storeName = p.stores?.name || "Boutique"
    const now = new Date()
    const expires = p.expires_at ? new Date(p.expires_at) : null
    const diffMs = expires ? expires.getTime() - now.getTime() : 0
    const diffH = Math.floor(diffMs / 3600000)
    const diffM = Math.floor((diffMs % 3600000) / 60000)
    const diffS = Math.floor((diffMs % 60000) / 1000)
    const flashEnd = expires && diffMs > 0
      ? `${String(diffH).padStart(2, "0")}:${String(diffM).padStart(2, "0")}:${String(diffS).padStart(2, "0")}`
      : undefined

    return {
      id: p.id,
      title: p.title,
      category: p.category,
      brand: p.category,
      store: storeName,
      storeDistance: p.district || "Brazzaville",
      originalPrice: Number(p.original_price) || 0,
      discountPrice: Number(p.sale_price) || 0,
      discountPercent: p.discount || 0,
      image: p.image || "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=70&auto=format",
      isFlash: p.is_flash || false,
      flashEnd,
      location: p.district || "Brazzaville",
      paymentMethods: p.payment_methods || ["mtn", "airtel"],
      views: p.views || 0,
      clicks: p.clicks || 0,
      description: p.description || "",
      store_slug: p.stores?.slug || "",
    }
  })
}

export async function fetchPromoById(id: string): Promise<PromoItem | null> {
  const items = await fetchActivePromotions()
  return items.find(p => p.id === id) || null
}
