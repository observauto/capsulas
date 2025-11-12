// Ruta del archivo: src/lib/gamification-sync.ts

import { supabase } from "./supabase";
import { readUserScopedJSON, writeUserScopedJSON, clearUserScopedValue } from "./user-storage";
import { GAMIFICATION_STORE_KEY, LEGACY_BADGES_KEY, LEGACY_OWNER_KEY, LEGACY_POINTS_KEY, normalizeUserId } from "./gamification-keys";

export type GamificationSnapshot = { points: number; badges: string[]; };
export type LocalGamificationRecord = { snapshot: GamificationSnapshot; updatedAt: string | null; lastLocalUpdate: string | null; };
export type FullSyncResult = { success: boolean; pointsMigrated: number; badgesMigrated: number; finalPoints: number; error?: string; };

const STORE_VERSION = 1;
type StoredGamificationEntry = LocalGamificationRecord;
type LocalGamificationStore = { version: typeof STORE_VERSION; users: Record<string, StoredGamificationEntry>; guest: StoredGamificationEntry; };

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
  if (!isBrowser()) { return; }
  try {
    window.localStorage.setItem(GAMIFICATION_STORE_KEY, JSON.stringify(store));
    window.localStorage.removeItem(LEGACY_POINTS_KEY);
    window.localStorage.removeItem(LEGACY_BADGES_KEY);
    window.localStorage.removeItem(LEGACY_OWNER_KEY);
  } catch (error) {
    console.error("[GAMIFICATION] Error guardando store local:", error);
  }
}

function migrateLegacyStore(): LocalGamificationStore {
  const store: LocalGamificationStore = { version: STORE_VERSION, users: {}, guest: emptyEntry() };
  if (!isBrowser()) { return store; }
  try {
    const legacyPointsRaw = window.localStorage.getItem(LEGACY_POINTS_KEY);
    const legacyBadgesRaw = window.localStorage.getItem(LEGACY_BADGES_KEY);
    if (legacyPointsRaw === null && legacyBadgesRaw === null) { return store; }
    const snapshot: GamificationSnapshot = { points: legacyPointsRaw ? normalizePoints(legacyPointsRaw) : 0, badges: legacyBadgesRaw ? normalizeBadges(JSON.parse(legacyBadgesRaw)) : [], };
    const legacyOwner = window.localStorage.getItem(LEGACY_OWNER_KEY);
    const normalizedOwner = normalizeUserId(legacyOwner);
    const migratedEntry: StoredGamificationEntry = { snapshot, updatedAt: null, lastLocalUpdate: nowIso(), };
    if (normalizedOwner) { store.users[normalizedOwner] = migratedEntry; } else { store.guest = migratedEntry; }
  } catch (error) { console.error("[GAMIFICATION] Error migrando datos legacy:", error); }
  return store;
}

function loadStore(): LocalGamificationStore {
  if (!isBrowser()) { return { version: STORE_VERSION, users: {}, guest: emptyEntry(), }; }
  try {
    const raw = window.localStorage.getItem(GAMIFICATION_STORE_KEY);
    if (!raw) {
      const migrated = migrateLegacyStore();
      persistStore(migrated);
      return migrated;
    }
    const parsed = JSON.parse(raw) as Partial<LocalGamificationStore> | null;
    if (!parsed || parsed.version !== STORE_VERSION || typeof parsed !== "object") {
      const reset: LocalGamificationStore = { version: STORE_VERSION, users: {}, guest: emptyEntry(), };
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
    return { version: STORE_VERSION, users: sanitizedUsers, guest: cloneEntry(parsed.guest), };
  } catch (error) {
    console.error("[GAMIFICATION] Error cargando store local:", error);
    const fallback: LocalGamificationStore = { version: STORE_VERSION, users: {}, guest: emptyEntry(), };
    persistStore(fallback);
    return fallback;
  }
}

export function readLocalGamificationData(userId?: string | null): LocalGamificationRecord {
  if (!isBrowser()) { return emptyEntry(); }
  try {
    const normalizedUser = normalizeUserId(userId);
    const store = loadStore();
    return cloneEntry(normalizedUser ? store.users[normalizedUser] : store.guest);
  } catch (error) {
    console.error("[GAMIFICATION] Error leyendo snapshot local:", error);
    return emptyEntry();
  }
}

export function writeLocalGamificationData(snapshot: GamificationSnapshot, userId?: string | null, meta?: Partial<Pick<LocalGamificationRecord, "updatedAt" | "lastLocalUpdate">>): void {
  if (!isBrowser()) return;
  try {
    const normalizedUser = normalizeUserId(userId);
    const store = loadStore();
    const sanitizedSnapshot = cloneSnapshot(snapshot);
    const targetEntry = normalizedUser ? store.users[normalizedUser] : store.guest;
    const existing = targetEntry ? cloneEntry(targetEntry) : emptyEntry();
    const nextEntry: StoredGamificationEntry = {
      snapshot: sanitizedSnapshot,
      updatedAt: meta && Object.prototype.hasOwnProperty.call(meta, "updatedAt") ? sanitizeTimestamp(meta.updatedAt) : existing.updatedAt,
      lastLocalUpdate: meta && Object.prototype.hasOwnProperty.call(meta, "lastLocalUpdate") ? sanitizeTimestamp(meta.lastLocalUpdate ?? nowIso()) ?? nowIso() : nowIso(),
    };
    if (normalizedUser) { store.users[normalizedUser] = nextEntry; } else { store.guest = nextEntry; }
    persistStore(store);
  } catch (e) { console.error(e); }
}

export function clearLocalGamificationData(userId?: string | null): void {
  if (!isBrowser()) return;
  try {
    const normalizedUser = normalizeUserId(userId);
    const store = loadStore();
    if (normalizedUser) { delete store.users[normalizedUser]; } else { store.guest = emptyEntry(); }
    persistStore(store);
  } catch (e) { console.error(e); }
}

type RemoteGamificationLoad = { status: "success"; snapshot: (GamificationSnapshot & { level: number; updatedAt: string | null }) | null; profileExists: boolean; } | { status: "error"; error: string; };

export async function loadGamificationDataFromSupabase(userId: string): Promise<RemoteGamificationLoad> {
  try {
    const { data: profileRow, error: profileError } = await supabase.from("user_profiles").select("points, level, updated_at").eq("user_id", userId).maybeSingle();
    if (profileError) { return { status: "error", error: profileError.message }; }
    const { data: achievementsData, error: achievementsError } = await supabase.from("user_achievements").select("achievement:achievements(achievement_code)").eq("user_id", userId);
    const badges = achievementsError ? [] : achievementsData?.map(r => r.achievement?.achievement_code).filter((c): c is string => !!c) || [];
    if (!profileRow) { return { status: "success", snapshot: null, profileExists: false }; }
    return { status: "success", snapshot: { points: normalizePoints(profileRow.points), badges: normalizeBadges(badges), level: normalizePoints(profileRow.level), updatedAt: sanitizeTimestamp(profileRow.updated_at) }, profileExists: true };
  } catch (e) { return { status: "error", error: e instanceof Error ? e.message : "Error desconocido" }; }
}

async function ensureBadges(userId: string, desiredBadges: string[]): Promise<number> {
  const uniqueDesired = normalizeBadges(desiredBadges);
  if (uniqueDesired.length === 0) return 0;
  const { data: existingData } = await supabase.from("user_achievements").select("achievement:achievements(achievement_code)").eq("user_id", userId);
  const existingBadges = existingData?.map(r => r.achievement?.achievement_code).filter((c): c is string => !!c) || [];
  const missingBadges = uniqueDesired.filter(b => !existingBadges.includes(b));
  if (missingBadges.length === 0) return 0;
  const { data: achievements, error: achievementsError } = await supabase.from("achievements").select("id, achievement_code").in("achievement_code", missingBadges);
  if (achievementsError || !achievements) return 0;
  const payload = achievements.map(a => ({ user_id: userId, achievement_id: a.id, earned_at: nowIso(), times_earned: 1 }));
  if (payload.length === 0) return 0;
  const { error: insertError } = await supabase.from("user_achievements").insert(payload);
  return insertError ? 0 : payload.length;
}

export async function persistGamificationProgress(userId: string, snapshot: GamificationSnapshot, metadata?: {email?: string|null, name?: string|null}, options?: {knownProfileExists?: boolean}): Promise<string> {
  const points = normalizePoints(snapshot.points);
  const badges = normalizeBadges(snapshot.badges);
  const timestamp = nowIso();
  const level = Math.max(1, Math.floor(points / 100) + 1);
  const payload: Record<string, any> = { user_id: userId, points, level, updated_at: timestamp };
  if (!options?.knownProfileExists) { payload.role = "end_user"; }
  if (metadata?.email) { payload.email = metadata.email; }
  const trimmedName = metadata?.name?.trim();
  if (trimmedName) { payload.name = trimmedName; }
  const { error: upsertError } = await supabase.from("user_profiles").upsert(payload, { onConflict: "user_id" });
  if (upsertError) throw upsertError;
  await ensureBadges(userId, badges);
  return timestamp;
}

export async function fullSync(userId: string, userEmail: string | null): Promise<FullSyncResult> {
  try {
    const guestRecord = readLocalGamificationData(null);
    const userRecord = readLocalGamificationData(userId);
    
    const remoteResult = await loadGamificationDataFromSupabase(userId);
    if (remoteResult.status === "error") {
      return { success: false, pointsMigrated: 0, badgesMigrated: 0, finalPoints: 0, error: remoteResult.error };
    }

    const remoteSnapshot = remoteResult.snapshot ? mergeSnapshots(remoteResult.snapshot.points, remoteResult.snapshot.badges) : emptySnapshot();
    const localGuestSnapshot = mergeSnapshots(guestRecord.snapshot.points, guestRecord.snapshot.badges);
    const localUserSnapshot = mergeSnapshots(userRecord.snapshot.points, userRecord.snapshot.badges);

    const finalPoints = Math.max(remoteSnapshot.points, localGuestSnapshot.points, localUserSnapshot.points);
    const finalBadges = normalizeBadges([...remoteSnapshot.badges, ...localGuestSnapshot.badges, ...localUserSnapshot.badges]);
    const finalSnapshot = { points: finalPoints, badges: finalBadges };

    const guestCompletedCapsules = readUserScopedJSON<string[]>('completed_capsules', null) || [];
    if (guestCompletedCapsules.length > 0) {
      console.log(`[SYNC] Migrando ${guestCompletedCapsules.length} cápsulas de invitado...`);
      const capsulePayload = guestCompletedCapsules.map(slug => ({ user_id: userId, capsule_slug: slug }));
      const { error: capsuleError } = await supabase.from('user_completed_capsules').upsert(capsulePayload, { onConflict: 'user_id,capsule_slug' });
      if (capsuleError) { console.error("[SYNC] Error al migrar cápsulas:", capsuleError); } 
      else { clearUserScopedValue('completed_capsules', null); }
    }

    const persistedAt = await persistGamificationProgress(
      userId,
      finalSnapshot,
      { email: userEmail, name: userEmail?.split("@")[0] ?? null },
      { knownProfileExists: remoteResult.profileExists }
    );

    writeLocalGamificationData(finalSnapshot, userId, { updatedAt: persistedAt, lastLocalUpdate: persistedAt });
    clearLocalGamificationData(null);

    return {
      success: true,
      pointsMigrated: Math.max(0, finalPoints - remoteSnapshot.points),
      badgesMigrated: finalBadges.filter(b => !remoteSnapshot.badges.includes(b)).length,
      finalPoints: finalPoints,
    };
  } catch (error) {
    console.error("[GAMIFICATION] Error durante sincronización completa:", error);
    return { success: false, pointsMigrated: 0, badgesMigrated: 0, finalPoints: 0, error: error instanceof Error ? error.message : "Error desconocido" };
  }
}
