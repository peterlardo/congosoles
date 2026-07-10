import pg from "pg"
const { Client } = pg

const client = new Client({
  connectionString: "postgresql://postgres.eerfjupbfrmiwijablqi:Emmanuelle%401724_@aws-0-eu-central-1.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
})

await client.connect()
try {
  await client.query("ALTER TABLE public.promotions ADD COLUMN IF NOT EXISTS payment_methods JSONB DEFAULT '[\"mtn\",\"airtel\"]'::jsonb")
  console.log("Migration applied: payment_methods column added")
} catch (e) {
  console.error("Error:", e.message)
}
await client.end()
