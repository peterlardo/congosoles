import pg from "pg"
const pool = new pg.Pool({host:"aws-0-eu-central-1.pooler.supabase.com",port:6543,user:"postgres.eerfjupbfrmiwijablqi",password:"Emmanuelle@1724_",database:"postgres",ssl:{rejectUnauthorized:false}})

const r = await pool.query("SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'stores' AND indexdef LIKE '%UNIQUE%'")
console.log('Unique indexes on stores:')
r.rows.forEach(i => console.log(' ', i.indexname, i.indexdef))

// Also check the INSERT policy definition
const r2 = await pool.query("SELECT pg_get_expr(p.polqual, p.polrelid) AS with_check, pg_get_expr(p.polwithcheck, p.polrelid) AS with_check2 FROM pg_policy p JOIN pg_class c ON p.polrelid = c.oid WHERE c.relname = 'stores' AND p.polname = 'Users can insert own store'")
console.log('\nInsert policy details:')
console.log(' with_check:', r2.rows[0]?.with_check)
console.log(' with_check2:', r2.rows[0]?.with_check2)

await pool.end()
