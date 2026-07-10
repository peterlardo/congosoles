import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import ProtectedRoute from "@/components/ProtectedRoute"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import Home from "@/pages/Home"
import Promos from "@/pages/Promos"
import Boutiques from "@/pages/Boutiques"
import Login from "@/pages/Login"
import Signup from "@/pages/Signup"
import DashboardOverview from "@/pages/dashboard/Overview"
import DashboardPromotions from "@/pages/dashboard/Promotions"
import DashboardBoutique from "@/pages/dashboard/Boutique"
import DashboardParametres from "@/pages/dashboard/Parametres"
import Category from "@/pages/Category"
import PromoDetail from "@/pages/PromoDetail"
import StoreDetail from "@/pages/StoreDetail"
import About from "@/pages/About"
import Blog from "@/pages/Blog"
import Contact from "@/pages/Contact"
import Privacy from "@/pages/Privacy"
import CGU from "@/pages/CGU"
import Legal from "@/pages/Legal"
import Presse from "@/pages/Presse"
import Recrutement from "@/pages/Recrutement"
import Tarifs from "@/pages/Tarifs"
import GuideVendeur from "@/pages/GuideVendeur"
import Publicite from "@/pages/Publicite"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Routes>
            {/* Auth pages - no header/footer */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Dashboard - no header/footer, custom layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardOverview />} />
              <Route path="promotions" element={<DashboardPromotions />} />
              <Route path="boutique" element={<DashboardBoutique />} />
              <Route path="parametres" element={<DashboardParametres />} />
            </Route>

            {/* Public pages - with header/footer */}
            <Route
              path="*"
              element={
                <>
                  <Header />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/promos" element={<Promos />} />
                    <Route path="/boutiques" element={<Boutiques />} />
                    <Route path="/categorie/:slug" element={<Category />} />
                    <Route path="/promo/:id" element={<PromoDetail />} />
                    <Route path="/boutique/:name" element={<StoreDetail />} />
                    <Route path="/a-propos" element={<About />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/confidentialite" element={<Privacy />} />
                    <Route path="/cgu" element={<CGU />} />
                    <Route path="/mentions-legales" element={<Legal />} />
                    <Route path="/presse" element={<Presse />} />
                    <Route path="/recrutement" element={<Recrutement />} />
                    <Route path="/tarifs" element={<Tarifs />} />
                    <Route path="/guide-vendeur" element={<GuideVendeur />} />
                    <Route path="/publicite" element={<Publicite />} />
                  </Routes>
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
