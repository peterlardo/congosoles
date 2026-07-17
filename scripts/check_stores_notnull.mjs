import pg from "pg"
const pool = new pg.Pool({host:"aws-0-eu-central-1.pooler.supabase.com",port:6543,user:"postgres.eerfjupbfrmiwijablqi",password:"Emmanuelle@1724_",database:"postgres",ssl:{rejectUnauthorized:false}})

const r = await pool.query("SELECT column_name, is_nullable, column_default FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'stores' AND column_name IN ('slug', 'name', 'status', 'user_id') ORDER BY ordinal_position")
r.rows.forEach(c => console.log(c.column_name, 'nullable:', c.is_nullable, 'default:', c.column_default))

await pool.end()
