import pg from "pg"

const pool = new pg.Pool({host:"aws-0-eu-central-1.pooler.supabase.com",port:6543,user:"postgres.eerfjupbfrmiwijablqi",password:"Emmanuelle@1724_",database:"postgres",ssl:{rejectUnauthorized:false}})

const r1 = await pool.query("SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual FROM pg_policies WHERE tablename = 'promotions'")
console.log('RLS policies for promotions:')
r1.rows.forEach(r => console.log(' ', r.policyname, '| cmd:', r.cmd, '| using:', r.qual?.substring(0,120)))

const r2 = await pool.query("SELECT id, email, role FROM public.profiles WHERE email = 'admin@congosoldes.cg'")
console.log('\nAdmin profile:', r2.rows[0]?.id, r2.rows[0]?.role)

const r3 = await pool.query("SELECT count(1) FROM public.promotions")
console.log('Total promos in DB:', r3.rows[0].count)

const r4 = await pool.query("SELECT count(1) FROM public.stores")
console.log('Total stores in DB:', r4.rows[0].count)

// Simulate what the admin frontend query does
const r5 = await pool.query(`
  SELECT p.id, p.title, p.status, s.name as store_name
  FROM public.promotions p
  LEFT JOIN public.stores s ON s.id = p.store_id
  ORDER BY p.created_at DESC
  LIMIT 5
`)
console.log('\nFirst 5 promotions (like admin query):')
r5.rows.forEach(r => console.log(' ', r.id?.substring(0,8), r.title?.substring(0,30), r.status, '| store:', r.store_name))

await pool.end()
