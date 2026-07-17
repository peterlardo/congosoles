import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

interface InvoiceData {
  store_name: string
  owner_name: string
  owner_email: string
  plan: string
  plan_name: string
  price: number
  payment_method: string
  payment_phone: string
  created_at: string
}

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
const LOGO_URL = "https://congosoles.vercel.app/assets/logo.png"

const PAYMENT_LABELS: Record<string, string> = {
  mtn: "MTN Mobile Money",
  airtel: "Airtel Money",
}

const PLAN_COLORS: Record<string, string> = {
  pro: "#6366f1",
  "sur-devis": "#f59e0b",
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 })
  }

  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), { status: 500 })
  }

  try {
    const data: InvoiceData = await req.json()
    const resend = new Resend(RESEND_API_KEY)

    const invoiceNum = "INV-" + Date.now().toString(36).toUpperCase()
    const invoiceDate = new Date(data.created_at).toLocaleDateString("fr-FR", {
      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    })
    const accentColor = PLAN_COLORS[data.plan] || "#6366f1"
    const priceFormatted = data.price > 0
      ? data.price.toLocaleString("fr-FR") + " FCFA / mois"
      : "Sur devis"

    const { error } = await resend.emails.send({
      from: "Congo Soldes <factures@congosoldes.cg>",
      to: [data.owner_email],
      subject: `Votre facture Congo Soldes - ${data.plan_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, ${accentColor}, #1e1b4b); padding: 32px 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <img src="${LOGO_URL}" alt="Congo Soldes" style="height: 60px; width: auto; margin-bottom: 16px; filter: brightness(0) invert(1);" />
            <h1 style="color: white; margin: 0; font-size: 22px;">FACTURE</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 13px;">${invoiceNum}</p>
          </div>

          <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 24px;">
              <div>
                <p style="font-size: 14px; font-weight: bold; color: #111827; margin: 0;">Congo Soldes</p>
                <p style="font-size: 12px; color: #6b7280; margin: 2px 0;">Brazzaville, Congo</p>
                <p style="font-size: 12px; color: #6b7280; margin: 2px 0;">contact@congosoldes.cg</p>
              </div>
              <div style="text-align: right;">
                <p style="font-size: 13px; color: #374151; margin: 0;">Date : ${invoiceDate}</p>
                <p style="font-size: 13px; color: #374151; margin: 4px 0 0;">N° Facture : ${invoiceNum}</p>
              </div>
            </div>

            <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <p style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin: 0 0 8px;">Client</p>
              <p style="font-size: 14px; font-weight: 600; color: #111827; margin: 0;">${data.owner_name}</p>
              <p style="font-size: 13px; color: #6b7280; margin: 2px 0;">${data.owner_email}</p>
              <p style="font-size: 13px; color: #6b7280; margin: 2px 0;">Boutique : ${data.store_name}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="padding: 10px 12px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Description</th>
                  <th style="padding: 10px 12px; text-align: center; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Quantité</th>
                  <th style="padding: 10px 12px; text-align: right; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Montant</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 12px; font-size: 14px; color: #111827;">
                    <strong>Abonnement ${data.plan_name}</strong>
                    <p style="margin: 2px 0 0; font-size: 12px; color: #6b7280;">Boutique "${data.store_name}" sur Congo Soldes</p>
                  </td>
                  <td style="padding: 12px; text-align: center; font-size: 14px; color: #111827;">1</td>
                  <td style="padding: 12px; text-align: right; font-size: 14px; font-weight: bold; color: #111827;">
                    ${data.price > 0 ? data.price.toLocaleString("fr-FR") + " FCFA" : "Sur devis"}
                  </td>
                </tr>
                ${data.price > 0 ? `
                <tr>
                  <td style="padding: 12px; font-size: 14px; color: #6b7280;">TVA (0%)</td>
                  <td style="padding: 12px; text-align: center; font-size: 14px; color: #6b7280;">—</td>
                  <td style="padding: 12px; text-align: right; font-size: 14px; color: #6b7280;">0 FCFA</td>
                </tr>
                ` : ""}
              </tbody>
            </table>

            ${data.price > 0 ? `
            <div style="background: linear-gradient(135deg, ${accentColor}, #1e1b4b); border-radius: 8px; padding: 16px; text-align: right; margin-bottom: 24px;">
              <p style="font-size: 13px; color: rgba(255,255,255,0.8); margin: 0;">Total à payer</p>
              <p style="font-size: 24px; font-weight: bold; color: white; margin: 4px 0 0;">${data.price.toLocaleString("fr-FR")} FCFA</p>
              <p style="font-size: 12px; color: rgba(255,255,255,0.7); margin: 2px 0 0;">Paiement mensuel</p>
            </div>
            ` : `
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;">
              <p style="font-size: 14px; font-weight: bold; color: #92400e; margin: 0;">Offre Sur devis</p>
              <p style="font-size: 13px; color: #b45309; margin: 4px 0 0;">Un devis personnalisé vous sera communiqué sous 48h.</p>
            </div>
            `}

            <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <p style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin: 0 0 8px;">Informations de paiement</p>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #6b7280;">Moyen de paiement</td>
                  <td style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #111827; text-align: right;">${PAYMENT_LABELS[data.payment_method] || data.payment_method}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #6b7280;">Numéro de téléphone</td>
                  <td style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #111827; text-align: right;">${data.payment_phone}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-size: 13px; color: #6b7280;">Statut</td>
                  <td style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #f59e0b; text-align: right;">En attente de validation</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">Congo Soldes - Toutes les promotions au même endroit</p>
              <p style="font-size: 12px; color: #9ca3af; margin: 4px 0 0;">contact@congosoldes.cg | https://congosoles.vercel.app</p>
            </div>
          </div>
        </div>
      `,
    })

    if (error) throw error

    return new Response(JSON.stringify({ success: true, invoice: invoiceNum }), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
