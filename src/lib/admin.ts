import { supabase } from "./supabase"
import type {
  AdminStore, AdminPromotion, AdminProfile, AdminCategory, AdminSubcategory,
  District, Neighborhood, SubscriptionPlan, Subscription, Payment,
  SponsoredCampaign, Banner, Review, Report, Notification, CMSPage,
  ActivityLog, SupportTicket, PlatformSetting, StoreDocument, AdminStats
} from "@/types/admin"

export async function logActivity(action: string, entityType: string, entityId: string, details?: any) {
  await supabase.from("activity_logs").insert({
    user_id: (await supabase.auth.getUser()).data.user?.id,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details: details || {},
  })
}

// Users
export async function fetchUsers(): Promise<AdminProfile[]> {
  const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })
  return (data as AdminProfile[]) || []
}

export async function updateUserRole(userId: string, role: string) {
  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId)
  if (!error) await logActivity("update_user_role", "user", userId, { role })
  return { error }
}

export async function deleteUser(userId: string) {
  const { error } = await supabase.auth.admin.deleteUser(userId)
  if (!error) await logActivity("delete_user", "user", userId)
  return { error }
}

// Stores
export async function fetchAdminStores(status?: string, search?: string): Promise<AdminStore[]> {
  let query = supabase.from("stores").select("*, profiles!stores_user_id_fkey(email, name)")
  if (status && status !== "all") query = query.eq("status", status)
  if (search) query = query.ilike("name", `%${search}%`)
  query = query.order("created_at", { ascending: false })
  const { data } = await query
  return (data as any[])?.map((s: any) => ({
    ...s,
    owner_email: s.profiles?.email || "",
    owner_name: s.profiles?.name || ""
  })) || []
}

export async function updateStoreStatus(storeId: string, status: string, reason?: string) {
  const update: any = { status }
  if (status === "rejected") update.rejected_reason = reason || ""
  if (status === "active") update.verified_at = new Date().toISOString()
  const { error } = await supabase.from("stores").update(update).eq("id", storeId)
  if (!error) await logActivity("update_store_status", "store", storeId, { status })
  return { error }
}

export async function toggleStoreBadge(storeId: string, badge: "verified" | "premium", value: boolean) {
  const field = badge === "verified" ? "verified" : "premium"
  const { error } = await supabase.from("stores").update({ [field]: value }).eq("id", storeId)
  if (!error) await logActivity("toggle_store_badge", "store", storeId, { badge, value })
  return { error }
}

// Promotions
export async function fetchAdminPromotions(status?: string, search?: string): Promise<AdminPromotion[]> {
  let query = supabase.from("promotions").select("*, stores!promotions_store_id_fkey(name, slug), profiles!promotions_user_id_fkey(email)")
  if (status && status !== "all") query = query.eq("status", status)
  if (search) query = query.ilike("title", `%${search}%`)
  query = query.order("created_at", { ascending: false })
  const { data } = await query
  return (data as any[])?.map((p: any) => ({
    ...p,
    store_name: p.stores?.name || "",
    store_slug: p.stores?.slug || "",
    owner_email: p.profiles?.email || ""
  })) || []
}

export async function updatePromoStatus(promoId: string, status: string, reason?: string) {
  const update: any = { status }
  if (status === "active") update.flagged = false
  if (reason) update.rejection_reason = reason
  const { error } = await supabase.from("promotions").update(update).eq("id", promoId)
  if (!error) await logActivity("update_promo_status", "promotion", promoId, { status })
  return { error }
}

export async function togglePromoFeature(promoId: string, featured: boolean) {
  const { error } = await supabase.from("promotions").update({ featured }).eq("id", promoId)
  if (!error) await logActivity("toggle_promo_featured", "promotion", promoId, { featured })
  return { error }
}

export async function deletePromotion(promoId: string) {
  const { error } = await supabase.from("promotions").delete().eq("id", promoId)
  if (!error) await logActivity("delete_promotion", "promotion", promoId)
  return { error }
}

// Categories
export async function fetchCategories(): Promise<AdminCategory[]> {
  const { data: cats } = await supabase.from("categories").select("*").order("display_order")
  const { data: subs } = await supabase.from("subcategories").select("*")
  return (cats as AdminCategory[])?.map(cat => ({
    ...cat,
    subcategories: (subs as AdminSubcategory[])?.filter(s => s.category_id === cat.id) || []
  })) || []
}

export async function saveCategory(cat: Partial<AdminCategory>) {
  const { error } = cat.id
    ? await supabase.from("categories").update(cat).eq("id", cat.id)
    : await supabase.from("categories").insert(cat)
  if (!error) await logActivity(cat.id ? "update_category" : "create_category", "category", cat.id || "new")
  return { error }
}

export async function saveSubcategory(sub: Partial<AdminSubcategory>) {
  return sub.id
    ? await supabase.from("subcategories").update(sub).eq("id", sub.id)
    : await supabase.from("subcategories").insert(sub)
}

// Locations
export async function fetchDistricts(): Promise<District[]> {
  const { data: dists } = await supabase.from("districts").select("*").order("display_order")
  const { data: neighs } = await supabase.from("neighborhoods").select("*")
  return (dists as District[])?.map(d => ({
    ...d,
    neighborhoods: (neighs as Neighborhood[])?.filter(n => n.district_id === d.id) || []
  })) || []
}

// Subscriptions
export async function fetchSubscriptions(): Promise<Subscription[]> {
  const { data } = await supabase
    .from("subscriptions")
    .select("*, subscription_plans!subscriptions_plan_id_fkey(name), profiles!subscriptions_user_id_fkey(email)")
    .order("created_at", { ascending: false })
  return (data as any[])?.map(s => ({
    ...s,
    plan_name: s.subscription_plans?.name || "",
    user_email: s.profiles?.email || ""
  })) || []
}

// Payments
export async function fetchPayments(): Promise<Payment[]> {
  const { data } = await supabase
    .from("payments")
    .select("*, profiles!payments_user_id_fkey(email)")
    .order("created_at", { ascending: false })
  return (data as any[])?.map(p => ({ ...p, user_email: p.profiles?.email || "" })) || []
}

// Campaigns
export async function fetchCampaigns(): Promise<SponsoredCampaign[]> {
  const { data } = await supabase
    .from("sponsored_campaigns")
    .select("*, stores!sponsored_campaigns_store_id_fkey(name), profiles!sponsored_campaigns_user_id_fkey(email)")
    .order("created_at", { ascending: false })
  return (data as any[])?.map(c => ({
    ...c, store_name: c.stores?.name || "", user_email: c.profiles?.email || ""
  })) || []
}

// Banners
export async function fetchBanners(): Promise<Banner[]> {
  const { data } = await supabase.from("banners").select("*, stores!banners_store_id_fkey(name)").order("created_at", { ascending: false })
  return (data as any[])?.map(b => ({ ...b, store_name: b.stores?.name || "" })) || []
}

// Reviews
export async function fetchReviews(): Promise<Review[]> {
  const { data } = await supabase
    .from("reviews")
    .select("*, stores!reviews_store_id_fkey(name), profiles!reviews_user_id_fkey(name)")
    .order("created_at", { ascending: false })
  return (data as any[])?.map(r => ({
    ...r, store_name: r.stores?.name || "", user_name: r.profiles?.name || ""
  })) || []
}

// Reports
export async function fetchReports(): Promise<Report[]> {
  const { data } = await supabase
    .from("reports")
    .select("*, profiles!reports_reporter_id_fkey(name), handled:profiles!reports_handled_by_fkey(name)")
    .order("created_at", { ascending: false })
  return (data as any[])?.map(r => ({
    ...r, reporter_name: r.profiles?.name || "", handler_name: r.handled?.name || ""
  })) || []
}

export async function updateReportStatus(reportId: string, status: string, notes?: string) {
  const { error } = await supabase.from("reports").update({
    status, resolution_notes: notes || "", handled_by: (await supabase.auth.getUser()).data.user?.id
  }).eq("id", reportId)
  if (!error) await logActivity("update_report_status", "report", reportId, { status })
  return { error }
}

// Notifications
export async function sendNotification(notification: Partial<Notification>) {
  const { error } = await supabase.from("notifications").insert(notification)
  return { error }
}

// CMS
export async function fetchCMSPages(): Promise<CMSPage[]> {
  const { data } = await supabase.from("cms_pages").select("*").order("created_at", { ascending: false })
  return (data as CMSPage[]) || []
}

// Support
export async function fetchTickets(): Promise<SupportTicket[]> {
  const { data } = await supabase
    .from("support_tickets")
    .select("*, profiles!support_tickets_user_id_fkey(name, email), assignee:profiles!support_tickets_assigned_to_fkey(name)")
    .order("created_at", { ascending: false })
  return (data as any[])?.map(t => ({
    ...t, user_name: t.profiles?.name || "", user_email: t.profiles?.email || "", assignee_name: t.assignee?.name || ""
  })) || []
}

// Activity Logs
export async function fetchActivityLogs(limit = 100): Promise<ActivityLog[]> {
  const { data } = await supabase
    .from("activity_logs")
    .select("*, profiles!activity_logs_user_id_fkey(name, email)")
    .order("created_at", { ascending: false })
    .limit(limit)
  return (data as any[])?.map(l => ({
    ...l, user_name: l.profiles?.name || "", user_email: l.profiles?.email || ""
  })) || []
}

// Settings
export async function fetchSettings(): Promise<PlatformSetting[]> {
  const { data } = await supabase.from("platform_settings").select("*")
  return (data as PlatformSetting[]) || []
}

export async function updateSetting(key: string, value: any) {
  const { error } = await supabase.from("platform_settings").upsert({ key, value, updated_at: new Date().toISOString() })
  if (!error) await logActivity("update_setting", "setting", key, { value })
  return { error }
}

// Stats
export async function fetchAdminStats(): Promise<AdminStats> {
  const [
    { count: totalUsers },
    { count: totalStores },
    { count: totalPromos },
    { data: storesByStatus },
    { data: promosByStatus },
    { data: storesByCategoryData },
    { data: promosByCategoryData },
    { count: activeSubscriptions },
    { count: pendingReports },
    { count: pendingTickets },
    { count: pendingStores },
    { count: pendingDocuments },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("stores").select("*", { count: "exact", head: true }),
    supabase.from("promotions").select("*", { count: "exact", head: true }),
    supabase.from("stores").select("status").then(r => {
      const grouped: Record<string, number> = {}
      ;(r.data || []).forEach((s: any) => { grouped[s.status] = (grouped[s.status] || 0) + 1 })
      return { data: Object.entries(grouped).map(([status, count]) => ({ status, count })) }
    }),
    supabase.from("promotions").select("status").then(r => {
      const grouped: Record<string, number> = {}
      ;(r.data || []).forEach((p: any) => { grouped[p.status] = (grouped[p.status] || 0) + 1 })
      return { data: Object.entries(grouped).map(([status, count]) => ({ status, count })) }
    }),
    supabase.from("stores").select("category").then(r => {
      const grouped: Record<string, number> = {}
      ;(r.data || []).forEach((s: any) => { grouped[s.category] = (grouped[s.category] || 0) + 1 })
      return { data: Object.entries(grouped).map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count).slice(0, 10) }
    }),
    supabase.from("promotions").select("category").then(r => {
      const grouped: Record<string, number> = {}
      ;(r.data || []).forEach((p: any) => { grouped[p.category] = (grouped[p.category] || 0) + 1 })
      return { data: Object.entries(grouped).map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count).slice(0, 10) }
    }),
    supabase.from("subscriptions").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("reports").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("support_tickets").select("*", { count: "exact", head: true }).not("status", "in", '("resolved","closed")'),
    supabase.from("stores").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("store_documents").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ])

  const totalViews = 0
  const totalClicks = 0
  const totalRevenue = 0

  return {
    totalUsers: totalUsers || 0,
    totalStores: totalStores || 0,
    totalPromos: totalPromos || 0,
    totalViews, totalClicks,
    storesByStatus: storesByStatus || [],
    promosByStatus: promosByStatus || [],
    storesByCategory: storesByCategoryData || [],
    promosByCategory: promosByCategoryData || [],
    activeSubscriptions: activeSubscriptions || 0,
    recentSignups: [],
    totalRevenue,
    pendingReports: pendingReports || 0,
    pendingTickets: pendingTickets || 0,
    pendingStores: pendingStores || 0,
    pendingDocuments: pendingDocuments || 0,
  }
}
