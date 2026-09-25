interface RateLimitEntry {
  timestamps: number[];
}

interface SecurityStats {
  totalEvaluated: number;
  totalBlocked: number;
  activeTrackedIps: number;
  lastBlockedAt?: string;
  lastBlockedIp?: string;
}

const LIMITS: Record<"telemetry" | "contact", { max: number; windowMs: number }> = {
  telemetry: { max: 60, windowMs: 60_000 }, // 60 requests per 60 seconds
  contact: { max: 5, windowMs: 600_000 }, // 5 requests per 10 minutes
};

interface RateLimiterGlobalScope {
  __rateLimitBuckets?: Map<string, RateLimitEntry>;
  __securityStats?: {
    totalEvaluated: number;
    totalBlocked: number;
    lastBlockedAt?: string;
    lastBlockedIp?: string;
  };
}

const globalForLimiter = globalThis as unknown as RateLimiterGlobalScope;

const buckets = (globalForLimiter.__rateLimitBuckets ??= new Map<string, RateLimitEntry>());
const stats = (globalForLimiter.__securityStats ??= {
  totalEvaluated: 0,
  totalBlocked: 0,
});

export function checkRateLimit(
  ip: string,
  endpoint: "telemetry" | "contact",
): {
  allowed: boolean;
  current: number;
  limit: number;
  resetMs: number;
} {
  const config = LIMITS[endpoint];
  const now = Date.now();
  const key = `${endpoint}:${ip}`;

  stats.totalEvaluated++;

  let entry = buckets.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    buckets.set(key, entry);
  }

  // Remove timestamps outside window
  entry.timestamps = entry.timestamps.filter((t) => now - t < config.windowMs);

  if (entry.timestamps.length >= config.max) {
    stats.totalBlocked++;
    stats.lastBlockedAt = new Date().toLocaleTimeString();
    stats.lastBlockedIp = ip;
    const oldest = entry.timestamps[0] || now;
    const resetMs = Math.max(0, config.windowMs - (now - oldest));
    return {
      allowed: false,
      current: entry.timestamps.length,
      limit: config.max,
      resetMs,
    };
  }

  entry.timestamps.push(now);

  // Clean stale buckets periodically
  if (buckets.size > 2000) {
    for (const [k, e] of buckets.entries()) {
      if (
        e.timestamps.length === 0 ||
        now - (e.timestamps[e.timestamps.length - 1] || 0) > 600_000
      ) {
        buckets.delete(k);
      }
    }
  }

  return {
    allowed: true,
    current: entry.timestamps.length,
    limit: config.max,
    resetMs: config.windowMs,
  };
}

export function getSecurityDiagnostics(): {
  telemetryLimit: string;
  contactLimit: string;
  totalEvaluated: number;
  totalBlocked: number;
  activeTrackedIps: number;
  lastBlockedAt?: string;
  lastBlockedIp?: string;
} {
  return {
    telemetryLimit: "60 req / min",
    contactLimit: "5 req / 10 min",
    totalEvaluated: stats.totalEvaluated,
    totalBlocked: stats.totalBlocked,
    activeTrackedIps: buckets.size,
    lastBlockedAt: stats.lastBlockedAt,
    lastBlockedIp: stats.lastBlockedIp,
  };
}
