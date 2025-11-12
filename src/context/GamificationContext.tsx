// Ruta del archivo: src/context/GamificationContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useAuth } from "./AuthContext"; // Sin cambios
import {
  GamificationSnapshot,
  loadGamificationDataFromSupabase,
  persistGamificationProgress,
  readLocalGamificationData,
  writeLocalGamificationData,
  mergeSnapshots,
} from "@/lib/gamification-sync"; // Sin cambios

type GamificationContextValue = {
  points: number;
  level: number;
  badges: string[];
  addPoints: (delta: number) => void;
  subtractPoints: (delta: number) => void;
  grantBadge: (code: string) => void;
  grantBadges: (codes: string[]) => void;
  reset: () => Promise<void>;
  isLoading: boolean;
};

const GamificationContext = createContext<GamificationContextValue | null>(null);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  // ✅ CORRECCIÓN: Obtenemos el estado 'loading' de AuthContext
  const { user, isSyncing, loading: isAuthLoading } = useAuth();
  const [points, setPointsState] = useState(0);
  const [badges, setBadgesState] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isBootstrapping = useRef(false);

  const applySnapshot = useCallback((snapshot: GamificationSnapshot) => {
    const validatedSnapshot = mergeSnapshots(snapshot.points, snapshot.badges);
    setPointsState(validatedSnapshot.points);
    setBadgesState(validatedSnapshot.badges);
  }, []);

  useEffect(() => {
    let cancelled = false;
    
    const bootstrap = async () => {
      if (isBootstrapping.current) return;
      isBootstrapping.current = true;
      setIsLoading(true);

      // ✅ CORRECCIÓN: Esperamos si AuthContext sigue cargando.
      if (isAuthLoading) {
        console.log('[GAMIFICATION] Esperando fin de autenticación de AuthContext...');
        isBootstrapping.current = false;
        // No establecemos isLoading(false) aquí, esperamos a que el efecto se re-ejecute
        return;
      }

      if (isSyncing) {
        console.log('[GAMIFICATION] Esperando fin de sincronización de AuthContext...');
        isBootstrapping.current = false;
        // No establecemos isLoading(false) aquí, esperamos a que el efecto se re-ejecute
        return;
      }

      if (user?.id) {
        console.log('[GAMIFICATION] Usuario autenticado. Cargando datos desde Supabase...');
        try {
          const remoteData = await loadGamificationDataFromSupabase(user.id);
          if (cancelled) return;

          if (remoteData.status === "success" && remoteData.snapshot) {
            const remoteSnapshot = mergeSnapshots(remoteData.snapshot.points, remoteData.snapshot.badges);
            applySnapshot(remoteSnapshot);
          } else {
            const localRecord = readLocalGamificationData(user.id);
            applySnapshot(localRecord.snapshot);
          }
        } catch (error) {
          console.error("[GAMIFICATION] Error cargando datos remotos, usando fallback local:", error);
          const localRecord = readLocalGamificationData(user.id);
          applySnapshot(localRecord.snapshot);
        }
      } else {
        console.log('[GAMIFICATION] Usuario no autenticado. Cargando datos de invitado.');
        const localRecord = readLocalGamificationData(null);
        applySnapshot(localRecord.snapshot);
      }
      
      if (!cancelled) {
        setIsLoading(false);
        isBootstrapping.current = false;
        window.dispatchEvent(new CustomEvent('gamification:update'));
      }
    };

    bootstrap();
    
    const syncCompleteListener = () => bootstrap();
    window.addEventListener('gamification:syncComplete', syncCompleteListener);

    return () => {
      cancelled = true;
      isBootstrapping.current = false;
      window.removeEventListener('gamification:syncComplete', syncCompleteListener);
    };
    // ✅ CORRECCIÓN: Añadimos 'isAuthLoading' a las dependencias del efecto
  }, [user, isSyncing, isAuthLoading, applySnapshot]);

  const updateAndPersist = useCallback((newPoints: number, newBadges: string[]) => {
    const snapshot = mergeSnapshots(newPoints, newBadges);
    applySnapshot(snapshot);

    if (user?.id) {
      persistGamificationProgress(user.id, snapshot, { email: user.email, name: user.name });
    } else {
      writeLocalGamificationData(snapshot, null);
    }
    window.dispatchEvent(new CustomEvent('gamification:update'));
  }, [user, applySnapshot]); // Sin cambios

  const addPoints = useCallback((delta: number) => {
    setPointsState(prevPoints => {
      const newPoints = Math.max(0, Math.floor(prevPoints + delta));
      setBadgesState(prevBadges => {
        const newBadges = mergeSnapshots(newPoints, prevBadges).badges;
        updateAndPersist(newPoints, newBadges);
        return newBadges;
      });
      return newPoints;
    });
  }, [updateAndPersist]); // Sin cambios
  
  const subtractPoints = useCallback((delta: number) => {
    addPoints(-Math.abs(delta));
  }, [addPoints]); // Sin cambios

  const grantBadge = useCallback((code: string) => {
    setBadgesState(prevBadges => {
      if (prevBadges.includes(code)) return prevBadges;
      const newBadges = [...prevBadges, code];
      updateAndPersist(points, newBadges);
      return newBadges;
    });
  }, [points, updateAndPersist]); // Sin cambios

  const grantBadges = useCallback((codes: string[]) => {
    setBadgesState(prevBadges => {
      const newBadgesToAdd = codes.filter(code => !prevBadges.includes(code));
      if (newBadgesToAdd.length === 0) return prevBadges;
      const newBadges = [...prevBadges, ...newBadgesToAdd];
      updateAndPersist(points, newBadges);
      return newBadges;
    });
  }, [points, updateAndPersist]); // Sin cambios

  const reset = useCallback(async () => {
    updateAndPersist(0, []);
  }, [updateAndPersist]); // Sin cambios

  const level = useMemo(() => Math.floor(points / 100) + 1, [points]); // Sin cambios

  const value = useMemo<GamificationContextValue>(
    () => ({ points, level, badges, addPoints, subtractPoints, grantBadge, grantBadges, reset, isLoading }),
    [points, level, badges, addPoints, subtractPoints, grantBadge, grantBadges, reset, isLoading],
  ); // Sin cambios

  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
}

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) {
    throw new Error("useGamification must be used within GamificationProvider");
  }
  return ctx;
} // Sin cambios
