import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

interface StoreData {
  id: string
  name: string
  owner_name: string
  owner_email: string
  category: string
  created_at: string
}

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
const ADMIN_EMAIL = "fred.bialard@gmail.com"

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 })
  }

  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), { status: 500 })
  }

  try {
    const store: StoreData = await req.json()
    const resend = new Resend(RESEND_API_KEY)

    const storeUrl = `https://congosoles.vercel.app/dashboard/admin/stores-pending`
    const createdDate = new Date(store.created_at).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    const { error } = await resend.emails.send({
      from: "Congo Soldes <notifications@congosoldes.cg>",
      to: [ADMIN_EMAIL],
      subject: `Nouvelle boutique à valider : ${store.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Nouvelle boutique à valider</h1>
          </div>
          <div style="padding: 24px; background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="color: #374151; font-size: 16px;">Une nouvelle boutique a été créée et attend votre validation.</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Boutique</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #111827;">${store.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Catégorie</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #111827;">${store.category || "Non spécifiée"}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Propriétaire</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #111827;">${store.owner_name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Email</td>
                <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; color: #111827;">${store.owner_email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; color: #6b7280;">Date</td>
                <td style="padding: 8px; color: #111827;">${createdDate}</td>
              </tr>
            </table>
            <div style="margin-top: 24px; text-align: center;">
              <a href="${storeUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; padding: 12px 32px; border-radius: 9999px; font-weight: bold; font-size: 14px;">Valider la boutique</a>
            </div>
          </div>
        </div>
      `,
    })

    if (error) throw error

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
