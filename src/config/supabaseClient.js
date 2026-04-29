import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// 🔍 DEBUG HERE
console.log("SUPABASE URL:", process.env.SUPABASE_URL);
console.log("SUPABASE KEY:", process.env.SUPABASE_KEY ? "Loaded ✅" : "Missing ❌");

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);