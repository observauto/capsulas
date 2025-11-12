// Types for full capsule experience (Momento 3)

export interface Sponsor {
  name: string;
  logoUrl: string;
  link?: string;
  accentColor?: string;
}

export type SectionType = 
  | "intro" 
  | "concept" 
  | "mediaGallery" 
  | "tips" 
  | "case" 
  | "summary" 
  | "quizIntro";

export interface Section {
  id: string;
  order: number;
  type: SectionType;
  title: string;
  content: string;
  mediaUrl?: string;
  tips?: string[];
}

export interface QuizQuestion {
  id: string;
  order: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type CapsuleMode = "wizard" | "article";

export interface FullCapsule {
  id: string;
  slug: string;
  mode: CapsuleMode;
  title: string;
  summary: string;
  heroImage?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  sponsors?: Sponsor[];
  sections: Section[];
  quiz?: QuizQuestion[];
}

export interface QuizResult {
  scorePercent: number;
  correctCount: number;
  total: number;
  passed: boolean;
  badgesGranted: string[];
}

export interface UserProgress {
  capsuleSlug: string;
  completedSections: string[];
  quizCompleted: boolean;
  quizResult?: QuizResult;
}
