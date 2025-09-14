import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage"
// import * as SecureStore from "expo-secure-store"; // todo replace async storage with secure store

const supabaseKey =  process.env.EXPO_PUBLIC_SUPABASE_API_KEY
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL

export const supabase = createClient(supabaseUrl, supabaseKey, {
    localStorage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
})
