import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (typeof process !== "undefined" &&
    (process.env?.SUPABASE_URL || process.env?.VITE_SUPABASE_URL)) ||
  "https://ajnchxwmgokpfxctfrai.supabase.co";

const supabaseKey =
  (typeof process !== "undefined" &&
    (process.env?.SUPABASE_SERVICE_ROLE_KEY ||
      process.env?.SUPABASE_PUBLISHABLE_KEY ||
      process.env?.VITE_SUPABASE_PUBLISHABLE_KEY)) ||
  "sb_publishable_J_vSTIYpn-fxt_BkuatJgQ_JCn5-JKc";

export function createServerSupabaseClient() {
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
