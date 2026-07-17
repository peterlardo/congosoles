import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { fetchPromoById, type PromoItem } from "@/lib/promotions"
import { ProductCard } from "@/components/ProductCard"

const categoryLabels: Record<string, string> = {
  supermarches: "Supermarchés",
  mode: "Mode",
  chaussures: "Chaussures",
  beaute: "Beauté",
  telephones: "Téléphones",
  informatique: "Informatique",
  electromenager: "Électroménager",
  restaurants: "Restaurants",
  pharmacies: "Pharmacies",
  automobile: "Automobile",
  mobilier: "Mobilier",
  sport: "Sport",
}

export default function Category() {
  const { slug } = useParams<{ slug: string }>()
  const label = categoryLabels[slug || ""] || slug
  const [products, setProducts] = useState<PromoItem[]>([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("promotions")
        .select("*, stores!promotions_store_id_fkey(name, slug, address, district)")
        .eq("status", "active")
        .eq("category", slug)
        .order("created_at", { ascending: false })

      const items: PromoItem[] = ((data as any[]) || []).map(p => {
        const storeName = p.stores?.name || "Boutique"
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
          flashEnd: undefined,
          location: p.district || "Brazzaville",
          paymentMethods: p.payment_methods || ["mtn", "airtel"],
          views: p.views || 0,
          clicks: p.clicks || 0,
          description: p.description || "",
          store_slug: p.stores?.slug || "",
        }
      })
      setProducts(items)
    }
    load()
  }, [slug])

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-8">
        <div className="text-xs font-bold uppercase tracking-widest text-primary">Catégorie</div>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink sm:text-5xl">{label}</h1>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          Toutes les promotions de la catégorie {label}.
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-border/60 bg-card p-8 text-center shadow-card">
          <div className="font-display text-2xl font-bold text-ink">Aucune promotion</div>
          <p className="mt-2 text-sm text-ink-soft">Revenez bientôt pour découvrir les offres {label}.</p>
        </div>
      )}
    </main>
  )
}
