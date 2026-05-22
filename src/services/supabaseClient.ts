import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Polyfill de URL necessário apenas no React Native (não no browser)
if (Platform.OS !== 'web') {
  require('react-native-url-polyfill/auto');
}

const SUPABASE_URL  = process.env.EXPO_PUBLIC_SUPABASE_URL  || 'https://ssnbobxmyhetdduvttmo.supabase.co';
const SUPABASE_ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_EzJi_v-Ms4MnvOXwwrrrgw_5lS0wFNl';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    storage:            Platform.OS === 'web' ? undefined : AsyncStorage,
    autoRefreshToken:   true,
    persistSession:     true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});
