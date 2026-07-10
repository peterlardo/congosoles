import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react"

export default function Signup() {
  const { signUp } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const { error } = await signUp(email, password, name)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setConfirmed(true)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src="/assets/logo.png" alt="Congo Soldes" className="h-16 w-16 object-contain" />
          </Link>
          <h1 className="mt-6 font-display text-3xl font-bold text-ink">Créer un compte</h1>
          <p className="mt-2 text-sm text-ink-soft">Rejoignez Congo Soldes en tant que commerçant</p>
        </div>

        {confirmed ? (
          <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-card text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-lg font-bold text-ink">Vérifiez votre email</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Un lien de confirmation vous a été envoyé à <strong>{email}</strong>. Cliquez sur ce lien pour activer votre compte.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full gradient-primary text-sm font-bold text-primary-foreground shadow-glow transition hover:opacity-95"
            >
              Se connecter
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-border/60 bg-card p-8 shadow-card">
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
            )}

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nom</label>
              <div className="relative mt-1.5">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Votre nom"
                  className="h-12 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm text-ink outline-none transition focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="votre@email.com"
                  className="h-12 w-full rounded-full border border-border bg-background pl-11 pr-4 text-sm text-ink outline-none transition focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mot de passe</label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="8 caractères minimum"
                  className="h-12 w-full rounded-full border border-border bg-background pl-11 pr-11 text-sm text-ink outline-none transition focus:border-primary"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-full gradient-primary text-sm font-bold text-primary-foreground shadow-glow transition hover:opacity-95 disabled:opacity-50"
            >
              {loading ? "Création..." : "Créer mon compte"}
            </button>

            <div className="text-center text-sm text-ink-soft">
              Déjà un compte ?{" "}
              <Link to="/login" className="font-semibold text-primary transition hover:underline">Se connecter</Link>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-muted-foreground transition hover:text-ink">← Retour à l'accueil</Link>
        </div>
      </div>
    </main>
  )
}
