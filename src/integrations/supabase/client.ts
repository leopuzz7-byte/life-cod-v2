import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Anon-ключ Supabase публичный по дизайну — защита идёт через RLS-политики, а не через секретность ключа.
const SUPABASE_URL = 'https://thjyvcjzurjbufvthlvb.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoanl2Y2p6dXJqYnVmdnRobHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNTY1NzIsImV4cCI6MjA5NDczMjU3Mn0.pKNH-Z7N0t8EJeei08ZxU8bfkVMk10DD1ePLNHZu3j0';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
