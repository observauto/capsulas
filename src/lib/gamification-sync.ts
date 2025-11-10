import { supabase } from "./supabase";
import { KEY_BADGES, KEY_POINTS } from "./gamification-keys";

export type GamificationSnapshot = {
  points: number;
  badges: string[];
};

export type FullSyncResult = {
  success: boolean;
  pointsMigrated: number;
  badgesMigrated: number;
  finalPoints: number;
  error?: string;
};

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function normalizePoints(value: unknown): number {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) {
    return 0;
  }
  return Math.floor(numeric);
}

function normalizeBadges(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return Array.from(
    new Set(
      value
        .filter((entry): entry is string => typeof entry === "string")
        .map(entry => entry.trim())
        .filter(entry => entry.length > 0),
    ),
  );
}

export function readLocalGamificationData(): GamificationSnapshot {
  if (!isBrowser()) {
    return { points: 0, badges: [] };
  }

  try {
    const storedPoints = window.localStorage.getItem(KEY_POINTS);
    const storedBadges = window.localStorage.getItem(KEY_BADGES);

    return {
      points: storedPoints ? normalizePoints(storedPoints) : 0,
      badges: storedBadges ? normalizeBadges(JSON.parse(storedBadges)) : [],
    };
  } catch (error) {
    console.error("[GAMIFICATION] Error leyendo localStorage:", error);
    return { points: 0, badges: [] };
  }
}

export function writeLocalGamificationData(snapshot: GamificationSnapshot): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(KEY_POINTS, String(normalizePoints(snapshot.points)));
    window.localStorage.setItem(KEY_BADGES, JSON.stringify(normalizeBadges(snapshot.badges)));
  } catch (error) {
    console.error("[GAMIFICATION] Error escribiendo localStorage:", error);
  }
}

export function clearLocalGamificationData(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(KEY_POINTS);
    window.localStorage.removeItem(KEY_BADGES);
  } catch (error) {
    console.error("[GAMIFICATION] Error limpiando localStorage:", error);
  }
}

type RemoteGamificationLoad =
  | {
      status: "success";
      snapshot: (GamificationSnapshot & { level: number }) | null;
      profileExists: boolean;
    }
  | {
      status: "error";
      error: string;
    };

export async function loadGamificationDataFromSupabase(userId: string): Promise<RemoteGamificationLoad> {
  try {
    const { data: profileRow, error: profileError } = await supabase
      .from("user_profiles")
      .select("points, level")
      .eq("user_id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("[GAMIFICATION] Error cargando perfil de Supabase:", profileError);
      return {
        status: "error",
        error: profileError.message || "Unknown Supabase profile error",
      };
    }

    const { data: achievementsData, error: achievementsError } = await supabase
      .from("user_achievements")
      .select("achievement:achievements(achievement_code)")
      .eq("user_id", userId);

    if (achievementsError) {
      console.error("[GAMIFICATION] Error cargando logros de Supabase:", achievementsError);
    }

    const badges = achievementsError
      ? []
      : achievementsData?.map(record => record.achievement?.achievement_code).filter((code): code is string => Boolean(code)) || [];

    if (!profileRow) {
      return {
        status: "success",
        snapshot: null,
        profileExists: false,
      };
    }

    return {
      status: "success",
      snapshot: {
        points: normalizePoints(profileRow.points ?? 0),
        badges: normalizeBadges(badges),
        level: normalizePoints(profileRow.level ?? 1) || 1,
      },
      profileExists: true,
    };
  } catch (error) {
    console.error("[GAMIFICATION] Error general leyendo Supabase:", error);
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown Supabase error",
    };
  }
}

function difference<T>(source: T[], exclude: T[]): T[] {
  const excludeSet = new Set(exclude);
  return source.filter(item => !excludeSet.has(item));
}

async function fetchExistingBadgeCodes(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("user_achievements")
      .select("achievement:achievements(achievement_code)")
      .eq("user_id", userId);

    if (error) {
      console.error("[GAMIFICATION] Error obteniendo badges existentes:", error);
      return [];
    }

    return (
      data?.map(record => record.achievement?.achievement_code).filter((code): code is string => Boolean(code)) || []
    );
  } catch (error) {
    console.error("[GAMIFICATION] Error inesperado obteniendo badges existentes:", error);
    return [];
  }
}

async function ensureBadges(userId: string, desiredBadges: string[]): Promise<number> {
  const uniqueDesired = normalizeBadges(desiredBadges);
  if (uniqueDesired.length === 0) {
    return 0;
  }

  const existing = await fetchExistingBadgeCodes(userId);
  const missing = difference(uniqueDesired, existing);

  if (missing.length === 0) {
    return 0;
  }

  const { data: achievementRecords, error: achievementError } = await supabase
    .from("achievements")
    .select("id, achievement_code")
    .in("achievement_code", missing);

  if (achievementError) {
    console.error("[GAMIFICATION] Error obteniendo metadatos de badges:", achievementError);
    return 0;
  }

  const rows = (achievementRecords || [])
    .map(record => {
      if (!record?.id || !record?.achievement_code) {
        return null;
      }
      return {
        user_id: userId,
        achievement_id: record.id,
        earned_at: new Date().toISOString(),
        times_earned: 1,
      };
    })
    .filter((entry): entry is { user_id: string; achievement_id: string; earned_at: string; times_earned: number } => Boolean(entry));

  if (!rows.length) {
    return 0;
  }

  const { error: insertError } = await supabase.from("user_achievements").insert(rows);

  if (insertError) {
    console.error("[GAMIFICATION] Error guardando nuevos badges:", insertError);
    return 0;
  }

  return rows.length;
}

type PersistMetadata = { email?: string | null; name?: string | null };

type PersistOptions = {
  /**
   * Indica si ya existe un perfil remoto para evitar sobrescribir campos
   * sensibles (por ejemplo, el role) al realizar un upsert.
   */
  knownProfileExists?: boolean;
};

export async function persistGamificationProgress(
  userId: string,
  snapshot: GamificationSnapshot,
  metadata?: PersistMetadata,
  options?: PersistOptions,
): Promise<void> {
  const points = normalizePoints(snapshot.points);
  const badges = normalizeBadges(snapshot.badges);
  const timestamp = new Date().toISOString();
  const level = Math.max(1, Math.floor(points / 100) + 1);

  const basePayload: Record<string, string | number | null> = {
    user_id: userId,
    points,
    level,
    updated_at: timestamp,
  };

  if (!options?.knownProfileExists) {
    basePayload.role = "end_user";
  }

  if (metadata?.email) {
    basePayload.email = metadata.email;
  }

  const trimmedName = metadata?.name?.trim();
  if (trimmedName) {
    basePayload.name = trimmedName;
  }

  const { error: upsertError } = await supabase
    .from("user_profiles")
    .upsert(basePayload, { onConflict: "user_id", ignoreDuplicates: false })
    .select("user_id")
    .maybeSingle();

  if (upsertError) {
    console.error("[GAMIFICATION] Error guardando perfil de usuario:", upsertError);
    throw upsertError;
  }

  await ensureBadges(userId, badges);
}

export async function fullSync(userId: string, userEmail: string | null): Promise<FullSyncResult> {
  try {
    const localSnapshot = readLocalGamificationData();
    const normalizedLocal: GamificationSnapshot = {
      points: normalizePoints(localSnapshot.points),
      badges: normalizeBadges(localSnapshot.badges),
    };

    const remoteResult = await loadGamificationDataFromSupabase(userId);

    if (remoteResult.status === "error") {
      return {
        success: false,
        pointsMigrated: 0,
        badgesMigrated: 0,
        finalPoints: normalizedLocal.points,
        error: remoteResult.error,
      };
    }

    const remoteSnapshot = remoteResult.snapshot
      ? {
          points: normalizePoints(remoteResult.snapshot.points),
          badges: normalizeBadges(remoteResult.snapshot.badges),
        }
      : null;

    const remotePoints = remoteSnapshot?.points ?? 0;
    const remoteBadges = remoteSnapshot?.badges ?? [];

    const finalSnapshot: GamificationSnapshot = remoteSnapshot
      ? {
          points: Math.max(remoteSnapshot.points, normalizedLocal.points),
          badges: normalizeBadges([...remoteSnapshot.badges, ...normalizedLocal.badges]),
        }
      : normalizedLocal;

    await persistGamificationProgress(
      userId,
      finalSnapshot,
      {
        email: userEmail,
        name: userEmail?.split("@")[0] ?? null,
      },
      {
        knownProfileExists: remoteResult.profileExists,
      },
    );

    const migratedBadges = finalSnapshot.badges.filter(code => !remoteBadges.includes(code)).length;

    return {
      success: true,
      pointsMigrated: Math.max(0, finalSnapshot.points - remotePoints),
      badgesMigrated: migratedBadges,
      finalPoints: finalSnapshot.points,
    };
  } catch (error) {
    console.error("[GAMIFICATION] Error durante sincronización completa:", error);
    return {
      success: false,
      pointsMigrated: 0,
      badgesMigrated: 0,
      finalPoints: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
