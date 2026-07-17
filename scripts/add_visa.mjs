import pg from 'pg';
const pool = new pg.Pool({
  host: 'aws-0-eu-central-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.eerfjupbfrmiwijablqi',
  password: 'Emmanuelle@1724_',
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
});

// Add visa to promos that don't have it, making ~66% have visa
const res = await pool.query(`
  UPDATE promotions
  SET payment_methods = payment_methods || '["visa"]'::jsonb
  WHERE NOT (payment_methods ? 'visa')
  AND id IN (
    SELECT id FROM promotions ORDER BY random() LIMIT (SELECT count(*)/2 FROM promotions WHERE NOT (payment_methods ? 'visa'))
  )
`);
console.log(`Updated ${res.rowCount} promos to add VISA`);

const check = await pool.query(`
  SELECT
    count(*) FILTER (WHERE payment_methods ? 'visa') as with_visa,
    count(*) FILTER (WHERE payment_methods ? 'mtn') as with_mtn,
    count(*) FILTER (WHERE payment_methods ? 'airtel') as with_airtel
  FROM promotions
`);
console.log(check.rows[0]);

await pool.end();
