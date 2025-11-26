// NOTE: Added comment to trigger redeploy and ensure apikey header is set
import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://ocuehuwgxyknnwyjubpt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdWVodXdneHlrbm53eWp1YnB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3OTA0NjQsImV4cCI6MjA3NzM2NjQ2NH0.2cbgoYnLUDMiJXf4Ukc6HScmsrDsJheTAhW7ihdh9LM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'implicit', // CAMBIADO: Usar flow más simple para evitar loops
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'supabase.auth.token'
  },
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'apikey': supabaseAnonKey
    }
  }
})

export type User = {
  id: string
  email: string
  name: string
  avatar_url: string | null
  created_at: string
}