import { readFileSync } from "fs"
import pg from "pg"
const { Client } = pg

const client = new Client({
  connectionString: "postgresql://postgres.eerfjupbfrmiwijablqi:Emmanuelle%401724_@aws-0-eu-central-1.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
})

await client.connect()
try {
  const sql = readFileSync("supabase/schema_v3_contracts.sql", "utf8")
  await client.query(sql)
  console.log("Schema v3 applied successfully")
} catch (e) {
  console.error("Error:", e.message)
}
await client.end()
