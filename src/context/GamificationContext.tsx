import React from "react";
import { useAuth } from "./AuthContext";
import { loadGamificationDataFromSupabase, updateBadgesInSupabase, updatePointsInSupabase } from "@/lib/gamification-sync";

const KEY_POINTS = "oa_points";
const KEY_BADGES = "oa_badges";

const MILESTONE_BADGES = [
  { code: "beginner", threshold: 100 },
  { code: "intermediate", threshold: 500 },
  { code: "expert", threshold: 1000 },
] as const;

const MILESTONE_CODES = new Set(MILESTONE_BADGES.map(item => item.code));

function ensureMilestoneBadges(points: number, badgesList: string[]): string[] {
  // Verificación de seguridad: asegurar que badgesList sea un array
  const safeBadgesList = Array.isArray(badgesList) ? badgesList : [];
  const base = safeBadgesList.filter(code => !MILESTONE_CODES.has(code));
  const milestoneCodes = MILESTONE_BADGES.filter(item => points >= item.threshold).map(item => item.code);
  const combined = [...base];
  milestoneCodes.forEach(code => {
    if (!combined.includes(code)) {
      combined.push(code);
    }
  });
  return combined;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readPointsLS(): number {
  if (!isBrowser()) return 0;
  try {
    const stored = window.localStorage.getItem(KEY_POINTS);
    if (!stored) return 0;
    const parsed = Number(stored);
    return Number.isFinite(parsed) ? parsed : 0;
  } catch {
    return 0;
  }
}

function writePointsLS(value: number) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEY_POINTS, String(value));
  } catch {
    // ignore write errors (private mode, etc.)
  }
}

function readBadgesLS(): string[] {
  if (!isBrowser()) return [];
  try {
    const stored = window.localStorage.getItem(KEY_BADGES);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function writeBadgesLS(list: string[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEY_BADGES, JSON.stringify(list));
  } catch {
    // ignore write errors
  }
}

function clearLocalStorage() {
  // LIMPIEZA FORZADA: Solo eliminar datos falsos de gamificación, preservar autenticación
  if (!isBrowser()) return;
  try {
    // Limpiar claves específicas de gamificación
    window.localStorage.removeItem(KEY_POINTS);
    window.localStorage.removeItem(KEY_BADGES);
    
    // Identificar qué claves eliminar (solo las de gamificación, NO autenticación)
    const keysToRemove = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && (
        key.includes('oa_') || 
        key.includes('capsule') || 
        key.includes('pill') || 
        key.includes('progress') ||
        (key.includes('user_') && !key.includes('supabase')) || // Solo user_ que NO sean de Supabase
        (key.includes('achievement') || key.includes('badge') || key.includes('reward') || key.includes('streak'))
      )) {
        keysToRemove.push(key);
      }
    }
    
    // IMPORTANTE: NO eliminar claves de Supabase (tokens de sesión)
    // NO eliminar access_code_valid
    keysToRemove.forEach(key => {
      window.localStorage.removeItem(key);
    });
    
    console.log('[GAMIFICATION] localStorage limpiado (preservando autenticación):', keysToRemove.length, 'claves de gamificación eliminadas');
  } catch (error) {
    console.error('[GAMIFICATION] Error limpiando localStorage:', error);
  }
}

async function fetchProfile() {
  // API endpoint no existe en proyecto frontend - comentado para evitar errores
  /*
  try {
    const response = await fetch("/api/gamification/me", { method: "GET" });
    if (!response.ok) return null;
    return response.json() as Promise<{ points?: number; badges?: unknown }>;
  } catch {
    return null;
  }
  */
  return null; // Retorna null para usar localStorage únicamente
}

async function requestReset() {
  // API endpoint no existe en proyecto frontend - comentado para evitar errores
  /*
  try {
    const response = await fetch("/api/gamification/reset", { method: "POST" });
    if (!response.ok) return null;
    return response.json() as Promise<{ points?: number; badges?: unknown }>;
  } catch {
    return null;
  }
  */
  return null; // Retorna null para usar localStorage únicamente
}

type GamificationContextValue = {
  points: number;
  badges: string[];
  setPoints: (value: number) => void;
  setBadges: (value: string[]) => void;
  addPoints: (delta: number) => void;
  subtractPoints: (delta: number) => void;
  grantBadge: (code: string) => void;
  grantBadges: (codes: string[]) => void;
  reset: () => Promise<void> | void;
};

const GamificationContext = React.createContext<GamificationContextValue | null>(null);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const { user, isSyncing } = useAuth();  // NUEVO: Leer flag isSyncing
  const [points, setPointsState] = React.useState(0);
  const [badges, setBadgesState] = React.useState<string[]>([]);
  const [isLoadingFromDB, setIsLoadingFromDB] = React.useState(true);

  const syncMilestones = React.useCallback((nextPoints: number) => {
    setBadgesState(prev => {
      const combined = ensureMilestoneBadges(nextPoints, prev);
      if (combined.length === prev.length && combined.every((code, index) => code === prev[index])) {
        return prev;
      }
      return combined;
    });
  }, []);

  const syncStorage = React.useCallback(
    (nextPoints: number, nextBadges: string[]) => {
      // Solo escribir a localStorage si los valores realmente cambiaron
      const currentPoints = readPointsLS();
      const currentBadges = readBadgesLS();
      
      if (currentPoints !== nextPoints || JSON.stringify(currentBadges) !== JSON.stringify(nextBadges)) {
        writePointsLS(nextPoints);
        writeBadgesLS(nextBadges);
        
        // Solo disparar evento si es una aplicación web (no SSR)
        if (isBrowser() && typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent("gamification:update", {
              detail: { points: nextPoints, badges: nextBadges },
            }),
          );
        }
      }
    },
    [],
  );

  // Sincronizar puntos con Supabase cuando el usuario está autenticado
  const syncPointsToSupabase = React.useCallback(async (newPoints: number) => {
    if (user?.id && !isLoadingFromDB) {
      console.log('[GAMIFICATION] Sincronizando puntos a Supabase:', newPoints);
      await updatePointsInSupabase(user.id, newPoints, {
        email: user.email,
        name: user.name,
      });
    }
  }, [user, isLoadingFromDB]);

  const syncBadgesToSupabase = React.useCallback(async (currentBadges: string[]) => {
    if (user?.id && !isLoadingFromDB) {
      console.log('[GAMIFICATION] Sincronizando badges a Supabase:', currentBadges);
      await updateBadgesInSupabase(user.id, currentBadges);
    }
  }, [user, isLoadingFromDB]);

  // Flag para evitar procesamiento de eventos de storage durante actualizaciones manuales
  const isManualUpdate = React.useRef(false);
  
  React.useEffect(() => {
    if (!isBrowser()) return;

    let cancelled = false;
    let timeoutId: NodeJS.Timeout;

    const applyLocalStorageState = () => {
      const lsPoints = readPointsLS();
      const lsBadges = readBadgesLS();
      const normalizedBadges = ensureMilestoneBadges(lsPoints, lsBadges);
      console.log('[GAMIFICATION] Datos desde localStorage:', { lsPoints, lsBadges });

      isManualUpdate.current = true;
      setPointsState(lsPoints);
      setBadgesState(normalizedBadges);
      isManualUpdate.current = false;
    };

    const bootstrap = async () => {
      setIsLoadingFromDB(true);

      // SOLO limpiar datos falsos de gamificación, NO tocar puntos reales
      const currentPoints = readPointsLS();
      const currentBadges = readBadgesLS();
      
      // CORRECCIÓN PRECISA: Preservar EXACTAMENTE estas claves de datos reales
      const REAL_DATA_KEYS = [
        KEY_POINTS,      // 'oa_points' - puntos reales del usuario
        KEY_BADGES,      // 'oa_badges' - badges reales del usuario
        'completed_capsules', // cápsulas completadas por el usuario
        'userProfile'    // perfil del usuario
      ];
      
      const shouldPreserve = (key: string | null): boolean => {
        if (!key) return true;

        if (REAL_DATA_KEYS.includes(key)) {
          return true;
        }

        const normalized = key.toLowerCase();

        // Claves críticas de autenticación de Supabase (tokens y metadatos)
        if (normalized.includes('supabase') || key.startsWith('sb-')) {
          return true;
        }

        // Código de acceso de la plataforma
        if (normalized === 'access_code_valid') {
          return true;
        }

        return false;
      };

      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!shouldPreserve(key)) {
          // Solo eliminar claves que NO sean datos reales del usuario
          keysToRemove.push(key as string);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log('[GAMIFICATION] Limpieza localStorage completada:', keysToRemove.length, 'claves eliminadas, datos reales preservados');
      
      // Verificar si había puntos reales guardados
      if (currentPoints > 0 || currentBadges.length > 0) {
        console.log('[GAMIFICATION] Puntos/badges reales encontrados:', { currentPoints, currentBadges });
      }
      
      // SIMPLIFICADO: No esperar la sincronización del AuthContext, trabajar independientemente
      
      // Si el usuario está autenticado, cargar desde Supabase
      if (user?.id) {
        console.log('[GAMIFICATION] Usuario autenticado, cargando desde Supabase...');
        try {
          const supabaseData = await loadGamificationDataFromSupabase(user.id);
          if (cancelled) return;

          if (supabaseData) {
            console.log('[GAMIFICATION] Datos cargados desde Supabase:', supabaseData);
            const normalizedBadges = ensureMilestoneBadges(supabaseData.points, supabaseData.badges);

            isManualUpdate.current = true;
            setPointsState(supabaseData.points);
            setBadgesState(normalizedBadges);
            isManualUpdate.current = false;
          } else {
            console.warn('[GAMIFICATION] Supabase sin datos o con error, usando fallback de localStorage');
            applyLocalStorageState();
          }
        } catch (error) {
          console.error('[GAMIFICATION] Error cargando desde Supabase, usando fallback localStorage:', error);
          // Fallback a localStorage si falla Supabase
          applyLocalStorageState();
        }
        return;
      }

      // Si no está autenticado, usar localStorage
      console.log('[GAMIFICATION] Usuario no autenticado, usando localStorage...');
      const profile = await fetchProfile();
      if (cancelled) return;

      if (profile) {
        const nextPoints = Number(profile.points ?? 0);
        const nextBadges = Array.isArray(profile.badges)
          ? profile.badges.filter((item): item is string => typeof item === "string")
          : [];
        const normalizedBadges = ensureMilestoneBadges(nextPoints, nextBadges);
        
        isManualUpdate.current = true;
        setPointsState(nextPoints);
        setBadgesState(normalizedBadges);
        isManualUpdate.current = false;
        return;
      }

      applyLocalStorageState();
    } finally {
      setIsLoadingFromDB(false);
    };

    bootstrap();

    const onStorage = (event: StorageEvent) => {
      // NO procesar eventos de storage si es una actualización manual
      if (isManualUpdate.current) {
        return;
      }
      
      if (!event.key || (event.key !== KEY_POINTS && event.key !== KEY_BADGES)) {
        return;
      }
      
      console.log('[GAMIFICATION] Storage event recibido:', event.key);
      setPointsState(readPointsLS());
      setBadgesState(readBadgesLS());
    };

    window.addEventListener("storage", onStorage);

    return () => {
      cancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener("storage", onStorage);
    };
  }, [user]);  // SIMPLIFICADO: Solo dependencia en user

  React.useEffect(() => {
    if (!isBrowser() || isLoadingFromDB) return;
    
    // Sincronizar a localStorage y Supabase solo cuando no estamos cargando desde DB
    isManualUpdate.current = true;
    syncStorage(points, badges);
    void syncBadgesToSupabase(badges);
    isManualUpdate.current = false;
  }, [points, badges, isLoadingFromDB, syncBadgesToSupabase, syncStorage]);

  const setPoints = React.useCallback((value: number) => {
    const nextPoints = Math.max(0, value);
    setPointsState(nextPoints);
    syncMilestones(nextPoints);
    syncPointsToSupabase(nextPoints);
  }, [syncMilestones, syncPointsToSupabase]);

  const setBadges = React.useCallback((value: string[]) => {
    setBadgesState(prev => {
      const unique = Array.from(new Set(value));
      const combined = ensureMilestoneBadges(points, unique);
      if (combined.length === prev.length && combined.every((code, index) => code === prev[index])) {
        return prev;
      }
      return combined;
    });
  }, [points]);

  const addPoints = React.useCallback((delta: number) => {
    if (!Number.isFinite(delta) || delta === 0 || isSyncing || isLoadingFromDB) {
      console.log('[GAMIFICATION] addPoints cancelado:', { delta, isSyncing, isLoadingFromDB });
      return;
    }
    
    console.log('[GAMIFICATION] Agregando puntos:', delta);
    setPointsState(prev => {
      const nextPoints = Math.max(0, prev + delta);
      if (nextPoints !== prev) {
        syncMilestones(nextPoints);
        // Desincronizar para evitar bucle
        setTimeout(() => syncPointsToSupabase(nextPoints), 100);
      }
      return nextPoints;
    });
  }, [syncMilestones, syncPointsToSupabase, isSyncing, isLoadingFromDB]);

  const subtractPoints = React.useCallback((delta: number) => {
    if (!Number.isFinite(delta) || delta <= 0 || isSyncing || isLoadingFromDB) {
      if (delta < 0) {
        addPoints(-delta);
      }
      return;
    }
    
    console.log('[GAMIFICATION] Restando puntos:', delta);
    setPointsState(prev => {
      const nextPoints = Math.max(0, prev - delta);
      if (nextPoints !== prev) {
        syncMilestones(nextPoints);
      }
      return nextPoints;
    });
  }, [addPoints, syncMilestones, isSyncing, isLoadingFromDB]);

  const grantBadge = React.useCallback((code: string) => {
    if (typeof code !== "string" || code.length === 0) return;
    setBadgesState(prev => {
      const baseList = prev.includes(code) ? prev : [...prev, code];
      const combined = ensureMilestoneBadges(points, baseList);
      if (combined.length === prev.length && combined.every((value, index) => value === prev[index])) {
        return prev;
      }
      return combined;
    });
  }, [points]);

  const grantBadges = React.useCallback((codes: string[]) => {
    if (!codes.length) {
      setBadgesState(prev => ensureMilestoneBadges(points, prev));
      return;
    }
    setBadgesState(prev => {
      const filtered = codes.filter((code): code is string => typeof code === "string" && code.length > 0);
      if (filtered.length === 0) {
        const combined = ensureMilestoneBadges(points, prev);
        if (combined.length === prev.length && combined.every((value, index) => value === prev[index])) {
          return prev;
        }
        return combined;
      }
      const nextList = [...prev];
      filtered.forEach(code => {
        if (!nextList.includes(code)) {
          nextList.push(code);
        }
      });
      const combined = ensureMilestoneBadges(points, nextList);
      if (combined.length === prev.length && combined.every((value, index) => value === prev[index])) {
        return prev;
      }
      return combined;
    });
  }, [points]);

  const reset = React.useCallback(async () => {
    if (!isBrowser()) {
      setPointsState(0);
      setBadgesState([]);
      return;
    }

    // LIMPIEZA FORZADA: Limpiar localStorage al hacer reset
    clearLocalStorage();

    const response = await requestReset();
    if (response) {
      const nextPoints = Number(response.points ?? 0);
      const nextBadges = Array.isArray(response.badges)
        ? response.badges.filter((item): item is string => typeof item === "string")
        : [];
      const normalizedBadges = ensureMilestoneBadges(nextPoints, nextBadges);
      setPointsState(nextPoints);
      setBadgesState(normalizedBadges);
      return;
    }

    setPointsState(0);
    setBadgesState([]);
    syncMilestones(0);
  }, [syncMilestones]);

  const value = React.useMemo<GamificationContextValue>(
    () => ({ points, badges, setPoints, setBadges, addPoints, subtractPoints, grantBadge, grantBadges, reset }),
    [addPoints, badges, grantBadge, grantBadges, points, reset, setBadges, setPoints, subtractPoints],
  );

  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
}

export function useGamification() {
  const ctx = React.useContext(GamificationContext);
  if (!ctx) {
    throw new Error("useGamification must be used within GamificationProvider");
  }
  return ctx;
}

export { KEY_POINTS, KEY_BADGES };
