import type {
  DeviceTelemetryProfile,
  TelemetryBatchPayload,
  TelemetryEvent,
  TelemetryEventName,
} from "./types";
import { resolveAccurateDeviceProfile } from "./device-detector";

let initialized = false;
let sessionToken = "";
let visitorId = "";
let deviceProfile: DeviceTelemetryProfile | null = null;
let eventQueue: TelemetryEvent[] = [];
let maxScrollPercentage = 0;
let activeDwellSeconds = 0;
let lastPulseActiveSeconds = 0;
let dwellInterval: number | null = null;
let flushInterval: number | null = null;

function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function resolveDeviceProfile(): DeviceTelemetryProfile {
  if (deviceProfile) return deviceProfile;
  deviceProfile = resolveAccurateDeviceProfile();
  return deviceProfile;
}

function parseUtmParams(): TelemetryBatchPayload["utm"] {
  if (typeof window === "undefined") return {};
  try {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get("utm_source") || undefined,
      medium: params.get("utm_medium") || undefined,
      campaign: params.get("utm_campaign") || undefined,
      content: params.get("utm_content") || undefined,
      term: params.get("utm_term") || undefined,
    };
  } catch {
    return {};
  }
}

export function queueTelemetryEvent(
  eventName: TelemetryEventName,
  payload?: Record<string, unknown>,
  sectionId?: string,
) {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/admin")) return;

  const event: TelemetryEvent = {
    eventName,
    path: window.location.pathname,
    sectionId,
    payload,
    timestamp: new Date().toISOString(),
  };

  eventQueue.push(event);

  // If high-intent conversion event, flush immediately
  if (
    eventName === "resume_download" ||
    eventName === "contact_copy" ||
    eventName === "external_click"
  ) {
    flushTelemetryBatch(true);
  }
}

export function flushTelemetryBatch(isImmediate = false) {
  if (typeof window === "undefined" || !sessionToken) return;
  if (eventQueue.length === 0 && !isImmediate) return;

  const eventsToFlush = [...eventQueue];
  eventQueue = [];

  const payload: TelemetryBatchPayload = {
    sessionToken,
    visitorHash: visitorId,
    device: resolveDeviceProfile(),
    referrer: typeof document !== "undefined" ? document.referrer : "",
    utm: parseUtmParams(),
    events: eventsToFlush,
    maxScrollPercentage,
    activeDwellSeconds,
  };

  const jsonString = JSON.stringify(payload);
  const endpoint = "/api/telemetry";

  // Use sendBeacon when supported and unloading/immediate
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([jsonString], { type: "application/json" });
    const success = navigator.sendBeacon(endpoint, blob);
    if (success) return;
  }

  // Fallback to fetch with keepalive
  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: jsonString,
    keepalive: true,
  }).catch(() => {
    // Silently handle offline/network errors
  });
}

function setupScrollTracker() {
  const milestones = [25, 50, 75, 90, 100];
  const reached = new Set<number>();

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight > 0) {
            const currentPercent = Math.min(
              100,
              Math.max(0, Math.round((window.scrollY / docHeight) * 100)),
            );
            if (currentPercent > maxScrollPercentage) {
              maxScrollPercentage = currentPercent;
            }
            for (const m of milestones) {
              if (currentPercent >= m && !reached.has(m)) {
                reached.add(m);
                queueTelemetryEvent("scroll_depth", { percentage: m });
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );
}

function setupDwellEngine() {
  dwellInterval = window.setInterval(() => {
    if (
      document.visibilityState === "visible" &&
      (document.hasFocus() || window.document.hasFocus())
    ) {
      activeDwellSeconds += 1;
      // Pulse every 15s
      if (activeDwellSeconds - lastPulseActiveSeconds >= 15) {
        const increment = activeDwellSeconds - lastPulseActiveSeconds;
        lastPulseActiveSeconds = activeDwellSeconds;
        queueTelemetryEvent("dwell_pulse", {
          activeTotalSeconds: activeDwellSeconds,
          pulseIncrement: increment,
        });
      }
    }
  }, 1000);
}

function setupSectionObserver() {
  const sections = document.querySelectorAll<HTMLElement>("section[id]");
  if (!sections.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
          queueTelemetryEvent("page_view", { section: entry.target.id }, entry.target.id);
        }
      }
    },
    { threshold: 0.4 },
  );

  sections.forEach((sec) => observer.observe(sec));
}

function setupGlobalClickListener() {
  document.addEventListener("click", (e) => {
    const target = (e.target as HTMLElement).closest("a, button");
    if (!target) return;

    const href = target.getAttribute("href") || "";
    const isResume =
      href.includes(".pdf") ||
      href.includes("resume") ||
      target.getAttribute("data-track") === "resume-download";

    if (isResume) {
      queueTelemetryEvent("resume_download", {
        href,
        buttonText: target.textContent?.trim() || "Resume",
      });
      return;
    }

    if (href.startsWith("mailto:")) {
      queueTelemetryEvent("contact_copy", { type: "mailto", email: href.replace("mailto:", "") });
      return;
    }

    if (href.startsWith("tel:")) {
      queueTelemetryEvent("contact_copy", { type: "tel", phone: href.replace("tel:", "") });
      return;
    }

    if (href.startsWith("http") && !href.includes(window.location.host)) {
      queueTelemetryEvent("external_click", {
        href,
        destination: new URL(href).hostname,
      });
    }
  });
}

export function initTelemetry() {
  if (typeof window === "undefined" || initialized) return;
  if (window.location.pathname.startsWith("/admin")) return;
  initialized = true;

  // Session Token
  try {
    sessionToken = sessionStorage.getItem("__prt_stok") || "";
    if (!sessionToken) {
      sessionToken = generateUUID();
      sessionStorage.setItem("__prt_stok", sessionToken);
    }

    visitorId = localStorage.getItem("__prt_vid") || "";
    if (!visitorId) {
      visitorId = generateUUID();
      localStorage.setItem("__prt_vid", visitorId);
    }
  } catch {
    sessionToken = generateUUID();
    visitorId = generateUUID();
  }

  // Initial Page View
  queueTelemetryEvent("page_view", {
    title: document.title,
    url: window.location.href,
  });

  setupScrollTracker();
  setupDwellEngine();
  setupSectionObserver();
  setupGlobalClickListener();

  // Periodic flush every 8s
  flushInterval = window.setInterval(() => {
    flushTelemetryBatch(false);
  }, 8000);

  // Flush on visibility change / unload
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushTelemetryBatch(true);
    }
  });

  window.addEventListener("pagehide", () => {
    flushTelemetryBatch(true);
  });
}
