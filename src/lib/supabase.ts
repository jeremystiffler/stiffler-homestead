import { createClient } from "@supabase/supabase-js";

function envValue(value: string | undefined) {
  const cleaned = value?.trim();
  if (!cleaned || cleaned === "\"\"" || cleaned === "''") return "";
  return cleaned;
}

const supabaseUrl = envValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
const anonKey = envValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const serviceRoleKey = envValue(process.env.SUPABASE_SERVICE_ROLE_KEY);

export function hasSupabaseConfig() {
  return Boolean(supabaseUrl && (anonKey || serviceRoleKey));
}

export function getSupabaseServerClient() {
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getSupabaseAnonClient() {
  if (!supabaseUrl || !anonKey) return null;
  return createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
