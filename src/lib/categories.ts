import { supabase } from "./supabase"

export interface CategoryFront {
  id: string
  name: string
  icon: string
  count: number
  slug: string
}

const ICON_MAP: Record<string, string> = {
  "mode": "👗",
  "alimentation": "🥫",
  "téléphones": "📱",
  "telephones": "📱",
  "électroménager": "🔌",
  "electromenager": "🔌",
  "beauté": "💄",
  "beaute": "💄",
  "restaurants": "🍽️",
  "pharmacies": "💊",
  "services": "🛠️",
  "immobilier": "🏠",
  "automobile": "🚗",
  "informatique": "💻",
  "sport": "⚽",
  "chaussures": "👟",
  "mobilier": "🛋️",
  "supermarchés": "🛒",
  "supermarches": "🛒",
}

export async function fetchCategories(): Promise<CategoryFront[]> {
  try {
    const { data: cats } = await supabase
      .from("categories")
      .select("id, name, slug, icon")
      .eq("is_active", true)
      .order("display_order")

    const { data: promos } = await supabase
      .from("promotions")
      .select("category")

    const counts: Record<string, number> = {}
    if (promos) {
      for (const p of promos) {
        const key = (p.category || "").toLowerCase()
        counts[key] = (counts[key] || 0) + 1
      }
    }

    return ((cats as any[]) || []).map(c => {
      const key = c.slug || c.name.toLowerCase()
      return {
        id: c.id,
        name: c.name,
        icon: c.icon || ICON_MAP[key] || "🏷️",
        count: counts[key] || 0,
        slug: c.slug || key,
      }
    })
  } catch {
    return []
  }
}
