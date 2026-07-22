import { createClient } from '@supabase/supabase-js';

// Sanitize Supabase URL: remove trailing slash and whitespace
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project-id.supabase.co';
const supabaseUrl = rawUrl.trim().replace(/\/$/, '');

const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key').trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const hasValidSupabaseConfig = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
