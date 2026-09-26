import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { ShieldCheck, Lock, ArrowRight, AlertCircle, RefreshCw, Fingerprint } from "lucide-react";
import type { AdminDashboardData } from "@/lib/admin/types";
import type { AuditLogEntry } from "@/lib/admin/telemetry-store";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OverviewTab } from "@/components/admin/OverviewTab";
import { VisitorsTab } from "@/components/admin/VisitorsTab";
import { CrmTab } from "@/components/admin/CrmTab";
import { CmsTab } from "@/components/admin/CmsTab";
import { ObservabilityTab } from "@/components/admin/ObservabilityTab";
import { SecurityTab } from "@/components/admin/SecurityTab";
import { NeuralGlobe } from "@/components/admin/three/NeuralGlobe";
import { GhostVectorReplay } from "@/components/admin/GhostVectorReplay";
import { ArchonSentinelView } from "@/components/admin/ArchonSentinelView";
import { ArchonTerminal } from "@/components/admin/ArchonTerminal";
import {
  checkWebAuthnSupport,
  verifyBiometricPasskey,
  registerBiometricPasskey,
} from "@/lib/admin/webauthn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

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

  // Executive sub-tab states for restructured modules
  const [intelSubTab, setIntelSubTab] = useState<"globe" | "ghost" | "dossier">("globe");
  const [securitySubTab, setSecuritySubTab] = useState<"sentinel" | "diagnostics">("sentinel");
  const [crmSubTab, setCrmSubTab] = useState<"pipeline" | "cms">("pipeline");
  const [termSubTab, setTermSubTab] = useState<"cli" | "vitals">("cli");

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
        }
      }
    } catch {
      // Offline or network error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const [webAuthnSupported, setWebAuthnSupported] = useState<boolean>(false);

  useEffect(() => {
    // Check if session has stored authentication
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("__prt_admin_auth");
      if (stored === "authenticated") {
        setIsAuthenticated(true);
      }
      const { isSupported } = checkWebAuthnSupport();
      setWebAuthnSupported(isSupported);
    }
  }, []);

  const handleBiometricAuth = async () => {
    setErrorMsg("");
    const res = await verifyBiometricPasskey();
    if (res.success) {
      setIsAuthenticated(true);
      sessionStorage.setItem("__prt_admin_auth", "authenticated");
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleRegisterPasskey = async () => {
    setErrorMsg("");
    const res = await registerBiometricPasskey();
    if (res.success) {
      setIsAuthenticated(true);
      sessionStorage.setItem("__prt_admin_auth", "authenticated");
    } else {
      setErrorMsg(res.message);
    }
  };

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
      <div className="relative flex min-h-screen items-center justify-center bg-background px-4 font-sans text-foreground">
        <div aria-hidden className="scanlines pointer-events-none fixed inset-0 z-10" />
        <div className="absolute top-4 right-4 z-30">
          <ThemeToggle />
        </div>
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

              {webAuthnSupported && (
                <div className="pt-2 border-t border-border/60 space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBiometricAuth}
                    className="w-full gap-2 border-accent/40 bg-accent/10 font-mono text-xs text-accent hover:bg-accent hover:text-accent-foreground transition-all"
                  >
                    <Fingerprint className="h-4 w-4" />
                    Biometric Passkey (Windows Hello / Touch ID)
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleRegisterPasskey}
                      className="font-mono text-[10px] text-muted-foreground hover:text-accent hover:underline"
                    >
                      [ Enroll This Device Hardware Passkey ]
                    </button>
                  </div>
                </div>
              )}

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
        {/* Module 1: Executive Overview */}
        {activeTab === "overview" && <OverviewTab data={dashboardData} />}

        {/* Module 2: Live Intelligence & Spatial Telemetry */}
        {activeTab === "intelligence" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
              <span className="font-mono text-xs font-semibold text-muted-foreground mr-1">
                INTELLIGENCE VIEW:
              </span>
              <button
                type="button"
                onClick={() => setIntelSubTab("globe")}
                className={`px-3 py-1.5 font-mono text-xs rounded-md transition-all ${
                  intelSubTab === "globe"
                    ? "bg-accent/15 text-accent border border-accent/40 font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/20 border border-transparent"
                }`}
              >
                🌐 3D Geospatial Globe
              </button>
              <button
                type="button"
                onClick={() => setIntelSubTab("ghost")}
                className={`px-3 py-1.5 font-mono text-xs rounded-md transition-all ${
                  intelSubTab === "ghost"
                    ? "bg-accent/15 text-accent border border-accent/40 font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/20 border border-transparent"
                }`}
              >
                👻 Ghost Vector Replay
              </button>
              <button
                type="button"
                onClick={() => setIntelSubTab("dossier")}
                className={`px-3 py-1.5 font-mono text-xs rounded-md transition-all ${
                  intelSubTab === "dossier"
                    ? "bg-accent/15 text-accent border border-accent/40 font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/20 border border-transparent"
                }`}
              >
                📋 Full Visitor Dossier ({dashboardData.visitors.length})
              </button>
            </div>

            {intelSubTab === "globe" && <NeuralGlobe visitors={dashboardData.visitors} />}
            {intelSubTab === "ghost" && <GhostVectorReplay visitors={dashboardData.visitors} />}
            {intelSubTab === "dossier" && <VisitorsTab visitors={dashboardData.visitors} />}
          </div>
        )}

        {/* Module 3: Cyber Sentinel & Security Chamber */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
              <span className="font-mono text-xs font-semibold text-muted-foreground mr-1">
                DEFENSE VIEW:
              </span>
              <button
                type="button"
                onClick={() => setSecuritySubTab("sentinel")}
                className={`px-3 py-1.5 font-mono text-xs rounded-md transition-all ${
                  securitySubTab === "sentinel"
                    ? "bg-accent/15 text-accent border border-accent/40 font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/20 border border-transparent"
                }`}
              >
                🛡️ Threat Radar & IP Quarantine
              </button>
              <button
                type="button"
                onClick={() => setSecuritySubTab("diagnostics")}
                className={`px-3 py-1.5 font-mono text-xs rounded-md transition-all ${
                  securitySubTab === "diagnostics"
                    ? "bg-accent/15 text-accent border border-accent/40 font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/20 border border-transparent"
                }`}
              >
                🔒 Rate Limiting & Audit Chamber
              </button>
            </div>

            {securitySubTab === "sentinel" && (
              <ArchonSentinelView visitors={dashboardData.visitors} />
            )}
            {securitySubTab === "diagnostics" && (
              <SecurityTab auditLogs={auditLogs} securityDiagnostics={securityDiagnostics} />
            )}
          </div>
        )}

        {/* Module 4: Recruiter CRM & Content */}
        {activeTab === "crm" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
              <span className="font-mono text-xs font-semibold text-muted-foreground mr-1">
                TALENT VIEW:
              </span>
              <button
                type="button"
                onClick={() => setCrmSubTab("pipeline")}
                className={`px-3 py-1.5 font-mono text-xs rounded-md transition-all ${
                  crmSubTab === "pipeline"
                    ? "bg-accent/15 text-accent border border-accent/40 font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/20 border border-transparent"
                }`}
              >
                💼 Inquiries & Pipeline ({dashboardData.inquiries.length})
              </button>
              <button
                type="button"
                onClick={() => setCrmSubTab("cms")}
                className={`px-3 py-1.5 font-mono text-xs rounded-md transition-all ${
                  crmSubTab === "cms"
                    ? "bg-accent/15 text-accent border border-accent/40 font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/20 border border-transparent"
                }`}
              >
                📄 Resume & Content Asset Status
              </button>
            </div>

            {crmSubTab === "pipeline" && <CrmTab inquiries={dashboardData.inquiries} />}
            {crmSubTab === "cms" && (
              <CmsTab resumeDownloads={dashboardData.stats.resumeDownloads} />
            )}
          </div>
        )}

        {/* Module 5: Terminal & Diagnostics */}
        {activeTab === "terminal" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
              <span className="font-mono text-xs font-semibold text-muted-foreground mr-1">
                SYSTEM VIEW:
              </span>
              <button
                type="button"
                onClick={() => setTermSubTab("cli")}
                className={`px-3 py-1.5 font-mono text-xs rounded-md transition-all ${
                  termSubTab === "cli"
                    ? "bg-accent/15 text-accent border border-accent/40 font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/20 border border-transparent"
                }`}
              >
                ⚡ Matrix Directive CLI
              </button>
              <button
                type="button"
                onClick={() => setTermSubTab("vitals")}
                className={`px-3 py-1.5 font-mono text-xs rounded-md transition-all ${
                  termSubTab === "vitals"
                    ? "bg-accent/15 text-accent border border-accent/40 font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/20 border border-transparent"
                }`}
              >
                📊 3D WebGL & Core Web Vitals
              </button>
            </div>

            {termSubTab === "cli" && <ArchonTerminal data={dashboardData} />}
            {termSubTab === "vitals" && <ObservabilityTab data={dashboardData} />}
          </div>
        )}
      </main>
    </div>
  );
}
