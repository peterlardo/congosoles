import pg from "pg"
const pool = new pg.Pool({host:"aws-0-eu-central-1.pooler.supabase.com",port:6543,user:"postgres.eerfjupbfrmiwijablqi",password:"Emmanuelle@1724_",database:"postgres",ssl:{rejectUnauthorized:false}})

// Check FKs for reports, support_tickets, activity_logs, contracts
for (const table of ["reports", "support_tickets", "activity_logs", "contracts"]) {
  const r = await pool.query(`
    SELECT conname, pg_get_constraintdef(oid) AS def
    FROM pg_constraint
    WHERE contype = 'f' AND conrelid::regclass::text = $1
  `, [table])
  console.log(`${table}:`)
  r.rows.forEach(fk => console.log(' ', fk.conname, '->', fk.def))
}

await pool.end()
