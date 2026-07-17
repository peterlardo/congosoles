const BASE = "https://sandbox.momodeveloper.mtn.com"
const SUB_KEY = "4c91dae7a6f1474387a23a1f3d448eb7"
const API_USER = "c72025f5-5cd1-4630-99e4-8ba4722fad56"

async function main() {
  // 1. Create API User
  console.log("1. Creating API User...")
  const createRes = await fetch(`${BASE}/v1_0/apiuser`, {
    method: "POST",
    headers: {
      "X-Reference-Id": API_USER,
      "Ocp-Apim-Subscription-Key": SUB_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ providerCallbackHost: "congosoles.vercel.app" }),
  })
  console.log(`   Status: ${createRes.status}`)

  // 2. Generate API Key
  console.log("2. Generating API Key...")
  const keyRes = await fetch(`${BASE}/v1_0/apiuser/${API_USER}/apikey`, {
    method: "POST",
    headers: { "Ocp-Apim-Subscription-Key": SUB_KEY },
  })
  const keyData = await keyRes.json()
  console.log(`   Status: ${keyRes.status}`)
  console.log(`   API Key: ${JSON.stringify(keyData)}`)

  if (!keyData.apiKey) {
    console.log("   Failed to get API Key, trying to fetch user details...")
    const userRes = await fetch(`${BASE}/v1_0/apiuser/${API_USER}`, {
      headers: { "Ocp-Apim-Subscription-Key": SUB_KEY },
    })
    console.log(`   User status: ${userRes.status}`)
    console.log(`   User data: ${JSON.stringify(await userRes.json())}`)
    return
  }

  const API_KEY = keyData.apiKey

  // 3. Get Access Token
  console.log("3. Getting Access Token...")
  const basic = Buffer.from(`${API_USER}:${API_KEY}`).toString("base64")
  const tokenRes = await fetch(`${BASE}/collection/token/`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Ocp-Apim-Subscription-Key": SUB_KEY,
    },
  })
  const tokenData = await tokenRes.json()
  console.log(`   Status: ${tokenRes.status}`)
  console.log(`   Token: ${tokenData.access_token ? "✓ obtained" : "✗ failed"}`)

  if (!tokenData.access_token) {
    console.log(`   Error: ${JSON.stringify(tokenData)}`)
    return
  }

  // 4. Test RequestToPay
  console.log("4. Testing RequestToPay...")
  const refId = crypto.randomUUID()
  const rtpRes = await fetch(`${BASE}/collection/v1_0/requesttopay`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "X-Reference-Id": refId,
      "X-Target-Environment": "sandbox",
      "Ocp-Apim-Subscription-Key": SUB_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: "100",
      currency: "EUR",
      externalId: "test-" + Date.now(),
      payer: { partyIdType: "MSISDN", partyId: "46733123450" },
      payerMessage: "Test paiement Congo Soldes",
      payeeNote: "Merci",
    }),
  })
  console.log(`   Status: ${rtpRes.status}`)
  console.log(`   Result: ${rtpRes.status === 202 ? "✓ RequestToPay accepted" : "✗ failed"}`)

  if (rtpRes.status !== 202) {
    const err = await rtpRes.json().catch(() => ({}))
    console.log(`   Error: ${JSON.stringify(err)}`)
  }

  console.log("\n--- KEYS TO ADD TO VERCEL ---")
  console.log(`MTN_API_USER=${API_USER}`)
  console.log(`MTN_API_KEY=${API_KEY}`)
  console.log(`MTN_SUBSCRIPTION_KEY=${SUB_KEY}`)
}

main().catch(console.error)
