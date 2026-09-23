import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "00" },
  { id: "experience", label: "01" },
  { id: "projects", label: "02" },
  { id: "skills", label: "03" },
  { id: "certifications", label: "04" },
  { id: "contact", label: "05" },
];

/**
 * Ultra-slim right-edge scroll HUD. Thin rail, tiny numeric readout,
 * pinned as close to the viewport edge as possible.
 */
export function ScrollProgress() {
  const [p, setP] = useState(0);
  const [active, setActive] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const compute = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setP(Math.min(1, Math.max(0, window.scrollY / max)));
      const mid = window.scrollY + window.innerHeight * 0.4;
      let idx = 0;
      SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= mid) idx = i;
      });
      setActive(idx);
      raf.current = 0;
    };
    const onScroll = () => {
      if (!raf.current) raf.current = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const pct = Math.round(p * 100)
    .toString()
    .padStart(2, "0");

  return (
    <aside
      aria-hidden
      className="pointer-events-none fixed right-1.5 top-1/2 z-40 hidden -translate-y-1/2 md:block"
    >
      <div className="flex flex-col items-center gap-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent">{pct}</span>
        <div className="relative h-64 w-px bg-border/60">
          <div
            className="absolute left-0 top-0 w-px bg-gradient-to-b from-accent to-accent-2"
            style={{ height: `${p * 100}%`, boxShadow: "0 0 8px var(--accent)" }}
          />
          {SECTIONS.map((s, i) => {
            const pos = (i / (SECTIONS.length - 1)) * 100;
            const isActive = i === active;
            return (
              <span
                key={s.id}
                className={`absolute -left-[3px] h-[7px] w-[7px] -translate-y-1/2 rounded-full border transition-all duration-300 ${
                  isActive ? "border-accent-2 bg-accent-2 scale-125" : "border-border bg-background"
                }`}
                style={{
                  top: `${pos}%`,
                  boxShadow: isActive ? "0 0 10px var(--accent-2)" : "none",
                }}
              />
            );
          })}
          <div
            className="absolute -left-[2px] h-[5px] w-[5px] -translate-y-1/2 rounded-full bg-accent"
            style={{
              top: `${p * 100}%`,
              boxShadow: "0 0 10px var(--accent)",
            }}
          />
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
          {SECTIONS[active].label}
        </span>
      </div>
    </aside>
  );
}
