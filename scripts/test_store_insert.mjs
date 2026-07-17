// Test store insert as admin via Supabase REST API (simulating frontend)
const headers = {
  "apikey": "sb_publishable_2ozZiLj1qz4DgI91-M4mVQ_cglWOEq_",
  "Authorization": "Bearer sb_publishable_2ozZiLj1qz4DgI91-M4mVQ_cglWOEq_",
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Prefer": "return=minimal"
}

const body = {
  user_id: "adb7aa04-2589-4e95-9b1a-5b0ae2ef2184",
  name: "Test Store from API",
  category: "mode",
  status: "active",
  verified: true
}

const r = await fetch("https://eerfjupbfrmiwijablqi.supabase.co/rest/v1/stores", {
  method: "POST",
  headers,
  body: JSON.stringify(body)
})

console.log("Status:", r.status)
const text = await r.text()
console.log("Body:", text.substring(0, 500))
