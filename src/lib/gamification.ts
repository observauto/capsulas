// Shared gamification metadata (badges, helper resolvers).
// State management lives in the GamificationContext provider.

export interface Badge {
  code: string;
  name: string;
  description: string;
  icon: string; // emoji or icon name
}

export const AVAILABLE_BADGES: Record<string, Badge> = {
  // 🎮 Niveles de Progreso
  beginner: {
    code: "beginner",
    name: "Principiante",
    description: "Acumulaste 100 puntos",
    icon: "🌟",
  },
  intermediate: {
    code: "intermediate",
    name: "Intermedio",
    description: "Acumulaste 500 puntos",
    icon: "💫",
  },
  expert: {
    code: "expert",
    name: "Experto",
    description: "Acumulaste 1000 puntos",
    icon: "🔥",
  },
  master: {
    code: "master",
    name: "Maestro",
    description: "Acumulaste 2000 puntos",
    icon: "👑",
  },

  // 🚗 Badges Automotive Específicos
  primera_capsula: {
    code: "primera_capsula",
    name: "Primera Cápsula",
    description: "Completaste tu primera cápsula completa",
    icon: "🚗",
  },
  mecanico_novato: {
    code: "mecanico_novato",
    name: "Mecánico Novato",
    description: "Completaste 3 cápsulas técnicas",
    icon: "🔧",
  },
  experto_flotas: {
    code: "experto_flotas",
    name: "Experto en Flotas",
    description: "Completaste las cápsulas de gestión de flotas",
    icon: "🚛",
  },
  gnv_pro: {
    code: "gnv_pro",
    name: "GNV Pro",
    description: "Completaste la cápsula de Gas Natural Vehicular",
    icon: "⚡",
  },
  seguridad_vial: {
    code: "seguridad_vial",
    name: "Seguridad Vial",
    description: "Completaste la cápsula de seguridad vial",
    icon: "🛡️",
  },
  financiero: {
    code: "financiero",
    name: "Financiero",
    description: "Completaste métodos de financiación automotriz",
    icon: "💰",
  },
  identificador_modelos: {
    code: "identificador_modelos",
    name: "Identificador de Modelos",
    description: "Aprendiste a identificar modelos automotrices",
    icon: "🔍",
  },

  // 🏆 Logros Especiales
  quiz_master: {
    code: "quiz_master",
    name: "Quiz Master",
    description: "Obtuviste 100% en un quiz",
    icon: "🎯",
  },
  quiz_first_pass: {
    code: "quiz_first_pass",
    name: "Primera Aprobación",
    description: "Aprobaste tu primer quiz",
    icon: "🥇",
  },
  wizard_complete: {
    code: "wizard_complete",
    name: "Navegador Experto",
    description: "Completaste una cápsula en modo wizard",
    icon: "🧙‍♂️",
  },
  article_reader: {
    code: "article_reader",
    name: "Lector Especializado",
    description: "Completaste una cápsula en modo artículo",
    icon: "📚",
  },
  coleccionista: {
    code: "coleccionista",
    name: "Coleccionista",
    description: "Completaste todas las cápsulas disponibles",
    icon: "🏆",
  },
};

export function getBadge(badgeCode: string): Badge | undefined {
  return AVAILABLE_BADGES[badgeCode];
}

export function resolveBadges(codes: string[]): Badge[] {
  return codes
    .map(code => AVAILABLE_BADGES[code])
    .filter((badge): badge is Badge => Boolean(badge));
}
