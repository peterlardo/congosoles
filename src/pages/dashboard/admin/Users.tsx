import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { fetchUsers, updateUserRole } from "@/lib/admin"
import { Search, User, Shield, ShieldAlert, MoreVertical, Check, X } from "lucide-react"
import type { AdminProfile } from "@/types/admin"

const roles = ["super_admin", "admin", "moderator", "vendor", "shop_manager", "client"]

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [editingRole, setEditingRole] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers().then(data => { setUsers(data); setLoading(false) })
  }, [])

  const filtered = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleRoleChange = async (userId: string, role: string) => {
    await updateUserRole(userId, role)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: role as any } : u))
    setEditingRole(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Gestion des utilisateurs</h1>
          <p className="mt-1 text-sm text-ink-soft">{users.length} utilisateur{users.length > 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un utilisateur..."
          className="h-10 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm text-ink outline-none transition focus:border-primary"
        />
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />)}</div>
      ) : (
        <div className="space-y-2">
          {filtered.map(user => (
            <div key={user.id} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                {user.name.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-ink">{user.name || "Sans nom"}</span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
                    user.role === "super_admin" ? "bg-red-500/10 text-red-600"
                    : user.role === "admin" ? "bg-violet-500/10 text-violet-600"
                    : user.role === "moderator" ? "bg-blue-500/10 text-blue-600"
                    : user.role === "vendor" ? "bg-green-500/10 text-green-600"
                    : "bg-muted text-muted-foreground"
                  }`}>{user.role}</span>
                </div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </div>
              <div className="relative">
                {editingRole === user.id ? (
                  <div className="flex gap-1">
                    <select value={user.role} onChange={e => handleRoleChange(user.id, e.target.value)}
                      className="rounded-lg border border-border bg-background px-2 py-1 text-xs outline-none">
                      {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <button onClick={() => setEditingRole(null)} className="p-1 text-muted-foreground hover:text-ink"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <button onClick={() => setEditingRole(user.id)} className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-ink">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-border/60 bg-card p-12 text-center">
              <User className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-ink-soft">Aucun utilisateur trouvé</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}