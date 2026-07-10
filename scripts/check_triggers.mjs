import pg from "pg"
const pool = new pg.Pool({host:"aws-0-eu-central-1.pooler.supabase.com",port:6543,user:"postgres.eerfjupbfrmiwijablqi",password:"Emmanuelle@1724_",database:"postgres",ssl:{rejectUnauthorized:false}})

const r = await pool.query("SELECT trigger_name, action_timing, event_manipulation FROM information_schema.triggers WHERE event_object_schema = 'public' AND event_object_table = 'stores'")
console.log('Triggers on stores:', r.rows.length || 'none')
r.rows.forEach(t => console.log(' ', t.trigger_name, t.action_timing, t.event_manipulation))

await pool.end()
