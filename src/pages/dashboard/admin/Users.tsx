import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { fetchUsers, updateUserRole, deleteUser } from "@/lib/admin"
import { Search, User, Plus, Trash2, X, Check } from "lucide-react"
import type { AdminProfile } from "@/types/admin"
import Pagination from "@/components/Pagination"

const roles = ["super_admin", "admin", "moderator", "vendor", "shop_manager", "client"]

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [editingRole, setEditingRole] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [newUser, setNewUser] = useState({ email: "", password: "", name: "", role: "client" })
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchUsers().then(data => { setUsers(data); setLoading(false) })
  }, [])

  const filtered = users.filter(u =>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const pageSize = 6
  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => { setPage(1) }, [search])

  const handleRoleChange = async (userId: string, role: string) => {
    await updateUserRole(userId, role)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: role as any } : u))
    setEditingRole(null)
  }

  const handleCreate = async () => {
    const { data, error } = await supabase.auth.admin.createUser({
      email: newUser.email,
      password: newUser.password,
      email_confirm: true,
      user_metadata: { name: newUser.name }
    })
    if (!error && data?.user) {
      await supabase.from("profiles").upsert({ id: data.user.id, email: newUser.email, name: newUser.name, role: newUser.role })
      setUsers(await fetchUsers())
    }
    setShowCreate(false)
    setNewUser({ email: "", password: "", name: "", role: "client" })
  }

  const handleDelete = async (userId: string) => {
    await deleteUser(userId)
    setUsers(prev => prev.filter(u => u.id !== userId))
    setDeleteConfirm(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Gestion des utilisateurs</h1>
          <p className="mt-1 text-sm text-ink-soft">{users.length} utilisateur{users.length > 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
          <Plus className="h-4 w-4" /> Créer un utilisateur
        </button>
      </div>

      <div className="relative max-w-md">
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
          {paged.map(user => (
            <div key={user.id} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                {user.name?.charAt(0).toUpperCase() || "?"}
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
                  <div className="flex gap-1">
                    <button onClick={() => setEditingRole(user.id)} className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-ink" title="Changer rôle">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteConfirm(user.id)} className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10 hover:text-red-500" title="Supprimer">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <Pagination current={page} total={filtered.length} pageSize={pageSize} onChange={setPage} />
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-border/60 bg-card p-12 text-center">
              <User className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-ink-soft">Aucun utilisateur trouvé</p>
            </div>
          )}
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowCreate(false)}>
          <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">Nouvel utilisateur</h3>
            <div className="mt-4 space-y-3">
              <input value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Nom complet" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <input value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Email" type="email" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <input value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Mot de passe" type="password" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary">
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <div className="flex gap-2 pt-2">
                <button onClick={handleCreate} className="flex-1 rounded-full gradient-primary py-2.5 text-sm font-bold text-primary-foreground">Créer</button>
                <button onClick={() => setShowCreate(false)} className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold text-ink">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDeleteConfirm(null)}>
          <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">Confirmer la suppression</h3>
            <p className="mt-2 text-sm text-ink-soft">Cette action est irréversible. Voulez-vous vraiment supprimer cet utilisateur ?</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-bold text-white">Supprimer</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold text-ink">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
