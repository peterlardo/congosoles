import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://eerfjupbfrmiwijablqi.supabase.co"
const supabaseAnonKey = "sb_publishable_2ozZiLj1qz4DgI91-M4mVQ_cglWOEq_"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
