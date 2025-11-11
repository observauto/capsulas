// Ruta del archivo: src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ocuehuwgxyknnwyjubpt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdWVodXdneHlrbm53eWp1YnB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3OTA0NjQsImV4cCI6MjA3NzM2NjQ2NH0.2cbgoYnLUDMiJXf4Ukc6HScmsrDsJheTAhW7ihdh9LM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Usar el flujo PKCE moderno y seguro.
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'supabase.auth.token'
  }
})

export type User = {
  id: string
  email: string
  name: string
  avatar_url: string | null
  created_at: string
}
