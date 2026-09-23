import { useEffect, useRef, useState } from "react";

const WORDS = [
  "COMPUTER_VISION",
  "AGENTIC_AI",
  "LANGGRAPH",
  "RAG_SYSTEMS",
  "EXPLAINABLE_AI",
  "CREWAI",
  "CHROMADB",
  "YOLO_OPENCV",
  "MULTI_AGENT",
  "PRODUCTION_ML",
];

/**
 * Scroll-linked marquee band. Translates horizontally based on the
 * element's position in the viewport, so it visibly reacts to the
 * user's scroll velocity — a subtle but expressive motion cue.
 */
export function ScrollMarquee() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);

  useEffect(() => {
    const raf = { id: 0 };
    const compute = () => {
      const el = wrap.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const progress =
          1 - (rect.top + rect.height / 2) / (window.innerHeight + rect.height);
        // shift up to 40% of the track width both directions
        setX((progress - 0.5) * 80);
      }
      raf.id = 0;
    };
    const onScroll = () => {
      if (!raf.id) raf.id = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf.id) cancelAnimationFrame(raf.id);
    };
  }, []);

  const row = [...WORDS, ...WORDS];

  return (
    <div
      ref={wrap}
      aria-hidden
      className="relative overflow-hidden border-y border-border/60 bg-background/60 py-6 backdrop-blur-md"
    >
      <div
        ref={track}
        className="flex gap-10 whitespace-nowrap will-change-transform"
        style={{ transform: `translate3d(${x}%, 0, 0)` }}
      >
        {row.map((w, i) => (
          <span
            key={i}
            className={`font-display text-4xl font-bold uppercase tracking-tighter md:text-6xl ${
              i % 3 === 0
                ? "text-accent"
                : i % 3 === 1
                  ? "text-foreground/20 [-webkit-text-stroke:1px_var(--accent-2)]"
                  : "text-accent-2"
            }`}
          >
            {w} <span className="text-muted-foreground/50">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
