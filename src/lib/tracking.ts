import { supabase } from "./supabase"

export async function trackPromoClick(promoId: string) {
  try {
    await supabase.from("promo_clicks").insert({
      promo_id: promoId,
      user_agent: navigator.userAgent.slice(0, 500),
      click_type: "click",
    })
  } catch { }
}

export async function trackPromoView(promoId: string) {
  try {
    await supabase.from("promo_clicks").insert({
      promo_id: promoId,
      user_agent: navigator.userAgent.slice(0, 500),
      click_type: "view",
    })
  } catch { }
}

export interface PurchaseData {
  promo_id: string
  amount: number
  payment_method: string
  phone: string
  buyer_name: string
  buyer_email: string
  delivery_option?: string
  delivery_city?: string
  delivery_district?: string
  delivery_neighborhood?: string
  delivery_address?: string
  delivery_instructions?: string
}

export async function trackPurchase(data: PurchaseData) {
  try {
    await supabase.from("promo_clicks").insert({
      promo_id: data.promo_id,
      amount: data.amount,
      payment_method: data.payment_method,
      phone: data.phone,
      buyer_name: data.buyer_name,
      buyer_email: data.buyer_email,
      delivery_option: data.delivery_option || "",
      delivery_city: data.delivery_city || "",
      delivery_district: data.delivery_district || "",
      delivery_neighborhood: data.delivery_neighborhood || "",
      delivery_address: data.delivery_address || "",
      delivery_instructions: data.delivery_instructions || "",
      user_agent: navigator.userAgent.slice(0, 500),
      click_type: "purchase",
    })
  } catch { }
}
