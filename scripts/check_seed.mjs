import pg from 'pg';
const pool = new pg.Pool({
  host: 'aws-0-eu-central-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.eerfjupbfrmiwijablqi',
  password: 'Emmanuelle@1724_',
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
});
const res = await pool.query("SELECT (SELECT count(*) FROM stores) as stores, (SELECT count(*) FROM promotions) as promos, (SELECT count(*) FROM categories) as cats");
console.log(res.rows[0]);
await pool.end();
