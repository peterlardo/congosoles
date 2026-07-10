// Test the Supabase join by making direct HTTP calls to PostgREST

const supabaseUrl = "https://eerfjupbfrmiwijablqi.supabase.co"
const anonKey = "sb_publishable_2ozZiLj1qz4DgI91-M4mVQ_cglWOEq_"

async function test() {
  const headers = {
    "apikey": anonKey,
    "Authorization": `Bearer ${anonKey}`,
    "Accept": "application/json"
  }

  // Test 1: simple promotions query (no joins)
  const r1 = await fetch(`${supabaseUrl}/rest/v1/promotions?select=id,title,status&limit=3`, { headers })
  console.log("Test 1 - simple query:", r1.status, JSON.stringify(await r1.json()).substring(0,100))

  // Test 2: with stores join
  const r2 = await fetch(`${supabaseUrl}/rest/v1/promotions?select=id,title,stores!promotions_store_id_fkey(name,slug)&limit=3`, { headers })
  console.log("Test 2 - with stores join:", r2.status, JSON.stringify(await r2.json()).substring(0,100))

  // Test 3: with profiles join (the problematic one)
  const r3 = await fetch(`${supabaseUrl}/rest/v1/promotions?select=id,title,profiles!promotions_user_id_fkey(email)&limit=3`, { headers })
  console.log("Test 3 - profiles join status:", r3.status)
  const text3 = await r3.text()
  console.log("  body:", text3.substring(0,200))

  // Test 4: stores with profiles join (the stores version)
  const r4 = await fetch(`${supabaseUrl}/rest/v1/stores?select=id,name,profiles!stores_user_id_fkey(email,name)&limit=3`, { headers })
  console.log("Test 4 - stores+profiles join status:", r4.status)
  const text4 = await r4.text()
  console.log("  body:", text4.substring(0,200))
}

test().catch(console.error)
