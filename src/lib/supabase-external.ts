import { createClient } from '@supabase/supabase-js';

const EXTERNAL_SUPABASE_URL = 'https://sztjsfxisgmeckuhsjhw.supabase.co';
const EXTERNAL_SUPABASE_ANON_KEY = 'sb_publishable_AkI24z9GG-M923UwBOM6vg_ObrVJkQ2';

export const externalSupabase = createClient(EXTERNAL_SUPABASE_URL, EXTERNAL_SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    },
  },
});
