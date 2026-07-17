import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://eerfjupbfrmiwijablqi.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_2ozZiLj1qz4DgI91-M4mVQ_cglWOEq_"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
