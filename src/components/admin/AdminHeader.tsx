import { Activity, ShieldCheck, LogOut, Radio, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activeVisitorsCount: number;
  onLogout: () => void;
}

const TABS = [
  { id: "overview", label: "Command Center" },
  { id: "visitors", label: "Visitor Dossier" },
  { id: "crm", label: "Recruiter CRM" },
  { id: "cms", label: "Content & Resume" },
  { id: "observability", label: "3D & Web Vitals" },
  { id: "security", label: "Security & Audit" },
];

export function AdminHeader({
  activeTab,
  onTabChange,
  activeVisitorsCount,
  onLogout,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Live Presence Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/40 bg-surface text-accent shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold tracking-wider text-foreground">
                  DARSHAN_R // ARCHON
                </span>
                <Badge
                  variant="outline"
                  className="border-accent/30 bg-accent/10 font-mono text-[10px] text-accent"
                >
                  ENTERPRISE ADMIN
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Portfolio Intelligence & Command Center
              </p>
            </div>
          </div>

          <div className="hidden h-5 w-px bg-muted md:block" />

          {/* Real-time live presence counter */}
          <div
            className={`hidden items-center gap-2 rounded-full px-2.5 py-1 text-xs md:flex ${
              activeVisitorsCount > 0
                ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border border-border bg-muted/20 text-muted-foreground"
            }`}
          >
            <Radio
              className={`h-3.5 w-3.5 ${activeVisitorsCount > 0 ? "animate-pulse text-emerald-400" : "text-muted-foreground"}`}
            />
            <span className="font-mono font-medium">{activeVisitorsCount} ACTIVE NOW</span>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.reload()}
            className="hidden h-8 gap-1.5 border border-border font-mono text-xs text-muted-foreground hover:bg-muted/20 hover:text-foreground sm:inline-flex"
          >
            <RefreshCw className="h-3 w-3" />
            Sync
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="h-8 gap-1.5 border-rose-500/30 bg-rose-500/10 font-mono text-xs text-rose-300 hover:bg-rose-500/20 hover:text-foreground"
          >
            <LogOut className="h-3 w-3" />
            Exit
          </Button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="mx-auto flex max-w-7xl overflow-x-auto px-4 sm:px-6">
        <nav className="flex space-x-1 py-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-colors rounded-md ${
                  isActive
                    ? "text-accent bg-muted/20 shadow-inner"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.02]"
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-accent" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
