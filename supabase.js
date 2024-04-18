import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage"

const supabaseKey =  process.env.SUPABASE_API_KEY
const supabaseUrl = process.env.SUPABASE_URL

export const supabase = createClient(supabaseUrl, supabaseKey, {
    localStorage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
})
