export const ACCESS_GATE = {
  enabled: true,  // Changed from: process.env.NEXT_PUBLIC_ACCESS_GATE_ENABLED !== "false"
  ttlMs: 60 * 60 * 1000,
  storageKey: "oa_access",
} as const;
