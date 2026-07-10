import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { fetchTickets, updateTicketStatus, assignTicket } from "@/lib/admin"
import { MessageSquare, Search, ChevronDown, Send, User, Check, X, RotateCcw } from "lucide-react"
import type { SupportTicket, TicketMessage } from "@/types/admin"

export default function AdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("open")
  const [selected, setSelected] = useState<SupportTicket | null>(null)
  const [reply, setReply] = useState("")

  useEffect(() => {
    fetchTickets().then(data => { setTickets(data); setLoading(false) })
  }, [])

  const filtered = filter === "all" ? tickets : tickets.filter(t => t.status === filter)

  const selectTicket = async (ticket: SupportTicket) => {
    setSelected(ticket)
    const { data: msgs } = await supabase.from("ticket_messages")
      .select("*, profiles!ticket_messages_user_id_fkey(name)")
      .eq("ticket_id", ticket.id).order("created_at")
    const messages = (msgs as any[])?.map(m => ({ ...m, user_name: m.profiles?.name })) || []
    setSelected({ ...ticket, messages })
  }

  const handleStatus = async (ticketId: string, status: string) => {
    await updateTicketStatus(ticketId, status)
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: status as any } : t))
    setSelected(prev => prev?.id === ticketId ? { ...prev, status: status as any } : prev)
  }

  const sendReply = async () => {
    if (!reply.trim() || !selected) return
    const { data } = await supabase.from("ticket_messages").insert({
      ticket_id: selected.id, user_id: (await supabase.auth.getUser()).data.user?.id, message: reply
    }).select("*, profiles!ticket_messages_user_id_fkey(name)").single()
    const msg = { ...(data as any), user_name: data?.profiles?.name } as TicketMessage
    setSelected(prev => prev ? { ...prev, messages: [...(prev.messages || []), msg] } : prev)
    setReply("")
    if (selected.status === "open") {
      await supabase.from("support_tickets").update({ status: "in_progress" }).eq("id", selected.id)
      setTickets(prev => prev.map(t => t.id === selected.id ? { ...t, status: "in_progress" as any } : t))
      setSelected(prev => prev?.id === selected.id ? { ...prev, status: "in_progress" as any } : prev)
    }
  }

  const statusColors: Record<string, string> = {
    open: "bg-red-500/10 text-red-500",
    in_progress: "bg-amber-500/10 text-amber-500",
    waiting: "bg-blue-500/10 text-blue-500",
    resolved: "bg-green-500/10 text-green-500",
    closed: "bg-muted text-muted-foreground"
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      <div className="w-96 shrink-0 space-y-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Support</h1>
          <p className="mt-1 text-sm text-ink-soft">{tickets.filter(t => t.status !== "resolved" && t.status !== "closed").length} tickets ouverts</p>
        </div>
        <div className="flex gap-1.5 rounded-full border border-border bg-card p-1 flex-wrap">
          {["open", "in_progress", "waiting", "resolved", "closed", "all"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${filter === s ? "bg-primary text-primary-foreground" : "text-ink-soft hover:text-ink"}`}>
              {s === "all" ? "Tous" : s === "in_progress" ? "En cours" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <div className="space-y-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 16rem)" }}>
          {loading ? [1,2,3,4].map(i => <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />)
          : filtered.map(ticket => (
            <div key={ticket.id} onClick={() => selectTicket(ticket)}
              className={`cursor-pointer rounded-2xl border p-4 transition hover:-translate-y-0.5 ${
                selected?.id === ticket.id ? "border-primary bg-primary/5" : "border-border/60 bg-card"
              }`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-ink truncate">{ticket.subject}</span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${statusColors[ticket.status]}`}>{ticket.status}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{ticket.user_name || ticket.user_email} · {new Date(ticket.created_at).toLocaleDateString("fr-FR")}</div>
              <div className="mt-1 flex gap-1">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  ticket.priority === "urgent" ? "bg-red-500/10 text-red-500"
                  : ticket.priority === "high" ? "bg-amber-500/10 text-amber-500"
                  : "bg-muted text-muted-foreground"
                }`}>{ticket.priority}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground capitalize">{ticket.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 rounded-2xl border border-border/60 bg-card shadow-card flex flex-col">
        {!selected ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-ink-soft">Sélectionnez un ticket pour voir les messages</p>
            </div>
          </div>
        ) : (
          <>
            <div className="border-b border-border/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-ink">{selected.subject}</h3>
                  <p className="text-xs text-muted-foreground">{selected.user_name || selected.user_email} · {selected.category}</p>
                </div>
                <div className="flex gap-1.5">
                  {selected.status !== "resolved" && selected.status !== "closed" && (
                    <>
                      <button onClick={() => handleStatus(selected.id, "resolved")}
                        className="flex items-center gap-1 rounded-full bg-success/10 px-3 py-1.5 text-xs font-bold text-success transition hover:bg-success/20">
                        <Check className="h-3.5 w-3.5" /> Résoudre
                      </button>
                      <button onClick={() => handleStatus(selected.id, "closed")}
                        className="flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground transition hover:bg-red-500/10 hover:text-red-500">
                        <X className="h-3.5 w-3.5" /> Fermer
                      </button>
                    </>
                  )}
                  {(selected.status === "resolved" || selected.status === "closed") && (
                    <button onClick={() => handleStatus(selected.id, "open")}
                      className="flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-500 transition hover:bg-blue-500/20">
                      <RotateCcw className="h-3.5 w-3.5" /> Rouvrir
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 p-4">
              <div className="rounded-xl bg-muted p-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium text-ink">{selected.user_name || "Utilisateur"}</span>
                </div>
                <p className="mt-1 text-ink">{selected.message}</p>
              </div>
              {selected.messages?.map(msg => (
                <div key={msg.id} className="rounded-xl bg-muted p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium text-ink">{msg.user_name || "Admin"}</span>
                    <span className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleString("fr-FR")}</span>
                  </div>
                  <p className="mt-1 text-ink">{msg.message}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border/60 p-4">
              <div className="flex gap-2">
                <input value={reply} onChange={e => setReply(e.target.value)}
                  placeholder="Écrire un message..."
                  className="h-10 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none transition focus:border-primary"
                  onKeyDown={e => e.key === "Enter" && sendReply()}
                />
                <button onClick={sendReply}
                  className="grid h-10 w-10 place-items-center rounded-full gradient-primary text-primary-foreground">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
