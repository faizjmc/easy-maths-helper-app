// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wqxqkiblpejkemfjriwh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxeHFraWJscGVqa2VtZmpyaXdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3ODc1MjAsImV4cCI6MjA2NzM2MzUyMH0.el4nedi_9_w5cuS1EP2tEf3G-oQ4Iu2zTmzf-_WHzao";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});