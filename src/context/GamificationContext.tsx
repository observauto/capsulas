
import React from "react";
import { useAuth } from "./AuthContext";
import {
  GamificationSnapshot,
  loadGamificationDataFromSupabase,
  persistGamificationProgress,
  readLocalGamificationData,
  writeLocalGamificationData,
} from "@/lib/gamification-sync";

const MILESTONE_BADGES = [
  { code: "beginner", threshold: 100 },
  { code: "intermediate", threshold: 500 },
  { code: "expert", threshold: 1000 },
] as const;

function ensureMilestoneBadges(points: number, badgesList: string[]): string[] {
  const baseList = Array.isArray(badgesList)
    ? badgesList.filter((code): code is string => typeof code === "string" && code.trim().length > 0)
    : [];
  const uniqueBadges = Array.from(new Set(baseList.map(code => code.trim())));
  const milestones = MILESTONE_BADGES.filter(item => points >= item.threshold).map(item => item.code);
  const combined = [...uniqueBadges];

  milestones.forEach(code => {
    if (!combined.includes(code)) {
      combined.push(code);
    }
  });

  return combined;
}

function arraysEqual(left: string[], right: string[]): boolean {
  if (left.length !== right.length) {
    return false;
  }
  return left.every((value, index) => value === right[index]);
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
  reset: () => Promise<void>;
};

const GamificationContext = React.createContext<GamificationContextValue | null>(null);

function mergeSnapshots(points: number, badges: string[]): GamificationSnapshot {
  const safePoints = Math.max(0, Math.floor(points));
  return {
    points: safePoints,
    badges: ensureMilestoneBadges(safePoints, badges),
  };
}

function computeBadgeKey(badges: string[]): string {
  return JSON.stringify([...badges].sort());
}

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [points, setPointsState] = React.useState(0);
  const [badges, setBadgesState] = React.useState<string[]>([]);
  const [hydrated, setHydrated] = React.useState(false);
  const [activeStorageUserId, setActiveStorageUserId] = React.useState<string | null>(null);

  const isBootstrappingRef = React.useRef(false);
  const lastPersistedRef = React.useRef<{ points: number; badgeKey: string } | null>(null);
  const remoteProfileExistsRef = React.useRef(false);
  const activeStorageUserIdRef = React.useRef<string | null>(null);

  const applySnapshot = React.useCallback((snapshot: GamificationSnapshot) => {
    setPointsState(snapshot.points);
    setBadgesState(snapshot.badges);
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    const storageUserId = user?.id ?? null;
    isBootstrappingRef.current = true;
    setHydrated(false);
    setActiveStorageUserId(storageUserId);
    activeStorageUserIdRef.current = storageUserId;
    const localStored = readLocalGamificationData(storageUserId);
    const localSnapshot = mergeSnapshots(localStored.points, localStored.badges);
    remoteProfileExistsRef.current = false;
    lastPersistedRef.current = null;

    const bootstrap = async () => {
      let mergedPoints = localSnapshot.points;
      let mergedBadges = localSnapshot.badges;

      if (user?.id) {
        try {
          const remoteResult = await loadGamificationDataFromSupabase(user.id);
          if (cancelled) {
            return;
          }

          if (remoteResult.status === "error") {
            console.error("[GAMIFICATION] No se pudo cargar progreso remoto:", remoteResult.error);
          } else if (remoteResult.snapshot) {
            remoteProfileExistsRef.current = remoteResult.profileExists;
            const remoteSnapshot = mergeSnapshots(
              remoteResult.snapshot.points,
              remoteResult.snapshot.badges,
            );
            mergedPoints = Math.max(remoteSnapshot.points, mergedPoints);
            mergedBadges = ensureMilestoneBadges(
              mergedPoints,
              [...remoteSnapshot.badges, ...mergedBadges],
            );

            const badgeKeyRemote = computeBadgeKey(remoteSnapshot.badges);
            const badgeKeyMerged = computeBadgeKey(mergedBadges);

            if (remoteSnapshot.points !== mergedPoints || badgeKeyRemote !== badgeKeyMerged) {
              try {
                await persistGamificationProgress(
                  user.id,
                  { points: mergedPoints, badges: mergedBadges },
                  { email: user.email, name: user.name },
                  { knownProfileExists: true },
                );
              } catch (error) {
                console.error("[GAMIFICATION] Error persistiendo progreso fusionado:", error);
              }
            }
          } else {
            remoteProfileExistsRef.current = remoteResult.profileExists;
            try {
              await persistGamificationProgress(
                user.id,
                { points: mergedPoints, badges: mergedBadges },
                { email: user.email, name: user.name },
                { knownProfileExists: false },
              );
              remoteProfileExistsRef.current = true;
            } catch (error) {
              console.error("[GAMIFICATION] Error creando progreso remoto inicial:", error);
            }
          }
        } catch (error) {
          console.error("[GAMIFICATION] Error cargando datos remotos:", error);
        }
      }

      if (cancelled) {
        return;
      }

      const finalSnapshot = mergeSnapshots(mergedPoints, mergedBadges);
      applySnapshot(finalSnapshot);
      writeLocalGamificationData(finalSnapshot, storageUserId);
      setHydrated(true);
      isBootstrappingRef.current = false;
      lastPersistedRef.current = {
        points: finalSnapshot.points,
        badgeKey: computeBadgeKey(finalSnapshot.badges),
      };
    };

    bootstrap().catch(error => {
      console.error("[GAMIFICATION] Error durante bootstrap:", error);
      if (!cancelled) {
        applySnapshot(localSnapshot);
        writeLocalGamificationData(localSnapshot, storageUserId);
        setHydrated(true);
        isBootstrappingRef.current = false;
        lastPersistedRef.current = {
          points: localSnapshot.points,
          badgeKey: computeBadgeKey(localSnapshot.badges),
        };
      }
    });

    return () => {
      cancelled = true;
    };
  }, [applySnapshot, user]);

  React.useEffect(() => {
    if (!hydrated) {
      return;
    }
    if (isBootstrappingRef.current) {
      return;
    }

    writeLocalGamificationData(mergeSnapshots(points, badges), activeStorageUserIdRef.current);
  }, [badges, hydrated, points, activeStorageUserId]);

  React.useEffect(() => {
    if (!hydrated || !user?.id || isBootstrappingRef.current) {
      return;
    }

    const snapshot = mergeSnapshots(points, badges);
    const badgeKey = computeBadgeKey(snapshot.badges);
    const lastPersisted = lastPersistedRef.current;

    if (lastPersisted && lastPersisted.points === snapshot.points && lastPersisted.badgeKey === badgeKey) {
      return;
    }

    let cancelled = false;

    persistGamificationProgress(
      user.id,
      snapshot,
      { email: user.email, name: user.name },
      { knownProfileExists: remoteProfileExistsRef.current },
    )
      .then(() => {
        if (!cancelled) {
          lastPersistedRef.current = { points: snapshot.points, badgeKey };
          remoteProfileExistsRef.current = true;
        }
      })
      .catch(error => {
        console.error("[GAMIFICATION] Error sincronizando progreso:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [badges, hydrated, points, user]);

  const setPoints = React.useCallback((value: number) => {
    const nextPoints = Math.max(0, Math.floor(value));
    setPointsState(prev => {
      if (prev === nextPoints) {
        return prev;
      }
      setBadgesState(current => ensureMilestoneBadges(nextPoints, current));
      return nextPoints;
    });
  }, []);

  const setBadges = React.useCallback(
    (value: string[]) => {
      const nextBadges = ensureMilestoneBadges(points, value);
      setBadgesState(prev => (arraysEqual(prev, nextBadges) ? prev : nextBadges));
    },
    [points],
  );

  const addPoints = React.useCallback((delta: number) => {
    if (!Number.isFinite(delta) || delta === 0) {
      return;
    }
    setPointsState(prev => {
      const nextPoints = Math.max(0, Math.floor(prev + delta));
      if (nextPoints === prev) {
        return prev;
      }
      setBadgesState(current => ensureMilestoneBadges(nextPoints, current));
      return nextPoints;
    });
  }, []);

  const subtractPoints = React.useCallback((delta: number) => {
    if (!Number.isFinite(delta) || delta <= 0) {
      return;
    }
    addPoints(-delta);
  }, [addPoints]);

  const grantBadge = React.useCallback(
    (code: string) => {
      if (typeof code !== "string" || code.trim().length === 0) {
        return;
      }
      const trimmed = code.trim();
      setBadgesState(prev => {
        if (prev.includes(trimmed)) {
          return ensureMilestoneBadges(points, prev);
        }
        return ensureMilestoneBadges(points, [...prev, trimmed]);
      });
    },
    [points],
  );

  const grantBadges = React.useCallback(
    (codes: string[]) => {
      if (!Array.isArray(codes) || codes.length === 0) {
        setBadgesState(prev => ensureMilestoneBadges(points, prev));
        return;
      }
      const normalized = codes
        .filter((code): code is string => typeof code === "string")
        .map(code => code.trim())
        .filter(code => code.length > 0);
      setBadgesState(prev => ensureMilestoneBadges(points, [...prev, ...normalized]));
    },
    [points],
  );

  const reset = React.useCallback(async () => {
    const snapshot = mergeSnapshots(0, []);
    applySnapshot(snapshot);
    writeLocalGamificationData(snapshot, activeStorageUserIdRef.current);

    if (user?.id) {
      try {
        await persistGamificationProgress(
          user.id,
          snapshot,
          { email: user.email, name: user.name },
          { knownProfileExists: remoteProfileExistsRef.current },
        );
        lastPersistedRef.current = { points: snapshot.points, badgeKey: computeBadgeKey(snapshot.badges) };
        remoteProfileExistsRef.current = true;
      } catch (error) {
        console.error("[GAMIFICATION] Error reseteando progreso:", error);
      }
    }
  }, [applySnapshot, user]);

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
