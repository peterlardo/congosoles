import { useState } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import {
  LayoutDashboard, Zap, Store, Settings, LogOut, Menu, X,
  ChevronRight, Bell, User
} from "lucide-react"

const sidebarLinks = [
  { to: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { to: "/dashboard/promotions", label: "Promotions", icon: Zap },
  { to: "/dashboard/boutique", label: "Ma boutique", icon: Store },
  { to: "/dashboard/parametres", label: "Paramètres", icon: Settings },
]

export default function DashboardLayout() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

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
          <div className="text-xs text-muted-foreground">Espace commerçant</div>
        </div>
      </div>

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
              {user?.user_metadata?.name || user?.email?.split("@")[0] || "Commerçant"}
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
              {user?.user_metadata?.name || "Commerçant"}
            </div>
            <div className="text-xs text-muted-foreground">Plan Gratuit</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
