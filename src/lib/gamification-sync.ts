import { supabase } from "./supabase";
import {
  GAMIFICATION_STORE_KEY,
  LEGACY_BADGES_KEY,
  LEGACY_OWNER_KEY,
  LEGACY_POINTS_KEY,
  normalizeUserId,
} from "./gamification-keys";

export type GamificationSnapshot = {
  points: number;
  badges: string[];
};

export type LocalGamificationRecord = {
  snapshot: GamificationSnapshot;
  updatedAt: string | null;
  lastLocalUpdate: string | null;
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

const STORE_VERSION = 1;

type StoredGamificationEntry = LocalGamificationRecord;

type LocalGamificationStore = {
  version: typeof STORE_VERSION;
  users: Record<string, StoredGamificationEntry>;
  guest: StoredGamificationEntry;
};

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

function emptySnapshot(): GamificationSnapshot {
  return { points: 0, badges: [] };
}

function sanitizeTimestamp(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const ms = Date.parse(trimmed);
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
}

function nowIso(): string {
  return new Date().toISOString();
}

function cloneSnapshot(snapshot?: GamificationSnapshot | null): GamificationSnapshot {
  if (!snapshot) {
    return emptySnapshot();
  }
  return {
    points: normalizePoints(snapshot.points),
    badges: normalizeBadges(snapshot.badges),
  };
}

function emptyEntry(): StoredGamificationEntry {
  return {
    snapshot: emptySnapshot(),
    updatedAt: null,
    lastLocalUpdate: null,
  };
}

function cloneEntry(entry?: Partial<StoredGamificationEntry> | null): StoredGamificationEntry {
  if (!entry) {
    return emptyEntry();
  }
  return {
    snapshot: cloneSnapshot(entry.snapshot ?? emptySnapshot()),
    updatedAt: sanitizeTimestamp(entry.updatedAt),
    lastLocalUpdate: sanitizeTimestamp(entry.lastLocalUpdate),
  };
}

function persistStore(store: LocalGamificationStore): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(GAMIFICATION_STORE_KEY, JSON.stringify(store));
    window.localStorage.removeItem(LEGACY_POINTS_KEY);
    window.localStorage.removeItem(LEGACY_BADGES_KEY);
    window.localStorage.removeItem(LEGACY_OWNER_KEY);
  } catch (error) {
    console.error("[GAMIFICATION] Error guardando store local de gamificación:", error);
  }
}

function migrateLegacyStore(): LocalGamificationStore {
  const store: LocalGamificationStore = {
    version: STORE_VERSION,
    users: {},
    guest: emptyEntry(),
  };

  if (!isBrowser()) {
    return store;
  }

  try {
    const legacyPointsRaw = window.localStorage.getItem(LEGACY_POINTS_KEY);
    const legacyBadgesRaw = window.localStorage.getItem(LEGACY_BADGES_KEY);

    if (legacyPointsRaw === null && legacyBadgesRaw === null) {
      return store;
    }

    const snapshot: GamificationSnapshot = {
      points: legacyPointsRaw ? normalizePoints(legacyPointsRaw) : 0,
      badges: legacyBadgesRaw ? normalizeBadges(JSON.parse(legacyBadgesRaw)) : [],
    };

    const legacyOwner = window.localStorage.getItem(LEGACY_OWNER_KEY);
    const normalizedOwner = normalizeUserId(legacyOwner);
    const migratedEntry: StoredGamificationEntry = {
      snapshot,
      updatedAt: null,
      lastLocalUpdate: nowIso(),
    };

    if (normalizedOwner) {
      store.users[normalizedOwner] = migratedEntry;
    } else {
      store.guest = migratedEntry;
    }
  } catch (error) {
    console.error("[GAMIFICATION] Error migrando datos legacy de gamificación:", error);
  }

  return store;
}

function loadStore(): LocalGamificationStore {
  if (!isBrowser()) {
    return {
      version: STORE_VERSION,
      users: {},
      guest: emptyEntry(),
    };
  }

  try {
    const raw = window.localStorage.getItem(GAMIFICATION_STORE_KEY);
    if (!raw) {
      const migrated = migrateLegacyStore();
      persistStore(migrated);
      return migrated;
    }

    const parsed = JSON.parse(raw) as Partial<LocalGamificationStore> | null;
    if (!parsed || parsed.version !== STORE_VERSION || typeof parsed !== "object") {
      const reset: LocalGamificationStore = {
        version: STORE_VERSION,
        users: {},
        guest: emptyEntry(),
      };
      persistStore(reset);
      return reset;
    }

    const sanitizedUsers: Record<string, StoredGamificationEntry> = {};
    if (parsed.users && typeof parsed.users === "object") {
      for (const [key, value] of Object.entries(parsed.users)) {
        const normalizedKey = normalizeUserId(key) ?? key;
        if (typeof normalizedKey === "string" && normalizedKey.length > 0) {
          sanitizedUsers[normalizedKey] = cloneEntry(value as StoredGamificationEntry);
        }
      }
    }

    return {
      version: STORE_VERSION,
      users: sanitizedUsers,
      guest: cloneEntry(parsed.guest),
    };
  } catch (error) {
    console.error("[GAMIFICATION] Error cargando store local de gamificación:", error);
    const fallback: LocalGamificationStore = {
      version: STORE_VERSION,
      users: {},
      guest: emptyEntry(),
    };
    persistStore(fallback);
    return fallback;
  }
}

export function readLocalGamificationData(userId?: string | null): LocalGamificationRecord {
  if (!isBrowser()) {
    return emptyEntry();
  }

  try {
    const normalizedUser = normalizeUserId(userId);
    const store = loadStore();

    if (normalizedUser) {
      return cloneEntry(store.users[normalizedUser]);
    }

    return cloneEntry(store.guest);
  } catch (error) {
    console.error("[GAMIFICATION] Error leyendo snapshot local de gamificación:", error);
    return emptyEntry();
  }
}

export function writeLocalGamificationData(
  snapshot: GamificationSnapshot,
  userId?: string | null,
  meta?: Partial<Pick<LocalGamificationRecord, "updatedAt" | "lastLocalUpdate">>,
): void {
  if (!isBrowser()) {
    return;
  }

  try {
    const normalizedUser = normalizeUserId(userId);
    const store = loadStore();
    const sanitizedSnapshot = cloneSnapshot(snapshot);
    const targetEntry = normalizedUser ? store.users[normalizedUser] : store.guest;
    const existing = targetEntry ? cloneEntry(targetEntry) : emptyEntry();

    const nextEntry: StoredGamificationEntry = {
      snapshot: sanitizedSnapshot,
      updatedAt:
        meta && Object.prototype.hasOwnProperty.call(meta, "updatedAt")
          ? sanitizeTimestamp(meta.updatedAt ?? null)
          : existing.updatedAt,
      lastLocalUpdate:
        meta && Object.prototype.hasOwnProperty.call(meta, "lastLocalUpdate")
          ? sanitizeTimestamp(meta.lastLocalUpdate ?? nowIso()) ?? nowIso()
          : nowIso(),
    };

    if (normalizedUser) {
      store.users[normalizedUser] = nextEntry;
    } else {
      store.guest = nextEntry;
    }

    persistStore(store);
  } catch (error) {
    console.error("[GAMIFICATION] Error escribiendo snapshot local de gamificación:", error);
  }
}

export function clearLocalGamificationData(userId?: string | null): void {
  if (!isBrowser()) {
    return;
  }

  try {
    const normalizedUser = normalizeUserId(userId);
    const store = loadStore();

    if (normalizedUser) {
      delete store.users[normalizedUser];
    } else {
      store.guest = emptyEntry();
    }

    persistStore(store);
  } catch (error) {
    console.error("[GAMIFICATION] Error limpiando datos locales de gamificación:", error);
  }
}

type RemoteGamificationLoad =
  | {
      status: "success";
      snapshot: (GamificationSnapshot & { level: number; updatedAt: string | null }) | null;
      profileExists: boolean;
    }
  | {
      status: "error";
      error: string;
    };

function parseTimestamp(value: string | null | undefined): number {
  if (!value) {
    return 0;
  }
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : 0;
}

export async function loadGamificationDataFromSupabase(userId: string): Promise<RemoteGamificationLoad> {
  try {
    const { data: profileRow, error: profileError } = await supabase
      .from("user_profiles")
      .select("points, level, updated_at")
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
        updatedAt: sanitizeTimestamp(profileRow.updated_at),
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
): Promise<string> {
  const points = normalizePoints(snapshot.points);
  const badges = normalizeBadges(snapshot.badges);
  const timestamp = nowIso();
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
  return timestamp;
}

export async function fullSync(userId: string, userEmail: string | null): Promise<FullSyncResult> {
  try {
    const localRecord = readLocalGamificationData(userId);
    const localSnapshot = cloneSnapshot(localRecord.snapshot);
    const localLastUpdate = parseTimestamp(localRecord.lastLocalUpdate);

    const remoteResult = await loadGamificationDataFromSupabase(userId);

    if (remoteResult.status === "error") {
      return {
        success: false,
        pointsMigrated: 0,
        badgesMigrated: 0,
        finalPoints: localSnapshot.points,
        error: remoteResult.error,
      };
    }

    let remotePoints = 0;
    let remoteBadges: string[] = [];
    let remoteUpdatedAt = 0;

    if (remoteResult.snapshot) {
      remotePoints = normalizePoints(remoteResult.snapshot.points);
      remoteBadges = normalizeBadges(remoteResult.snapshot.badges);
      remoteUpdatedAt = parseTimestamp(remoteResult.snapshot.updatedAt);
    }

    let finalSnapshot = cloneSnapshot(localSnapshot);
    let shouldPersist = true;

    if (remoteResult.snapshot) {
      if (remoteUpdatedAt >= localLastUpdate) {
        finalSnapshot = {
          points: remotePoints,
          badges: remoteBadges,
        };
        shouldPersist = false;
        writeLocalGamificationData(finalSnapshot, userId, {
          updatedAt: remoteResult.snapshot.updatedAt,
          lastLocalUpdate: remoteResult.snapshot.updatedAt,
        });
        return {
          success: true,
          pointsMigrated: 0,
          badgesMigrated: 0,
          finalPoints: finalSnapshot.points,
        };
      }

      finalSnapshot = {
        points: Math.max(remotePoints, localSnapshot.points),
        badges: normalizeBadges([...remoteBadges, ...localSnapshot.badges]),
      };
    } else {
      shouldPersist = finalSnapshot.points > 0 || finalSnapshot.badges.length > 0;
    }

    if (!shouldPersist) {
      return {
        success: true,
        pointsMigrated: 0,
        badgesMigrated: 0,
        finalPoints: finalSnapshot.points,
      };
    }

    const persistedAt = await persistGamificationProgress(
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

    writeLocalGamificationData(finalSnapshot, userId, {
      updatedAt: persistedAt,
      lastLocalUpdate: persistedAt,
    });

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
