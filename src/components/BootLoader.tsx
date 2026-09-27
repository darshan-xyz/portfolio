import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

// Set once the intro has played in this browser session, so client-side
// navigations between routes never replay it (and never flash a layout).
let introPlayed = false;

const STEPS = [
  "> INITIALIZING_KERNEL",
  "> LOADING_NEURAL_MODULES",
  "> CALIBRATING_VISION_STACK",
  "> BOOTING_AGENTIC_RUNTIME",
  "> LINKING_KNOWLEDGE_GRAPH",
  "> HANDSHAKE_COMPLETE",
];

/**
 * Two-phase intro rendered as stacked layers so there is no gap where the
 * page peeks through between phases. Boot layer sits on top and fades away
 * to reveal the intro (name + explore) layer underneath.
 */
export function BootLoader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Captured on first render (SSR + hydration agree): the entry route decides
  // whether we play the full boot sequence or just a quick veil.
  const entry = useRef({ path: pathname, played: introPlayed });
  const isHomeEntry = entry.current.path === "/";
  const skip = entry.current.played;

  const [name, setName] = useState("");
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"boot" | "intro" | "gone">(
    skip ? "gone" : isHomeEntry ? "boot" : "intro",
  );
  const [bootFading, setBootFading] = useState(false);
  const [introLeaving, setIntroLeaving] = useState(false);

  const target = "DARSHAN_R";

  // Deep links to inner routes get a short veil instead of the full boot.
  useEffect(() => {
    if (skip || isHomeEntry) return;
    const t1 = setTimeout(() => setIntroLeaving(true), 260);
    const t2 = setTimeout(() => setPhase("gone"), 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [skip, isHomeEntry]);

  useEffect(() => {
    if (phase === "gone") introPlayed = true;
  }, [phase]);

  useEffect(() => {
    if (phase !== "boot") return;
    let i = 0;
    const typing = setInterval(() => {
      i += 1;
      setName(target.slice(0, i));
      if (i >= target.length) clearInterval(typing);
    }, 55);
    const steps = setInterval(() => {
      setStepIdx((s) => (s < STEPS.length ? s + 1 : s));
    }, 380);
    const bar = setInterval(() => {
      setProgress((p) => Math.min(100, p + Math.random() * 6 + 3));
    }, 110);
    return () => {
      clearInterval(typing);
      clearInterval(steps);
      clearInterval(bar);
    };
  }, [phase]);

  // When boot finishes, start fade — intro is already rendered underneath.
  useEffect(() => {
    if (phase !== "boot") return;
    if (progress >= 100 && stepIdx >= STEPS.length) {
      const t1 = setTimeout(() => setBootFading(true), 220);
      const t2 = setTimeout(() => setPhase("intro"), 900);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [progress, stepIdx, phase]);

  useEffect(() => {
    if (phase !== "gone") document.documentElement.style.overflow = "hidden";
    else document.documentElement.style.overflow = "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [phase]);

  const dismiss = () => {
    window.dispatchEvent(new CustomEvent("portfolio:intro-dismiss"));
    setIntroLeaving(true);
    setTimeout(() => setPhase("gone"), 900);
  };

  if (phase === "gone") return null;

  return (
    <>
      {/* Intro layer — always mounted while overlay visible, sits under boot */}
      <div
        className={`fixed inset-0 z-[100] flex flex-col overflow-hidden bg-background transition-opacity duration-[900ms] ${
          introLeaving ? "opacity-0" : "opacity-100"
        }`}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-background" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklch, var(--background) 48%, transparent) 0%, color-mix(in oklch, var(--background) 10%, transparent) 42%, color-mix(in oklch, var(--background) 78%, transparent) 100%)",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-bg opacity-15" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, color-mix(in oklch, var(--accent) 22%, transparent), transparent 60%)",
          }}
        />
        <div className="relative flex items-center justify-between px-6 py-5 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:px-10">
          <span className="text-accent">■ SYSTEM_ONLINE</span>
          <span>v2.1 · secure_link</span>
        </div>
        <div className="relative flex flex-1 flex-col items-center justify-end px-4 pb-[2svh] text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-accent">
            // operator · ai_engineer
          </p>
          <h1
            aria-label="Darshan R"
            className="intro-name mt-2 select-none font-display font-bold uppercase leading-[0.85] tracking-tighter text-foreground"
          >
            <span className="text-gradient">DARSHAN</span>
            <span className="text-accent-2">.R</span>
          </h1>
          <p className="mt-3 max-w-2xl font-mono text-xs uppercase tracking-[0.35em] text-muted-foreground">
            AI · GEN_AI · VISION · AGENTIC · CLOUD_ML
          </p>
          {isHomeEntry && (
            <button
              type="button"
              onClick={dismiss}
              disabled={phase === "boot"}
              className="group relative mt-6 inline-flex items-center gap-4 rounded-full border border-accent/50 bg-accent/10 px-10 py-3 font-mono text-xs uppercase tracking-[0.4em] text-accent transition-all duration-500 hover:border-accent hover:bg-accent hover:text-accent-foreground disabled:opacity-0"
              style={{ boxShadow: "0 0 40px color-mix(in oklch, var(--accent) 25%, transparent)" }}
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-accent-2 transition-transform group-hover:scale-150"
                style={{ boxShadow: "0 0 12px var(--accent-2)" }}
              />
              Explore Portfolio
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          )}
        </div>
        <div className="relative border-t border-border/60 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:px-10">
          <span className="text-accent-2">◉</span> READY_FOR_DEPLOYMENT · DARSHAN.R
        </div>
        <style>{`
          .intro-name {
            font-size: clamp(2.75rem, min(11vw, 15svh), 10rem);
            filter: drop-shadow(0 0 40px color-mix(in oklch, var(--accent) 35%, transparent));
          }
        `}</style>
      </div>

      {/* Boot layer — on top, fades out to reveal intro */}
      {phase === "boot" && (
        <div
          aria-hidden
          className={`fixed inset-0 z-[110] flex flex-col overflow-hidden bg-background transition-opacity duration-[900ms] ${
            bootFading ? "opacity-0" : "opacity-100"
          }`}
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 20% 30%, color-mix(in oklch, var(--accent) 18%, transparent), transparent 60%)",
            }}
          />
          <div className="relative flex items-center justify-between border-b border-border/60 px-6 py-5 md:px-10">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-2xl font-bold tracking-tighter text-accent md:text-3xl">
                {name}
                <span className="cursor-blink" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                // operator
              </span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent-2">
              v2.1 · secure_link
            </div>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-6">
            <div className="w-full max-w-xl">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                <span>CORE_BOOT</span>
                <span className="text-accent">{Math.round(progress)}%</span>
              </div>
              <div className="mt-3 h-[2px] w-full overflow-hidden bg-border">
                <div
                  className="h-full bg-gradient-to-r from-accent to-accent-2"
                  style={{
                    width: `${progress}%`,
                    transition: "width 160ms linear",
                    boxShadow: "0 0 12px var(--accent)",
                  }}
                />
              </div>
              <ul className="mt-6 space-y-1.5 font-mono text-xs">
                {STEPS.slice(0, stepIdx).map((s, i) => (
                  <li
                    key={s}
                    className={i === stepIdx - 1 ? "text-accent" : "text-muted-foreground"}
                  >
                    {s} <span className="text-accent-2">[OK]</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="relative border-t border-border/60 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:px-10">
            <span className="text-accent">■</span> AI_ENGINEER · GEN_AI · VISION · AGENTIC ·
            DARSHAN.R
          </div>
        </div>
      )}
    </>
  );
}
