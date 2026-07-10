import pg from "pg"
const { Client } = pg

const client = new Client({
  connectionString: "postgresql://postgres.eerfjupbfrmiwijablqi:Emmanuelle%401724_@aws-0-eu-central-1.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
})

await client.connect()
try {
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.messages (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      subject TEXT NOT NULL DEFAULT '',
      body TEXT NOT NULL DEFAULT '',
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Admins can manage messages" ON public.messages;
    CREATE POLICY "Admins can manage messages" ON public.messages
      FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
    DROP POLICY IF EXISTS "Users can view own messages" ON public.messages;
    CREATE POLICY "Users can view own messages" ON public.messages
      FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
    DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
    CREATE POLICY "Users can send messages" ON public.messages
      FOR INSERT WITH CHECK (auth.uid() = sender_id);
  `)
  console.log("Messages table created successfully")
} catch (e) {
  console.error("Error:", e.message)
}
await client.end()
