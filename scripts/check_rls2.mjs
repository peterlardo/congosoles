import pg from "pg"

const pool = new pg.Pool({host:"aws-0-eu-central-1.pooler.supabase.com",port:6543,user:"postgres.eerfjupbfrmiwijablqi",password:"Emmanuelle@1724_",database:"postgres",ssl:{rejectUnauthorized:false}})

const r1 = await pool.query("SELECT proname, prosrc FROM pg_proc WHERE proname IN ('is_admin', 'is_vendor', 'is_owner_or_admin') ORDER BY proname")
console.log('Functions:')
r1.rows.forEach(r => console.log(' ', r.proname, '->', r.prosrc?.substring(0,200)))

// Check what user_id values are in promotions
const r2 = await pool.query("SELECT user_id, count(1) FROM public.promotions GROUP BY user_id ORDER BY count DESC")
console.log('\nuser_id distribution in promotions:')
r2.rows.forEach(r => console.log(' ', r.user_id?.substring(0,20), ':', r.count))

// Check the is_admin() function works
const r3 = await pool.query("SELECT public.is_admin() as is_admin")
console.log('\nis_admin() from direct SQL (no auth context):', r3.rows[0]?.is_admin)

// Check admin's profile
const r4 = await pool.query("SELECT id, email, name, role FROM public.profiles WHERE email = 'admin@congosoldes.cg'")
console.log('\nAdmin profile:', r4.rows[0])

await pool.end()
