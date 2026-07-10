import pg from "pg"
const pool = new pg.Pool({host:"aws-0-eu-central-1.pooler.supabase.com",port:6543,user:"postgres.eerfjupbfrmiwijablqi",password:"Emmanuelle@1724_",database:"postgres",ssl:{rejectUnauthorized:false}})

// Check RLS policies on all relevant tables
for (const table of ["promotions", "stores", "profiles"]) {
  const r = await pool.query(
    "SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual FROM pg_policies WHERE tablename = $1",
    [table]
  )
  console.log(`\nRLS policies for ${table}:`)
  r.rows.forEach(p => console.log(' ', p.policyname, '| cmd:', p.cmd, '| using:', p.qual?.substring(0,150)))
}

// Also check if RLS is enabled on each table
const r2 = await pool.query(`
  SELECT relname, relrowsecurity
  FROM pg_class
  WHERE relname IN ('promotions', 'stores', 'profiles')
    AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
`)
console.log('\nRLS enabled:')
r2.rows.forEach(r => console.log(' ', r.relname, '->', r.relrowsecurity ? 'YES' : 'NO'))

await pool.end()
