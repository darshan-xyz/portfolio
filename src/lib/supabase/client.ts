import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (typeof process !== "undefined" && process.env?.VITE_SUPABASE_URL) ||
  import.meta.env?.VITE_SUPABASE_URL ||
  "https://ajnchxwmgokpfxctfrai.supabase.co";

const supabaseAnonKey =
  (typeof process !== "undefined" && process.env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
  import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_J_vSTIYpn-fxt_BkuatJgQ_JCn5-JKc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
