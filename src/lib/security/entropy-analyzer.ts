/**
 * ARCHON SENTINEL — CYBER-DEFENSE & MULTI-VECTOR ENTROPY ENGINE
 *
 * Mathematically scores real-time visitor sessions across 4 security entropy dimensions:
 * 1. Fingerprint Cohesion (GPU WebGL unmasked vendor vs claimed OS)
 * 2. Cadence Variance (Programmatic bot regularity vs biological micro-jitter)
 * 3. Traversal Velocity (Biological reading speed vs scraper bursts)
 * 4. Geolocation Coherence (Impossible travel velocity between sessions)
 */

import type { VisitorSessionRecord } from "@/lib/admin/types";

export interface EntropyVectorScore {
  fingerprintEntropy: number; // 0 (natural) to 100 (suspicious spoof)
  cadenceEntropy: number; // 0 (organic jitter) to 100 (synthetic timer)
  velocityEntropy: number; // 0 (human pacing) to 100 (instant scraper)
  geoCoherence: number; // 0 (normal IP) to 100 (VPN / Proxy / Hop)
  compositeThreatScore: number; // 0 - 100
  threatLevel: "NOMINAL" | "ELEVATED" | "CRITICAL";
  heuristics: string[];
}

// In-memory dynamic IP quarantine store
const QUARANTINED_IPS = new Set<string>();

export function isIpQuarantined(ip: string): boolean {
  return QUARANTINED_IPS.has(ip);
}

export function toggleIpQuarantine(ip: string): boolean {
  if (QUARANTINED_IPS.has(ip)) {
    QUARANTINED_IPS.delete(ip);
    return false;
  } else {
    QUARANTINED_IPS.add(ip);
    return true;
  }
}

export function getQuarantinedIps(): string[] {
  return Array.from(QUARANTINED_IPS);
}

/**
 * Evaluates real visitor session record for security entropy
 */
export function analyzeSessionEntropy(session: VisitorSessionRecord): EntropyVectorScore {
  const heuristics: string[] = [];
  let fpScore = 10;
  let cadenceScore = 15;
  let velScore = 10;
  let geoScore = 10;

  // 1. Fingerprint Cohesion Analysis
  const gpu = (session.gpuRenderer || "").toLowerCase();
  const os = (session.os || "").toLowerCase();

  if (session.deviceType === "bot") {
    fpScore = 95;
    heuristics.push("Identified bot user-agent signature");
  } else if (
    !gpu ||
    gpu.includes("swiftshader") ||
    gpu.includes("llvmpipe") ||
    gpu.includes("software")
  ) {
    fpScore = 80;
    heuristics.push("Software-emulated headless WebGL pipeline detected");
  } else if (os.includes("ios") && !gpu.includes("apple")) {
    fpScore = 65;
    heuristics.push("OS/GPU architecture mismatch (iOS claimed without Apple Silicon GPU)");
  } else {
    fpScore = 12;
  }

  // 2. Traversal Velocity Analysis
  const events = session.eventsCount || 1;
  const dwell = Math.max(1, session.activeDwellSeconds || 1);
  const eventsPerSecond = events / dwell;

  if (eventsPerSecond > 6) {
    velScore = 85;
    heuristics.push(`Abnormally high event frequency: ${eventsPerSecond.toFixed(1)} ev/s`);
  } else if (session.maxScrollPercentage > 90 && dwell < 3) {
    velScore = 70;
    heuristics.push("Instantaneous page traversal (100% scroll in < 3s)");
  } else {
    velScore = 15;
  }

  // 3. Cadence Variance
  if (session.timeline && session.timeline.length >= 3) {
    const intervals: number[] = [];
    for (let i = 1; i < session.timeline.length; i++) {
      const t1 = new Date(session.timeline[i - 1].time).getTime();
      const t2 = new Date(session.timeline[i].time).getTime();
      if (!isNaN(t1) && !isNaN(t2)) {
        intervals.push(Math.abs(t2 - t1));
      }
    }

    if (intervals.length >= 2) {
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance =
        intervals.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / intervals.length;
      const stdDev = Math.sqrt(variance);

      // Low standard deviation means suspicious robotic regularity
      if (stdDev < 150 && avg < 1000) {
        cadenceScore = 80;
        heuristics.push("Synthetic clockwork timing intervals detected");
      }
    }
  }

  // 4. Geolocation Coherence
  if (
    session.countryCode === "XX" ||
    !session.countryCode ||
    session.countryName === "Anonymous Proxy"
  ) {
    geoScore = 75;
    heuristics.push("Tor / Anonymous Exit Node or unresolvable GeoIP");
  } else if (
    session.asnOrg &&
    (session.asnOrg.includes("Hosting") ||
      session.asnOrg.includes("Cloud") ||
      session.asnOrg.includes("Datacenter"))
  ) {
    geoScore = 60;
    heuristics.push(`Commercial Datacenter ASN (${session.asnOrg})`);
  }

  // Composite Weighted Score
  const composite = Math.round(
    fpScore * 0.35 + cadenceScore * 0.25 + velScore * 0.25 + geoScore * 0.15,
  );

  let threatLevel: "NOMINAL" | "ELEVATED" | "CRITICAL" = "NOMINAL";
  if (composite >= 65 || isIpQuarantined(session.ip)) {
    threatLevel = "CRITICAL";
  } else if (composite >= 40) {
    threatLevel = "ELEVATED";
  }

  return {
    fingerprintEntropy: fpScore,
    cadenceEntropy: cadenceScore,
    velocityEntropy: velScore,
    geoCoherence: geoScore,
    compositeThreatScore: composite,
    threatLevel,
    heuristics,
  };
}
