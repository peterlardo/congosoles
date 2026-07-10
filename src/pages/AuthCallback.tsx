import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"

export default function AuthCallback() {
  const navigate = useNavigate()
  const [message, setMessage] = useState("Confirmation en cours...")
  const [error, setError] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setMessage("Compte confirmé avec succès ! Redirection...")
        setTimeout(() => navigate("/dashboard"), 1500)
      } else {
        const params = new URLSearchParams(window.location.hash.replace("#", "?"))
        const errorParam = params.get("error_description")
        if (errorParam) {
          setMessage(decodeURIComponent(errorParam))
          setError(true)
        } else {
          setMessage("Lien de confirmation invalide ou expiré.")
          setError(true)
        }
      }
    })
  }, [navigate])

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className={`rounded-3xl border p-8 shadow-card ${
          error ? "border-red-200 bg-red-50" : "border-border/60 bg-card"
        }`}>
          <h1 className={`text-2xl font-bold ${error ? "text-red-600" : "text-ink"}`}>
            {error ? "Erreur" : "Confirmation"}
          </h1>
          <p className={`mt-3 text-sm ${error ? "text-red-500" : "text-ink-soft"}`}>
            {message}
          </p>
          {error && (
            <button
              onClick={() => navigate("/login")}
              className="mt-6 h-12 w-full rounded-full gradient-primary text-sm font-bold text-primary-foreground shadow-glow"
            >
              Se connecter
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
