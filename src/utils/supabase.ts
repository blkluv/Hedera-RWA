import { createClient } from "@supabase/supabase-js";
import { getEnv } from ".";

const supabaseUrl = getEnv("VITE_PUBLIC_SUPABASE_URL");
const supabaseAnonKey = getEnv("VITE_PUBLIC_SUPABASE_ANON_KEY");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
