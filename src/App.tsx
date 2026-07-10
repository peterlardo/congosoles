import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import Home from "@/pages/Home"
import Promos from "@/pages/Promos"
import Boutiques from "@/pages/Boutiques"
import Dashboard from "@/pages/Dashboard"
import Category from "@/pages/Category"
import PromoDetail from "@/pages/PromoDetail"
import StoreDetail from "@/pages/StoreDetail"
import About from "@/pages/About"
import Blog from "@/pages/Blog"
import Contact from "@/pages/Contact"
import Privacy from "@/pages/Privacy"
import CGU from "@/pages/CGU"
import Legal from "@/pages/Legal"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/promos" element={<Promos />} />
          <Route path="/boutiques" element={<Boutiques />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categorie/:slug" element={<Category />} />
          <Route path="/promo/:id" element={<PromoDetail />} />
          <Route path="/boutique/:name" element={<StoreDetail />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/confidentialite" element={<Privacy />} />
          <Route path="/cgu" element={<CGU />} />
          <Route path="/mentions-legales" element={<Legal />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
