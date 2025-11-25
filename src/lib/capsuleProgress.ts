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
  save(slug, p);

  // Si aprobó el quiz, marcar cápsula como completada
  if (result.passed) {
    markCapsuleAsCompleted(slug);
  }

  return p;
}

// Obtener lista de cápsulas completadas
export function getCompletedCapsules(): Array<{ slug: string, completedAt: string }> {
  try {
    const raw = localStorage.getItem('completed_capsules');
    if (raw) return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to load completed capsules", error);
  }
  return [];
}

// Marcar cápsula como completada
export function markCapsuleAsCompleted(slug: string) {
  try {
    const completed = getCompletedCapsules();

    // Si ya está completada, no agregar duplicado
    if (completed.some(c => c.slug === slug)) {
      console.log(`[PROGRESS] Cápsula ${slug} ya estaba completada`);
      return;
    }

    // Agregar con timestamp actual
    completed.push({
      slug,
      completedAt: new Date().toISOString()
    });

    localStorage.setItem('completed_capsules', JSON.stringify(completed));
    console.log(`[PROGRESS] ✓ Cápsula ${slug} marcada como completada`);
  } catch (error) {
    console.error("Failed to mark capsule as completed", error);
  }
}

