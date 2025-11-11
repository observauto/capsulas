import { normalizeUserId } from "./gamification-keys";

const STORAGE_PREFIX = "capsulas:user";
const ACTIVE_USER_KEY = `${STORAGE_PREFIX}:active`;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function buildUserScopedKey(baseKey: string, userId?: string | null): string {
  const normalized = normalizeUserId(userId);
  const suffix = normalized ?? "guest";
  return `${STORAGE_PREFIX}:${baseKey}::${suffix}`;
}

function parseJSON<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error("[USER_STORAGE] Error parsing JSON:", error);
    return null;
  }
}

export function readUserScopedJSON<T>(
  baseKey: string,
  userId?: string | null,
  legacyKey?: string,
): T | null {
  if (!isBrowser()) {
    return null;
  }

  const storageKey = buildUserScopedKey(baseKey, userId);
  const raw = window.localStorage.getItem(storageKey);
  if (raw !== null) {
    return parseJSON<T>(raw);
  }

  if (legacyKey) {
    const legacyRaw = window.localStorage.getItem(legacyKey);
    if (legacyRaw !== null) {
      const parsed = parseJSON<T>(legacyRaw);
      if (parsed !== null) {
        writeUserScopedJSON(baseKey, parsed, userId);
        window.localStorage.removeItem(legacyKey);
        return parsed;
      }
    }
  }

  return null;
}

export function writeUserScopedJSON<T>(baseKey: string, value: T, userId?: string | null): void {
  if (!isBrowser()) {
    return;
  }

  try {
    const storageKey = buildUserScopedKey(baseKey, userId);
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch (error) {
    console.error("[USER_STORAGE] Error writing JSON:", error);
  }
}

export function clearUserScopedValue(baseKey: string, userId?: string | null): void {
  if (!isBrowser()) {
    return;
  }

  const storageKey = buildUserScopedKey(baseKey, userId);
  window.localStorage.removeItem(storageKey);
}

export function setActiveUserId(userId: string | null): void {
  if (!isBrowser()) {
    return;
  }

  const normalized = normalizeUserId(userId);
  if (normalized) {
    window.localStorage.setItem(ACTIVE_USER_KEY, normalized);
  } else {
    window.localStorage.removeItem(ACTIVE_USER_KEY);
  }
}

export function getStoredActiveUserId(): string | null {
  if (!isBrowser()) {
    return null;
  }

  const stored = window.localStorage.getItem(ACTIVE_USER_KEY);
  return normalizeUserId(stored);
}
