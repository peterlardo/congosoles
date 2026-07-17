import pg from "pg"
const pool = new pg.Pool({host:"aws-0-eu-central-1.pooler.supabase.com",port:6543,user:"postgres.eerfjupbfrmiwijablqi",password:"Emmanuelle@1724_",database:"postgres",ssl:{rejectUnauthorized:false}})

// Full policy definitions for stores
const r = await pool.query(`
  SELECT p.polname, p.polcmd,
    pg_get_expr(p.polqual, p.polrelid) AS using_expr,
    pg_get_expr(p.polwithcheck, p.polrelid) AS withcheck_expr
  FROM pg_policy p
  JOIN pg_class c ON p.polrelid = c.oid
  WHERE c.relname = 'stores'
`)
console.log('Full store policies:')
r.rows.forEach(p => console.log('  policy:', p.polname, 'cmd:', p.polcmd, 'using:', p.using_expr, 'with check:', p.withcheck_expr))

// Also check if the merchant user exists
const r2 = await pool.query("SELECT id, email, role FROM public.profiles WHERE role = 'vendor' LIMIT 1")
console.log('\nSample vendor:', r2.rows[0]?.id?.substring(0,12), r2.rows[0]?.email, r2.rows[0]?.role)

await pool.end()
