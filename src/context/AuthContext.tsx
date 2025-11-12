// Ruta del archivo: src/context/AuthContext.tsx
// ** ATENCIÓN: Corregido el bucle infinito eliminando 'loading' del
// ** array de dependencias del useEffect principal (línea 89) y 
// ** añadiendo 'accessCodeValid'.

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, User } from '@/lib/supabase';
import { fullSync, FullSyncResult } from '@/lib/gamification-sync';
import { setActiveUserId } from '@/lib/user-storage';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isSyncing: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  accessCodeValid: boolean;
  validateAccessCode: (code: string) => boolean;
  clearAccessCode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); 
  const [isSyncing, setIsSyncing] = useState(false);
  const [accessCodeValid, setAccessCodeValid] = useState(false);

  // 1. Función para comprobar el código de acceso desde localStorage
  const checkAccessCode = useCallback(() => {
    try {
      const storedCodeValid = localStorage.getItem('access_code_valid') === 'true';
      setAccessCodeValid(storedCodeValid);
      return storedCodeValid;
    } catch {
      setAccessCodeValid(false);
      return false;
    }
  }, []);

  // 2. Comprobación de estado inicial (Auth y Access Code)
  // ✅ CORRECCIÓN CLAVE: El array de dependencias ahora es [accessCodeValid, checkAccessCode]
  // Esto asegura que el hook se ejecute UNA VEZ al inicio, y UNA VEZ MÁS
  // si 'accessCodeValid' cambia (es decir, cuando el usuario introduce "013").
  useEffect(() => {
    setLoading(true);
    
    // Comprobamos el código "013" solo si aún no está validado en el estado
    const codeValid = accessCodeValid || checkAccessCode();
    
    if (!codeValid) {
      console.log("[AUTH] Access Gate '013' no validado. Deteniendo carga.");
      setUser(null);
      setLoading(false); // Terminamos la carga
      return; // No suscribir a Supabase
    }

    // Si el código "013" SÍ es válido, procedemos a verificar la sesión de Supabase
    console.log("[AUTH] Access Gate '013' validado. Verificando sesión de Supabase...");
    
    const authTimeout = setTimeout(() => {
      console.warn("[AUTH] Timeout: Autenticación inicial tardó mucho. Forzando fin de carga.");
      if (loading) setLoading(false); // 'loading' aquí es el valor 'stale' del closure
    }, 10000); 

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AUTH] Evento de auth:', event, { hasSession: !!session });
        clearTimeout(authTimeout); 

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
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
      clearTimeout(authTimeout);
    };
  }, [accessCodeValid, checkAccessCode]); // ✅ CORRECCIÓN: Dependencias corregidas.

  const handleDataSync = async (userId: string, userEmail: string) => {
    // ... (Sin cambios) ...
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
    // ... (Sin cambios) ...
    await supabase.auth.signOut();
    setUser(null);
    clearAccessCode(); 
  };

  const validateAccessCode = (code: string) => {
    // ... (Sin cambios) ...
    const isValid = code.trim() === '013';
    if (isValid) {
      try {
        localStorage.setItem('access_code_valid', 'true');
        // ✅ Esto disparará el 'useEffect' de arriba para que se
        // ejecute de nuevo, esta vez con 'codeValid = true'.
        setAccessCodeValid(true); 
      } catch (error) {
        console.error("Error guardando 'access_code_valid' en localStorage:", error);
      }
    }
    return isValid;
  };

  const clearAccessCode = () => {
    // ... (Sin cambios) ...
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
  // ... (Sin cambios) ...
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
