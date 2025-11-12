// Ruta del archivo: src/lib/gamification-sync.ts

import { supabase } from "./supabase";
import { readUserScopedJSON, writeUserScopedJSON, clearUserScopedValue } from "./user-storage";
import { GAMIFICATION_STORE_KEY, LEGACY_BADGES_KEY, LEGACY_OWNER_KEY, LEGACY_POINTS_KEY, normalizeUserId } from "./gamification-keys";

// --- TIPOS Y FUNCIONES INTERNAS ---
export type GamificationSnapshot = { points: number; badges: string[]; };
export type LocalGamificationRecord = { snapshot: GamificationSnapshot; updatedAt: string | null; lastLocalUpdate: string | null; };
export type FullSyncResult = { success: boolean; pointsMigrated: number; badgesMigrated: number; finalPoints: number; error?: string; };

const STORE_VERSION = 1;
type StoredGamificationEntry = LocalGamificationRecord;
type LocalGamificationStore = { version: typeof STORE_VERSION; users: Record<string, StoredGamificationEntry>; guest: StoredGamificationEntry; };
const MILESTONE_BADGES = [{ code: "beginner", threshold: 100 }, { code: "intermediate", threshold: 500 }, { code: "expert", threshold: 1000 }] as const;

// ✅ CORRECCIÓN: Función `ensureMilestoneBadges` movida aquí para ser compartida
function ensureMilestoneBadges(points: number, badgesList: string[]): string[] {
  const uniqueBadges = new Set(Array.isArray(badgesList) ? badgesList : []);
  MILESTONE_BADGES.forEach(milestone => {
    if (points >= milestone.threshold) {
      uniqueBadges.add(milestone.code);
    }
  });
  return Array.from(uniqueBadges);
}

// ✅ CORRECCIÓN: Función `mergeSnapshots` movida aquí y exportada
export function mergeSnapshots(points: number, badges: string[]): GamificationSnapshot {
  const safePoints = Math.max(0, Math.floor(points));
  return {
    points: safePoints,
    badges: ensureMilestoneBadges(safePoints, badges),
  };
}

function isBrowser(): boolean { return typeof window !== "undefined" && typeof window.localStorage !== "undefined"; }
function normalizePoints(value: unknown): number { const n = typeof value === "number" ? value : Number(value); return !Number.isFinite(n) || n < 0 ? 0 : Math.floor(n); }
function normalizeBadges(value: unknown): string[] { if (!Array.isArray(value)) return []; return Array.from(new Set(value.filter((e): e is string => typeof e === "string").map(e => e.trim()).filter(e => e.length > 0))); }
function emptySnapshot(): GamificationSnapshot { return { points: 0, badges: [] }; }
function sanitizeTimestamp(v: unknown): string | null { if (typeof v !== "string") return null; const t = v.trim(); if (!t) return null; const m = Date.parse(t); return Number.isFinite(m) ? new Date(m).toISOString() : null; }
function nowIso(): string { return new Date().toISOString(); }
function cloneSnapshot(s?: GamificationSnapshot | null): GamificationSnapshot { return s ? { points: normalizePoints(s.points), badges: normalizeBadges(s.badges) } : emptySnapshot(); }
function emptyEntry(): StoredGamificationEntry { return { snapshot: emptySnapshot(), updatedAt: null, lastLocalUpdate: null }; }
function cloneEntry(e?: Partial<StoredGamificationEntry> | null): StoredGamificationEntry { return e ? { snapshot: cloneSnapshot(e.snapshot), updatedAt: sanitizeTimestamp(e.updatedAt), lastLocalUpdate: sanitizeTimestamp(e.lastLocalUpdate) } : emptyEntry(); }
function persistStore(s: LocalGamificationStore): void { if (isBrowser()) try { localStorage.setItem(GAMIFICATION_STORE_KEY, JSON.stringify(s)); localStorage.removeItem(LEGACY_POINTS_KEY); localStorage.removeItem(LEGACY_BADGES_KEY); localStorage.removeItem(LEGACY_OWNER_KEY); } catch (e) { console.error(e); } }
function loadStore(): LocalGamificationStore { if (!isBrowser()) return { version: 1, users: {}, guest: emptyEntry() }; try { const r = localStorage.getItem(GAMIFICATION_STORE_KEY); if (r) { const p = JSON.parse(r); if (p && typeof p === "object" && p.version === STORE_VERSION) { const u: Record<string, StoredGamificationEntry> = {}; if (p.users && typeof p.users === "object") Object.entries(p.users).forEach(([k, v]) => { const n = normalizeUserId(k) || k; if (typeof n === "string" && n.length > 0) u[n] = cloneEntry(v as StoredGamificationEntry); }); return { version: 1, users: u, guest: cloneEntry(p.guest) }; } } } catch { } return { version: 1, users: {}, guest: emptyEntry() }; }
export function readLocalGamificationData(userId?: string | null): LocalGamificationRecord { if (!isBrowser()) return emptyEntry(); try { const n = normalizeUserId(userId); const s = loadStore(); return cloneEntry(n ? s.users[n] : s.guest); } catch (e) { console.error(e); return emptyEntry(); } }
export function writeLocalGamificationData(snapshot: GamificationSnapshot, userId?: string | null, meta?: Partial<Pick<LocalGamificationRecord, "updatedAt" | "lastLocalUpdate">>): void { if (!isBrowser()) return; try { const n = normalizeUserId(userId); const s = loadStore(); const c = cloneSnapshot(snapshot); const t = n ? s.users[n] : s.guest; const i = t ? cloneEntry(t) : emptyEntry(); const o = { snapshot: c, updatedAt: meta?.hasOwnProperty("updatedAt") ? sanitizeTimestamp(meta.updatedAt) : i.updatedAt, lastLocalUpdate: meta?.hasOwnProperty("lastLocalUpdate") ? sanitizeTimestamp(meta.lastLocalUpdate ?? nowIso()) ?? nowIso() : nowIso() }; n ? s.users[n] = o : s.guest = o; persistStore(s); } catch (e) { console.error(e); } }
export function clearLocalGamificationData(userId?: string | null): void { if (!isBrowser()) return; try { const n = normalizeUserId(userId); const s = loadStore(); n ? delete s.users[n] : s.guest = emptyEntry(); persistStore(s); } catch (e) { console.error(e); } }
type RemoteGamificationLoad = { status: "success"; snapshot: (GamificationSnapshot & { level: number; updatedAt: string | null }) | null; profileExists: boolean; } | { status: "error"; error: string; };
export async function loadGamificationDataFromSupabase(userId: string): Promise<RemoteGamificationLoad> { try { const { data: p, error: e } = await supabase.from("user_profiles").select("points, level, updated_at").eq("user_id", userId).maybeSingle(); if (e) return { status: "error", error: e.message }; const { data: a, error: r } = await supabase.from("user_achievements").select("achievement:achievements(achievement_code)").eq("user_id", userId); const t = r ? [] : a?.map(e => e.achievement?.achievement_code).filter((e): e is string => !!e) || []; return p ? { status: "success", snapshot: { points: normalizePoints(p.points), badges: normalizeBadges(t), level: normalizePoints(p.level), updatedAt: sanitizeTimestamp(p.updated_at) }, profileExists: true } : { status: "success", snapshot: null, profileExists: false }; } catch (e) { return { status: "error", error: e instanceof Error ? e.message : "Error desconocido" }; } }
async function ensureBadges(userId: string, desiredBadges: string[]): Promise<number> { const u = normalizeBadges(desiredBadges); if (u.length === 0) return 0; const { data: e } = await supabase.from("user_achievements").select("achievement:achievements(achievement_code)").eq("user_id", userId); const t = e?.map(r => r.achievement?.achievement_code).filter((c): c is string => !!c) || []; const n = u.filter(b => !t.includes(b)); if (n.length === 0) return 0; const { data: s, error: r } = await supabase.from("achievements").select("id, achievement_code").in("achievement_code", n); if (r || !s) return 0; const a = s.map(i => i ? { user_id: userId, achievement_id: i.id, earned_at: nowIso(), times_earned: 1 } : null).filter(Boolean); if (a.length === 0) return 0; const { error: i } = await supabase.from("user_achievements").insert(a); return i ? 0 : a.length; }
export async function persistGamificationProgress(userId: string, snapshot: GamificationSnapshot, metadata?: { email?: string | null, name?: string | null }, options?: { knownProfileExists?: boolean }): Promise<string> { const p = normalizePoints(snapshot.points); const a = normalizeBadges(snapshot.badges); const t = nowIso(); const l = Math.max(1, Math.floor(p / 100) + 1); const d: Record<string, any> = { user_id: userId, points: p, level: l, updated_at: t }; if (!options?.knownProfileExists) d.role = "end_user"; if (metadata?.email) d.email = metadata.email; const n = metadata?.name?.trim(); if (n) d.name = n; const { error: i } = await supabase.from("user_profiles").upsert(d, { onConflict: "user_id" }); if (i) throw i; await ensureBadges(userId, a); return t; }

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

    const persistedAt = await persistGamificationProgress(userId, finalSnapshot, { email: userEmail, name: userEmail?.split("@")[0] ?? null }, { knownProfileExists: remoteResult.profileExists });

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
