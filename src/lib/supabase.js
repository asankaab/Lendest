
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePubKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePubKey) {
    console.warn('Missing Supabase URL or Anon Key in .env file');
}

export const supabase = createClient(supabaseUrl, supabasePubKey);
