import { useEffect, useRef } from "react";
import { useMotionState } from "@/hooks/use-motion";

type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number };

/**
 * Fine particle field pinned to the viewport that emits on scroll.
 * The faster you scroll, the more particles spawn — creating a
 * "phosphor drift" effect that reinforces vertical motion.
 * Disabled entirely when the visitor prefers reduced motion.
 */
export function ScrollParticles() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { reduced } = useMotionState();

  useEffect(() => {
    if (reduced) return;
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      cvs.width = window.innerWidth * dpr;
      cvs.height = window.innerHeight * dpr;
      cvs.style.width = `${window.innerWidth}px`;
      cvs.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: P[] = [];
    // ambient drifting particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * cvs.width,
        y: Math.random() * cvs.height,
        vx: (Math.random() - 0.5) * 0.1 * dpr,
        vy: (Math.random() - 0.5) * 0.1 * dpr,
        life: Infinity,
        max: Infinity,
        r: (Math.random() * 1.2 + 0.4) * dpr,
      });
    }

    let lastY = window.scrollY;
    let velocity = 0;
    const onScroll = () => {
      const y = window.scrollY;
      velocity = y - lastY;
      lastY = y;
      const count = Math.min(24, Math.floor(Math.abs(velocity) * 0.6));
      const dir = velocity > 0 ? 1 : -1;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * cvs.width,
          y: dir > 0 ? -10 : cvs.height + 10,
          vx: (Math.random() - 0.5) * 0.6 * dpr,
          vy: (Math.random() * 0.8 + 0.6) * dpr * dir * -1 * -1 * (dir > 0 ? 1 : -1),
          life: 0,
          max: 60 + Math.random() * 40,
          r: (Math.random() * 1.6 + 0.6) * dpr,
        });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy + Math.sin((p.life + p.x) * 0.02) * 0.15 * dpr;
        p.life += 1;
        if (p.life > p.max || p.x < -20 || p.x > cvs.width + 20 || p.y < -20 || p.y > cvs.height + 20) {
          if (p.max !== Infinity) {
            particles.splice(i, 1);
            continue;
          }
          // wrap ambient
          if (p.x < -20) p.x = cvs.width + 20;
          if (p.x > cvs.width + 20) p.x = -20;
          if (p.y < -20) p.y = cvs.height + 20;
          if (p.y > cvs.height + 20) p.y = -20;
        }
        const alpha =
          p.max === Infinity ? 0.35 : Math.max(0, 1 - p.life / p.max) * 0.85;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 249, 201, ${alpha})`;
        ctx.shadowBlur = 8 * dpr;
        ctx.shadowColor = "rgba(124, 249, 201, 0.7)";
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
