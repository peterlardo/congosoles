import { Link } from "react-router-dom"
import { Briefcase, MapPin, Clock, ChevronRight } from "lucide-react"

export default function Recrutement() {
  const jobs = [
    { id: 1, title: "Développeur React Full Stack", location: "Brazzaville", type: "CDI", department: "Technique", description: "Rejoignez notre équipe technique pour développer et maintenir la plateforme Congo Soldes." },
    { id: 2, title: "Chargé de partenariats commerciaux", location: "Brazzaville", type: "CDI", department: "Commercial", description: "Développez notre réseau de boutiques partenaires et négociez de nouvelles collaborations." },
    { id: 3, title: "Community Manager", location: "Brazzaville", type: "CDD", department: "Marketing", description: "Gérez nos réseaux sociaux et créez du contenu engageant pour notre communauté." },
    { id: 4, title: "Stagiaire UX/UI Designer", location: "Brazzaville", type: "Stage", department: "Design", description: "Participez à la conception d'interfaces utilisateur intuitives et modernes." },
    { id: 5, title: "Responsable logistique Pointe-Noire", location: "Pointe-Noire", type: "CDI", department: "Logistique", description: "Supervisez les opérations de livraison et la satisfaction client dans la région." },
  ]

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-red-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_55%)] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-8 lg:py-16">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/25">
            ← Retour à l'accueil
          </Link>
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/15 text-white backdrop-blur">
              <Briefcase className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">Recrutement</h1>
              <p className="mt-2 max-w-lg text-lg text-white/70">Rejoignez l'aventure Congo Soldes et contribuez au commerce congolais.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold text-ink">Nos valeurs</h2>
          <p className="mt-2 text-sm text-ink-soft leading-relaxed">
            Chez Congo Soldes, nous croyons que la technologie peut rendre le commerce plus équitable et plus accessible.
            Nous recherchons des talents passionnés qui partagent cette vision.
          </p>
        </div>

        <div className="space-y-4">
          {jobs.map((job) => (
            <article key={job.id} className="group rounded-2xl border border-border/60 bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-ink group-hover:text-primary">{job.title}</h3>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      job.type === "CDI" ? "bg-success/10 text-success" : job.type === "CDD" ? "bg-blue-500/10 text-blue-600" : "bg-amber-500/10 text-amber-600"
                    }`}>{job.type}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-ink-soft">{job.description}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.department}</span>
                  </div>
                </div>
                <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary" />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-border/60 bg-card p-8 text-center shadow-card">
          <h2 className="font-display text-xl font-bold text-ink">Pas de poste qui vous correspond ?</h2>
          <p className="mt-2 text-sm text-ink-soft">Envoyez-nous votre candidature spontanée, nous la garderons en vue.</p>
          <Link to="/contact" className="mt-4 inline-flex rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow">Envoyer ma candidature</Link>
        </div>
      </div>
    </main>
  )
}
