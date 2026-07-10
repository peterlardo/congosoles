import pg from "pg"
const pool = new pg.Pool({host:"aws-0-eu-central-1.pooler.supabase.com",port:6543,user:"postgres.eerfjupbfrmiwijablqi",password:"Emmanuelle@1724_",database:"postgres",ssl:{rejectUnauthorized:false}})

const r = await pool.query(`
  SELECT conname, pg_get_constraintdef(oid) AS def
  FROM pg_constraint
  WHERE contype = 'f' AND conrelid::regclass::text = 'messages'
`)
console.log('messages FKs:')
r.rows.forEach(fk => console.log(' ', fk.conname, '->', fk.def))

// Also test the messages join from the API
const supabaseUrl = "https://eerfjupbfrmiwijablqi.supabase.co"
const anonKey = "sb_publishable_2ozZiLj1qz4DgI91-M4mVQ_cglWOEq_"
const headers = { "apikey": anonKey, "Authorization": `Bearer ${anonKey}`, "Accept": "application/json" }
const r2 = await fetch(`${supabaseUrl}/rest/v1/messages?select=id,subject,sender:profiles!messages_sender_id_fkey(name),receiver:profiles!messages_receiver_id_fkey(name)&limit=3`, { headers })
const text2 = await r2.text()
console.log('\nAPI test:', r2.status, text2.substring(0,300))

await pool.end()
