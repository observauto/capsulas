import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, User } from '@/lib/supabase'
import { fullSync } from '@/lib/gamification-sync'
import { toast } from '@/hooks/use-toast'

interface AuthContextType {
  user: User | null
  loading: boolean
  isSyncing: boolean  // NUEVO: Flag de sincronización
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  accessCodeValid: boolean
  validateAccessCode: (code: string) => boolean
  clearAccessCode: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)  // NUEVO
  const [accessCodeValid, setAccessCodeValid] = useState(false)

  // Verificar código de acceso en localStorage
  useEffect(() => {
    const savedCode = localStorage.getItem('access_code_valid')
    setAccessCodeValid(savedCode === 'true')
  }, [])

  // Cargar usuario al iniciar
  useEffect(() => {
    async function loadUser() {
      try {
        console.log('[AUTH] Cargando usuario inicial...')
        const { data: { user: supabaseUser }, error } = await supabase.auth.getUser()
        
        console.log('[AUTH] Usuario obtenido:', {
          hasUser: !!supabaseUser,
          userId: supabaseUser?.id,
          userEmail: supabaseUser?.email,
          error
        })
        
        if (error) {
          console.error('[AUTH] Error obteniendo usuario:', error)
        } else if (supabaseUser) {
          // Convertir usuario de Supabase a nuestro tipo User
          const user: User = {
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
            avatar_url: supabaseUser.user_metadata?.avatar_url || null,
            created_at: supabaseUser.created_at || ''
          }
          setUser(user)
          
          console.log('[AUTH] Usuario establecido, ejecutando sincronización en background...')
          // Sincronizar datos locales a Supabase EN BACKGROUND (sin bloquear)
          handleDataSync(user.id, user.email).catch(error => {
            console.error('[AUTH] Error en sync background:', error)
          })
        }
      } catch (error) {
        console.error('[AUTH] Error cargando usuario:', error)
      } finally {
        setLoading(false)  // IMPORTANTE: Siempre terminar el loading inmediatamente
      }
    }
    loadUser()

    // Listener para cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AUTH] Evento de auth:', event, {
          hasSession: !!session,
          userId: session?.user?.id,
          userEmail: session?.user?.email
        })

        if (session?.user) {
          const user: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
            avatar_url: session.user.user_metadata?.avatar_url || null,
            created_at: session.user.created_at || ''
          }
          setUser(user)

          // Sincronizar datos solo en SIGNED_IN event EN BACKGROUND
          if (event === 'SIGNED_IN') {
            console.log('[AUTH] Sincronizando datos despues de login en background...')
            handleDataSync(user.id, user.email).catch(error => {
              console.error('[AUTH] Error en sync después de login:', error)
            })

            // Redirect to saved URL if exists
            const returnToUrl = sessionStorage.getItem('returnToCapsule');
            if (returnToUrl) {
              console.log('[AUTH] Redirigiendo a:', returnToUrl);
              sessionStorage.removeItem('returnToCapsule');
              // Use setTimeout to ensure the sync is complete
              setTimeout(() => {
                window.location.href = returnToUrl;
              }, 4000);
            }
          }
        } else {
          // Algunos eventos (ej. INITIAL_SESSION) pueden dispararse sin sesión válida
          // inmediatamente después de un SIGNED_IN. Evitamos limpiar el usuario
          // salvo en eventos que representan un cierre real de sesión.
          if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
            console.log('[AUTH] No hay sesion, limpiando usuario')
            setUser(null)
          } else {
            console.log('[AUTH] Evento sin sesión, preservando estado actual')
          }
        }

        setLoading(false)  // IMPORTANTE: Siempre terminar el loading inmediatamente
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // SINCRONIZACIÓN FORZADA - Se ejecuta en background (NO bloquea la UI)
  const handleDataSync = async (userId: string, userEmail: string) => {
    setIsSyncing(true)  // NUEVO: Marcar inicio de sincronización
    
    try {
      console.log('[AUTH] ===== EJECUTANDO SINCRONIZACIÓN EN BACKGROUND =====');
      console.log('[AUTH] User ID:', userId);
      console.log('[AUTH] Email:', userEmail);
      
      // Timeout más corto (10 segundos) para no bloquear
      const syncPromise = fullSync(userId, userEmail);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout en sincronización (10s)')), 10000)
      );
      
      const result = await Promise.race([syncPromise, timeoutPromise]) as any;
      
      console.log('[AUTH] ===== RESULTADO DE SINCRONIZACIÓN EN BACKGROUND =====');
      console.log('[AUTH] Success:', result.success);
      console.log('[AUTH] Puntos migrados:', result.pointsMigrated);
      console.log('[AUTH] Badges migrados:', result.badgesMigrated);
      console.log('[AUTH] Puntos finales:', result.finalPoints);
      console.log('[AUTH] Error:', result.error);
      
      if (result.success) {
        // Mostrar toast solo si hay datos para migrar
        if (result.pointsMigrated > 0 || result.badgesMigrated > 0) {
          console.log('[AUTH] Mostrando toast de restauración en background');
          toast({
            title: "Datos restaurados exitosamente",
            description: `Se restauraron ${result.pointsMigrated} puntos y ${result.badgesMigrated} logros. Total: ${result.finalPoints} puntos.`,
            variant: "default"
          });
        }
      } else {
        console.error('[AUTH] ERROR EN SINCRONIZACIÓN EN BACKGROUND:', result.error);
        // NO mostrar error en toast para evitar spam
      }
    } catch (error: any) {
      console.error('[AUTH] EXCEPCIÓN EN handleDataSync (background):', error);
      // NO mostrar error - es background y no debe interrumpir al usuario
    } finally {
      setIsSyncing(false)  // NUEVO: Marcar fin de sincronización
      console.log('[AUTH] ===== SINCRONIZACIÓN EN BACKGROUND FINALIZADA =====');
    }
  }

  const signInWithGoogle = async () => {
    try {
      // Check if there's a return URL saved in sessionStorage
      const returnToUrl = sessionStorage.getItem('returnToCapsule');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin // Use current origin as redirect URL
        }
      })

      if (error) {
        console.error('Error signing in with Google:', error.message)
        throw error
      }
    } catch (error) {
      console.error('Google Sign-In error:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error.message)
        throw error
      }
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  const validateAccessCode = (code: string) => {
    const isValid = code.trim() === '013'
    if (isValid) {
      localStorage.setItem('access_code_valid', 'true')
      setAccessCodeValid(true)
    }
    return isValid
  }

  const clearAccessCode = () => {
    localStorage.removeItem('access_code_valid')
    setAccessCodeValid(false)
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isSyncing,  // NUEVO: Exponer flag
      signInWithGoogle,
      signOut,
      accessCodeValid,
      validateAccessCode,
      clearAccessCode
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
