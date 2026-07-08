import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowRight } from "lucide-react"

export function TopOffer() {
  return (
    <section className="bg-gradient-to-r from-red-600 via-red-500 to-amber-500 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
              <div className="text-white font-bold text-lg">−40%</div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Badge variant="flash" className="text-[10px]">Top offre du jour</Badge>
              </div>
              <h3 className="text-white font-semibold text-lg">Poulet braisé + attiéké + boisson</h3>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <span className="line-through">6 500 FCFA</span>
                <span className="text-white font-bold">3 900 FCFA</span>
              </div>
            </div>
          </div>
          <Button variant="secondary" className="bg-white text-red-600 hover:bg-gray-100 gap-2">
            Explorer <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
