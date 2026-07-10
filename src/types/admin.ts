export type UserRole = "super_admin" | "admin" | "moderator" | "vendor" | "shop_manager" | "client"
export type StoreStatus = "pending" | "active" | "suspended" | "rejected"
export type PromoStatus = "active" | "draft" | "expired"
export type ReportReason = "fake_promo" | "misleading_price" | "fake_store" | "inappropriate_image" | "abusive_content" | "fraud" | "unavailable_product" | "other"
export type ReportStatus = "pending" | "investigating" | "resolved" | "dismissed"
export type TicketStatus = "open" | "in_progress" | "waiting" | "resolved" | "closed"
export type TicketPriority = "low" | "normal" | "high" | "urgent"
export type CampaignStatus = "pending" | "active" | "paused" | "completed" | "rejected" | "cancelled"
export type BannerPosition = "home" | "categories" | "store" | "promo_detail" | "dashboard" | "mobile"
export type NotificationChannel = "internal" | "email" | "whatsapp" | "sms" | "push"
export type DocStatus = "pending" | "approved" | "rejected" | "needs_correction"

export interface AdminProfile {
  id: string
  name: string
  email: string
  avatar_url?: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface AdminStore {
  id: string
  user_id: string
  name: string
  slug: string
  description: string
  address: string
  phone: string
  website: string
  image: string
  category: string
  status: StoreStatus
  verified: boolean
  premium: boolean
  verified_at?: string
  rejected_reason?: string
  rating: number
  review_count: number
  promo_count: number
  featured: boolean
  district?: string
  neighborhood?: string
  gps_lat?: number
  gps_lng?: number
  created_at: string
  updated_at: string
  owner_email?: string
  owner_name?: string
}

export interface AdminPromotion {
  id: string
  user_id: string
  store_id: string
  title: string
  description: string
  discount: number
  original_price: number
  sale_price: number
  image: string
  category: string
  status: PromoStatus
  flagged: boolean
  featured: boolean
  archived: boolean
  rejection_reason?: string
  is_flash: boolean
  expires_at?: string
  views: number
  clicks: number
  created_at: string
  store_name?: string
  store_slug?: string
  owner_email?: string
}

export interface AdminCategory {
  id: string
  name: string
  slug: string
  icon: string
  image: string
  description: string
  display_order: number
  is_active: boolean
  created_at: string
  subcategories?: AdminSubcategory[]
}

export interface AdminSubcategory {
  id: string
  category_id: string
  name: string
  slug: string
  description: string
  is_active: boolean
  created_at: string
}

export interface District {
  id: string
  name: string
  slug: string
  display_order: number
  is_active: boolean
  created_at: string
  neighborhoods?: Neighborhood[]
}

export interface Neighborhood {
  id: string
  district_id: string
  name: string
  slug: string
  is_active: boolean
  created_at: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  slug: string
  description: string
  price: number
  max_promotions: number
  max_stores: number
  duration_days: number
  features: string[]
  is_active: boolean
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: string
  status: "active" | "expired" | "cancelled" | "suspended"
  starts_at: string
  expires_at: string
  auto_renew: boolean
  created_at: string
  plan_name?: string
  user_email?: string
}

export interface Payment {
  id: string
  user_id: string
  subscription_id?: string
  amount: number
  currency: string
  method: string
  provider: string
  status: "pending" | "completed" | "failed" | "refunded"
  transaction_id: string
  phone: string
  receipt_url: string
  notes: string
  created_at: string
  user_email?: string
}

export interface SponsoredCampaign {
  id: string
  user_id: string
  store_id: string
  type: string
  title: string
  description: string
  budget: number
  status: CampaignStatus
  starts_at: string
  ends_at: string
  impressions: number
  clicks: number
  created_at: string
  store_name?: string
  user_email?: string
}

export interface Banner {
  id: string
  title: string
  image: string
  link_url: string
  position: BannerPosition
  store_id?: string
  is_active: boolean
  starts_at: string
  ends_at?: string
  clicks: number
  impressions: number
  display_order: number
  created_at: string
  store_name?: string
}

export interface Review {
  id: string
  store_id: string
  user_id: string
  rating: number
  comment: string
  status: "pending" | "approved" | "hidden" | "rejected"
  created_at: string
  store_name?: string
  user_name?: string
}

export interface Report {
  id: string
  reporter_id: string
  target_type: string
  target_id: string
  reason: ReportReason
  description: string
  status: ReportStatus
  handled_by?: string
  resolution_notes: string
  created_at: string
  reporter_name?: string
  handler_name?: string
}

export interface Notification {
  id: string
  user_id?: string
  type: string
  title: string
  body: string
  channel: NotificationChannel
  target_audience: string
  target_value: string
  is_read: boolean
  link_url: string
  created_at: string
}

export interface CMSPage {
  id: string
  slug: string
  title: string
  content: string
  meta_title: string
  meta_description: string
  image: string
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface ActivityLog {
  id: string
  user_id?: string
  action: string
  entity_type: string
  entity_id: string
  details: any
  ip_address: string
  created_at: string
  user_name?: string
  user_email?: string
}

export interface SupportTicket {
  id: string
  user_id: string
  subject: string
  message: string
  status: TicketStatus
  priority: TicketPriority
  assigned_to?: string
  category: string
  created_at: string
  updated_at: string
  user_name?: string
  user_email?: string
  assignee_name?: string
  messages?: TicketMessage[]
}

export interface TicketMessage {
  id: string
  ticket_id: string
  user_id: string
  message: string
  created_at: string
  user_name?: string
}

export interface PlatformSetting {
  id: string
  key: string
  value: any
  updated_at: string
}

export interface StoreDocument {
  id: string
  store_id: string
  type: string
  file_url: string
  status: DocStatus
  rejection_reason: string
  uploaded_at: string
  store_name?: string
}

export interface AdminStats {
  totalUsers: number
  totalStores: number
  totalPromos: number
  totalViews: number
  totalClicks: number
  storesByStatus: { status: string; count: number }[]
  promosByStatus: { status: string; count: number }[]
  storesByCategory: { category: string; count: number }[]
  promosByCategory: { category: string; count: number }[]
  activeSubscriptions: number
  recentSignups: { date: string; count: number }[]
  totalRevenue: number
  pendingReports: number
  pendingTickets: number
  pendingStores: number
  pendingDocuments: number
}
