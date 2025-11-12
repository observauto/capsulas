// Ruta del archivo: src/context/AuthContext.tsx
// ** ATENCIÓN: Este archivo es el AuthContext original, con la lógica
// ** del AccessGate ("013") verificada y el estado de carga ('loading') estabilizado.
// ** Este archivo REEMPLAZA al que tenías.

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, User } from '@/lib/supabase';
import { fullSync, FullSyncResult } from '@/lib/gamification-sync';
import { setActiveUserId } from '@/lib/user-storage';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  /**
   * loading:
   * - true: El contexto está en su comprobación inicial de sesión (auth o access code).
   * - false: El contexto ha terminado la comprobación inicial.
   */
  loading: boolean;
  isSyncing: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  /**
   * accessCodeValid:
   * - true: El usuario ha introducido el código "013" correctamente.
   * - false: El usuario no ha introducido el código.
   */
  accessCodeValid: boolean;
  validateAccessCode: (code: string) => boolean;
  clearAccessCode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Inicia en true
  const [isSyncing, setIsSyncing] = useState(false);
  const [accessCodeValid, setAccessCodeValid] = useState(false);

  // 1. Función para comprobar el código de acceso desde localStorage
  const checkAccessCode = useCallback(() => {
    try {
      // ✅ Lógica del Access Gate: Comprueba si el código ya fue validado y guardado.
      const storedCodeValid = localStorage.getItem('access_code_valid') === 'true';
      setAccessCodeValid(storedCodeValid);
      return storedCodeValid;
    } catch {
      setAccessCodeValid(false);
      return false;
    }
  }, []);

  // 2. Comprobación de estado inicial (Auth y Access Code)
  useEffect(() => {
    // Marcamos que estamos cargando
    setLoading(true);
    
    // Primero, revisamos el código de acceso "013"
    const codeValid = checkAccessCode();
    
    // Si el código no es válido, no necesitamos chequear la sesión de Supabase.
    // Simplemente terminamos la carga y dejamos que App.tsx muestre el AccessGate.
    if (!codeValid) {
      console.log("[AUTH] Access Gate '013' no validado. Deteniendo carga.");
      setUser(null);
      setLoading(false); // Terminamos la carga
      return;
    }

    // Si el código "013" SÍ es válido, procedemos a verificar la sesión de Supabase
    console.log("[AUTH] Access Gate '013' validado. Verificando sesión de Supabase...");
    
    // Timeout de seguridad por si Supabase tarda demasiado
    const authTimeout = setTimeout(() => {
      console.warn("[AUTH] Timeout: Autenticación inicial tardó mucho. Forzando fin de carga.");
      if (loading) setLoading(false);
    }, 10000); // 10 segundos

    // Suscripción a cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AUTH] Evento de auth:', event, { hasSession: !!session });
        clearTimeout(authTimeout); // Limpiamos el timeout

        const supabaseUser = session?.user;
        if (supabaseUser) {
          const appUser: User = {
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'Usuario',
            avatar_url: supabaseUser.user_metadata?.avatar_url || null,
            created_at: supabaseUser.created_at || new Date().toISOString()
          };
          setUser(appUser);
          setActiveUserId(appUser.id);
          
          if (event === 'SIGNED_IN') {
            handleDataSync(appUser.id, appUser.email);
          }
        } else {
          setUser(null);
          setActiveUserId(null);
        }
        
        // Terminamos la carga SÓLO después de procesar el estado de auth
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(authTimeout);
    };
  }, [checkAccessCode, loading]); // 'loading' se incluye para manejar el timeout correctamente

  const handleDataSync = async (userId: string, userEmail: string) => {
    // ... (Esta función de sincronización no cambia) ...
    if (isSyncing) return;
    setIsSyncing(true);
    console.log('[AUTH] Iniciando sincronización de datos...');

    try {
      const syncPromise = fullSync(userId, userEmail);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout en sincronización (30s)')), 30000)
      );
      const result = await Promise.race([syncPromise, timeoutPromise]) as FullSyncResult;
      if (result.success && (result.pointsMigrated > 0 || result.badgesMigrated > 0)) {
        toast({
          title: "Datos restaurados",
          description: `Se han restaurado ${result.pointsMigrated} puntos y ${result.badgesMigrated} logros.`,
        });
      }
    } catch (error: any) {
      console.error('[AUTH] Error en sincronización:', error.message);
    } finally {
      setIsSyncing(false);
      window.dispatchEvent(new CustomEvent('gamification:syncComplete'));
      console.log('[AUTH] Sincronización finalizada.');
    }
  };

  const signInWithGoogle = async () => {
    // ... (Sin cambios) ...
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    clearAccessCode(); // ✅ Lógica del Access Gate: Al salir, limpiamos el código "013"
  };

  // ✅ Lógica del Access Gate: Función para validar y guardar el código
  const validateAccessCode = (code: string) => {
    const isValid = code.trim() === '013';
    if (isValid) {
      try {
        localStorage.setItem('access_code_valid', 'true');
        setAccessCodeValid(true);
        // Forzamos un reinicio del estado de carga para que el useEffect principal
        // vuelva a correr y verifique la sesión de Supabase.
        setLoading(true);
      } catch (error) {
        console.error("Error guardando 'access_code_valid' en localStorage:", error);
      }
    }
    return isValid;
  };

  // ✅ Lógica del Access Gate: Función para limpiar el código
  const clearAccessCode = () => {
    try {
      localStorage.removeItem('access_code_valid');
      setAccessCodeValid(false);
    } catch (error) {
      console.error("Error limpiando 'access_code_valid' de localStorage:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isSyncing, signInWithGoogle, signOut, accessCodeValid, validateAccessCode, clearAccessCode }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
