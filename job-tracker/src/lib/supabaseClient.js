import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Prevent the app from crashing if environment variables are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing! Please check your Netlify environment settings.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
)
