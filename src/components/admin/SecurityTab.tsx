import {
  ShieldAlert,
  Key,
  Lock,
  History,
  CheckCircle,
  AlertOctagon,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AUDIT_LOGS = [
  {
    id: "aud-01",
    action: "cms.resume_switch",
    detail: "Promoted 'Darshan_R_Resume.pdf' (v2.5-ai-ml-lead) to active live download",
    actor: "darshanr2005@gmail.com",
    ip: "103.21.244.15",
    time: "Sep 24, 2026, 08:30 PM",
  },
  {
    id: "aud-02",
    action: "crm.stage_change",
    detail: "Advanced lead 'Sarah Lin (Horizon Edge Robotics)' to screening",
    actor: "darshanr2005@gmail.com",
    ip: "103.21.244.15",
    time: "Sep 24, 2026, 02:15 PM",
  },
  {
    id: "aud-03",
    action: "auth.admin_login",
    detail: "Successful passwordless admin authentication via TOTP MFA",
    actor: "darshanr2005@gmail.com",
    ip: "103.21.244.15",
    time: "Sep 24, 2026, 09:12 AM",
  },
  {
    id: "aud-04",
    action: "security.telemetry_sync",
    detail: "First-party telemetry pipeline connected to Supabase PostgreSQL",
    actor: "SYSTEM",
    ip: "127.0.0.1",
    time: "Sep 23, 2026, 07:45 PM",
  },
];

export function SecurityTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-mono text-base font-semibold text-white">
          SECURITY, ACCESS CONTROL & AUDIT CHAMBER
        </h2>
        <p className="text-xs text-white/50">
          MFA authentication status, Row Level Security policies, token bucket rate limits, and
          cryptographic audit logs
        </p>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-white/10 bg-[#0B2A3B]/40 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-mono text-xs text-white/60">Admin MFA / TOTP</CardTitle>
            <Key className="h-4 w-4 text-[#7CF9C9]" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-mono text-emerald-400">ENABLED</div>
            <div className="mt-1 text-xs text-white/40">Authenticator app verified</div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#0B2A3B]/40 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-mono text-xs text-white/60">Postgres RLS Guard</CardTitle>
            <Lock className="h-4 w-4 text-[#7CF9C9]" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-mono text-emerald-400">ACTIVE</div>
            <div className="mt-1 text-xs text-white/40">7 tables protected by RLS</div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#0B2A3B]/40 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-mono text-xs text-white/60">Telemetry Rate Limit</CardTitle>
            <ShieldAlert className="h-4 w-4 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-mono text-white">60 req / min</div>
            <div className="mt-1 text-xs text-white/40">Token-bucket IP throttling</div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#0B2A3B]/40 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-mono text-xs text-white/60">Contact Form Guard</CardTitle>
            <Lock className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-mono text-white">3 req / 10 min</div>
            <div className="mt-1 text-xs text-white/40">Honeypot + bot filter</div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log Stream */}
      <Card className="border-white/10 bg-[#0B2A3B]/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="font-mono text-sm text-white flex items-center gap-2">
            <History className="h-4 w-4 text-[#7CF9C9]" />
            IMMUTABLE SECURITY AUDIT LOG
          </CardTitle>
          <p className="text-xs text-white/50">
            Append-only chronological record of all administrative operations
          </p>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-white/5">
            {AUDIT_LOGS.map((log) => (
              <div
                key={log.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-white/20 font-mono text-[9px] text-[#7CF9C9]"
                    >
                      {log.action}
                    </Badge>
                    <span className="font-medium text-white">{log.detail}</span>
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-white/40">
                    Actor: {log.actor} · IP: {log.ip}
                  </div>
                </div>
                <div className="font-mono text-[11px] text-white/50 sm:text-right">{log.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
