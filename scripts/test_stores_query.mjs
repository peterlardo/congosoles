const supabaseUrl = "https://eerfjupbfrmiwijablqi.supabase.co"
const anonKey = "sb_publishable_2ozZiLj1qz4DgI91-M4mVQ_cglWOEq_"

async function test() {
  const headers = { "apikey": anonKey, "Authorization": `Bearer ${anonKey}`, "Accept": "application/json" }
  
  // Test stores select (should work - public policy)
  const r1 = await fetch(`${supabaseUrl}/rest/v1/stores?select=id,name,user_id&limit=5`, { headers })
  const data1 = await r1.json()
  console.log("Stores count:", data1.length)
  data1.forEach(s => console.log(" ", s.name, "user:", s.user_id?.substring(0,12)))
  
  // Test profiles select (anon - should only see own profile... but we have no auth)
  const r2 = await fetch(`${supabaseUrl}/rest/v1/profiles?select=id,email&limit=5`, { headers })
  const text2 = await r2.text()
  console.log("\nProfiles status:", r2.status, "body:", text2.substring(0,100))
}
test().catch(console.error)
