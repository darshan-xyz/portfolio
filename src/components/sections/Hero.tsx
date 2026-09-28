import { useEffect, useRef, useState } from "react";
import { profile as defaultProfile } from "@/data/portfolio";
import type { ProfileData } from "@/lib/admin/portfolio-store";
import exploreBackground from "@/assets/darshan-explore-background.png.asset.json";

const SIGNALS = [
  { text: "Can it see?", placement: "left-[7%] top-[20%]" },
  { text: "Now let it reason.", placement: "right-[5%] top-[28%]" },
  { text: "Ship the intelligence.", placement: "left-[11%] bottom-[18%]" },
];

interface HeroSectionProps {
  profileData?: ProfileData;
}

export function HeroSection({ profileData = defaultProfile }: HeroSectionProps) {
  const [introTransition, setIntroTransition] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeProfile = profileData;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.defaultMuted = true;
    video.muted = true;
    const playVideo = () => {
      video.play().catch(() => {});
    };
    playVideo();

    const handleInteraction = () => {
      if (video.paused) playVideo();
    };

    window.addEventListener("pointerdown", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });
    window.addEventListener("keydown", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  useEffect(() => {
    const beginTransition = () => {
      setIntroTransition(true);
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
      window.setTimeout(() => setIntroTransition(false), 1400);
    };
    window.addEventListener("portfolio:intro-dismiss", beginTransition);
    return () => window.removeEventListener("portfolio:intro-dismiss", beginTransition);
  }, []);

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden px-1 pb-6 pt-16 sm:px-2 sm:pb-8 sm:pt-18 lg:px-3 lg:pb-10 lg:pt-20"
    >
      <div aria-hidden className="hero-haze hero-haze-left" />
      <div aria-hidden className="hero-haze hero-haze-right" />

      <div
        className={`hero-glass relative mx-auto flex w-full max-w-none min-h-[calc(100svh-4rem)] md:min-h-0 md:aspect-[16/9] flex-col justify-between overflow-hidden rounded-[2rem] border border-border/80 px-5 py-5 shadow-2xl sm:px-8 sm:py-7 lg:rounded-[2.5rem] lg:px-12 ${introTransition ? "hero-from-intro" : ""}`}
      >
        <div className="relative z-30 flex items-center justify-between font-mono text-[9px] uppercase text-muted-foreground sm:text-[10px]">
          <span className="flex items-center gap-2 text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-2 shadow-[0_0_12px_var(--accent-2)]" />
            Intelligence online
          </span>
          <span>DR / 2026</span>
        </div>

        <video
          ref={videoRef}
          aria-hidden
          src="/homevideo.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={exploreBackground.url}
          className={`hero-portrait pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-[44%_top] ${introTransition ? "hero-portrait-entering" : ""}`}
        >
          <source src="/homevideo.mp4" type="video/mp4" />
        </video>
        <div aria-hidden className="hero-glass-wash absolute inset-0 z-10" />

        <div className="relative z-20 flex flex-1 -translate-x-2 flex-col items-center justify-end px-1 pb-6 pt-16 text-center sm:-translate-x-6 sm:px-3 sm:pb-8 lg:-translate-x-10 lg:pb-9">
          <h1
            className={`hero-content-name max-w-full whitespace-nowrap font-display text-[clamp(3.25rem,9vw,8.75rem)] font-bold uppercase leading-[0.88] tracking-normal text-foreground ${introTransition ? "hero-content-entering" : ""}`}
          >
            <span>Darshan</span>
            <span className="hero-name-accent">.R</span>
          </h1>

          <p
            className={`hero-content-description mt-4 max-w-[34rem] text-[0.78rem] leading-6 text-muted-foreground sm:mt-5 sm:text-sm lg:max-w-[39rem] lg:text-base lg:leading-7 ${introTransition ? "hero-content-entering" : ""}`}
          >
            I build intelligent systems that can <span className="text-foreground">see</span>,{" "}
            <span className="text-foreground">reason</span>, and{" "}
            <span className="text-foreground">act</span> — from computer vision to production-ready
            generative AI.
          </p>

          <div
            className={`hero-content-actions mt-5 flex w-full max-w-[31rem] flex-col justify-center gap-2.5 sm:mt-6 sm:flex-row sm:gap-3 ${introTransition ? "hero-content-entering" : ""}`}
          >
            <a
              href="#projects"
              className="hero-primary-action inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-accent px-5 py-3 font-mono text-[9px] font-bold uppercase text-accent-foreground transition-transform hover:-translate-y-0.5 sm:min-h-12 sm:px-6 sm:text-[10px]"
            >
              Explore projects{" "}
              <span aria-hidden className="ml-3">
                ↗
              </span>
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-border bg-surface/40 px-5 py-3 font-mono text-[9px] font-bold uppercase text-foreground backdrop-blur-xl transition-colors hover:border-accent hover:text-accent sm:min-h-12 sm:px-6 sm:text-[10px]"
            >
              Start a conversation
            </a>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block" aria-hidden>
          {SIGNALS.map((signal, index) => (
            <span
              key={signal.text}
              className={`hero-signal absolute ${signal.placement}`}
              style={{ animationDelay: `${index * 700}ms` }}
            >
              {signal.text}
            </span>
          ))}
        </div>

        <div className="relative z-30 flex items-end justify-between font-mono text-[9px] uppercase text-muted-foreground sm:text-[10px]">
          <span>Vision · RAG · Agents</span>
          <a
            href="#experience"
            className="pointer-events-auto flex items-center gap-2 text-foreground transition-colors hover:text-accent"
          >
            Scroll to explore <span aria-hidden>↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
