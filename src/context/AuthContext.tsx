import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { ACCESS_CODE, SESSION_DURATION } from '@/config/accessGate';

interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  role: 'user' | 'admin' | 'superadmin' | 'sponsor';
  points: number;
  avatar_url?: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAccessGranted: boolean;
  grantAccess: () => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  checkAccessCode: (code: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const { toast } = useToast();

  // Verificar acceso inicial (Gate 013)
  useEffect(() => {
    const storedAccess = localStorage.getItem('access_granted');
    const accessTimestamp = localStorage.getItem('access_timestamp');

    if (storedAccess === 'true' && accessTimestamp) {
      const now = new Date().getTime();
      const diff = now - parseInt(accessTimestamp);
      
      if (diff < SESSION_DURATION) {
        setIsAccessGranted(true);
      } else {
        localStorage.removeItem('access_granted');
        localStorage.removeItem('access_timestamp');
        setIsAccessGranted(false);
      }
    }
    // Importante: setLoading NO debe depender de 'loading' en el array de dependencias
    setLoading(false);
  }, []);

  // Escuchar cambios de sesión en Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchUserProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchUserProfile(session.user.id);
      else setUserProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const grantAccess = () => {
    setIsAccessGranted(true);
    localStorage.setItem('access_granted', 'true');
    localStorage.setItem('access_timestamp', new Date().getTime().toString());
  };

  const checkAccessCode = (code: string): boolean => {
    if (code === ACCESS_CODE) {
      grantAccess();
      return true;
    }
    return false;
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            prompt: 'select_account'
          }
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error al iniciar sesión",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
    } catch (error: any) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      userProfile,
      loading,
      isAccessGranted,
      grantAccess,
      signInWithGoogle,
      signOut,
      checkAccessCode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
