// Ruta del archivo: src/context/AuthContext.tsx

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

    const checkAccessCode = useCallback(() => {
        try {
            return localStorage.getItem('access_code_valid') === 'true';
        } catch {
            return false;
        }
    }, []);

    useEffect(() => {
        setAccessCodeValid(checkAccessCode());
    }, [checkAccessCode]);

    useEffect(() => {
        setActiveUserId(user?.id ?? null);
    }, [user?.id]);

    useEffect(() => {
        setLoading(true);
        const authTimeout = setTimeout(() => {
            console.warn("[AUTH] Timeout: Autenticación inicial tardó mucho. Forzando fin de carga.");
            if (loading) setLoading(false);
        }, 15000);

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
                    if (event === 'SIGNED_IN') {
                        handleDataSync(appUser.id, appUser.email);
                    }
                } else {
                    setUser(null);
                }
                setLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
            clearTimeout(authTimeout);
        };
    }, []);

    const handleDataSync = async (userId: string, userEmail: string) => {
        if (isSyncing) return;
        setIsSyncing(true);
        console.log('[AUTH] Iniciando sincronización de datos...');

        try {
            // Obtener el usuario actual de Supabase para acceder a user_metadata completo
            const { data: { user: currentUser } } = await supabase.auth.getUser();

            const syncPromise = fullSync(
                userId,
                userEmail,
                // Pasar metadata completa de Google
                currentUser ? {
                    name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || userEmail.split('@')[0],
                    avatar_url: currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture,
                    phone: currentUser.user_metadata?.phone_number || currentUser.phone,
                } : undefined
            );

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
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin }
        });
        if (error) throw error;
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        clearAccessCode();
    };

    const validateAccessCode = (code: string) => {
        const isValid = code.trim() === '013';
        if (isValid) {
            localStorage.setItem('access_code_valid', 'true');
            setAccessCodeValid(true);
        }
        return isValid;
    };

    const clearAccessCode = () => {
        localStorage.removeItem('access_code_valid');
        setAccessCodeValid(false);
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
