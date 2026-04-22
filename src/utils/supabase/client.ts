import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // Return a dummy client or handle build-time static generation
    // This prevents the build from failing if env vars are missing
    return {} as any; 
  }

  return createBrowserClient(url, anonKey)
}
