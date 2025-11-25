// Capsule repository - data access layer
// TODO: Replace in-memory storage with backend API calls (Lovable Cloud + PostgreSQL)

import { FullCapsule, UserProgress, QuizResult } from "@/types/capsule";
import { FULL_CAPSULES } from "@/data/fullCapsules";
import {
  clearUserScopedValue,
  getStoredActiveUserId,
  readUserScopedJSON,
  writeUserScopedJSON,
} from "./user-storage";

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

function getAllProgress(): Record<string, ExtendedUserProgress> {
  if (typeof window === "undefined") return {};
  const stored = readUserScopedJSON<Record<string, ExtendedUserProgress>>(
    PROGRESS_STORAGE_BASE,
    getActiveUserId(),
    PROGRESS_STORAGE_KEY,
  );
  return stored ?? {};
}

function saveAllProgress(p: Record<string, ExtendedUserProgress>) {
  if (typeof window === "undefined") return;
  try {
    writeUserScopedJSON(PROGRESS_STORAGE_BASE, p, getActiveUserId());
  } catch (e) {
    console.error("Error saving progress:", e);
  }
}

export function getCapsuleProgress(slug: string): ExtendedUserProgress {
  const all = getAllProgress();
  return all[slug] || {
    capsuleSlug: slug,
    completedSections: [],
    quizCompleted: false,
  };
}

export function markSectionCompleted(slug: string, sectionId: string) {
  const all = getAllProgress();
  const entry = all[slug] || {
    capsuleSlug: slug,
    completedSections: [],
    quizCompleted: false,
  };
  if (!entry.completedSections.includes(sectionId)) {
    entry.completedSections.push(sectionId);
  }
  all[slug] = entry;
  saveAllProgress(all);
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

  const all = getAllProgress();
  const entry = all[slug] || {
    capsuleSlug: slug,
    completedSections: [],
    quizCompleted: false,
  };

  entry.quizCompleted = true;
  entry.quizResult = result;

  const allSectionsDone = capsule.sections.every(s =>
    entry.completedSections.includes(s.id)
  );
  if (allSectionsDone) {
    entry.completed = true;
    entry.completedAt = Date.now();
  }

  all[slug] = entry;
  saveAllProgress(all);
  return result;
}

export function setCapsuleCompleted(slug: string) {
  const all = getAllProgress();
  const entry = all[slug] || {
    capsuleSlug: slug,
    completedSections: [],
    quizCompleted: false,
  };
  entry.completed = true;
  entry.completedAt = Date.now();
  all[slug] = entry;
  saveAllProgress(all);
}

export function isCapsuleCompleted(slug: string): boolean {
  // Método 1: Revisar en completed_capsules (más confiable)
  try {
    const completedRaw = localStorage.getItem('completed_capsules');
    if (completedRaw) {
      const completed = JSON.parse(completedRaw);
      if (completed.some((c: any) => c.slug === slug)) {
        return true;
      }
    }
  } catch { }

  // Método 2 (fallback): Revisar progreso individual
  const capsule = getFullCapsuleBySlug(slug);
  if (!capsule) return false;
  const p = getCapsuleProgress(slug);
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
  const all = getAllProgress();
  delete all[slug];
  saveAllProgress(all);
}

export function resetAllProgress() {
  if (typeof window === "undefined") return;
  clearUserScopedValue(PROGRESS_STORAGE_BASE, getActiveUserId());
}