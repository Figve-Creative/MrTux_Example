import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** True once real Supabase project credentials are set (in .env.local locally,
 *  or in the hosting provider's environment variables in production). Until
 *  then, every Supabase-backed feature (accounts, cloud size-profile sync,
 *  order-intake sync) quietly no-ops instead of throwing, so the rest of the
 *  site keeps working exactly as it does today. */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;

if (!isSupabaseConfigured && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set — accounts, " +
      "cloud size-profile sync, and order-intake sync are disabled. See .env.example.",
  );
}
