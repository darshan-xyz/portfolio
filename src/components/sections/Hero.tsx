import { useEffect, useState } from "react";
import { profile } from "@/data/portfolio";
import exploreBackground from "@/assets/darshan-explore-background.png.asset.json";

const SIGNALS = [
  { text: "Can it see?", placement: "left-[7%] top-[20%]" },
  { text: "Now let it reason.", placement: "right-[5%] top-[28%]" },
  { text: "Ship the intelligence.", placement: "left-[11%] bottom-[18%]" },
];

export function HeroSection() {
  const [introTransition, setIntroTransition] = useState(false);

  useEffect(() => {
    const beginTransition = () => {
      setIntroTransition(true);
      window.setTimeout(() => setIntroTransition(false), 1400);
    };
    window.addEventListener("portfolio:intro-dismiss", beginTransition);
    return () => window.removeEventListener("portfolio:intro-dismiss", beginTransition);
  }, []);

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[112svh] items-start overflow-hidden px-2 pb-14 pt-16 sm:px-3 sm:pt-20 lg:px-4"
    >
      <div aria-hidden className="hero-haze hero-haze-left" />
      <div aria-hidden className="hero-haze hero-haze-right" />

      <div className={`hero-glass relative mx-auto flex min-h-[calc(100svh-5rem)] w-full flex-col overflow-hidden rounded-[2rem] border border-border/80 px-5 py-5 shadow-2xl sm:min-h-[calc(104svh-5rem)] sm:px-8 sm:py-7 lg:rounded-[2.5rem] lg:px-12 ${introTransition ? "hero-from-intro" : ""}`}>
        <div className="relative z-30 flex items-center justify-between font-mono text-[9px] uppercase text-muted-foreground sm:text-[10px]">
          <span className="flex items-center gap-2 text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-2 shadow-[0_0_12px_var(--accent-2)]" />
            Intelligence online
          </span>
          <span>DR / 2026</span>
        </div>

        <img
          aria-hidden
          src={exploreBackground.url}
          alt=""
          className={`hero-portrait pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-[44%_center] ${introTransition ? "hero-portrait-entering" : ""}`}
        />
        <div aria-hidden className="hero-glass-wash absolute inset-0 z-10" />

        <div className="relative z-20 flex flex-1 -translate-x-2 flex-col items-center justify-end px-1 pb-6 pt-16 text-center sm:-translate-x-6 sm:px-3 sm:pb-8 lg:-translate-x-10 lg:pb-9">
          <h1 className={`hero-content-name max-w-full whitespace-nowrap font-display text-[clamp(3.25rem,9vw,8.75rem)] font-bold uppercase leading-[0.88] tracking-normal text-foreground ${introTransition ? "hero-content-entering" : ""}`}>
            <span>Darshan</span><span className="hero-name-accent">.R</span>
          </h1>

          <p className={`hero-content-description mt-4 max-w-[34rem] text-[0.78rem] leading-6 text-muted-foreground sm:mt-5 sm:text-sm lg:max-w-[39rem] lg:text-base lg:leading-7 ${introTransition ? "hero-content-entering" : ""}`}>
            I build intelligent systems that can <span className="text-foreground">see</span>,{" "}
            <span className="text-foreground">reason</span>, and <span className="text-foreground">act</span> —
            from computer vision to production-ready generative AI.
          </p>

          <div className={`hero-content-actions mt-5 flex w-full max-w-[31rem] flex-col justify-center gap-2.5 sm:mt-6 sm:flex-row sm:gap-3 ${introTransition ? "hero-content-entering" : ""}`}>
            <a href="#projects" className="hero-primary-action inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-accent px-5 py-3 font-mono text-[9px] font-bold uppercase text-accent-foreground transition-transform hover:-translate-y-0.5 sm:min-h-12 sm:px-6 sm:text-[10px]">
              Explore projects <span aria-hidden className="ml-3">↗</span>
            </a>
            <a href="#contact" className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-border bg-surface/40 px-5 py-3 font-mono text-[9px] font-bold uppercase text-foreground backdrop-blur-xl transition-colors hover:border-accent hover:text-accent sm:min-h-12 sm:px-6 sm:text-[10px]">
              Start a conversation
            </a>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block" aria-hidden>
          {SIGNALS.map((signal, index) => (
            <span key={signal.text} className={`hero-signal absolute ${signal.placement}`} style={{ animationDelay: `${index * 700}ms` }}>
              {signal.text}
            </span>
          ))}
        </div>

        <div className="relative z-30 flex items-end justify-between font-mono text-[9px] uppercase text-muted-foreground sm:text-[10px]">
          <span>Vision · RAG · Agents</span>
          <a href="#experience" className="pointer-events-auto flex items-center gap-2 text-foreground transition-colors hover:text-accent">
            Scroll to explore <span aria-hidden>↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
