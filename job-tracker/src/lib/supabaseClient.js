import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Prevent the app from crashing and provide helpful debugging info
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
  console.error('CRITICAL: Supabase configuration is missing or invalid!')
  console.info('Current URL:', supabaseUrl)
  console.info('Check your Netlify Environment Variables for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-please-set-env-vars.supabase.co', 
  supabaseAnonKey || 'placeholder-please-set-env-vars'
)

// Add a global listener to help debug "Failed to fetch" issues in production
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', event => {
    if (event.reason && event.reason.message === 'Failed to fetch') {
      console.error('NETWORK ERROR: "Failed to fetch" detected.')
      console.error('This is likely due to:')
      console.error('1. Incorrect Supabase URL in Netlify Environment Variables')
      console.error('2. Ad-blockers or browser extensions blocking the request')
      console.error('3. CORS issues (unlikely with Supabase unless URL is wrong)')
      console.info('Configured Supabase URL:', supabaseUrl)
    }
  })
}
