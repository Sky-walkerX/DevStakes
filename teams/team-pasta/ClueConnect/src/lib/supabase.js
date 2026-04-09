import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create the client if we have a valid-looking URL and key
// (avoids crashing when placeholder strings are present)
const isValidUrl = supabaseUrl.startsWith('https://') && supabaseUrl.includes('.supabase.co');
const isValidKey = supabaseAnonKey.length > 20;

export const supabase = isValidUrl && isValidKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
