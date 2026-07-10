import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { User, Mail, Lock, Save } from "lucide-react"

export default function DashboardParametres() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.user_metadata?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [newPassword, setNewPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.auth.updateUser({
      data: { name },
    })
    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword) return
    setSaving(true)
    await supabase.auth.updateUser({ password: newPassword })
    setSaving(false)
    setNewPassword("")
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Paramètres</h1>
        <p className="mt-1 text-sm text-ink-soft">Gérez votre profil et vos préférences.</p>
      </div>

      <form onSubmit={handleUpdateProfile} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card space-y-4">
        <h2 className="font-semibold text-ink">Profil</h2>

        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nom</label>
          <div className="relative mt-1.5">
            <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-ink outline-none transition focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              value={email}
              disabled
              className="h-11 w-full rounded-xl border border-border bg-muted pl-10 pr-4 text-sm text-muted-foreground"
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">L'email ne peut pas être modifié.</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow transition hover:opacity-95 disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? "Enregistrement..." : saved ? "Enregistré ✓" : "Mettre à jour"}
        </button>
      </form>

      <form onSubmit={handleUpdatePassword} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card space-y-4">
        <h2 className="font-semibold text-ink">Changer le mot de passe</h2>

        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nouveau mot de passe</label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              placeholder="8 caractères minimum"
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-ink outline-none transition focus:border-primary"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving || !newPassword}
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary disabled:opacity-50"
        >
          <Lock className="h-4 w-4" /> Changer le mot de passe
        </button>
      </form>

      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-600">Zone dangereuse</h2>
        <p className="mt-1 text-sm text-red-500">La suppression de votre compte est irréversible.</p>
        <button className="mt-3 rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100">
          Supprimer mon compte
        </button>
      </div>
    </div>
  )
}
