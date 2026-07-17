import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-display font-bold text-primary">404</div>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink">Page introuvable</h1>
      <p className="mt-2 text-sm text-ink-soft">La page que vous recherchez n'existe pas ou a été déplacée.</p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow transition hover:opacity-95"
      >
        Retour à l'accueil
      </Link>
    </div>
  )
}