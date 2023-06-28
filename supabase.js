import { createClient } from "@supabase/supabase-js";
import config from './config';
import AsyncStorage from "@react-native-async-storage/async-storage"

const supabaseKey =  config.SUPABASE_API_KEY
const supabaseUrl = config.SUPABASE_URL

export const supabase = createClient(supabaseUrl, supabaseKey, {
    localStorage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
})
