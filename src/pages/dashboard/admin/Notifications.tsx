import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { sendNotification } from "@/lib/admin"
import { Bell, Send, Users, Store, Tag } from "lucide-react"
import type { Notification } from "@/types/admin"

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    type: "system", title: "", body: "", channel: "internal" as const,
    target_audience: "all", target_value: ""
  })

  useEffect(() => {
    supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(50)
      .then(({ data }) => { setNotifications((data as Notification[]) || []); setLoading(false) })
  }, [])

  const handleSend = async () => {
    await sendNotification(form as Notification)
    setForm({ type: "system", title: "", body: "", channel: "internal", target_audience: "all", target_value: "" })
    setShowForm(false)
    const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(50)
    setNotifications((data as Notification[]) || [])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Notifications</h1>
          <p className="mt-1 text-sm text-ink-soft">{notifications.length} notifications envoyées</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
          <Send className="h-4 w-4" /> Envoyer
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Titre" className="h-10 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
              className="h-10 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary">
              <option value="system">Système</option>
              <option value="promotion">Promotion</option>
              <option value="payment">Paiement</option>
              <option value="marketing">Marketing</option>
            </select>
            <select value={form.channel} onChange={e => setForm({ ...form, channel: e.target.value as any })}
              className="h-10 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary">
              <option value="internal">Interne</option>
              <option value="email">Email</option>
            </select>
            <select value={form.target_audience} onChange={e => setForm({ ...form, target_audience: e.target.value })}
              className="h-10 rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary">
              <option value="all">Tous les utilisateurs</option>
              <option value="vendors">Commerçants</option>
              <option value="clients">Clients</option>
            </select>
          </div>
          <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })}
            placeholder="Contenu de la notification..."
            className="h-24 w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-primary" />
          <div className="flex gap-2">
            <button onClick={handleSend} className="rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">Envoyer</button>
            <button onClick={() => setShowForm(false)} className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink">Annuler</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />)}</div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card">
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                n.type === "system" ? "bg-primary/10 text-primary"
                : n.type === "marketing" ? "bg-violet-500/10 text-violet-500"
                : "bg-blue-500/10 text-blue-500"
              }`}>
                <Bell className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-ink">{n.title}</div>
                <div className="text-xs text-muted-foreground">{n.body} · {n.channel} · {n.target_audience}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}