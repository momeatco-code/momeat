import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "@/shared/config/env";

export function createSupabaseBrowserClient() {
  const { NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, NEXT_PUBLIC_SUPABASE_URL } =
    getSupabasePublicEnv();

  return createBrowserClient(
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
