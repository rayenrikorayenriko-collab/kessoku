import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// KSF Supabase project configuration. Publishable keys are designed for client-side use.
export const SUPABASE_URL = "https://ufpgjiguixapczoohale.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_4yFqjHu9Sk7QyKpxBbJwcA_gj5oE0LJ";
export const SUPABASE_BUCKET = "media";

export const isSupabaseConfigured =
  SUPABASE_URL.startsWith("https://") && SUPABASE_ANON_KEY.length > 20;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }
  return client;
}
