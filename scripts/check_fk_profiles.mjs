import pg from "pg"
const pool = new pg.Pool({host:"aws-0-eu-central-1.pooler.supabase.com",port:6543,user:"postgres.eerfjupbfrmiwijablqi",password:"Emmanuelle@1724_",database:"postgres",ssl:{rejectUnauthorized:false}})

const r = await pool.query(`
  SELECT conname, conrelid::regclass AS table_name, confrelid::regclass AS foreign_table,
         pg_get_constraintdef(oid) AS def
  FROM pg_constraint
  WHERE contype = 'f'
    AND (conrelid::regclass::text = 'profiles' OR confrelid::regclass::text = 'profiles')
`)
console.log('Foreign keys involving profiles:')
r.rows.forEach(fk => console.log(' ', fk.conname, '|', fk.table_name, '->', fk.foreign_table, '|', fk.def?.substring(0,100)))

await pool.end()
