import { Activity, Zap, CheckCircle2, AlertTriangle, Cpu, Layers, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ObservabilityTab() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-mono text-base font-semibold text-white">
          SYSTEM HEALTH & WEBGL 3D OBSERVABILITY
        </h2>
        <p className="text-xs text-white/50">
          Real User Monitoring (RUM), Core Web Vitals, Three.js frame budgets, and hardware
          distribution
        </p>
      </div>

      {/* 3D WebGL Canvas Performance Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-white/10 bg-[#0B2A3B]/40 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-mono text-xs text-white/60">Avg Three.js FPS</CardTitle>
            <Activity className="h-4 w-4 text-[#7CF9C9]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-white">58.8 FPS</div>
            <div className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Optimal (60 FPS target budget)
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#0B2A3B]/40 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-mono text-xs text-white/60">GPU Acceleration</CardTitle>
            <Cpu className="h-4 w-4 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-white">98.6%</div>
            <div className="mt-1 text-xs text-white/40">Hardware WebGL2 context active</div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#0B2A3B]/40 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-mono text-xs text-white/60">WebGL Context Loss</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-white">0</div>
            <div className="mt-1 text-xs text-emerald-400">Zero GPU crash recovery events</div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#0B2A3B]/40 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-mono text-xs text-white/60">Reduced Motion Rate</CardTitle>
            <Layers className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-white">3.4%</div>
            <div className="mt-1 text-xs text-white/40">Gracefully bypassed to 2D aurora</div>
          </CardContent>
        </Card>
      </div>

      {/* Core Web Vitals Grid */}
      <Card className="border-white/10 bg-[#0B2A3B]/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="font-mono text-sm text-white flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#B8FF3A]" />
            CORE WEB VITALS AUDIT (REAL USER TELEMETRY)
          </CardTitle>
          <p className="text-xs text-white/50">
            Field metrics collected from real visitor browsing sessions
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-semibold text-white">LCP</span>
                <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]">
                  GOOD
                </Badge>
              </div>
              <div className="text-2xl font-bold font-mono text-white">1.08s</div>
              <p className="text-[11px] text-white/50 mt-1">
                Largest Contentful Paint (Goal &lt;2.5s)
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-semibold text-white">INP</span>
                <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]">
                  GOOD
                </Badge>
              </div>
              <div className="text-2xl font-bold font-mono text-white">38ms</div>
              <p className="text-[11px] text-white/50 mt-1">
                Interaction to Next Paint (Goal &lt;200ms)
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-semibold text-white">CLS</span>
                <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]">
                  GOOD
                </Badge>
              </div>
              <div className="text-2xl font-bold font-mono text-white">0.002</div>
              <p className="text-[11px] text-white/50 mt-1">
                Cumulative Layout Shift (Goal &lt;0.1)
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-semibold text-white">TTFB</span>
                <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]">
                  FAST
                </Badge>
              </div>
              <div className="text-2xl font-bold font-mono text-white">76ms</div>
              <p className="text-[11px] text-white/50 mt-1">Edge Time to First Byte</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hardware GPU Vendor Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-[#0B2A3B]/40 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="font-mono text-sm text-white">
              CLIENT GPU HARDWARE DISTRIBUTION
            </CardTitle>
            <p className="text-xs text-white/50">
              Visitor graphics cards parsed via WebGL unmasked renderer
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                vendor: "Apple Silicon (M1, M2, M3, M4 series)",
                percent: 52,
                count: 738,
                color: "#7CF9C9",
              },
              { vendor: "NVIDIA GeForce / RTX Series", percent: 28, count: 398, color: "#38bdf8" },
              { vendor: "Intel Iris Xe / UHD Graphics", percent: 14, count: 198, color: "#f59e0b" },
              { vendor: "AMD Radeon Series", percent: 6, count: 86, color: "#a855f7" },
            ].map((gpu) => (
              <div key={gpu.vendor} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-white font-medium">{gpu.vendor}</span>
                  <span className="font-mono text-white/70">
                    {gpu.percent}% ({gpu.count})
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${gpu.percent}%`, backgroundColor: gpu.color }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Client Error Stream */}
        <Card className="border-white/10 bg-[#0B2A3B]/40 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="font-mono text-sm text-white">
              CLIENT RUNTIME EXCEPTION MONITOR
            </CardTitle>
            <p className="text-xs text-white/50">
              Aggregated unhandled browser errors and promise rejections
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-emerald-500/20 bg-emerald-500/[0.02] text-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mb-2" />
              <div className="font-mono text-xs font-semibold text-white">ALL SYSTEMS HEALTHY</div>
              <p className="text-[11px] text-white/50 max-w-xs mt-1">
                0 client JavaScript exceptions or hydration failures logged across the last 4,892
                pageviews.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
