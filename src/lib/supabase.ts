import { createClient } from '@supabase/supabase-js';

function sanitizeUrl(url: string | undefined): string {
  if (!url) return 'https://placeholder-project-id.supabase.co';
  let sanitized = url
    .trim()
    .replace(/^["']|["']$/g, '') // Strip outer single/double quotes
    .trim()
    .replace(/\/+$/, '');        // Strip all trailing slashes

  // Automatically strip /rest/v1 or /auth/v1 if present at the end
  sanitized = sanitized.replace(/\/rest\/v1\/?$/, '');
  sanitized = sanitized.replace(/\/auth\/v1\/?$/, '');

  // Final trim and trailing slash removal
  return sanitized.trim().replace(/\/+$/, '');
}

function sanitizeKey(key: string | undefined): string {
  if (!key) return 'placeholder-anon-key';
  return key
    .trim()
    .replace(/^["']|["']$/g, '') // Strip outer single/double quotes
    .trim();
}

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseUrl = sanitizeUrl(rawUrl);
const supabaseAnonKey = sanitizeKey(rawKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Validate if config is real (not empty, placeholder, or invalid format)
export const hasValidSupabaseConfig = !!(
  rawUrl &&
  rawUrl.trim() !== '' &&
  !rawUrl.includes('placeholder') &&
  rawUrl.startsWith('http') &&
  rawKey &&
  rawKey.trim() !== '' &&
  !rawKey.includes('placeholder')
);
