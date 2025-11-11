export const LEGACY_POINTS_KEY = "oa_points";
export const LEGACY_BADGES_KEY = "oa_badges";
export const LEGACY_OWNER_KEY = "oa_gamification_owner";

const STORAGE_PREFIX = "capsulas:gami";
export const GAMIFICATION_STORE_KEY = `${STORAGE_PREFIX}:store:v1`;

export function normalizeUserId(userId?: string | null): string | null {
  if (typeof userId !== "string") {
    return null;
  }

  const trimmed = userId.trim();
  return trimmed.length > 0 ? trimmed : null;
}
