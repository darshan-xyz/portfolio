import { useState, useMemo, useEffect, useRef } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Lock,
  Unlock,
  Radio,
  Cpu,
  Terminal,
  Activity,
} from "lucide-react";
import type { VisitorSessionRecord } from "@/lib/admin/types";
import {
  analyzeSessionEntropy,
  isIpQuarantined,
  toggleIpQuarantine,
  getQuarantinedIps,
} from "@/lib/security/entropy-analyzer";
import { cyberAudio } from "@/lib/admin/cyber-audio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ArchonSentinelViewProps {
  visitors: VisitorSessionRecord[];
}

export function ArchonSentinelView({ visitors = [] }: ArchonSentinelViewProps) {
  const [, setRefreshState] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Compute threat profiles for all real sessions
  const analyzedSessions = useMemo(() => {
    return visitors.map((v) => ({
      session: v,
      entropy: analyzeSessionEntropy(v),
      quarantined: isIpQuarantined(v.ip),
    }));
  }, [visitors]);

  const stats = useMemo(() => {
    let critical = 0;
    let elevated = 0;
    let nominal = 0;
    let avgFp = 0;
    let avgCad = 0;
    let avgVel = 0;
    let avgGeo = 0;

    analyzedSessions.forEach((item) => {
      if (item.entropy.threatLevel === "CRITICAL" || item.quarantined) critical++;
      else if (item.entropy.threatLevel === "ELEVATED") elevated++;
      else nominal++;

      avgFp += item.entropy.fingerprintEntropy;
      avgCad += item.entropy.cadenceEntropy;
      avgVel += item.entropy.velocityEntropy;
      avgGeo += item.entropy.geoCoherence;
    });

    const count = Math.max(1, analyzedSessions.length);
    return {
      critical,
      elevated,
      nominal,
      avgFp: Math.round(avgFp / count),
      avgCad: Math.round(avgCad / count),
      avgVel: Math.round(avgVel / count),
      avgGeo: Math.round(avgGeo / count),
      quarantinedCount: getQuarantinedIps().length,
    };
  }, [analyzedSessions]);

  // Tactical Radar Drawing on HTML Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angleOffset = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(cx, cy) * 0.78;

      ctx.clearRect(0, 0, w, h);

      // Draw concentric radar rings
      ctx.strokeStyle = "rgba(124, 249, 201, 0.15)";
      ctx.lineWidth = 1;

      for (let r = 0.25; r <= 1.0; r += 0.25) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius * r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw crosshair axes
      ctx.beginPath();
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.stroke();

      // Rotating tactical radar sweep line
      angleOffset += 0.02;
      const sweepX = cx + Math.cos(angleOffset) * radius;
      const sweepY = cy + Math.sin(angleOffset) * radius;

      const grad = ctx.createLinearGradient(cx, cy, sweepX, sweepY);
      grad.addColorStop(0, "rgba(124, 249, 201, 0.35)");
      grad.addColorStop(1, "rgba(124, 249, 201, 0.0)");

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angleOffset - 0.35, angleOffset);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Draw threat nodes on the radar based on real session entropy
      analyzedSessions.forEach((s, idx) => {
        const angle = (idx * (Math.PI * 2)) / Math.max(1, analyzedSessions.length);
        const dist = (s.entropy.compositeThreatScore / 100) * radius;
        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle) * dist;

        ctx.beginPath();
        ctx.arc(
          px,
          py,
          s.quarantined || s.entropy.threatLevel === "CRITICAL" ? 5 : 3.5,
          0,
          Math.PI * 2,
        );

        if (s.quarantined || s.entropy.threatLevel === "CRITICAL") {
          ctx.fillStyle = "#f43f5e";
          ctx.shadowColor = "#f43f5e";
          ctx.shadowBlur = 8;
        } else if (s.entropy.threatLevel === "ELEVATED") {
          ctx.fillStyle = "#f59e0b";
          ctx.shadowColor = "#f59e0b";
          ctx.shadowBlur = 5;
        } else {
          ctx.fillStyle = "#7CF9C9";
          ctx.shadowColor = "#7CF9C9";
          ctx.shadowBlur = 4;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [analyzedSessions]);

  const handleQuarantine = (ip: string) => {
    const quarantinedNow = toggleIpQuarantine(ip);
    if (quarantinedNow) {
      cyberAudio.playSecurityAlert();
    } else {
      cyberAudio.playTacticalClick(600, 0.03);
    }
    setRefreshState((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-accent" />
            <h2 className="font-mono text-base font-semibold tracking-wider text-foreground">
              ARCHON SENTINEL // MULTI-VECTOR THREAT RADAR
            </h2>
            <Badge
              variant="outline"
              className="border-accent/40 bg-accent/10 font-mono text-[10px] text-accent"
            >
              DEFCON ACTIVE
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Multi-dimensional mathematical entropy scoring and real-time autonomous hardware
            firewall containment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="border-rose-500/30 bg-rose-500/10 font-mono text-xs text-rose-300">
            {stats.critical} CRITICAL THREATS
          </Badge>
          <Badge className="border-amber-500/30 bg-amber-500/10 font-mono text-xs text-amber-300">
            {stats.elevated} ELEVATED ENTROPY
          </Badge>
          <Badge className="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-300">
            {stats.nominal} NOMINAL
          </Badge>
        </div>
      </div>

      {/* Main Grid: Radar Canvas + Vector Gauges */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Radar Visualizer */}
        <Card className="border-border bg-surface/60 backdrop-blur-md lg:col-span-5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between font-mono text-xs text-muted-foreground">
              <span>LIVE ENTROPY SWEEP MATRIX</span>
              <Radio className="h-3.5 w-3.5 animate-pulse text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-4">
            <div className="relative h-64 w-64">
              <canvas
                ref={canvasRef}
                width={256}
                height={256}
                className="h-full w-full rounded-full border border-accent/20 bg-background/80 shadow-[0_0_30px_rgba(124,249,201,0.06)]"
              />
            </div>
            <div className="mt-4 flex w-full justify-around text-center font-mono text-[10px]">
              <div>
                <div className="text-muted-foreground">CENTER</div>
                <div className="text-accent">0% ENTROPY</div>
              </div>
              <div>
                <div className="text-muted-foreground">PERIMETER</div>
                <div className="text-rose-400">100% ANOMALY</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4 Entropy Dimension Gauges */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
          <Card className="border-border bg-surface/40 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="font-mono text-xs text-muted-foreground">
                GPU FINGERPRINT COHESION
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold font-mono text-foreground">{stats.avgFp}%</div>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {stats.avgFp > 50 ? "SPOOF RISKS DETECTED" : "ORGANIC WEBGL"}
                </Badge>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Evaluates headless Puppeteer / SwiftShader software emulators vs physical hardware
                GPUs.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-surface/40 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="font-mono text-xs text-muted-foreground">
                TIMING CADENCE REGULARITY
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold font-mono text-foreground">{stats.avgCad}%</div>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {stats.avgCad > 60 ? "BOT CLOCKWORK DETECTED" : "HUMAN JITTER"}
                </Badge>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Fourier variance of request timestamp intervals; flags robotic fixed-interval
                timers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-surface/40 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="font-mono text-xs text-muted-foreground">
                TRAVERSAL VELOCITY ANOMALY
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold font-mono text-foreground">{stats.avgVel}%</div>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {stats.avgVel > 50 ? "BURST SCRAPING" : "NATURAL READING"}
                </Badge>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Compares scroll depth and link interactions against biological human reading
                comprehension pacing.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-surface/40 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="font-mono text-xs text-muted-foreground">
                ASN / PROXY INTEGRITY
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold font-mono text-foreground">{stats.avgGeo}%</div>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {stats.avgGeo > 50 ? "DATACENTER / TOR" : "RESIDENTIAL ISP"}
                </Badge>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Cross-references Autonomous System Numbers (ASN) against commercial hosting and VPN
                ranges.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Real Sessions Threat Table & One-Click Quarantine */}
      <Card className="border-border bg-surface/60 backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between font-mono text-xs text-muted-foreground">
            <span>LIVE SESSION FORENSIC DOSSIER & QUARANTINE CHAMBER</span>
            <span className="font-mono text-[10px] text-accent">
              {analyzedSessions.length} SESSIONS MONITORED
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analyzedSessions.length === 0 ? (
            <div className="py-8 text-center font-mono text-xs text-muted-foreground">
              [ STANDBY MODE: ZERO INBOUND THREATS DETECTED ]
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="pb-2">IP / CLIENT ID</th>
                    <th className="pb-2">LOCATION / ASN</th>
                    <th className="pb-2">DEVICE / GPU</th>
                    <th className="pb-2 text-center">THREAT SCORE</th>
                    <th className="pb-2">FLAGS & HEURISTICS</th>
                    <th className="pb-2 text-right">DEFCON ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {analyzedSessions.slice(0, 15).map(({ session, entropy, quarantined }) => (
                    <tr key={session.id} className="hover:bg-muted/10 transition-colors">
                      <td className="py-3 font-semibold text-foreground">
                        <div>{session.ip}</div>
                        <div className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                          {session.id.slice(0, 12)}...
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="text-foreground">
                          {session.city || "Unknown"}, {session.countryCode}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate max-w-[180px]">
                          {session.asnOrg || "Standard ISP"}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="text-foreground capitalize">
                          {session.deviceType} · {session.os}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate max-w-[160px]">
                          {session.gpuRenderer || "Default Graphics"}
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <Badge
                          variant="outline"
                          className={
                            quarantined || entropy.threatLevel === "CRITICAL"
                              ? "border-rose-500/40 bg-rose-500/10 text-rose-400 font-bold"
                              : entropy.threatLevel === "ELEVATED"
                                ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                                : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                          }
                        >
                          {quarantined ? "LOCKED" : `${entropy.compositeThreatScore}/100`}
                        </Badge>
                      </td>
                      <td className="py-3 text-[11px] text-muted-foreground">
                        {entropy.heuristics.length > 0 ? (
                          <ul className="list-disc pl-3 space-y-0.5">
                            {entropy.heuristics.slice(0, 2).map((h, i) => (
                              <li key={i} className="text-amber-300/80">
                                {h}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-emerald-400/70">Clean verified telemetry</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <Button
                          size="sm"
                          variant={quarantined ? "destructive" : "outline"}
                          onClick={() => handleQuarantine(session.ip)}
                          className={`font-mono text-[10px] h-7 gap-1.5 ${
                            quarantined
                              ? "bg-rose-600 hover:bg-rose-700 text-white"
                              : "border-border hover:border-rose-500/50 hover:text-rose-400"
                          }`}
                        >
                          {quarantined ? (
                            <>
                              <Unlock className="h-3 w-3" />
                              Release
                            </>
                          ) : (
                            <>
                              <Lock className="h-3 w-3" />
                              Quarantine IP
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
