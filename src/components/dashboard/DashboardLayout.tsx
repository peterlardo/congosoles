import { useState } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import {
  LayoutDashboard, Zap, Store, Settings, LogOut, Menu,
  ChevronRight, Bell, User, ShoppingBag, TrendingUp, Shield,
  Users, Layers, MapPin, CreditCard, DollarSign, AlertTriangle,
  MessageSquare, FileText, History, Bell as BellIcon, Megaphone,
  Crown, Image, Star, ShieldAlert
} from "lucide-react"

export default function DashboardLayout() {
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isAdmin = profile?.role === "super_admin" || profile?.role === "admin" || profile?.role === "moderator"
  const isSuperAdmin = profile?.role === "super_admin" || profile?.role === "admin"

  const vendorLinks = [
    { to: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
    { to: "/dashboard/promotions", label: "Mes promotions", icon: Zap },
    { to: "/dashboard/boutique", label: "Ma boutique", icon: Store },
    { to: "/dashboard/parametres", label: "Paramètres", icon: Settings },
  ]

  const adminLinks = [
    { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { to: "/dashboard/admin/users", label: "Utilisateurs", icon: Users },
    { to: "/dashboard/admin/stores", label: "Boutiques", icon: ShoppingBag },
    { to: "/dashboard/admin/promotions", label: "Promotions", icon: Zap },
    { to: "/dashboard/admin/categories", label: "Catégories", icon: Layers },
    { to: "/dashboard/admin/locations", label: "Localisations", icon: MapPin },
    { to: "/dashboard/admin/subscriptions", label: "Abonnements", icon: Crown },
    { to: "/dashboard/admin/payments", label: "Paiements", icon: DollarSign },
    { to: "/dashboard/admin/reports", label: "Signalements", icon: AlertTriangle },
    { to: "/dashboard/admin/notifications", label: "Notifications", icon: BellIcon },
    { to: "/dashboard/admin/cms", label: "Pages CMS", icon: FileText },
    { to: "/dashboard/admin/support", label: "Support", icon: MessageSquare },
    { to: "/dashboard/admin/activity", label: "Journal activité", icon: History },
    { to: "/dashboard/admin/trends", label: "Tendances", icon: TrendingUp },
    { to: "/dashboard/admin/settings", label: "Paramètres", icon: Settings },
  ]

  const sidebarLinks = isAdmin ? adminLinks : vendorLinks

  const handleLogout = async () => {
    await signOut()
    navigate("/")
  }

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard"
    return location.pathname.startsWith(path)
  }

  const Sidebar = ({ className = "" }: { className?: string }) => (
    <aside className={`flex flex-col bg-card border-r border-border/60 ${className}`}>
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border/60">
        <img src="/assets/logo.png" alt="Congo Soldes" className="h-10 w-10 object-contain" />
        <div>
          <div className="font-display text-sm font-bold text-ink">Congo Soldes</div>
          <div className="text-xs text-muted-foreground">{isAdmin ? "Administration" : "Espace commerçant"}</div>
        </div>
      </div>

      {isAdmin && (
        <div className="mx-3 mt-3 flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-primary">{profile?.role === "super_admin" ? "Super Admin" : "Administrateur"}</span>
        </div>
      )}

      <nav className="flex-1 space-y-1 px-3 py-4">
        {sidebarLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              isActive(link.to)
                ? "bg-primary/10 text-primary"
                : "text-ink-soft hover:bg-muted hover:text-ink"
            }`}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
            {isActive(link.to) && <ChevronRight className="ml-auto h-4 w-4" />}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border/60 p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary text-xs font-bold">
            <User className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-ink">
              {profile?.name || user?.email?.split("@")[0] || "Utilisateur"}
            </div>
            <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
          </div>
          <button onClick={handleLogout} className="text-muted-foreground transition hover:text-red-500" title="Déconnexion">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden lg:flex lg:w-64 lg:flex-col">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 flex h-full w-72 flex-col">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-4 border-b border-border/60 bg-card px-6 py-3 lg:px-8">
          <button onClick={() => setMobileOpen(true)} className="text-ink lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <button className="relative text-muted-foreground transition hover:text-ink">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary" />
          </button>
          <div className="hidden sm:block text-right">
            <div className="text-sm font-semibold text-ink">
              {profile?.name || user?.user_metadata?.name || "Utilisateur"}
            </div>
            <div className="text-xs text-muted-foreground">{isSuperAdmin ? "Super Admin" : isAdmin ? "Administrateur" : "Plan Gratuit"}</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
