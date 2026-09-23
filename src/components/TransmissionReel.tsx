import { useEffect, useRef, useState } from "react";

/**
 * Procedural "video" tile — a canvas that renders animated footage
 * (waveform pulse, radar sweep, or neural static) with tape-style HUD
 * overlays. Used in place of real video files so the site stays light.
 */
type Mode = "waveform" | "radar" | "static";

export function TransmissionReel({
  label,
  mode = "waveform",
  duration = "00:42",
}: {
  label: string;
  mode?: Mode;
  duration?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(true);
  const [t, setT] = useState(0);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = cvs.getBoundingClientRect();
      cvs.width = r.width * dpr;
      cvs.height = r.height * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cvs);

    let raf = 0;
    let frame = 0;
    const loop = () => {
      if (!playing) {
        raf = requestAnimationFrame(loop);
        return;
      }
      frame += 1;
      setT((v) => (v + 1) % 10000);
      const w = cvs.width;
      const h = cvs.height;
      ctx.fillStyle = "rgba(4, 9, 20, 0.35)";
      ctx.fillRect(0, 0, w, h);

      if (mode === "waveform") {
        ctx.strokeStyle = "rgba(124, 249, 201, 0.9)";
        ctx.lineWidth = 1.5 * dpr;
        ctx.beginPath();
        for (let x = 0; x < w; x += 2) {
          const y =
            h / 2 +
            Math.sin((x + frame * 3) * 0.02) * h * 0.18 +
            Math.sin((x + frame * 2) * 0.05) * h * 0.08;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.strokeStyle = "rgba(184, 255, 58, 0.35)";
        ctx.beginPath();
        for (let x = 0; x < w; x += 2) {
          const y = h / 2 + Math.sin((x + frame * 4) * 0.03) * h * 0.28;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (mode === "radar") {
        const cx = w / 2;
        const cy = h / 2;
        const R = Math.min(w, h) * 0.42;
        ctx.strokeStyle = "rgba(124, 249, 201, 0.3)";
        for (let i = 1; i <= 4; i++) {
          ctx.beginPath();
          ctx.arc(cx, cy, (R * i) / 4, 0, Math.PI * 2);
          ctx.stroke();
        }
        const angle = (frame * 0.04) % (Math.PI * 2);
        const grad = ctx.createLinearGradient(
          cx,
          cy,
          cx + Math.cos(angle) * R,
          cy + Math.sin(angle) * R,
        );
        grad.addColorStop(0, "rgba(184, 255, 58, 0.6)");
        grad.addColorStop(1, "rgba(184, 255, 58, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2 * dpr;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
        ctx.stroke();
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3 + frame * 0.005;
          const r = R * (0.3 + ((i * 7) % 5) / 8);
          ctx.fillStyle = "rgba(124, 249, 201, 0.8)";
          ctx.beginPath();
          ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 2 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // static / noise
        const img = ctx.createImageData(w, h);
        for (let i = 0; i < img.data.length; i += 4) {
          const n = Math.random() * 200;
          img.data[i] = n * 0.4;
          img.data[i + 1] = n;
          img.data[i + 2] = n * 0.8;
          img.data[i + 3] = 60;
        }
        ctx.putImageData(img, 0, 0);
      }

      // scanline
      ctx.fillStyle = "rgba(124, 249, 201, 0.08)";
      const sy = (frame * 2) % h;
      ctx.fillRect(0, sy, w, 2 * dpr);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [mode, playing]);

  return (
    <div className="relative overflow-hidden border border-border bg-background/70">
      <div className="flex items-center justify-between border-b border-border/60 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.7_0.2_25)]" />
          REC · {label}
        </span>
        <span className="text-accent">{duration}</span>
      </div>
      <div className="relative aspect-[16/10]">
        <canvas ref={ref} className="absolute inset-0 h-full w-full" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(to bottom, transparent 0, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)",
          }}
        />
        <div className="pointer-events-none absolute left-3 top-3 font-mono text-[9px] uppercase tracking-widest text-accent-2">
          ● LIVE
        </div>
        <div className="pointer-events-none absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-widest text-accent">
          T+{String(Math.floor(t / 60)).padStart(2, "0")}:{String(t % 60).padStart(2, "0")}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border/60 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.3em]">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="text-accent hover:text-accent-2"
        >
          {playing ? "▮▮ pause" : "▶ play"}
        </button>
        <span className="text-muted-foreground">signal.stable</span>
      </div>
    </div>
  );
}
