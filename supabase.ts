import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as SecureStore from "expo-secure-store";
// todo: proper way to have secure session: https://supabase.com/blog/react-native-authentication#encrypting-the-user-session
// Using SecureStore instead of AsyncStorage is not correct and gives a warning:
// Value being stored in SecureStore is larger than 2048 bytes and it may not be stored successfully.
// In a future SDK version, this call may throw an error

const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});
