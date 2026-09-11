import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uaoqujoqyglutdlgnuqy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhb3F1am9xeWdsdXRkbGdudXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MDI2MDUsImV4cCI6MjEwNDE3ODYwNX0.L7r5ztU2o6sF8aBMtp0_ApsH9O3bFk9dJL5ul84Ypi0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
