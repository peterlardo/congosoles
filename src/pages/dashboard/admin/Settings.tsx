import { useEffect, useState } from "react"
import { fetchSettings, updateSetting } from "@/lib/admin"
import { Settings, Save } from "lucide-react"
import type { PlatformSetting } from "@/types/admin"

export default function AdminSettings() {
  const [settings, setSettings] = useState<PlatformSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [values, setValues] = useState<Record<string, any>>({})

  useEffect(() => {
    fetchSettings().then(data => {
      setSettings(data)
      const vals: Record<string, any> = {}
      data.forEach(s => { vals[s.key] = s.value })
      setValues(vals)
      setLoading(false)
    })
  }, [])

  const handleSave = async (key: string) => {
    setSaving(true)
    await updateSetting(key, values[key])
    setSaving(false)
  }

  if (loading) return <div className="h-64 animate-pulse rounded-2xl bg-muted" />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Paramètres généraux</h1>
        <p className="mt-1 text-sm text-ink-soft">Configuration de la plateforme</p>
      </div>

      {settings.map(setting => (
        <div key={setting.id} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ink capitalize">{setting.key === "general" ? "Général" : setting.key === "fees" ? "Frais" : "Modération"}</h3>
            <button onClick={() => handleSave(setting.key)} disabled={saving}
              className="inline-flex items-center gap-2 rounded-full gradient-primary px-4 py-2 text-sm font-bold text-primary-foreground">
              <Save className="h-4 w-4" /> {saving ? "..." : "Enregistrer"}
            </button>
          </div>
          <div className="space-y-3">
            {Object.entries(values[setting.key] || {}).map(([key, val]) => (
              <div key={key}>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{key.replace(/_/g, " ")}</label>
                <input
                  type={typeof val === "number" ? "number" : "text"}
                  value={values[setting.key]?.[key] ?? ""}
                  onChange={e => setValues(prev => ({
                    ...prev,
                    [setting.key]: { ...prev[setting.key], [key]: typeof val === "number" ? parseFloat(e.target.value) : e.target.value }
                  }))}
                  className="mt-1 h-10 w-full rounded-full border border-border bg-background px-4 text-sm text-ink outline-none transition focus:border-primary"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}