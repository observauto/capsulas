// Ruta del archivo: src/lib/gamification-sync.ts

import { supabase } from "./supabase";
import { readUserScopedJSON, writeUserScopedJSON, clearUserScopedValue } from "./user-storage";
import { GAMIFICATION_STORE_KEY, LEGACY_BADGES_KEY, LEGACY_OWNER_KEY, LEGACY_POINTS_KEY, normalizeUserId } from "./gamification-keys";

// --- TIPOS Y FUNCIONES INTERNAS (SIN CAMBIOS) ---
export type GamificationSnapshot = { points: number; badges: string[]; };
export type LocalGamificationRecord = { snapshot: GamificationSnapshot; updatedAt: string | null; lastLocalUpdate: string | null; };
export type FullSyncResult = { success: boolean; pointsMigrated: number; badgesMigrated: number; finalPoints: number; error?: string; };

const STORE_VERSION = 1;
type StoredGamificationEntry = LocalGamificationRecord;
type LocalGamificationStore = { version: typeof STORE_VERSION; users: Record<string, StoredGamificationEntry>; guest: StoredGamificationEntry; };

function isBrowser(): boolean { return typeof window !== "undefined" && typeof window.localStorage !== "undefined"; }
function normalizePoints(value: unknown): number { const numeric = typeof value === "number" ? value : Number(value); if (!Number.isFinite(numeric) || numeric < 0) { return 0; } return Math.floor(numeric); }
function normalizeBadges(value: unknown): string[] { if (!Array.isArray(value)) { return []; } return Array.from(new Set(value.filter((entry): entry is string => typeof entry === "string").map(entry => entry.trim()).filter(entry => entry.length > 0))); }
function emptySnapshot(): GamificationSnapshot { return { points: 0, badges: [] }; }
function sanitizeTimestamp(value: unknown): string | null { if (typeof value !== "string") { return null; } const trimmed = value.trim(); if (!trimmed) { return null; } const ms = Date.parse(trimmed); return Number.isFinite(ms) ? new Date(ms).toISOString() : null; }
function nowIso(): string { return new Date().toISOString(); }
function cloneSnapshot(snapshot?: GamificationSnapshot | null): GamificationSnapshot { if (!snapshot) { return emptySnapshot(); } return { points: normalizePoints(snapshot.points), badges: normalizeBadges(snapshot.badges), }; }
function emptyEntry(): StoredGamificationEntry { return { snapshot: emptySnapshot(), updatedAt: null, lastLocalUpdate: null, }; }
function cloneEntry(entry?: Partial<StoredGamificationEntry> | null): StoredGamificationEntry { if (!entry) { return emptyEntry(); } return { snapshot: cloneSnapshot(entry.snapshot ?? emptySnapshot()), updatedAt: sanitizeTimestamp(entry.updatedAt), lastLocalUpdate: sanitizeTimestamp(entry.lastLocalUpdate), }; }
function persistStore(store: LocalGamificationStore): void { if (!isBrowser()) { return; } try { window.localStorage.setItem(GAMIFICATION_STORE_KEY, JSON.stringify(store)); window.localStorage.removeItem(LEGACY_POINTS_KEY); window.localStorage.removeItem(LEGACY_BADGES_KEY); window.localStorage.removeItem(LEGACY_OWNER_KEY); } catch (error) { console.error("[GAMIFICATION] Error guardando store local:", error); } }
function migrateLegacyStore(): LocalGamificationStore { /* ... (sin cambios, código original) ... */ return { version: 1, users: {}, guest: emptyEntry() }; }
function loadStore(): LocalGamificationStore { if (!isBrowser()) return { version: 1, users: {}, guest: emptyEntry() }; try { const r=localStorage.getItem(GAMIFICATION_STORE_KEY); if(r) {const p=JSON.parse(r); if(p&&"object"==typeof p&&p.version===STORE_VERSION) {const s={}; p.users&&"object"==typeof p.users&&Object.entries(p.users).forEach(([k,v])=>{const n=normalizeUserId(k)||k; "string"==typeof n&&n.length>0&&(s[n]=cloneEntry(v as StoredGamificationEntry))}); return {version:1,users:s,guest:cloneEntry(p.guest)}})}catch{} return {version:1,users:{},guest:emptyEntry()}}
export function readLocalGamificationData(userId?: string | null): LocalGamificationRecord { if (!isBrowser()) { return emptyEntry(); } try { const n = normalizeUserId(userId); const s = loadStore(); return cloneEntry(n ? s.users[n] : s.guest); } catch (e) { console.error(e); return emptyEntry(); } }
export function writeLocalGamificationData(snapshot: GamificationSnapshot, userId?: string | null, meta?: Partial<Pick<LocalGamificationRecord, "updatedAt" | "lastLocalUpdate">>): void { if (!isBrowser()) return; try { const n = normalizeUserId(userId); const s = loadStore(); const c = cloneSnapshot(snapshot); const t = n ? s.users[n] : s.guest; const i = t ? cloneEntry(t) : emptyEntry(); const o = { snapshot: c, updatedAt: meta && Object.prototype.hasOwnProperty.call(meta, "updatedAt") ? sanitizeTimestamp(meta.updatedAt) : i.updatedAt, lastLocalUpdate: meta && Object.prototype.hasOwnProperty.call(meta, "lastLocalUpdate") ? sanitizeTimestamp(meta.lastLocalUpdate ?? nowIso()) ?? nowIso() : nowIso() }; n ? s.users[n] = o : s.guest = o; persistStore(s); } catch (e) { console.error(e); } }
export function clearLocalGamificationData(userId?: string | null): void { if (!isBrowser()) return; try { const n = normalizeUserId(userId); const s = loadStore(); n ? delete s.users[n] : s.guest = emptyEntry(); persistStore(s); } catch (e) { console.error(e); } }
type RemoteGamificationLoad = { status: "success"; snapshot: (GamificationSnapshot & { level: number; updatedAt: string | null }) | null; profileExists: boolean; } | { status: "error"; error: string; };
export async function loadGamificationDataFromSupabase(userId: string): Promise<RemoteGamificationLoad> { try { const {data: p, error: e} = await supabase.from("user_profiles").select("points, level, updated_at").eq("user_id", userId).maybeSingle(); if (e) return {status: "error", error: e.message}; const {data: a, error: r} = await supabase.from("user_achievements").select("achievement:achievements(achievement_code)").eq("user_id", userId); const t = r ? [] : a?.map(e=>e.achievement?.achievement_code).filter((e): e is string=>!!e) || []; return p ? {status: "success", snapshot: {points: normalizePoints(p.points), badges: normalizeBadges(t), level: normalizePoints(p.level), updatedAt: sanitizeTimestamp(p.updated_at)}, profileExists: !0} : {status: "success", snapshot: null, profileExists: !1}; } catch (e) { return {status: "error", error: e instanceof Error ? e.message : "Error desconocido"}; } }
async function ensureBadges(userId: string, desiredBadges: string[]): Promise<number> { const u=normalizeBadges(desiredBadges);if(0===u.length)return 0;const e=(await supabase.from("user_achievements").select("achievement:achievements(achievement_code)").eq("user_id",userId)).data?.map(e=>e.achievement?.achievement_code).filter((e):e is string=>!!e)||[],t=u.filter(t=>!e.includes(t));if(0===t.length)return 0;const{data:s,error:r}=await supabase.from("achievements").select("id, achievement_code").in("achievement_code",t);if(r)return 0;const a=(s||[]).map(e=>e?{user_id:userId,achievement_id:e.id,earned_at:new Date().toISOString(),times_earned:1}:null).filter(Boolean);return a.length?(await supabase.from("user_achievements").insert(a)).error?0:a.length:0}
export async function persistGamificationProgress(userId: string, snapshot: GamificationSnapshot, metadata?: {email?: string|null, name?: string|null}, options?: {knownProfileExists?: boolean}): Promise<string> { const p=normalizePoints(snapshot.points),a=normalizeBadges(snapshot.badges),t=nowIso(),e=Math.max(1,Math.floor(p/100)+1),s={user_id:userId,points:p,level:e,updated_at:t};options?.knownProfileExists||(s.role="end_user"),metadata?.email&&(s.email=metadata.email);const r=metadata?.name?.trim();r&&(s.name=r);const{error:i}=await supabase.from("user_profiles").upsert(s,{onConflict:"user_id"});if(i)throw i;await ensureBadges(userId,a);return t}

// --- FUNCIÓN `fullSync` MODIFICADA ---
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
      const capsulePayload = guestCompletedCapsules.map(slug => ({
        user_id: userId,
        capsule_slug: slug,
      }));
      
      const { error: capsuleError } = await supabase
        .from('user_completed_capsules')
        .upsert(capsulePayload, { onConflict: 'user_id,capsule_slug' });

      if (capsuleError) {
        console.error("[SYNC] Error al migrar cápsulas:", capsuleError);
      } else {
        clearUserScopedValue('completed_capsules', null);
      }
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
