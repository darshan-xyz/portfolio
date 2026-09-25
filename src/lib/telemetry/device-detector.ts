import type { AcquisitionChannel, DeviceTelemetryProfile, NavigationType } from "./types";

// Timezone to Country/City mapping for accurate local/offline resolution
const TIMEZONE_GEO_MAP: Record<string, { country: string; code: string; city: string }> = {
  "Asia/Kolkata": { country: "India", code: "IN", city: "Coimbatore / Bengaluru" },
  "Asia/Calcutta": { country: "India", code: "IN", city: "Coimbatore / Bengaluru" },
  "America/New_York": { country: "United States", code: "US", city: "New York" },
  "America/Los_Angeles": { country: "United States", code: "US", city: "Los Angeles / SF" },
  "America/Chicago": { country: "United States", code: "US", city: "Chicago" },
  "America/Denver": { country: "United States", code: "US", city: "Denver" },
  "Europe/London": { country: "United Kingdom", code: "GB", city: "London" },
  "Europe/Berlin": { country: "Germany", code: "DE", city: "Berlin" },
  "Europe/Paris": { country: "France", code: "FR", city: "Paris" },
  "Europe/Amsterdam": { country: "Netherlands", code: "NL", city: "Amsterdam" },
  "Asia/Singapore": { country: "Singapore", code: "SG", city: "Singapore" },
  "Asia/Tokyo": { country: "Japan", code: "JP", city: "Tokyo" },
  "Asia/Dubai": { country: "United Arab Emirates", code: "AE", city: "Dubai" },
  "Australia/Sydney": { country: "Australia", code: "AU", city: "Sydney" },
  "Australia/Melbourne": { country: "Australia", code: "AU", city: "Melbourne" },
  "America/Toronto": { country: "Canada", code: "CA", city: "Toronto" },
};

export function cleanGpuRenderer(rawRenderer?: string): { clean: string; raw: string } {
  if (!rawRenderer) return { clean: "Generic Display Adapter", raw: "" };

  const raw = rawRenderer.trim();
  let clean = raw;

  // Handle ANGLE format: "ANGLE (Vendor, Model Direct3D11 vs_5_0 ps_5_0, D3D11)"
  const angleMatch = raw.match(/ANGLE\s*\([^,]+,\s*([^,]+)/i);
  if (angleMatch && angleMatch[1]) {
    clean = angleMatch[1].trim();
  }

  // Remove Direct3D driver boilerplate
  clean = clean
    .replace(/\s*Direct3D[0-9._]+/gi, "")
    .replace(/\s*vs_[0-9_]+\s*ps_[0-9_]+/gi, "")
    .replace(/\s*\(R\)/gi, "")
    .replace(/\s*\(TM\)/gi, "")
    .replace(/\s*Graphics\s+Device/gi, "Graphics")
    .replace(/\s*ANGLE\s+Metal\s+Renderer:\s*/gi, "")
    .replace(/[,\s\-_)]+$/g, "")
    .replace(/^[,\s\-_(]+/g, "")
    .trim();

  return { clean: clean || raw, raw };
}

export function detectGpu(): { vendor?: string; renderer?: string; raw?: string } {
  if (typeof document === "undefined") return {};
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return {};

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) {
      return {
        vendor: gl.getParameter(gl.VENDOR) || undefined,
        renderer: gl.getParameter(gl.RENDERER) || undefined,
      };
    }

    const rawVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) as string;
    const rawRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;
    const { clean, raw } = cleanGpuRenderer(rawRenderer);

    return {
      vendor: rawVendor,
      renderer: clean,
      raw,
    };
  } catch {
    return {};
  }
}

export function detectOperatingSystem(): { name: string; version: string } {
  if (typeof navigator === "undefined") return { name: "Unknown", version: "" };

  const ua = navigator.userAgent;
  const platform =
    (navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData?.platform ||
    navigator.platform ||
    "";

  // Check iPadOS (iPad on iOS 13+ reports Macintosh user agent with touch)
  const isIPad =
    /iPad/i.test(ua) ||
    (/Macintosh/i.test(ua) &&
      typeof navigator.maxTouchPoints === "number" &&
      navigator.maxTouchPoints > 1);
  if (isIPad) return { name: "iPadOS", version: "iPad" };

  if (/iPhone/i.test(ua)) {
    const match = ua.match(/OS\s([0-9_]+)/);
    return { name: "iOS", version: match ? match[1].replace(/_/g, ".") : "iPhone" };
  }

  if (/Android/i.test(ua)) {
    const match = ua.match(/Android\s([0-9.]+)/);
    return { name: "Android", version: match ? match[1] : "" };
  }

  if (/Windows/i.test(ua) || /Win/i.test(platform)) {
    if (/Windows NT 10.0/i.test(ua)) {
      // Windows 10 vs Windows 11
      return { name: "Windows", version: "11 / 10" };
    }
    if (/Windows NT 6.3/i.test(ua)) return { name: "Windows", version: "8.1" };
    if (/Windows NT 6.1/i.test(ua)) return { name: "Windows", version: "7" };
    return { name: "Windows", version: "" };
  }

  if (/Macintosh|Mac OS X/i.test(ua)) {
    const match = ua.match(/Mac OS X\s([0-9_]+)/);
    return { name: "macOS", version: match ? match[1].replace(/_/g, ".") : "" };
  }

  if (/CrOS/i.test(ua)) return { name: "ChromeOS", version: "" };
  if (/Ubuntu/i.test(ua)) return { name: "Ubuntu Linux", version: "" };
  if (/Linux/i.test(ua) || /Linux/i.test(platform)) return { name: "Linux", version: "" };

  return { name: "Unknown OS", version: "" };
}

export function detectBrowser(): { name: string; version: string } {
  if (typeof navigator === "undefined") return { name: "Unknown", version: "" };

  const ua = navigator.userAgent;

  // Brave
  if ((navigator as unknown as { brave?: { isBrave?: () => Promise<boolean> } }).brave) {
    return { name: "Brave", version: "" };
  }

  // Edge
  const edgeMatch = ua.match(/Edg\/([0-9.]+)/);
  if (edgeMatch) return { name: "Microsoft Edge", version: edgeMatch[1].split(".")[0] };

  // Chrome
  const chromeMatch = ua.match(/Chrome\/([0-9.]+)/);
  if (chromeMatch && !/OPR|SamsungBrowser/i.test(ua)) {
    return { name: "Google Chrome", version: chromeMatch[1].split(".")[0] };
  }

  // Firefox
  const firefoxMatch = ua.match(/Firefox\/([0-9.]+)/);
  if (firefoxMatch) return { name: "Mozilla Firefox", version: firefoxMatch[1].split(".")[0] };

  // Safari
  const safariMatch = ua.match(/Version\/([0-9.]+).*Safari/);
  if (safariMatch) return { name: "Apple Safari", version: safariMatch[1].split(".")[0] };

  // Opera
  const operaMatch = ua.match(/OPR\/([0-9.]+)/);
  if (operaMatch) return { name: "Opera", version: operaMatch[1].split(".")[0] };

  // Samsung
  const samsungMatch = ua.match(/SamsungBrowser\/([0-9.]+)/);
  if (samsungMatch) return { name: "Samsung Internet", version: samsungMatch[1].split(".")[0] };

  return { name: "Browser", version: "" };
}

export function detectAcquisition(): {
  channel: AcquisitionChannel;
  label: string;
  navigationType: NavigationType;
} {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return {
      channel: "direct",
      label: "Direct Visit",
      navigationType: "unknown",
    };
  }

  const referrer = document.referrer.toLowerCase();
  const host = window.location.host.toLowerCase();
  const search = window.location.search.toLowerCase();
  const params = new URLSearchParams(search);
  const utmMedium = params.get("utm_medium")?.toLowerCase();
  const utmSource = params.get("utm_source")?.toLowerCase();

  // Navigation entry type (reload, navigate, back_forward)
  let navigationType: NavigationType = "unknown";
  try {
    const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    if (navEntries && navEntries.length > 0) {
      navigationType = navEntries[0].type as NavigationType;
    }
  } catch {
    // fallback
  }

  // 1. Paid / Ad Campaign
  if (utmMedium && /^(cpc|ppc|paid|ad|sponsored)$/i.test(utmMedium)) {
    return { channel: "campaign", label: `Ad Campaign (${utmSource || "Paid"})`, navigationType };
  }

  // 2. Email
  if (
    (utmMedium && /^(email|newsletter)$/i.test(utmMedium)) ||
    /mail\.google\.com|outlook\.live\.com|mail\.yahoo\.com/i.test(referrer)
  ) {
    return { channel: "email", label: "Email / Direct Mail", navigationType };
  }

  // 3. Search Engines
  if (/google\./i.test(referrer))
    return { channel: "search", label: "Google Search", navigationType };
  if (/bing\./i.test(referrer)) return { channel: "search", label: "Bing Search", navigationType };
  if (/duckduckgo\./i.test(referrer))
    return { channel: "search", label: "DuckDuckGo Search", navigationType };
  if (/yahoo\./i.test(referrer))
    return { channel: "search", label: "Yahoo Search", navigationType };

  // 4. Social Media
  if (/linkedin\./i.test(referrer) || utmSource === "linkedin") {
    return { channel: "social", label: "LinkedIn Referral", navigationType };
  }
  if (/github\./i.test(referrer) || utmSource === "github") {
    return { channel: "social", label: "GitHub Profile / Repo", navigationType };
  }
  if (/t\.co|twitter\.|x\.com/i.test(referrer) || utmSource === "twitter") {
    return { channel: "social", label: "X (Twitter) Link", navigationType };
  }
  if (/reddit\./i.test(referrer))
    return { channel: "social", label: "Reddit Referral", navigationType };
  if (/instagram\./i.test(referrer))
    return { channel: "social", label: "Instagram Link", navigationType };
  if (/youtube\.|youtu\.be/i.test(referrer))
    return { channel: "social", label: "YouTube Referral", navigationType };
  if (/threads\.net/i.test(referrer))
    return { channel: "social", label: "Threads Link", navigationType };
  if (/news\.ycombinator\.com/i.test(referrer))
    return { channel: "social", label: "Hacker News", navigationType };

  // 5. External Web Referral
  if (referrer && !referrer.includes(host)) {
    try {
      const refUrl = new URL(referrer);
      return {
        channel: "referral",
        label: `Referral Link (${refUrl.hostname.replace(/^www\./, "")})`,
        navigationType,
      };
    } catch {
      return { channel: "referral", label: "External Web Link", navigationType };
    }
  }

  // 6. Direct Visit
  if (navigationType === "reload") {
    return { channel: "direct", label: "Direct Visit (Page Reload)", navigationType };
  }
  if (navigationType === "back_forward") {
    return { channel: "direct", label: "Browser History (Back/Forward)", navigationType };
  }

  if (utmSource) {
    return { channel: "campaign", label: `Direct Link (Ref: ${utmSource})`, navigationType };
  }

  return { channel: "direct", label: "Direct Visit (URL Typed / Bookmark)", navigationType };
}

export function resolveAccurateDeviceProfile(): DeviceTelemetryProfile {
  const os = detectOperatingSystem();
  const browser = detectBrowser();
  const gpu = detectGpu();
  const acquisition = detectAcquisition();

  const width = typeof window !== "undefined" ? window.screen.width : 0;
  const height = typeof window !== "undefined" ? window.screen.height : 0;
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 0;
  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 0;
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const touchPoints = typeof navigator !== "undefined" ? navigator.maxTouchPoints || 0 : 0;
  const hasTouch = touchPoints > 0;
  const orientation = width >= height ? "landscape" : "portrait";
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  // Geolocation inference from timezone
  const geoInfo = TIMEZONE_GEO_MAP[timeZone];

  // Device Category categorization
  let deviceCategory: DeviceTelemetryProfile["deviceCategory"] = "desktop";
  if (os.name === "iOS" || os.name === "Android") {
    deviceCategory = "mobile";
  } else if (os.name === "iPadOS" || (hasTouch && width >= 768 && width <= 1024)) {
    deviceCategory = "tablet";
  } else if (width < 768 && hasTouch) {
    deviceCategory = "mobile";
  }

  return {
    screenWidth: width,
    screenHeight: height,
    viewportWidth,
    viewportHeight,
    devicePixelRatio: Math.round(dpr * 100) / 100,
    hasTouch,
    touchPoints,
    orientation,
    colorDepth: typeof window !== "undefined" ? window.screen.colorDepth || 24 : 24,
    osName: os.name,
    osVersion: os.version,
    browserName: browser.name,
    browserVersion: browser.version,
    deviceCategory,
    gpuVendor: gpu.vendor,
    gpuRenderer: gpu.renderer,
    rawGpuString: gpu.raw,
    language: typeof navigator !== "undefined" ? navigator.language : "en",
    timeZone,
    inferredCountry: geoInfo?.country,
    inferredCountryCode: geoInfo?.code,
    inferredCity: geoInfo?.city,
    navigationType: acquisition.navigationType,
    acquisitionChannel: acquisition.channel,
    acquisitionLabel: acquisition.label,
    landingPage:
      typeof window !== "undefined" ? window.location.pathname + window.location.search : "/",
  };
}
