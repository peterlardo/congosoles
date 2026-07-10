import { supabase } from "./supabase"
import type {
  AdminStore, AdminPromotion, AdminProfile, AdminCategory, AdminSubcategory,
  District, Neighborhood, SubscriptionPlan, Subscription, Payment,
  SponsoredCampaign, Banner, Review, Report, Notification, CMSPage,
  ActivityLog, SupportTicket, PlatformSetting, StoreDocument, AdminStats,
  ContractTemplate, Contract
} from "@/types/admin"

async function fetchProfilesMap(userIds: string[]): Promise<Map<string, { email: string; name: string }>> {
  const ids = [...new Set(userIds.filter(Boolean))]
  if (!ids.length) return new Map()
  const { data } = await supabase.from("profiles").select("id, email, name").in("id", ids)
  return new Map((data || []).map(p => [p.id, { email: p.email || "", name: p.name || "" }]))
}

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
  let query = supabase.from("stores").select("*")
  if (status && status !== "all") query = query.eq("status", status)
  if (search) query = query.ilike("name", `%${search}%`)
  query = query.order("created_at", { ascending: false })
  const { data: stores } = await query
  if (!stores) return []
  const userIds = [...new Set((stores as any[]).map(s => s.user_id).filter(Boolean))]
  const { data: profiles } = await supabase.from("profiles").select("id, email, name").in("id", userIds)
  const profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p]))
  return (stores as any[]).map(s => ({
    ...s,
    owner_email: profileMap[s.user_id]?.email || "",
    owner_name: profileMap[s.user_id]?.name || ""
  }))
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
  let query = supabase.from("promotions").select("*, stores!promotions_store_id_fkey(name, slug)")
  if (status && status !== "all") query = query.eq("status", status)
  if (search) query = query.ilike("title", `%${search}%`)
  query = query.order("created_at", { ascending: false })
  const { data } = await query
  return (data as any[])?.map((p: any) => ({
    ...p,
    store_name: p.stores?.name || "",
    store_slug: p.stores?.slug || "",
    owner_email: ""
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
  const { error } = sub.id
    ? await supabase.from("subcategories").update(sub).eq("id", sub.id)
    : await supabase.from("subcategories").insert(sub)
  if (!error) await logActivity(sub.id ? "update_subcategory" : "create_subcategory", "subcategory", sub.id || "new")
  return { error }
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from("categories").delete().eq("id", id)
  if (!error) await logActivity("delete_category", "category", id)
  return { error }
}

export async function deleteSubcategory(id: string) {
  const { error } = await supabase.from("subcategories").delete().eq("id", id)
  if (!error) await logActivity("delete_subcategory", "subcategory", id)
  return { error }
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

export async function saveDistrict(dist: Partial<District>) {
  const { error } = dist.id
    ? await supabase.from("districts").update(dist).eq("id", dist.id)
    : await supabase.from("districts").insert(dist)
  if (!error) await logActivity(dist.id ? "update_district" : "create_district", "district", dist.id || "new")
  return { error }
}

export async function deleteDistrict(id: string) {
  const { error } = await supabase.from("districts").delete().eq("id", id)
  if (!error) await logActivity("delete_district", "district", id)
  return { error }
}

export async function saveNeighborhood(neigh: Partial<Neighborhood>) {
  const { error } = neigh.id
    ? await supabase.from("neighborhoods").update(neigh).eq("id", neigh.id)
    : await supabase.from("neighborhoods").insert(neigh)
  if (!error) await logActivity(neigh.id ? "update_neighborhood" : "create_neighborhood", "neighborhood", neigh.id || "new")
  return { error }
}

export async function deleteNeighborhood(id: string) {
  const { error } = await supabase.from("neighborhoods").delete().eq("id", id)
  if (!error) await logActivity("delete_neighborhood", "neighborhood", id)
  return { error }
}

// Subscriptions
export async function fetchSubscriptions(): Promise<Subscription[]> {
  const { data } = await supabase
    .from("subscriptions")
    .select("*, subscription_plans!subscriptions_plan_id_fkey(name)")
    .order("created_at", { ascending: false })
  const subs = (data as any[]) || []
  const profilesMap = await fetchProfilesMap(subs.map(s => s.user_id))
  return subs.map(s => ({
    ...s,
    plan_name: s.subscription_plans?.name || "",
    user_email: profilesMap.get(s.user_id)?.email || ""
  }))
}

export async function cancelSubscription(subId: string) {
  const { error } = await supabase.from("subscriptions").update({
    status: "cancelled", auto_renew: false
  }).eq("id", subId)
  if (!error) await logActivity("cancel_subscription", "subscription", subId)
  return { error }
}

export async function updateSubscription(subId: string, updates: Partial<Subscription>) {
  const { error } = await supabase.from("subscriptions").update(updates).eq("id", subId)
  if (!error) await logActivity("update_subscription", "subscription", subId)
  return { error }
}

export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const { data } = await supabase.from("subscription_plans").select("*").order("price")
  return (data as SubscriptionPlan[]) || []
}

export async function saveSubscriptionPlan(plan: Partial<SubscriptionPlan>) {
  const { error } = plan.id
    ? await supabase.from("subscription_plans").update(plan).eq("id", plan.id)
    : await supabase.from("subscription_plans").insert(plan)
  if (!error) await logActivity(plan.id ? "update_plan" : "create_plan", "subscription_plan", plan.id || "new")
  return { error }
}

export async function deleteSubscriptionPlan(id: string) {
  const { error } = await supabase.from("subscription_plans").delete().eq("id", id)
  if (!error) await logActivity("delete_plan", "subscription_plan", id)
  return { error }
}

// Payments
export async function fetchPayments(): Promise<Payment[]> {
  const { data } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false })
  const payments = (data as any[]) || []
  const profilesMap = await fetchProfilesMap(payments.map(p => p.user_id))
  return payments.map(p => ({ ...p, user_email: profilesMap.get(p.user_id)?.email || "" }))
}

// Campaigns
export async function fetchCampaigns(): Promise<SponsoredCampaign[]> {
  const { data } = await supabase
    .from("sponsored_campaigns")
    .select("*, stores!sponsored_campaigns_store_id_fkey(name)")
    .order("created_at", { ascending: false })
  const campaigns = (data as any[]) || []
  const profilesMap = await fetchProfilesMap(campaigns.map(c => c.user_id))
  return campaigns.map(c => ({
    ...c, store_name: c.stores?.name || "", user_email: profilesMap.get(c.user_id)?.email || ""
  }))
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
    .select("*, stores!reviews_store_id_fkey(name)")
    .order("created_at", { ascending: false })
  const reviews = (data as any[]) || []
  const profilesMap = await fetchProfilesMap(reviews.map(r => r.user_id))
  return reviews.map(r => ({
    ...r, store_name: r.stores?.name || "", user_name: profilesMap.get(r.user_id)?.name || ""
  }))
}

// Reports
export async function fetchReports(): Promise<Report[]> {
  const { data } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false })
  const reports = (data as any[]) || []
  const uids = new Set<string>()
  reports.forEach(r => { if (r.reporter_id) uids.add(r.reporter_id); if (r.handled_by) uids.add(r.handled_by) })
  const profilesMap = await fetchProfilesMap([...uids])
  return reports.map(r => ({
    ...r,
    reporter_name: profilesMap.get(r.reporter_id)?.name || "",
    handler_name: profilesMap.get(r.handled_by)?.name || ""
  }))
}

export async function updateReportStatus(reportId: string, status: string, notes?: string) {
  const { error } = await supabase.from("reports").update({
    status, resolution_notes: notes || "", handled_by: (await supabase.auth.getUser()).data.user?.id
  }).eq("id", reportId)
  if (!error) await logActivity("update_report_status", "report", reportId, { status })
  return { error }
}

export async function updatePaymentStatus(paymentId: string, status: string) {
  const { error } = await supabase.from("payments").update({ status }).eq("id", paymentId)
  if (!error) await logActivity("update_payment_status", "payment", paymentId, { status })
  return { error }
}

export async function deletePayment(paymentId: string) {
  const { error } = await supabase.from("payments").delete().eq("id", paymentId)
  if (!error) await logActivity("delete_payment", "payment", paymentId)
  return { error }
}

// Notifications
export async function sendNotification(notification: Partial<Notification>) {
  const { error } = await supabase.from("notifications").insert(notification)
  return { error }
}

export async function deleteNotification(id: string) {
  const { error } = await supabase.from("notifications").delete().eq("id", id)
  if (!error) await logActivity("delete_notification", "notification", id)
  return { error }
}

// CMS
export async function fetchCMSPages(): Promise<CMSPage[]> {
  const { data } = await supabase.from("cms_pages").select("*").order("created_at", { ascending: false })
  return (data as CMSPage[]) || []
}

export async function saveCMSPage(page: Partial<CMSPage>) {
  const { error } = page.id
    ? await supabase.from("cms_pages").update(page).eq("id", page.id)
    : await supabase.from("cms_pages").insert(page)
  if (!error) await logActivity(page.id ? "update_cms_page" : "create_cms_page", "cms_page", page.id || "new")
  return { error }
}

export async function deleteCMSPage(id: string) {
  const { error } = await supabase.from("cms_pages").delete().eq("id", id)
  if (!error) await logActivity("delete_cms_page", "cms_page", id)
  return { error }
}

export async function deleteReport(id: string) {
  const { error } = await supabase.from("reports").delete().eq("id", id)
  if (!error) await logActivity("delete_report", "report", id)
  return { error }
}

export async function deleteStore(storeId: string) {
  const { error } = await supabase.from("stores").delete().eq("id", storeId)
  if (!error) await logActivity("delete_store", "store", storeId)
  return { error }
}

export async function updateTicketStatus(ticketId: string, status: string) {
  const { error } = await supabase.from("support_tickets").update({ status }).eq("id", ticketId)
  if (!error) await logActivity("update_ticket_status", "ticket", ticketId, { status })
  return { error }
}

export async function assignTicket(ticketId: string, assignedTo: string) {
  const { error } = await supabase.from("support_tickets").update({ assigned_to: assignedTo }).eq("id", ticketId)
  if (!error) await logActivity("assign_ticket", "ticket", ticketId, { assigned_to: assignedTo })
  return { error }
}

// Support
export async function fetchTickets(): Promise<SupportTicket[]> {
  const { data } = await supabase
    .from("support_tickets")
    .select("*")
    .order("created_at", { ascending: false })
  const tickets = (data as any[]) || []
  const uids = new Set<string>()
  tickets.forEach(t => { if (t.user_id) uids.add(t.user_id); if (t.assigned_to) uids.add(t.assigned_to) })
  const profilesMap = await fetchProfilesMap([...uids])
  return tickets.map(t => ({
    ...t,
    user_name: profilesMap.get(t.user_id)?.name || "",
    user_email: profilesMap.get(t.user_id)?.email || "",
    assignee_name: profilesMap.get(t.assigned_to)?.name || ""
  }))
}

// Activity Logs
export async function fetchActivityLogs(limit = 100): Promise<ActivityLog[]> {
  const { data } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)
  const logs = (data as any[]) || []
  const profilesMap = await fetchProfilesMap(logs.map(l => l.user_id))
  return logs.map(l => ({
    ...l, user_name: profilesMap.get(l.user_id)?.name || "", user_email: profilesMap.get(l.user_id)?.email || ""
  }))
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

// Contracts
export async function fetchContractTemplates(): Promise<ContractTemplate[]> {
  const { data } = await supabase.from("contract_templates").select("*").order("title")
  return (data as ContractTemplate[]) || []
}

export async function saveContractTemplate(tpl: Partial<ContractTemplate>) {
  const { error } = tpl.id
    ? await supabase.from("contract_templates").update(tpl).eq("id", tpl.id)
    : await supabase.from("contract_templates").insert(tpl)
  if (!error) await logActivity(tpl.id ? "update_contract_template" : "create_contract_template", "contract_template", tpl.id || "new")
  return { error }
}

export async function deleteContractTemplate(id: string) {
  const { error } = await supabase.from("contract_templates").delete().eq("id", id)
  if (!error) await logActivity("delete_contract_template", "contract_template", id)
  return { error }
}

export async function fetchContracts(): Promise<Contract[]> {
  const { data } = await supabase
    .from("contracts")
    .select("*, stores!contracts_store_id_fkey(name), contract_templates!contracts_template_id_fkey(title)")
    .order("created_at", { ascending: false })
  const contracts = (data as any[]) || []
  const profilesMap = await fetchProfilesMap(contracts.map(c => c.user_id))
  return contracts.map(c => ({
    ...c,
    store_name: c.stores?.name || "",
    user_email: profilesMap.get(c.user_id)?.email || "",
    template_title: c.contract_templates?.title || ""
  }))
}

export async function saveContract(contract: Partial<Contract>) {
  const { error } = contract.id
    ? await supabase.from("contracts").update(contract).eq("id", contract.id)
    : await supabase.from("contracts").insert(contract)
  if (!error) await logActivity(contract.id ? "update_contract" : "create_contract", "contract", contract.id || "new")
  return { error }
}

export async function deleteContract(id: string) {
  const { error } = await supabase.from("contracts").delete().eq("id", id)
  if (!error) await logActivity("delete_contract", "contract", id)
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
