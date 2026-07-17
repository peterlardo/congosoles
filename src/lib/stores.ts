import { supabase } from "./supabase"

export interface StoreFront {
  id: string
  name: string
  category: string
  location: string
  activePromos: number
  image: string
  bannerUrl: string
  logoUrl: string
  logoInitial: string
  logoColor: string
  logoGradient: string
  slug: string
}

export async function fetchStores(): Promise<StoreFront[]> {
  try {
    const { data } = await supabase
      .from("stores")
      .select("id, name, slug, image, category, district, promo_count, logo_url, banner_url, logo_initial, logo_color, logo_gradient")
      .eq("status", "active")
      .order("promo_count", { ascending: false })

    return ((data as any[]) || []).map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      location: s.district || "Brazzaville",
      activePromos: s.promo_count || 0,
      image: s.image || "",
      bannerUrl: s.banner_url || "",
      logoUrl: s.logo_url || "",
      logoInitial: s.logo_initial || s.name.charAt(0).toUpperCase(),
      logoColor: s.logo_color || "text-white",
      logoGradient: s.logo_gradient || "bg-gradient-to-br from-primary to-primary/70",
      slug: s.slug || "",
    }))
  } catch {
    return []
  }
}
