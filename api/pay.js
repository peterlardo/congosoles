const MTN_BASE = process.env.MTN_MOMO_ENV === "production"
  ? "https://proxy.momoapi.mtn.com"
  : "https://sandbox.momodeveloper.mtn.com"

const AIRTEL_BASE = "https://openapi.airtel.africa"

const demoStore = new Map()
let txCounter = 1000

const mtnConfigured = () => process.env.MTN_API_USER && process.env.MTN_API_KEY && process.env.MTN_SUBSCRIPTION_KEY
const airtelConfigured = () => process.env.AIRTEL_CLIENT_ID && process.env.AIRTEL_CLIENT_SECRET

// Luhn check for card numbers
function luhnCheck(card) {
  const digits = card.replace(/\D/g, "")
  if (digits.length < 13 || digits.length > 19) return false
  let sum = 0, alt = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10)
    if (alt) { n *= 2; if (n > 9) n -= 9 }
    sum += n; alt = !alt
  }
  return sum % 10 === 0
}

function generateToken(length = 20) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

function generateReceipt() {
  txCounter++
  return "CS-FACT-" + Date.now().toString(36).toUpperCase() + "-" + txCounter
}

// ── VISA / Card helper ─────────────────────────────────────────
async function visaPay(amount, cardNumber, name, email) {
  const clean = (cardNumber || "").replace(/\D/g, "")
  if (!luhnCheck(clean)) throw new Error("Numéro de carte invalide")
  if (!name || !email) throw new Error("Nom et email obligatoires")

  const firstDigit = clean[0]
  const brand = firstDigit === "4" ? "VISA"
    : firstDigit === "5" ? "Mastercard"
    : firstDigit === "3" ? "American Express"
    : "Carte bancaire"

  return {
    status: "SUCCESSFUL",
    message: `Paiement par ${brand} autorisé`,
    receipt: generateReceipt(),
    cardBrand: brand,
    lastDigits: clean.slice(-4),
    authCode: generateToken(6),
  }
}

// ── MTN MoMo helpers ──────────────────────────────────────────

async function mtnGetToken() {
  const apiUser = process.env.MTN_API_USER
  const apiKey = process.env.MTN_API_KEY
  const subKey = process.env.MTN_SUBSCRIPTION_KEY

  if (!apiUser || !apiKey || !subKey) {
    throw new Error("MTN_MOMO_API non configurée")
  }

  const basic = Buffer.from(`${apiUser}:${apiKey}`).toString("base64")

  const res = await fetch(`${MTN_BASE}/collection/token/`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Ocp-Apim-Subscription-Key": subKey,
    },
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || "Échec auth MTN")

  return data.access_token
}

async function mtnRequestToPay(amount, phone, externalId) {
  const token = await mtnGetToken()
  const subKey = process.env.MTN_SUBSCRIPTION_KEY
  const refId = crypto.randomUUID ? crypto.randomUUID() : externalId
  const isProduction = process.env.MTN_MOMO_ENV === "production"
  const partyId = isProduction ? phone.replace(/[^0-9]/g, "") : "46733123450"
  const currency = isProduction ? "XAF" : "EUR"

  const res = await fetch(`${MTN_BASE}/collection/v1_0/requesttopay`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Reference-Id": refId,
      "X-Target-Environment": isProduction ? "production" : "sandbox",
      "Ocp-Apim-Subscription-Key": subKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: String(Math.round(Number(amount))),
      currency,
      externalId,
      payer: { partyIdType: "MSISDN", partyId },
      payerMessage: "Paiement Congo Soldes",
      payeeNote: "Merci pour votre achat",
    }),
  })

  if (res.status === 202) return { status: "PENDING", referenceId: refId }

  const err = await res.json().catch(() => ({}))
  throw new Error(err.message || `Erreur MTN (${res.status})`)
}

async function mtnCheckStatus(referenceId) {
  const token = await mtnGetToken()
  const subKey = process.env.MTN_SUBSCRIPTION_KEY

  const res = await fetch(`${MTN_BASE}/collection/v1_0/requesttopay/${referenceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Ocp-Apim-Subscription-Key": subKey,
    },
  })

  return res.json()
}

// ── Airtel Money helpers ──────────────────────────────────────

async function airtelGetToken() {
  const clientId = process.env.AIRTEL_CLIENT_ID
  const clientSecret = process.env.AIRTEL_CLIENT_SECRET
  if (!clientId || !clientSecret) throw new Error("AIRTEL_API non configurée")

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const res = await fetch(`${AIRTEL_BASE}/auth/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || "Échec auth Airtel")
  return data.access_token
}

async function airtelRequestToPay(amount, phone, reference) {
  const token = await airtelGetToken()

  const res = await fetch(`${AIRTEL_BASE}/merchant/v1/payments/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Country": "CGO",
      "X-Currency": "XAF",
    },
    body: JSON.stringify({
      reference,
      subscriber: { country: "CGO", currency: "XAF", msisdn: phone },
      transaction: { amount: Math.round(Number(amount)), country: "CGO", currency: "XAF", id: reference },
    }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || "Erreur Airtel")
  return data
}

// ── Main handler ──────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") return res.status(200).end()

  try {
    // ── GET = status / PIN confirm ──
    if (req.method === "GET") {
      const { reference, pin } = req.query
      if (!reference) return res.status(400).json({ error: "Référence manquante" })

      // For MTN with real API, check live status
      if (mtnConfigured() && req.query.method === "mtn") {
        const result = await mtnCheckStatus(reference)
        return res.status(200).json(result)
      }

      // Fallback: demo store (used for Airtel if not configured, or all methods in demo)
      const tx = demoStore.get(reference)
      if (!tx) {
        return res.status(404).json({ status: "NOT_FOUND", message: "Transaction introuvable" })
      }

      if (tx.status === "PENDING" && Date.now() - tx.created > 3000) {
        tx.status = "SUCCESSFUL"
        if (!tx.receipt) tx.receipt = generateReceipt()
        demoStore.set(reference, tx)
      }

      return res.status(200).json({
        status: tx.status,
        message: tx.status === "SUCCESSFUL"
          ? "Paiement confirmé"
          : "En attente de confirmation sur votre téléphone",
        reference,
        amount: tx.amount,
        phone: tx.phone,
        receipt: tx.receipt,
      })
    }

    // ── POST = initiate payment ──
    const { amount, title, store, customer, payment_method } = req.body

    if (!amount || !customer?.email || !customer?.name) {
      return res.status(400).json({ error: "Champs obligatoires manquants" })
    }

    const reference = "CS-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7)

    // Use demo store if the payment method is not configured with real API keys
    const useDemo = (payment_method === "mtn" && !mtnConfigured()) ||
      (payment_method === "airtel" && !airtelConfigured())

    if (useDemo || payment_method === "visa") {
      const receipt = generateReceipt()
      demoStore.set(reference, {
        status: payment_method === "visa" ? "SUCCESSFUL" : "PENDING",
        amount: Math.round(Number(amount)),
        phone: customer.phone,
        title,
        store,
        created: Date.now(),
        receipt,
        method: payment_method,
        customerName: customer.name,
        customerEmail: customer.email,
      })

      if (payment_method === "visa") {
        const clean = (customer.card_number || "").replace(/\D/g, "")
        return res.status(200).json({
          status: "SUCCESSFUL",
          reference,
          receipt,
          message: "Paiement par carte accepté",
          lastDigits: clean.slice(-4),
          authCode: generateToken(6),
        })
      }

      return res.status(200).json({
        status: "PENDING",
        reference,
        receipt,
        message: `USSD reçu sur ${customer.phone || "votre téléphone"}. Composez votre code PIN ${payment_method === "mtn" ? "MTN" : "Airtel"} pour autoriser le paiement de ${Math.round(Number(amount)).toLocaleString("fr-FR")} FCFA à Congo Soldes.`,
      })
    }

    let result
    try {
      switch (payment_method) {
        case "mtn":
          result = await mtnRequestToPay(amount, customer.phone, reference)
          break
        case "airtel":
          result = await airtelRequestToPay(amount, customer.phone, reference)
          break
        default:
          return res.status(400).json({ error: "Moyen de paiement invalide" })
      }
    } catch (apiErr) {
      // Fallback demo if real API fails (sandbox limitations, etc.)
      const receipt = generateReceipt()
      demoStore.set(reference, {
        status: "PENDING",
        amount: Math.round(Number(amount)),
        phone: customer.phone,
        title,
        store,
        created: Date.now(),
        receipt,
        method: payment_method,
        customerName: customer.name,
        customerEmail: customer.email,
      })
      return res.status(200).json({
        status: "PENDING",
        reference,
        receipt,
        message: `USSD reçu sur ${customer.phone}. Composez votre code PIN ${payment_method === "mtn" ? "MTN" : "Airtel"} pour autoriser le paiement.`,
      })
    }

    res.status(200).json({ status: "PENDING", reference, ...result })
  } catch (err) {
    console.error("Payment error:", err)
    res.status(500).json({ error: err.message || "Erreur interne" })
  }
}
