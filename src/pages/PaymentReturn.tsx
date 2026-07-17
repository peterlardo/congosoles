import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function PaymentReturn() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const tx_ref = searchParams.get("tx_ref")
    const transaction_id = searchParams.get("transaction_id")
    const statusParam = searchParams.get("status")

    if (statusParam === "successful" || statusParam === "completed") {
      setStatus("success")
      setMessage("Votre paiement a été effectué avec succès !")
      return
    }

    if (statusParam === "failed" || statusParam === "cancelled") {
      setStatus("failed")
      setMessage("Le paiement a été annulé ou a échoué.")
      return
    }

    if (tx_ref || transaction_id) {
      const params = new URLSearchParams()
      if (tx_ref) params.set("tx_ref", tx_ref)
      if (transaction_id) params.set("transaction_id", transaction_id)

      fetch(`/api/pay-verify?${params.toString()}`)
        .then(r => r.json())
        .then(data => {
          if (data.status === "success" && data.data?.status === "successful") {
            setStatus("success")
            setMessage("Votre paiement a été effectué avec succès !")
          } else {
            setStatus("failed")
            setMessage("Le paiement n'a pas pu être confirmé.")
          }
        })
        .catch(() => {
          setStatus("failed")
          setMessage("Erreur lors de la vérification du paiement.")
        })
    } else {
      setStatus("failed")
      setMessage("Aucune information de paiement reçue.")
    }
  }, [searchParams])

  return (
    <main className="mx-auto max-w-lg px-4 py-20 lg:px-8">
      <div className="rounded-3xl border border-border/60 bg-card p-8 text-center shadow-card">
        {status === "loading" && (
          <>
            <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary" />
            <h1 className="mt-4 font-display text-2xl font-bold text-ink">Vérification du paiement...</h1>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h1 className="mt-4 font-display text-2xl font-bold text-ink">Paiement réussi !</h1>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            <p className="mt-1 text-xs text-muted-foreground">Présentez votre reçu au vendeur pour obtenir votre remise.</p>
            <Link to="/" className="mt-6 inline-flex rounded-full gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow hover:opacity-90">
              Retour à l'accueil
            </Link>
          </>
        )}
        {status === "failed" && (
          <>
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
            <h1 className="mt-4 font-display text-2xl font-bold text-ink">Paiement non abouti</h1>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/" className="inline-flex rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink hover:border-primary hover:text-primary">
                Accueil
              </Link>
              <Link to="/promos" className="inline-flex rounded-full gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow hover:opacity-90">
                Voir les promos
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
