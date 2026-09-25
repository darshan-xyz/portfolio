import {
  ShieldAlert,
  Key,
  Lock,
  History,
  CheckCircle2,
  Database,
  ShieldCheck,
  Bot,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AuditLogEntry } from "@/lib/admin/telemetry-store";

interface SecurityTabProps {
  auditLogs?: AuditLogEntry[];
  securityDiagnostics?: {
    telemetryLimit: string;
    contactLimit: string;
    totalEvaluated: number;
    totalBlocked: number;
    activeTrackedIps: number;
    lastBlockedAt?: string;
    lastBlockedIp?: string;
  } | null;
}

export function SecurityTab({ auditLogs = [], securityDiagnostics }: SecurityTabProps) {
  const evaluatedCount = securityDiagnostics?.totalEvaluated ?? 0;
  const blockedCount = securityDiagnostics?.totalBlocked ?? 0;
  const activeTracked = securityDiagnostics?.activeTrackedIps ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-mono text-base font-semibold text-foreground">
          SECURITY, ACCESS CONTROL & AUDIT CHAMBER
        </h2>
        <p className="text-xs text-muted-foreground">
          Live token-bucket rate limiters, honeypot anti-bot filters, administrative clearance, and
          cryptographic audit records
        </p>
      </div>

      {/* Real Security Status Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Admin Clearance */}
        <Card className="border-border bg-surface/40 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-mono text-xs font-medium text-muted-foreground">
              Admin Clearance
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-mono text-emerald-400">AUTHORIZED</div>
            <div className="mt-1 text-xs text-muted-foreground">Owner passkey verified session</div>
          </CardContent>
        </Card>

        {/* Card 2: Telemetry Rate Limiter */}
        <Card className="border-border bg-surface/40 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-mono text-xs font-medium text-muted-foreground">
              Telemetry Ingestion Guard
            </CardTitle>
            <Zap className="h-4 w-4 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-mono text-foreground">
              {securityDiagnostics?.telemetryLimit || "60 req / min"}
            </div>
            <div className="mt-1 text-xs text-muted-foreground font-mono">
              Evaluated: {evaluatedCount} · Throttled: {blockedCount}
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Contact Abuse & Honeypot */}
        <Card className="border-border bg-surface/40 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-mono text-xs font-medium text-muted-foreground">
              Contact Abuse Guard
            </CardTitle>
            <Bot className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-mono text-foreground">
              {securityDiagnostics?.contactLimit || "5 req / 10 min"}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Active honeypot + sliding-window token IP bucket
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Store & Persistence Engine */}
        <Card className="border-border bg-surface/40 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-mono text-xs font-medium text-muted-foreground">
              Persistence Engine
            </CardTitle>
            <Database className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-mono text-emerald-400">ACTIVE</div>
            <div className="mt-1 text-xs text-muted-foreground font-mono">
              {activeTracked} IP buckets actively tracked
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log Stream */}
      <Card className="border-border bg-surface/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="font-mono text-sm text-foreground flex items-center gap-2">
            <History className="h-4 w-4 text-accent" />
            IMMUTABLE SECURITY AUDIT LOG
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Append-only chronological record of all administrative access and security events
          </p>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
            {auditLogs.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground font-mono">
                No audit entries recorded yet. System listening...
              </div>
            ) : (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-border font-mono text-[9px] text-accent"
                      >
                        {log.action}
                      </Badge>
                      <span className="font-medium text-foreground">{log.detail}</span>
                    </div>
                    <div className="mt-1 font-mono text-[10px] text-muted-foreground">
                      Actor: {log.actor} · IP: {log.ip}
                    </div>
                  </div>
                  <div className="font-mono text-[11px] text-muted-foreground sm:text-right">
                    {log.time}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
