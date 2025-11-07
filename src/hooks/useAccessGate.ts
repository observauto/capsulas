import { useCallback, useMemo } from "react";

type Token = { token: "ok"; exp: number };

export function useAccessGate(
  enabled: boolean,
  passcode: string,
  ttlMs: number,
  storageKey: string,
) {
  const isValid = useCallback(() => {
    if (!enabled) return true;
    if (typeof window === "undefined") return false;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return false;
      const data: Token = JSON.parse(raw);
      return data.token === "ok" && Date.now() < data.exp;
    } catch {
      return false;
    }
  }, [enabled, storageKey]);

  const allow = useCallback(
    (code: string) => {
      if (!enabled) return true;
      if (code !== passcode) return false;
      if (typeof window === "undefined") return false;
      const exp = Date.now() + ttlMs;
      const token: Token = { token: "ok", exp };
      window.localStorage.setItem(storageKey, JSON.stringify(token));
      return true;
    },
    [enabled, passcode, storageKey, ttlMs],
  );

  const revoke = useCallback(() => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(storageKey);
  }, [storageKey]);

  return useMemo(() => ({ isValid, allow, revoke }), [allow, isValid, revoke]);
}
