import { readFileSync } from "fs"
import pg from "pg"
import { fileURLToPath } from "url"
import { dirname, resolve } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const sql = readFileSync(resolve(__dirname, "seed_data.sql"), "utf8")

const pool = new pg.Pool({
  host: "aws-0-eu-central-1.pooler.supabase.com",
  port: 6543,
  user: "postgres.eerfjupbfrmiwijablqi",
  password: "Emmanuelle@1724_",
  database: "postgres",
  ssl: { rejectUnauthorized: false },
})

try {
  console.log("Connexion à Supabase...")
  await pool.query(sql)
  console.log("Seed terminé avec succès !")
} catch (err) {
  console.error("Erreur:", err.message)
  console.error(err.stack)
} finally {
  await pool.end()
}
