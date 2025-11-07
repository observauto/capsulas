export interface CapsuleProgressData {
  readSections: string[];
  wizardCompleted: boolean;
  quizAttempts: number;
  quizBestScore?: number;
  quizPassed: boolean;
  updatedAt: string;
}

const KEY = (slug: string) => `capsule_progress_${slug}`;

function load(slug: string): CapsuleProgressData {
  try {
    const raw = localStorage.getItem(KEY(slug));
    if (raw) return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to load capsule progress from localStorage", error);
  }
  return {
    readSections: [],
    wizardCompleted: false,
    quizAttempts: 0,
    quizBestScore: undefined,
    quizPassed: false,
    updatedAt: new Date().toISOString(),
  };
}

function save(slug: string, data: CapsuleProgressData) {
  data.updatedAt = new Date().toISOString();
  try {
    localStorage.setItem(KEY(slug), JSON.stringify(data));
  } catch (error) {
    console.error("Failed to persist capsule progress in localStorage", error);
  }
}

export function getCapsuleProgressLite(slug: string) { return load(slug); }
export function markSectionReadLite(slug: string, sectionId: string) {
  const p = load(slug);
  if (!p.readSections.includes(sectionId)) { p.readSections.push(sectionId); save(slug, p); }
  return p;
}
export function markWizardCompleteLite(slug: string) {
  const p = load(slug); if (!p.wizardCompleted) { p.wizardCompleted = true; save(slug, p); } return p;
}
interface QuizResultLite { scorePercent: number; passed: boolean; }
export function recordQuizLite(slug: string, result: QuizResultLite) {
  const p = load(slug);
  p.quizAttempts += 1;
  if (p.quizBestScore === undefined || result.scorePercent > p.quizBestScore) p.quizBestScore = result.scorePercent;
  if (result.passed) p.quizPassed = true;
  save(slug, p); return p;
}
