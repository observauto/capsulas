export const KEY_POINTS = "oa_points";
export const KEY_BADGES = "oa_badges";
export const KEY_OWNER = "oa_gamification_owner";

export function buildGamificationKey(baseKey: string, userId: string | null): string {
  return userId ? `${baseKey}::${userId}` : baseKey;
}

export function normalizeUserId(userId?: string | null): string | null {
  if (typeof userId !== "string") {
    return null;
  }

  const trimmed = userId.trim();
  return trimmed.length > 0 ? trimmed : null;
}
