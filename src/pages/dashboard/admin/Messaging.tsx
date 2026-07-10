import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Mail, Send, Search, User, Trash2 } from "lucide-react"

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  subject: string
  body: string
  is_read: boolean
  created_at: string
  sender_name?: string
  receiver_name?: string
}

export default function AdminMessaging() {
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<{ id: string; name: string; email: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showCompose, setShowCompose] = useState(false)
  const [selected, setSelected] = useState<Message | null>(null)
  const [compose, setCompose] = useState({ receiver_id: "", subject: "", body: "" })

  useEffect(() => {
    Promise.all([
      supabase.from("messages").select("*, sender:profiles!messages_sender_id_fkey(name), receiver:profiles!messages_receiver_id_fkey(name)").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, name, email").neq("role", "super_admin"),
    ]).then(([msgs, profs]) => {
      setMessages((msgs.data as any[])?.map(m => ({
        ...m,
        sender_name: m.sender?.name,
        receiver_name: m.receiver?.name,
      })) || [])
      setUsers((profs.data as any[]) || [])
      setLoading(false)
    })
  }, [])

  const filtered = messages.filter(m =>
    !search || m.subject?.toLowerCase().includes(search.toLowerCase()) || m.body?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSend = async () => {
    if (!compose.receiver_id || !compose.subject || !compose.body) return
    const { data: userData } = await supabase.auth.getUser()
    await supabase.from("messages").insert({
      sender_id: userData.user?.id,
      receiver_id: compose.receiver_id,
      subject: compose.subject,
      body: compose.body,
    })
    setShowCompose(false)
    setCompose({ receiver_id: "", subject: "", body: "" })
    const { data } = await supabase.from("messages")
      .select("*, sender:profiles!messages_sender_id_fkey(name), receiver:profiles!messages_receiver_id_fkey(name)")
      .order("created_at", { ascending: false })
    setMessages((data as any[])?.map(m => ({
      ...m, sender_name: m.sender?.name, receiver_name: m.receiver?.name,
    })) || [])
  }

  const handleDelete = async (id: string) => {
    await supabase.from("messages").delete().eq("id", id)
    setMessages(prev => prev.filter(m => m.id !== id))
    setSelected(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Messagerie</h1>
          <p className="mt-1 text-sm text-ink-soft">{messages.length} message{messages.length > 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowCompose(true)}
          className="inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
          <Send className="h-4 w-4" /> Nouveau message
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un message..."
          className="h-10 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm text-ink outline-none transition focus:border-primary" />
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center">
          <Mail className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm text-ink-soft">Aucun message</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(msg => (
            <div key={msg.id} onClick={() => setSelected(msg)}
              className={`flex items-center gap-4 rounded-2xl border p-4 shadow-card cursor-pointer transition hover:-translate-y-0.5 hover:shadow-lift ${selected?.id === msg.id ? "border-primary bg-primary/5" : "border-border/60 bg-card"}`}>
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${!msg.is_read ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`truncate text-sm ${!msg.is_read ? "font-bold text-ink" : "text-ink"}`}>{msg.subject}</span>
                  {!msg.is_read && <span className="h-2 w-2 rounded-full bg-primary" />}
                </div>
                <div className="text-xs text-muted-foreground">
                  {msg.sender_name || msg.sender_id?.slice(0, 8)} → {msg.receiver_name || msg.receiver_id?.slice(0, 8)} · {new Date(msg.created_at).toLocaleString("fr-FR")}
                </div>
                <div className="mt-0.5 text-xs text-ink-soft line-clamp-1">{msg.body}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowCompose(false)}>
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">Nouveau message</h3>
            <div className="mt-4 space-y-3">
              <select value={compose.receiver_id} onChange={e => setCompose({ ...compose, receiver_id: e.target.value })}
                className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary">
                <option value="">Sélectionner un destinataire</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
              </select>
              <input value={compose.subject} onChange={e => setCompose({ ...compose, subject: e.target.value })}
                placeholder="Sujet" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <textarea value={compose.body} onChange={e => setCompose({ ...compose, body: e.target.value })}
                placeholder="Votre message..." className="h-32 w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-primary" />
              <div className="flex gap-2">
                <button onClick={handleSend} className="flex items-center gap-2 rounded-full gradient-primary px-6 py-2.5 text-sm font-bold text-primary-foreground">
                  <Send className="h-4 w-4" /> Envoyer
                </button>
                <button onClick={() => setShowCompose(false)} className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-ink">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-ink">{selected.subject}</h3>
              <button onClick={() => handleDelete(selected.id)} className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10 hover:text-red-500" title="Supprimer">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              De : {selected.sender_name || "Inconnu"} · À : {selected.receiver_name || "Inconnu"} · {new Date(selected.created_at).toLocaleString("fr-FR")}
            </div>
            <div className="mt-4 rounded-xl bg-muted p-4 text-sm text-ink whitespace-pre-wrap">{selected.body}</div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setSelected(null)} className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-ink">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
