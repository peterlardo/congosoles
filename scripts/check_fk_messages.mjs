import pg from "pg"
const pool = new pg.Pool({host:"aws-0-eu-central-1.pooler.supabase.com",port:6543,user:"postgres.eerfjupbfrmiwijablqi",password:"Emmanuelle@1724_",database:"postgres",ssl:{rejectUnauthorized:false}})

const r = await pool.query(`
  SELECT conname, pg_get_constraintdef(oid) AS def
  FROM pg_constraint
  WHERE contype = 'f' AND conrelid::regclass::text = 'ticket_messages'
`)
console.log('ticket_messages FKs:')
r.rows.forEach(fk => console.log(' ', fk.conname, '->', fk.def))

await pool.end()
