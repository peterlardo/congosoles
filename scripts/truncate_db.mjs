import pg from 'pg'

const PROJECT_REF = 'eerfjupbfrmiwijablqi'
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`

async function main() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    console.error('Usage: set SUPABASE_SERVICE_ROLE_KEY env var')
    console.error('Get it from: https://supabase.com/dashboard/project/' + PROJECT_REF + '/settings/api')
    process.exit(1)
  }

  const pool = new pg.Pool({
    host: `db.${PROJECT_REF}.supabase.co`,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: serviceRoleKey,
    ssl: { rejectUnauthorized: false },
  })

  const client = await pool.connect()
  try {
    console.log('Connected. Truncating tables...')

    await client.query('ALTER TABLE public.promo_clicks DISABLE ROW LEVEL SECURITY')
    await client.query('ALTER TABLE public.promotions DISABLE ROW LEVEL SECURITY')
    await client.query('ALTER TABLE public.stores DISABLE ROW LEVEL SECURITY')
    await client.query('ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY')

    await client.query('TRUNCATE TABLE public.promo_clicks CASCADE')
    await client.query('TRUNCATE TABLE public.promotions CASCADE')
    await client.query('TRUNCATE TABLE public.stores CASCADE')
    await client.query('TRUNCATE TABLE public.profiles CASCADE')

    await client.query('ALTER TABLE public.promo_clicks ENABLE ROW LEVEL SECURITY')
    await client.query('ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY')
    await client.query('ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY')
    await client.query('ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY')

    const { rows } = await client.query(`
      SELECT 'promo_clicks' as t, count(*) as c FROM public.promo_clicks UNION ALL
      SELECT 'promotions', count(*) FROM public.promotions UNION ALL
      SELECT 'stores', count(*) FROM public.stores UNION ALL
      SELECT 'profiles', count(*) FROM public.profiles
    `)
    console.log('All tables truncated. Verification:')
    for (const r of rows) console.log(`  ${r.t}: ${r.c} rows`)
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
