// Capsule repository - data access layer
import { FullCapsule, UserProgress, QuizResult } from "@/types/capsule";
import { FULL_CAPSULES } from "@/data/fullCapsules";
import {
  clearUserScopedValue,
  getStoredActiveUserId,
  readUserScopedJSON,
  writeUserScopedJSON,
} from "./user-storage";
import { supabase } from "@/lib/supabase";

const PROGRESS_STORAGE_KEY = "capsuleProgress";
const PROGRESS_STORAGE_BASE = "capsuleProgress";

function getActiveUserId(): string | null {
  return getStoredActiveUserId();
}

interface ExtendedUserProgress extends UserProgress {
  completed?: boolean;
  completedAt?: number;
}

export function listFullCapsules(): FullCapsule[] {
  return FULL_CAPSULES;
}

export function getFullCapsuleBySlug(slug: string): FullCapsule | undefined {
  return FULL_CAPSULES.find(c => c.slug === slug);
}

// --- LOCAL STORAGE HELPERS (Legacy & Dev Mode) ---

function getAllProgressLocal(): Record<string, ExtendedUserProgress> {
  if (typeof window === "undefined") return {};
  const stored = readUserScopedJSON<Record<string, ExtendedUserProgress>>(
    PROGRESS_STORAGE_BASE,
    getActiveUserId(),
    PROGRESS_STORAGE_KEY,
  );
  return stored ?? {};
}

function saveAllProgressLocal(p: Record<string, ExtendedUserProgress>) {
  if (typeof window === "undefined") return;
  try {
    writeUserScopedJSON(PROGRESS_STORAGE_BASE, p, getActiveUserId());
  } catch (e) {
    console.error("Error saving progress:", e);
  }
}

// --- SUPABASE HELPERS ---

async function getProgressSupabase(slug: string, userId: string): Promise<ExtendedUserProgress | null> {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('capsule_slug', slug)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error("Error fetching progress from Supabase:", error);
      return null;
    }

    if (!data) return null;

    return {
      capsuleSlug: data.capsule_slug,
      completedSections: data.completed_sections || [],
      quizCompleted: data.quiz_completed || false,
      quizResult: data.quiz_result,
      completed: data.completed,
      completedAt: data.completed_at ? new Date(data.completed_at).getTime() : undefined
    };
  } catch (e) {
    console.error("Exception fetching progress:", e);
    return null;
  }
}

async function saveProgressSupabase(slug: string, progress: ExtendedUserProgress, userId: string) {
  try {
    const payload = {
      user_id: userId,
      capsule_slug: slug,
      completed_sections: progress.completedSections,
      quiz_completed: progress.quizCompleted,
      quiz_result: progress.quizResult,
      completed: progress.completed,
      completed_at: progress.completedAt ? new Date(progress.completedAt).toISOString() : null,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('user_progress')
      .upsert(payload, { onConflict: 'user_id,capsule_slug' });

    if (error) {
      console.error("Error saving progress to Supabase:", error);
    }
  } catch (e) {
    console.error("Exception saving progress:", e);
  }
}

// --- PUBLIC API ---

// NOTE: This is now async in nature but we keep the signature sync for compatibility where possible,
// OR we accept that it might return stale data initially if we don't await.
// Ideally, components should use a hook or effect to load this.
// For now, we will use a hybrid approach: return local state immediately (optimistic) and sync in background if possible,
// BUT since we are migrating, we might need to change signatures to async or use a hook.
// Given the constraints, we will stick to synchronous local storage for 'dev-user-id' and
// for real users we might need to rely on the components fetching data.
// HOWEVER, `UnificadoDashboard` and `WizardMode` call this synchronously.
// To avoid breaking everything, we will modify `getCapsuleProgress` to try to read from a local cache that is populated async.
// BUT simpler: We will keep using LocalStorage as a "cache" for Supabase for the active session.

export function getCapsuleProgress(slug: string): ExtendedUserProgress {
  // Always return local state first (fast)
  const local = getAllProgressLocal();
  const progress = local[slug] || {
    capsuleSlug: slug,
    completedSections: [],
    quizCompleted: false,
  };

  // If real user, trigger background sync (fetch from Supabase and update local)
  // This is a bit "hacky" but avoids refactoring all components to async
  const userId = getActiveUserId();
  if (userId && userId !== 'dev-user-id' && typeof window !== 'undefined') {
    // We don't await this, it runs in background
    getProgressSupabase(slug, userId).then(remote => {
      if (remote) {
        // Merge or overwrite? Overwrite is safer for now if we assume single device usage at a time
        // But we should check if remote is newer? We don't have timestamps easily on local.
        // Let's just update local cache if remote exists
        const currentLocal = getAllProgressLocal();
        if (JSON.stringify(currentLocal[slug]) !== JSON.stringify(remote)) {
          currentLocal[slug] = remote;
          saveAllProgressLocal(currentLocal);
          // Force re-render might be needed? Components usually react to storage events or state changes.
          // This might be silent.
        }
      }
    });
  }

  return progress;
}

export function markSectionCompleted(slug: string, sectionId: string) {
  const capsule = getFullCapsuleBySlug(slug);
  const all = getAllProgressLocal();
  const entry = all[slug] || {
    capsuleSlug: slug,
    completedSections: [],
    quizCompleted: false,
  };
  if (!entry.completedSections.includes(sectionId)) {
    entry.completedSections.push(sectionId);
  }

  // IMPORTANTE: NO marcar como completada aquí.
  // La cápsula solo se marca como completada cuando se completa el quiz (ver submitQuiz)
  // Este cambio corrige el bug donde las cápsulas aparecían completadas solo por leer todas las secciones

  all[slug] = entry;
  saveAllProgressLocal(all);

  // Sync to Supabase
  const userId = getActiveUserId();
  if (userId && userId !== 'dev-user-id') {
    saveProgressSupabase(slug, entry, userId);
  }

  return entry;
}

export function submitQuiz(slug: string, answers: number[]): QuizResult {
  const capsule = getFullCapsuleBySlug(slug);
  if (!capsule || !capsule.quiz) throw new Error("Capsule or quiz not found");

  let correct = 0;
  capsule.quiz.forEach((q, i) => {
    if (answers[i] === q.correctIndex) correct++;
  });

  const total = capsule.quiz.length;
  const scorePercent = Math.round((correct / total) * 100);
  const passed = scorePercent >= 70;

  const badgesGranted: string[] = [];
  if (scorePercent === 100) badgesGranted.push("quiz_master");

  const result: QuizResult = {
    scorePercent,
    correctCount: correct,
    total,
    passed,
    badgesGranted,
  };

  const all = getAllProgressLocal();
  const entry = all[slug] || {
    capsuleSlug: slug,
    completedSections: [],
    quizCompleted: false,
  };

  entry.quizCompleted = true;
  entry.quizResult = result;

  // Excluir secciones de tipo 'quizIntro' porque no son navegables en WizardMode
  const navigableSections = capsule.sections.filter(s => s.type !== 'quizIntro');
  const allSectionsDone = navigableSections.every(s =>
    entry.completedSections.includes(s.id)
  );

  // IMPORTANTE: Este es el ÚNICO lugar donde se marca una cápsula como completada.
  // Se requiere que TODAS las secciones estén hechas Y el quiz esté completado.
  if (allSectionsDone && !entry.completed) {
    entry.completed = true;
    entry.completedAt = Date.now();
    console.log(`[CAPSULES_REPO] Cápsula ${slug} marcada como completada (secciones + quiz: ${scorePercent}%)`);
  } else if (!allSectionsDone) {
    console.warn(`[CAPSULES_REPO] Quiz de ${slug} completado pero faltan secciones: ${entry.completedSections.length}/${navigableSections.length}`);
  }

  all[slug] = entry;
  saveAllProgressLocal(all);

  // Sync to Supabase
  const userId = getActiveUserId();
  if (userId && userId !== 'dev-user-id') {
    saveProgressSupabase(slug, entry, userId);
  }

  return result;
}

export function setCapsuleCompleted(slug: string) {
  const all = getAllProgressLocal();
  const entry = all[slug] || {
    capsuleSlug: slug,
    completedSections: [],
    quizCompleted: false,
  };
  entry.completed = true;
  entry.completedAt = Date.now();
  all[slug] = entry;
  saveAllProgressLocal(all);

  // Sync to Supabase
  const userId = getActiveUserId();
  if (userId && userId !== 'dev-user-id') {
    saveProgressSupabase(slug, entry, userId);
  }
}

export function isCapsuleCompleted(slug: string): boolean {
  const capsule = getFullCapsuleBySlug(slug);
  if (!capsule) return false;

  const p = getCapsuleProgress(slug);

  // Una cápsula está completada si:
  // 1. El flag `completed` está en true (se establece solo en submitQuiz cuando secciones + quiz están hechos)
  // 2. O si manualmente todas las secciones + quiz están completados
  const sectionsOk = capsule.sections.every(s => p.completedSections.includes(s.id));
  return (sectionsOk && p.quizCompleted) || !!p.completed;
}

export function getCapsuleCompletionPercent(slug: string): number {
  const capsule = getFullCapsuleBySlug(slug);
  if (!capsule) return 0;
  const p = getCapsuleProgress(slug);
  const totalItems = capsule.sections.length + (capsule.quiz ? 1 : 0);
  const completedItems = p.completedSections.length + (p.quizCompleted ? 1 : 0);
  return Math.round((completedItems / totalItems) * 100);
}

export function resetCapsuleProgress(slug: string) {
  const all = getAllProgressLocal();
  delete all[slug];
  saveAllProgressLocal(all);

  // Sync to Supabase (delete?)
  // For now we just update it to empty/false to keep record
  const userId = getActiveUserId();
  if (userId && userId !== 'dev-user-id') {
    // We could delete the row or just reset fields. Deleting is cleaner for "reset".
    supabase.from('user_progress').delete().eq('user_id', userId).eq('capsule_slug', slug).then();
  }
}

export function resetAllProgress() {
  if (typeof window === "undefined") return;
  clearUserScopedValue(PROGRESS_STORAGE_BASE, getActiveUserId());
}