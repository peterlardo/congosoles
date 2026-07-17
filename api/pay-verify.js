const FLW_BASE = "https://api.flutterwave.com/v3"

const isDemo = (key) => {
  if (!key) return true
  const trimmed = key.trim().toLowerCase()
  return trimmed === "" || trimmed === "skip" || trimmed === "demo" || trimmed === "test"
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") return res.status(200).end()

  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY

  if (isDemo(secretKey)) {
    const { transaction_id } = req.query
    return res.status(200).json({
      status: "success",
      message: "Démo - Paiement simulé",
      data: {
        id: transaction_id || "demo_123",
        status: "successful",
        amount: 0,
        currency: "XAF",
      },
    })
  }

  try {
    const { tx_ref, transaction_id } = req.query

    if (transaction_id) {
      const response = await fetch(`${FLW_BASE}/transactions/${transaction_id}/verify`, {
        headers: { Authorization: `Bearer ${secretKey.trim()}` },
      })
      const data = await response.json()
      return res.status(200).json(data)
    }

    if (tx_ref) {
      const response = await fetch(`${FLW_BASE}/transactions/by_reference?tx_ref=${tx_ref}`, {
        headers: { Authorization: `Bearer ${secretKey.trim()}` },
      })
      const data = await response.json()
      return res.status(200).json(data)
    }

    res.status(400).json({ error: "Missing tx_ref or transaction_id" })
  } catch (err) {
    console.error("Verification error:", err)
    res.status(500).json({ error: "Erreur interne du serveur" })
  }
}
