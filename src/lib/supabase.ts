import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  'https://pffnxcvhlqqhfmkyjzvm.supabase.co';

const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  'USE_THE_SUPABASE_PUBLISHABLE_KEY_ALREADY_CONFIGURED_FOR_THIS_PROJECT';

// Check if credentials are placeholders or valid format
export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseAnonKey.includes('USE_THE_SUPABASE_PUBLISHABLE_KEY') &&
    supabaseUrl.startsWith('https://')
  );
};

// Create Supabase client with auth session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});
