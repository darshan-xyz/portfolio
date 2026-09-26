import { useState, useEffect, useRef } from "react";
import {
  MousePointer,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Activity,
  Maximize2,
  Layers,
  Sparkles,
} from "lucide-react";
import type { VisitorSessionRecord } from "@/lib/admin/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GhostVectorReplayProps {
  visitors: VisitorSessionRecord[];
}

export function GhostVectorReplay({ visitors = [] }: GhostVectorReplayProps) {
  // Find sessions with recorded trajectories
  const sessionsWithVectors = visitors.filter((v) => v.trajectory && v.trajectory.length > 0);

  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    sessionsWithVectors[0]?.id || visitors[0]?.id || "",
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeSession = visitors.find((v) => v.id === selectedSessionId);
  const trajectory = useMemo(() => activeSession?.trajectory || [], [activeSession?.trajectory]);

  // Reset frame when switching session
  useEffect(() => {
    setCurrentFrame(0);
    setIsPlaying(true);
  }, [selectedSessionId]);

  // Animation playback loop
  useEffect(() => {
    if (!isPlaying || trajectory.length === 0) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        if (prev >= trajectory.length - 1) {
          return 0; // Loop replay
        }
        return prev + 1;
      });
    }, 100 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, trajectory.length, playbackSpeed]);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    const isDark =
      typeof document !== "undefined" && document.documentElement.classList.contains("dark");

    // Clear background with theme-aware viewport
    ctx.fillStyle = isDark ? "#040914" : "#F8FAFC";
    ctx.fillRect(0, 0, w, h);

    // 1. Draw miniature wireframe portfolio sections
    ctx.strokeStyle = isDark ? "rgba(124, 249, 201, 0.14)" : "rgba(13, 147, 115, 0.22)";
    ctx.lineWidth = 1;

    // Wireframe Nav Header
    ctx.strokeRect(12, 10, w - 24, 18);
    ctx.fillStyle = isDark ? "rgba(124, 249, 201, 0.35)" : "rgba(13, 147, 115, 0.85)";
    ctx.font = "8px monospace";
    ctx.fillText("DARSHAN.R // PORTFOLIO HUD", 16, 22);

    // Wireframe Hero Glass Section
    ctx.strokeRect(12, 34, w - 24, 85);
    ctx.fillText("[ 00 // HERO INTELLIGENCE ]", 18, 48);

    // Wireframe Experience Bento
    ctx.strokeRect(12, 126, w - 24, 65);
    ctx.fillText("[ 01 // EXPERIENCE LOGBOOK ]", 18, 140);

    // Wireframe Projects Grid
    ctx.strokeRect(12, 198, w - 24, 75);
    ctx.fillText("[ 02 // DEPLOYED SYSTEMS ]", 18, 212);

    // Wireframe Skills & Contact
    ctx.strokeRect(12, 280, w - 24, 55);
    ctx.fillText("[ 03 // CONTACT HANDSHAKE ]", 18, 294);

    // 2. Draw Thermal Dwell Heatmap if enabled
    if (showHeatmap && trajectory.length > 0) {
      trajectory.forEach((pt) => {
        const hx = pt.x * w;
        const hy = pt.y * h;
        const rad = 25;

        const radGrad = ctx.createRadialGradient(hx, hy, 2, hx, hy, rad);
        if (isDark) {
          radGrad.addColorStop(0, "rgba(56, 189, 248, 0.08)");
          radGrad.addColorStop(0.5, "rgba(124, 249, 201, 0.04)");
          radGrad.addColorStop(1, "rgba(124, 249, 201, 0)");
        } else {
          radGrad.addColorStop(0, "rgba(2, 132, 199, 0.12)");
          radGrad.addColorStop(0.5, "rgba(13, 147, 115, 0.06)");
          radGrad.addColorStop(1, "rgba(13, 147, 115, 0)");
        }

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(hx, hy, rad, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 3. Draw Historical Trajectory Ribbon up to currentFrame
    if (trajectory.length > 1) {
      const activeSlice = trajectory.slice(0, currentFrame + 1);

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isDark ? "rgba(124, 249, 201, 0.65)" : "rgba(13, 147, 115, 0.85)";

      activeSlice.forEach((pt, idx) => {
        const px = pt.x * w;
        const py = pt.y * h;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Render Clicks as expanding shockwaves
      activeSlice.forEach((pt) => {
        if (pt.click) {
          const cx = pt.x * w;
          const cy = pt.y * h;

          ctx.beginPath();
          ctx.arc(cx, cy, 9, 0, Math.PI * 2);
          ctx.strokeStyle = isDark ? "#B8FF3A" : "#16a34a";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(cx, cy, 3, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? "#B8FF3A" : "#16a34a";
          ctx.fill();
        }
      });
    }

    // 4. Render Active Ghost Cursor Reticle
    const curPt = trajectory[currentFrame];
    if (curPt) {
      const gx = curPt.x * w;
      const gy = curPt.y * h;

      // Glow halo
      ctx.beginPath();
      ctx.arc(gx, gy, 8, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "rgba(124, 249, 201, 0.25)" : "rgba(13, 147, 115, 0.25)";
      ctx.fill();

      // Sharp reticle cursor
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx + 10, gy + 8);
      ctx.lineTo(gx + 4, gy + 9);
      ctx.lineTo(gx + 2, gy + 14);
      ctx.closePath();
      ctx.fillStyle = isDark ? "#7CF9C9" : "#0D9373";
      ctx.shadowColor = isDark ? "#7CF9C9" : "#0D9373";
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Coordinate readout tag
      ctx.fillStyle = isDark ? "rgba(124, 249, 201, 0.9)" : "rgba(13, 147, 115, 0.95)";
      ctx.font = "9px monospace";
      ctx.fillText(
        `X:${Math.round(curPt.x * 100)}% Y:${Math.round(curPt.y * 100)}% T+${Math.round(curPt.t / 100) / 10}s`,
        Math.min(w - 120, gx + 14),
        Math.max(20, gy - 6),
      );
    }
  }, [currentFrame, trajectory, showHeatmap]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MousePointer className="h-5 w-5 text-accent" />
            <h2 className="font-mono text-base font-semibold tracking-wider text-foreground">
              GHOST VECTOR // SPATIAL DOM TELEMETRY REPLAY
            </h2>
            <Badge
              variant="outline"
              className="border-accent/40 bg-accent/10 font-mono text-[10px] text-accent"
            >
              VECTOR STREAM ACTIVE
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Differential coordinate sampling streaming true cursor trajectories, velocity ribbons,
            and thermal interaction dwell zones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`font-mono text-xs h-8 ${showHeatmap ? "border-accent text-accent" : "text-muted-foreground"}`}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            {showHeatmap ? "Thermal Heatmap ON" : "Thermal Heatmap OFF"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Interactive Canvas Wireframe HUD */}
        <Card className="border-border bg-surface/60 backdrop-blur-md lg:col-span-8">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="font-mono text-xs text-muted-foreground flex items-center gap-2">
              <span>HOLOPHONIC VIEWPORT REPLAY</span>
              {activeSession && (
                <Badge variant="outline" className="font-mono text-[10px] text-foreground">
                  {activeSession.city}, {activeSession.countryCode} · {activeSession.deviceType}
                </Badge>
              )}
            </CardTitle>
            <div className="font-mono text-[11px] text-accent">
              FRAME {currentFrame + 1} / {Math.max(1, trajectory.length)}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-full max-w-xl aspect-[16/10] overflow-hidden rounded-xl border border-accent/30 shadow-[0_0_40px_rgba(124,249,201,0.06)]">
              <canvas
                ref={canvasRef}
                width={560}
                height={350}
                className="h-full w-full object-contain bg-background"
              />
            </div>

            {/* Playback Controls Bar */}
            <div className="mt-4 flex w-full max-w-xl items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-8 font-mono text-xs gap-1 border-border text-foreground hover:bg-muted/20"
                >
                  {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCurrentFrame(0)}
                  className="h-8 font-mono text-xs gap-1 text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </Button>
              </div>

              {/* Scrubber slider */}
              <div className="flex-1 px-4">
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, trajectory.length - 1)}
                  value={currentFrame}
                  onChange={(e) => setCurrentFrame(parseInt(e.target.value, 10))}
                  className="w-full accent-[#7CF9C9] h-1.5 bg-muted rounded cursor-pointer"
                />
              </div>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1 font-mono text-[10px]">
                {[1, 2, 4].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-1 rounded border transition-colors ${
                      playbackSpeed === spd
                        ? "border-accent bg-accent/20 text-accent"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Visitor Vector Stream Selector */}
        <Card className="border-border bg-surface/60 backdrop-blur-md lg:col-span-4">
          <CardHeader className="pb-3">
            <CardTitle className="font-mono text-xs text-muted-foreground">
              RECORDED SPATIAL SESSIONS ({visitors.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {visitors.length === 0 ? (
              <div className="py-8 text-center font-mono text-xs text-muted-foreground">
                [ ZERO VECTOR STREAMS AVAILABLE ]
              </div>
            ) : (
              visitors.map((v) => {
                const isSelected = v.id === selectedSessionId;
                const pointsCount = v.trajectory?.length || 0;
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedSessionId(v.id)}
                    className={`cursor-pointer rounded-lg border p-3 transition-all ${
                      isSelected
                        ? "border-accent bg-accent/10 shadow-sm"
                        : "border-border/60 bg-muted/10 hover:border-border hover:bg-muted/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {v.city || "Direct"}, {v.countryCode}
                      </span>
                      <Badge
                        variant="outline"
                        className={`font-mono text-[9px] ${
                          pointsCount > 0 ? "border-accent/40 text-accent" : "text-muted-foreground"
                        }`}
                      >
                        {pointsCount > 0 ? `${pointsCount} VECTORS` : "TELEMETRY ONLY"}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{v.ip}</span>
                      <span>Dwell: {v.activeDwellSeconds}s</span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
