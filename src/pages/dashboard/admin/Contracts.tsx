import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { fetchContractTemplates, saveContractTemplate, deleteContractTemplate, fetchContracts, saveContract, deleteContract } from "@/lib/admin"
import { FileText, Plus, Edit3, Trash2, Save, X, Check, Download, Eye, FileSignature } from "lucide-react"
import type { ContractTemplate, Contract } from "@/types/admin"

export default function AdminContracts() {
  const [tab, setTab] = useState<"templates" | "contracts">("templates")
  const [templates, setTemplates] = useState<ContractTemplate[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTemplate, setEditingTemplate] = useState<Partial<ContractTemplate> | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [preview, setPreview] = useState<ContractTemplate | null>(null)
  const [generate, setGenerate] = useState<{ template: ContractTemplate; storeId: string; storeName: string; vars: Record<string, string> } | null>(null)
  const [viewContract, setViewContract] = useState<Contract | null>(null)

  useEffect(() => {
    Promise.all([fetchContractTemplates(), fetchContracts()]).then(([t, c]) => {
      setTemplates(t); setContracts(c); setLoading(false)
    })
  }, [])

  const handleSaveTemplate = async () => {
    if (!editingTemplate?.title || !editingTemplate?.content) return
    await saveContractTemplate({
      ...editingTemplate,
      slug: editingTemplate.slug || editingTemplate.title.toLowerCase().replace(/\s+/g, "-"),
    })
    setTemplates(await fetchContractTemplates())
    setEditingTemplate(null)
  }

  const handleDeleteTemplate = async (id: string) => {
    await deleteContractTemplate(id)
    setTemplates(prev => prev.filter(t => t.id !== id))
    setDeleteConfirm(null)
  }

  const handleGenerate = async () => {
    if (!generate) return
    let content = generate.template.content
    Object.entries(generate.vars).forEach(([k, v]) => {
      content = content.replace(new RegExp(`{{${k}}}`, "g"), v || "")
    })
    await saveContract({
      template_id: generate.template.id,
      store_id: generate.storeId,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      title: `${generate.template.title} - ${generate.storeName}`,
      content,
      variables: generate.vars,
      status: "draft",
    })
    setContracts(await fetchContracts())
    setGenerate(null)
  }

  const handleDeleteContract = async (id: string) => {
    await deleteContract(id)
    setContracts(prev => prev.filter(c => c.id !== id))
    setDeleteConfirm(null)
  }

  const getStoreOptions = async () => {
    const { data } = await supabase.from("stores").select("id, name").eq("status", "active")
    return (data || []) as { id: string; name: string }[]
  }

  const openGenerate = async (template: ContractTemplate) => {
    const stores = await getStoreOptions()
    if (stores.length === 0) return
    setGenerate({
      template,
      storeId: stores[0].id,
      storeName: stores[0].name,
      vars: {
        store_name: stores[0].name,
        representative_name: "",
        store_address: "",
        date: new Date().toLocaleDateString("fr-FR"),
        duration: "30 jours",
        budget: "",
        campaign_type: "Standard",
        payment_terms: "100% à la signature",
        price: "",
        commission: "5",
        amount: "",
        service_description: "",
        fee_type: "gratuit",
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Contrats</h1>
        <p className="mt-1 text-sm text-ink-soft">Gestion des modèles et contrats</p>
      </div>

      <div className="flex gap-1.5 rounded-full border border-border bg-card p-1 w-fit">
        <button onClick={() => setTab("templates")}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${tab === "templates" ? "bg-primary text-primary-foreground" : "text-ink-soft hover:text-ink"}`}>
          Modèles ({templates.length})
        </button>
        <button onClick={() => setTab("contracts")}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${tab === "contracts" ? "bg-primary text-primary-foreground" : "text-ink-soft hover:text-ink"}`}>
          Contrats ({contracts.length})
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />)}</div>
      ) : tab === "templates" ? (
        <>
          <div className="flex justify-end">
            <button onClick={() => setEditingTemplate({ title: "", description: "", content: "", category: "general", is_active: true })}
              className="inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
              <Plus className="h-4 w-4" /> Nouveau modèle
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map(tpl => (
              <div key={tpl.id} className="rounded-2xl border border-border/60 bg-card p-5 shadow-card flex flex-col">
                <div className="flex items-start justify-between">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setPreview(tpl)} className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-ink" title="Aperçu">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button onClick={() => setEditingTemplate(tpl)} className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-ink" title="Modifier">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteConfirm(tpl.id)} className="rounded-lg p-1.5 text-red-400 transition hover:bg-red-500/10 hover:text-red-500" title="Supprimer">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <h3 className="mt-3 text-sm font-bold text-ink">{tpl.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{tpl.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize">{tpl.category}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${tpl.is_active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                    {tpl.is_active ? "Actif" : "Inactif"}
                  </span>
                </div>
                <button onClick={() => openGenerate(tpl)}
                  className="mt-4 flex items-center justify-center gap-2 rounded-full bg-primary/10 py-2 text-xs font-bold text-primary transition hover:bg-primary/20">
                  <FileSignature className="h-3 w-3" /> Générer un contrat
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            {contracts.map(contract => (
              <div key={contract.id} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                  contract.status === "signed" ? "bg-success/10 text-success"
                  : contract.status === "draft" ? "bg-amber-500/10 text-amber-500"
                  : contract.status === "cancelled" || contract.status === "expired" ? "bg-red-500/10 text-red-500"
                  : "bg-blue-500/10 text-blue-500"
                }`}>
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink">{contract.title}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      contract.status === "signed" ? "bg-success/10 text-success"
                      : contract.status === "draft" ? "bg-amber-500/10 text-amber-500"
                      : contract.status === "expired" ? "bg-red-500/10 text-red-500"
                      : contract.status === "cancelled" ? "bg-muted text-muted-foreground"
                      : "bg-blue-500/10 text-blue-500"
                    }`}>{contract.status}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{contract.store_name} · {contract.template_title} · {new Date(contract.created_at).toLocaleDateString("fr-FR")}</div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setViewContract(contract)} className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-ink" title="Voir">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button onClick={() => { setDeleteConfirm(contract.id) }} className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/10 hover:text-red-500" title="Supprimer">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {contracts.length === 0 && (
              <div className="rounded-2xl border border-border/60 bg-card p-12 text-center">
                <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-ink-soft">Aucun contrat généré</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Edit/Create Template Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditingTemplate(null)}>
          <div className="w-full max-w-2xl rounded-3xl bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">{editingTemplate.id ? "Modifier" : "Nouveau"} modèle de contrat</h3>
            <div className="mt-4 space-y-3">
              <input value={editingTemplate.title || ""} onChange={e => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                placeholder="Titre du modèle" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <input value={editingTemplate.slug || ""} onChange={e => setEditingTemplate({ ...editingTemplate, slug: e.target.value })}
                placeholder="Slug" className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              <textarea value={editingTemplate.description || ""} onChange={e => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                placeholder="Description" className="h-20 w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-primary" />
              <select value={editingTemplate.category || "general"} onChange={e => setEditingTemplate({ ...editingTemplate, category: e.target.value as any })}
                className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary">
                <option value="general">Général</option>
                <option value="partnership">Partenariat</option>
                <option value="advertising">Publicité</option>
                <option value="services">Services</option>
                <option value="brand_license">Licence de marque</option>
                <option value="consignment">Dépôt-vente</option>
                <option value="terms">CGU</option>
              </select>
              <textarea value={editingTemplate.content || ""} onChange={e => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                placeholder="Contenu HTML du contrat (utilisez {{variable}} pour les champs dynamiques)"
                className="h-64 w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-primary font-mono" />
              <div className="flex items-center gap-2">
                <input type="checkbox" id="tpl-active" checked={editingTemplate.is_active ?? true}
                  onChange={e => setEditingTemplate({ ...editingTemplate, is_active: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-primary" />
                <label htmlFor="tpl-active" className="text-sm text-ink">Modèle actif</label>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleSaveTemplate} className="flex items-center gap-2 rounded-full gradient-primary px-6 py-2.5 text-sm font-bold text-primary-foreground">
                  <Save className="h-4 w-4" /> Enregistrer
                </button>
                <button onClick={() => setEditingTemplate(null)} className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-ink">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Template Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setPreview(null)}>
          <div className="w-full max-w-3xl rounded-3xl bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-ink">{preview.title}</h3>
              <button onClick={() => setPreview(null)} className="rounded-lg p-2 text-muted-foreground hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background p-8">
              <div className="mb-6 text-center">
                <img src="/assets/logo.png" alt="Congo Soldes" className="mx-auto h-16 w-16 object-contain" />
                <h2 className="mt-2 font-display text-lg font-bold text-ink">Congo Soldes</h2>
                <p className="text-xs text-muted-foreground">Toutes les promotions au même endroit</p>
              </div>
              <div className="prose prose-sm max-w-none text-ink" dangerouslySetInnerHTML={{ __html: preview.content }} />
              <div className="mt-8 border-t border-border/60 pt-6 text-center">
                <img src="/assets/logo.png" alt="Congo Soldes" className="mx-auto h-12 w-12 object-contain opacity-50" />
                <p className="mt-2 text-xs text-muted-foreground">Congo Soldes · Brazzaville, République du Congo</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Contract Modal */}
      {generate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setGenerate(null)}>
          <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">Générer : {generate.template.title}</h3>
            <div className="mt-4 space-y-3">
              <label className="text-xs font-semibold text-muted-foreground">Boutique</label>
              <select value={generate.storeId} onChange={e => {
                const store = e.target.options[e.target.selectedIndex]
                setGenerate({
                  ...generate,
                  storeId: e.target.value,
                  storeName: store.text,
                  vars: { ...generate.vars, store_name: store.text }
                })
              }} className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
              {Object.entries(generate.vars).filter(([k]) => k !== "store_name").map(([key, val]) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-muted-foreground capitalize">{key.replace(/_/g, " ")}</label>
                  <input value={val} onChange={e => setGenerate({ ...generate, vars: { ...generate.vars, [key]: e.target.value } })}
                    className="mt-1 h-10 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <button onClick={handleGenerate} className="flex items-center gap-2 rounded-full gradient-primary px-6 py-2.5 text-sm font-bold text-primary-foreground">
                  <FileSignature className="h-4 w-4" /> Générer
                </button>
                <button onClick={() => setGenerate(null)} className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-ink">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Contract Modal */}
      {viewContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setViewContract(null)}>
          <div className="w-full max-w-3xl rounded-3xl bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-ink">{viewContract.title}</h3>
                <p className="text-xs text-muted-foreground">Statut: {viewContract.status} · {viewContract.store_name}</p>
              </div>
              <button onClick={() => setViewContract(null)} className="rounded-lg p-2 text-muted-foreground hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background p-8">
              <div className="mb-6 text-center">
                <img src="/assets/logo.png" alt="Congo Soldes" className="mx-auto h-16 w-16 object-contain" />
                <h2 className="mt-2 font-display text-lg font-bold text-ink">Congo Soldes</h2>
                <p className="text-xs text-muted-foreground">Toutes les promotions au même endroit</p>
              </div>
              <div className="prose prose-sm max-w-none text-ink" dangerouslySetInnerHTML={{ __html: viewContract.content }} />
              <div className="mt-8 border-t border-border/60 pt-6 text-center">
                <img src="/assets/logo.png" alt="Congo Soldes" className="mx-auto h-12 w-12 object-contain opacity-50" />
                <p className="mt-2 text-xs text-muted-foreground">Congo Soldes · Brazzaville, République du Congo</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDeleteConfirm(null)}>
          <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-lg font-bold text-ink">Confirmer la suppression</h3>
            <p className="mt-2 text-sm text-ink-soft">Cette action est irréversible.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => tab === "templates" ? handleDeleteTemplate(deleteConfirm) : handleDeleteContract(deleteConfirm)}
                className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-bold text-white">Supprimer</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold text-ink">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
