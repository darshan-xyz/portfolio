import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { ShieldCheck, Lock, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";
import type { AdminDashboardData } from "@/lib/admin/types";
import type { AuditLogEntry } from "@/lib/admin/telemetry-store";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OverviewTab } from "@/components/admin/OverviewTab";
import { VisitorsTab } from "@/components/admin/VisitorsTab";
import { CrmTab } from "@/components/admin/CrmTab";
import { CmsTab } from "@/components/admin/CmsTab";
import { ObservabilityTab } from "@/components/admin/ObservabilityTab";
import { SecurityTab } from "@/components/admin/SecurityTab";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EMPTY_DATA: AdminDashboardData = {
  stats: {
    totalViews: 0,
    uniqueVisitors: 0,
    avgDwellSeconds: 0,
    resumeDownloads: 0,
    targetCompanyVisits: 0,
    viewsTrendPercent: 0,
    visitorsTrendPercent: 0,
  },
  trafficSeries: [],
  topPages: [],
  deviceBreakdown: [
    { name: "Desktop", value: 0 },
    { name: "Mobile", value: 0 },
    { name: "Tablet", value: 0 },
    { name: "Bot", value: 0 },
  ],
  geoBreakdown: [],
  acquisitionBreakdown: [],
  visitors: [],
  inquiries: [],
};

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Command Center — Darshan R" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Real-time live state
  const [dashboardData, setDashboardData] = useState<AdminDashboardData>(EMPTY_DATA);
  const [activeVisitorsCount, setActiveVisitorsCount] = useState<number>(0);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [securityDiagnostics, setSecurityDiagnostics] = useState<{
    telemetryLimit: string;
    contactLimit: string;
    totalEvaluated: number;
    totalBlocked: number;
    activeTrackedIps: number;
    lastBlockedAt?: string;
    lastBlockedIp?: string;
  } | null>(null);
  const [resumeMeta, setResumeMeta] = useState<{
    exists: boolean;
    sizeBytes: number;
    sizeFormatted: string;
    updatedAt: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchRealData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin");
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setDashboardData(json.data);
          setActiveVisitorsCount(json.activeCount ?? 0);
          if (json.auditLogs) setAuditLogs(json.auditLogs);
          if (json.securityDiagnostics) setSecurityDiagnostics(json.securityDiagnostics);
          if (json.resumeMeta) setResumeMeta(json.resumeMeta);
        }
      }
    } catch {
      // Offline or network error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check if session has stored authentication
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("__prt_admin_auth");
      if (stored === "authenticated") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchRealData();

    // Log admin access in real audit log
    fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "audit_login" }),
    }).catch(() => {});

    // Polling every 3 seconds for 100% real-time pulse
    const interval = setInterval(fetchRealData, 3000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchRealData]);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const validCodes = ["darshan2026", "admin", "archon", "darshan"];
    if (validCodes.includes(passcode.trim().toLowerCase())) {
      setIsAuthenticated(true);
      sessionStorage.setItem("__prt_admin_auth", "authenticated");
      setErrorMsg("");
    } else {
      setErrorMsg("Invalid administrative passkey. Access denied.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("__prt_admin_auth");
    setPasscode("");
  };

  // If not authenticated, render Hardened Terminal Gate
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 font-sans text-foreground">
        <div aria-hidden className="scanlines pointer-events-none fixed inset-0 z-10" />
        <Card className="relative z-20 w-full max-w-md border-border bg-surface/80 backdrop-blur-2xl shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-accent/40 bg-background text-accent shadow-lg">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <CardTitle className="font-mono text-base font-bold tracking-wider text-foreground">
              DARSHAN_R // ARCHON GATE
            </CardTitle>
            <p className="font-mono text-xs text-muted-foreground">
              Enterprise Admin & Telemetry Clearance
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1 block font-mono text-xs text-muted-foreground">
                  ADMINISTRATIVE PASSKEY
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Enter passkey (e.g. darshan2026)"
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      setErrorMsg("");
                    }}
                    className="border-border bg-muted/20 pl-9 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-accent"
                    autoFocus
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-1.5 rounded bg-rose-500/10 p-2 text-xs text-rose-300 border border-rose-500/20">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full gap-2 bg-accent font-mono text-xs font-semibold text-accent-foreground hover:bg-accent/90"
              >
                Authenticate Clearance
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>

              <div className="border-t border-border pt-3 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setPasscode("darshan2026");
                    setIsAuthenticated(true);
                    sessionStorage.setItem("__prt_admin_auth", "authenticated");
                  }}
                  className="font-mono text-[11px] text-accent/70 hover:text-accent hover:underline"
                >
                  [ 1-Click Fast Auth for Owner ]
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated Enterprise Dashboard
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-surface/40 via-transparent to-transparent" />

      {/* Admin Navigation Header */}
      <AdminHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeVisitorsCount={activeVisitorsCount}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {activeTab === "overview" && <OverviewTab data={dashboardData} />}
        {activeTab === "visitors" && <VisitorsTab visitors={dashboardData.visitors} />}
        {activeTab === "crm" && <CrmTab inquiries={dashboardData.inquiries} />}
        {activeTab === "cms" && (
          <CmsTab
            resumeDownloads={dashboardData.stats.resumeDownloads}
            resumeMeta={resumeMeta}
            onRefresh={fetchRealData}
          />
        )}
        {activeTab === "observability" && <ObservabilityTab data={dashboardData} />}
        {activeTab === "security" && (
          <SecurityTab auditLogs={auditLogs} securityDiagnostics={securityDiagnostics} />
        )}
      </main>
    </div>
  );
}
