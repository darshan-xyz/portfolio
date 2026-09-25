import type { AdminDashboardData, CrmInquiryRecord, VisitorSessionRecord } from "./types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface StoredSession {
  id: string;
  sessionToken: string;
  visitorHash: string;
  ip: string;
  countryCode: string;
  countryName: string;
  city: string;
  region: string;
  asnNumber?: string;
  asnOrg?: string;
  isTargetCompany: boolean;
  deviceType: "desktop" | "mobile" | "tablet" | "bot";
  os: string;
  browser: string;
  gpuRenderer?: string;
  screenWidth: number;
  screenHeight: number;
  referrer: string;
  utmSource?: string;
  utmCampaign?: string;
  activeDwellSeconds: number;
  maxScrollPercentage: number;
  hasResumeDownload: boolean;
  hasContactIntent: boolean;
  startedAt: number;
  lastActiveAt: number;
  events: Array<{
    eventName: string;
    path: string;
    sectionId?: string;
    payload?: Record<string, unknown>;
    timestamp: string;
  }>;
}

// Global in-memory storage on server
const sessionsMap = new Map<string, StoredSession>();
const inquiriesList: CrmInquiryRecord[] = [];

// Audit logs
export interface AuditLogEntry {
  id: string;
  action: string;
  detail: string;
  actor: string;
  ip: string;
  time: string;
}

const auditLogsList: AuditLogEntry[] = [
  {
    id: "aud-init",
    action: "system.live_store_ready",
    detail: "Real-time telemetry and inquiry store initialized",
    actor: "SYSTEM",
    ip: "127.0.0.1",
    time: new Date().toLocaleTimeString(),
  },
];

export function recordAuditLog(
  action: string,
  detail: string,
  ip: string,
  actor = "darshanr2005@gmail.com",
) {
  auditLogsList.unshift({
    id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    action,
    detail,
    actor,
    ip,
    time: new Date().toLocaleTimeString(),
  });
  if (auditLogsList.length > 200) {
    auditLogsList.pop();
  }
}

export function getAuditLogs(): AuditLogEntry[] {
  return auditLogsList;
}

export function recordSession(sessionData: {
  sessionToken: string;
  visitorHash: string;
  rawIp: string;
  countryCode: string;
  city: string;
  region: string;
  asnNumber?: string | null;
  asnOrg?: string | null;
  deviceType: "desktop" | "mobile" | "tablet" | "bot";
  os: string;
  browser: string;
  gpuRenderer?: string | null;
  screenWidth: number;
  screenHeight: number;
  referrer?: string | null;
  utmSource?: string | null;
  utmCampaign?: string | null;
  activeDwellSeconds: number;
  maxScrollPercentage: number;
  hasResumeDownload: boolean;
  hasContactIntent: boolean;
  events: Array<{
    eventName: string;
    path: string;
    sectionId?: string | null;
    payload?: Record<string, unknown>;
    timestamp: string;
  }>;
}) {
  const now = Date.now();
  const existing = sessionsMap.get(sessionData.sessionToken);

  const isTarget = Boolean(
    sessionData.asnOrg &&
    /(google|microsoft|amazon|meta|apple|netflix|nvidia|stripe|uber|airbnb|openai|anthropic)/i.test(
      sessionData.asnOrg,
    ),
  );

  const formattedEvents = sessionData.events.map((e) => ({
    eventName: e.eventName,
    path: e.path,
    sectionId: e.sectionId || undefined,
    payload: e.payload,
    timestamp: e.timestamp || new Date().toISOString(),
  }));

  if (existing) {
    existing.activeDwellSeconds = Math.max(
      existing.activeDwellSeconds,
      sessionData.activeDwellSeconds,
    );
    existing.maxScrollPercentage = Math.max(
      existing.maxScrollPercentage,
      sessionData.maxScrollPercentage,
    );
    existing.hasResumeDownload = existing.hasResumeDownload || sessionData.hasResumeDownload;
    existing.hasContactIntent = existing.hasContactIntent || sessionData.hasContactIntent;
    existing.lastActiveAt = now;

    // Deduplicate / append events
    for (const ev of formattedEvents) {
      existing.events.push(ev);
    }
    if (existing.events.length > 100) {
      existing.events.splice(0, existing.events.length - 100);
    }
  } else {
    sessionsMap.set(sessionData.sessionToken, {
      id: `sess-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sessionToken: sessionData.sessionToken,
      visitorHash: sessionData.visitorHash,
      ip: sessionData.rawIp,
      countryCode: sessionData.countryCode || "UNKNOWN",
      countryName: sessionData.countryCode || "Unknown",
      city: sessionData.city || "Local",
      region: sessionData.region || "",
      asnNumber: sessionData.asnNumber || undefined,
      asnOrg: sessionData.asnOrg || undefined,
      isTargetCompany: isTarget,
      deviceType: sessionData.deviceType,
      os: sessionData.os,
      browser: sessionData.browser,
      gpuRenderer: sessionData.gpuRenderer || undefined,
      screenWidth: sessionData.screenWidth,
      screenHeight: sessionData.screenHeight,
      referrer: sessionData.referrer || "Direct",
      utmSource: sessionData.utmSource || undefined,
      utmCampaign: sessionData.utmCampaign || undefined,
      activeDwellSeconds: sessionData.activeDwellSeconds,
      maxScrollPercentage: sessionData.maxScrollPercentage,
      hasResumeDownload: sessionData.hasResumeDownload,
      hasContactIntent: sessionData.hasContactIntent,
      startedAt: now,
      lastActiveAt: now,
      events: formattedEvents,
    });
  }

  // Cap in-memory storage to 1000 sessions
  if (sessionsMap.size > 1000) {
    const oldestKey = sessionsMap.keys().next().value;
    if (oldestKey) sessionsMap.delete(oldestKey);
  }
}

export function recordInquiry(inquiry: {
  name: string;
  email: string;
  company?: string;
  roleType?: string;
  opportunityType?: string;
  message: string;
  ip?: string;
}) {
  const newInq: CrmInquiryRecord = {
    id: `inq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: inquiry.name.trim(),
    email: inquiry.email.trim(),
    company: inquiry.company?.trim() || "Not specified",
    roleType: inquiry.roleType || "Inquirer",
    opportunityType: inquiry.opportunityType || "General",
    message: inquiry.message.trim(),
    pipelineStage: "new",
    priority: inquiry.message.length > 200 ? "high" : "medium",
    sentiment: "positive",
    aiSummary: `Inquiry from ${inquiry.name} regarding: "${inquiry.message.slice(0, 80)}..."`,
    createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  inquiriesList.unshift(newInq);
  if (inquiriesList.length > 200) {
    inquiriesList.pop();
  }

  recordAuditLog(
    "crm.new_inquiry",
    `Received message from ${inquiry.name} (${inquiry.email})`,
    inquiry.ip || "127.0.0.1",
  );

  // Asynchronously persist to Supabase if configured
  try {
    const supabase = createServerSupabaseClient();
    supabase
      .from("crm_inquiries")
      .insert({
        name: newInq.name,
        email: newInq.email,
        company: newInq.company,
        role_type: newInq.roleType,
        opportunity_type: newInq.opportunityType,
        message: newInq.message,
        pipeline_stage: newInq.pipelineStage,
        priority: newInq.priority,
        sentiment_label: newInq.sentiment,
        ai_summary: newInq.aiSummary,
      })
      .then(() => {})
      .catch(() => {});
  } catch {
    // Non-blocking fail-safe
  }

  return newInq;
}

export function updateInquiryStage(
  id: string,
  stage: CrmInquiryRecord["pipelineStage"],
  ip = "127.0.0.1",
) {
  const item = inquiriesList.find((i) => i.id === id);
  if (item) {
    item.pipelineStage = stage;
    recordAuditLog("crm.stage_change", `Moved inquiry ${item.name} to ${stage}`, ip);
  }
}

export function getInquiries(): CrmInquiryRecord[] {
  return inquiriesList;
}

export function getActiveVisitorsCount(windowSeconds = 90): number {
  const threshold = Date.now() - windowSeconds * 1000;
  let count = 0;
  for (const sess of sessionsMap.values()) {
    if (sess.lastActiveAt >= threshold) {
      count++;
    }
  }
  return count;
}

export function getLiveDashboardData(): AdminDashboardData {
  const sessions = Array.from(sessionsMap.values());
  const now = Date.now();

  let totalViews = 0;
  let totalDwell = 0;
  let resumeDownloads = 0;
  let targetCompanyVisits = 0;

  const pageViewsCountMap = new Map<string, { views: number; totalDwell: number }>();
  const deviceCountMap = { Desktop: 0, Mobile: 0, Tablet: 0, Bot: 0 };
  const geoMap = new Map<string, { country: string; code: string; city: string; visits: number }>();
  const dateMap = new Map<string, { views: number; visitors: Set<string>; downloads: number }>();

  // Initialize last 7 days buckets
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now - i * 86400000);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dateMap.set(label, { views: 0, visitors: new Set(), downloads: 0 });
  }

  for (const s of sessions) {
    totalDwell += s.activeDwellSeconds;
    if (s.hasResumeDownload) resumeDownloads++;
    if (s.isTargetCompany) targetCompanyVisits++;

    // Devices
    if (s.deviceType === "mobile") deviceCountMap.Mobile++;
    else if (s.deviceType === "tablet") deviceCountMap.Tablet++;
    else if (s.deviceType === "bot") deviceCountMap.Bot++;
    else deviceCountMap.Desktop++;

    // Geo
    const geoKey = `${s.countryCode}-${s.city}`;
    const geoEntry = geoMap.get(geoKey) || {
      country: s.countryName,
      code: s.countryCode,
      city: s.city,
      visits: 0,
    };
    geoEntry.visits++;
    geoMap.set(geoKey, geoEntry);

    // Events breakdown
    for (const ev of s.events) {
      if (ev.eventName === "page_view") {
        totalViews++;
        const pKey = ev.path || "/";
        const pEntry = pageViewsCountMap.get(pKey) || { views: 0, totalDwell: 0 };
        pEntry.views++;
        pEntry.totalDwell += s.activeDwellSeconds;
        pageViewsCountMap.set(pKey, pEntry);
      }

      // Date series grouping
      const dateLabel = new Date(ev.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const dEntry = dateMap.get(dateLabel);
      if (dEntry) {
        if (ev.eventName === "page_view") dEntry.views++;
        if (ev.eventName === "resume_download") dEntry.downloads++;
        dEntry.visitors.add(s.visitorHash || s.ip);
      }
    }
  }

  const uniqueVisitors = sessions.length;
  const avgDwellSeconds = uniqueVisitors > 0 ? Math.round(totalDwell / uniqueVisitors) : 0;

  // Build traffic series
  const trafficSeries = Array.from(dateMap.entries()).map(([date, val]) => ({
    date,
    views: val.views,
    visitors: val.visitors.size,
    resumeDownloads: val.downloads,
  }));

  // Build top pages
  const topPages = Array.from(pageViewsCountMap.entries())
    .map(([path, val]) => ({
      path,
      name: path === "/" ? "Home (Portfolio Overview)" : path,
      views: val.views,
      avgDwell: val.views > 0 ? Math.round(val.totalDwell / val.views) : 0,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Build device breakdown
  const totalDev = sessions.length || 1;
  const deviceBreakdown: Array<{ name: "Desktop" | "Mobile" | "Tablet" | "Bot"; value: number }> = [
    { name: "Desktop", value: Math.round((deviceCountMap.Desktop / totalDev) * 100) },
    { name: "Mobile", value: Math.round((deviceCountMap.Mobile / totalDev) * 100) },
    { name: "Tablet", value: Math.round((deviceCountMap.Tablet / totalDev) * 100) },
    { name: "Bot", value: Math.round((deviceCountMap.Bot / totalDev) * 100) },
  ];

  // Build geo breakdown
  const geoBreakdown = Array.from(geoMap.values())
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 10)
    .map((g) => ({
      country: g.country,
      code: g.code,
      city: g.city,
      visits: g.visits,
      percent: uniqueVisitors > 0 ? Math.round((g.visits / uniqueVisitors) * 100) : 0,
    }));

  // Build visitor sessions list
  const visitorsList: VisitorSessionRecord[] = sessions
    .sort((a, b) => b.lastActiveAt - a.lastActiveAt)
    .map((s) => {
      const elapsedSeconds = Math.max(1, Math.round((now - s.lastActiveAt) / 1000));
      const timeAgo =
        elapsedSeconds < 60
          ? `${elapsedSeconds}s ago`
          : elapsedSeconds < 3600
            ? `${Math.floor(elapsedSeconds / 60)}m ago`
            : `${Math.floor(elapsedSeconds / 3600)}h ago`;

      return {
        id: s.id,
        sessionToken: s.sessionToken,
        ip: s.ip,
        countryCode: s.countryCode,
        countryName: s.countryName,
        city: s.city,
        region: s.region,
        asnNumber: s.asnNumber,
        asnOrg: s.asnOrg,
        isTargetCompany: s.isTargetCompany,
        deviceType: s.deviceType,
        os: s.os,
        browser: s.browser,
        gpuRenderer: s.gpuRenderer,
        screenWidth: s.screenWidth,
        screenHeight: s.screenHeight,
        referrer: s.referrer,
        utmSource: s.utmSource,
        utmCampaign: s.utmCampaign,
        activeDwellSeconds: s.activeDwellSeconds,
        maxScrollPercentage: s.maxScrollPercentage,
        hasResumeDownload: s.hasResumeDownload,
        hasContactIntent: s.hasContactIntent,
        timestamp: timeAgo,
        eventsCount: s.events.length,
        timeline: s.events.map((e, idx) => ({
          time: `+${idx * 12}s`,
          event: e.eventName.replace(/_/g, " ").toUpperCase(),
          detail: `${e.path} ${e.sectionId ? `(#${e.sectionId})` : ""}`,
        })),
      };
    });

  return {
    stats: {
      totalViews,
      uniqueVisitors,
      avgDwellSeconds,
      resumeDownloads,
      targetCompanyVisits,
      viewsTrendPercent: totalViews > 0 ? 100 : 0,
      visitorsTrendPercent: uniqueVisitors > 0 ? 100 : 0,
    },
    trafficSeries,
    topPages,
    deviceBreakdown,
    geoBreakdown,
    visitors: visitorsList,
    inquiries: inquiriesList,
  };
}
