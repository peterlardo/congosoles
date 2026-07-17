import pg from 'pg';
const pool = new pg.Pool({
  host: 'aws-0-eu-central-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.eerfjupbfrmiwijablqi',
  password: 'Emmanuelle@1724_',
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
});
const res = await pool.query("SELECT id, title, payment_methods FROM promotions WHERE payment_methods IS NOT NULL LIMIT 5");
console.log("Sample payment_methods from DB:");
for (const row of res.rows) {
  console.log(`  id=${row.id}: ${JSON.stringify(row.payment_methods)}`);
}
const nulls = await pool.query("SELECT count(*) FROM promotions WHERE payment_methods IS NULL OR payment_methods = '[]'::jsonb");
console.log(`Promotions with null/empty payment_methods: ${nulls.rows[0].count}`);
const all = await pool.query("SELECT id, payment_methods FROM promotions");
console.log(`Total promotions: ${all.rows.length}`);
await pool.end();
