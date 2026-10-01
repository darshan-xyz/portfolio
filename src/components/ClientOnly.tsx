import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { useMotionState } from "@/hooks/use-motion";

export function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <>{fallback}</>;
  return <Suspense fallback={fallback}>{children}</Suspense>;
}

/* ------------------------------------------------------------------ */
/* Lazy Three.js scenes + module-level chunk cache                     */
/* ------------------------------------------------------------------ */

const loaders = {
  shardField: () => import("./three/ShardField"),
  waveTerrain: () => import("./three/WaveTerrain"),
  coreScene: () => import("./three/CoreScene"),
  skillsCloud: () => import("./three/SkillsCloud"),
};

// Once a chunk is requested the promise is cached by the bundler, so
// subsequent route navigations resolve synchronously — no re-suspend, no veil.
let prefetched = false;
export function prefetchScenes() {
  if (prefetched || typeof window === "undefined") return;
  prefetched = true;
  const run = () => Object.values(loaders).forEach((load) => void load());

  const schedule = () => {
    const ric = (
      window as unknown as {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void;
      }
    ).requestIdleCallback;
    if (ric) {
      ric(run, { timeout: 3500 });
    } else {
      window.setTimeout(run, 2000);
    }
  };

  try {
    if (sessionStorage.getItem("darshan_intro_seen") === "1") {
      schedule();
      return;
    }
  } catch {}

  const onDismiss = () => {
    window.removeEventListener("portfolio:intro-dismiss", onDismiss);
    schedule();
  };
  window.addEventListener("portfolio:intro-dismiss", onDismiss, { once: true });
  window.setTimeout(schedule, 4500);
}

export const LazyHeroScene = lazy(loaders.shardField);
export const LazyShardField = lazy(loaders.shardField);
export const LazyWaveTerrain = lazy(loaders.waveTerrain);
export const LazyCoreScene = lazy(loaders.coreScene);
export const LazySkillsCloud = lazy(loaders.skillsCloud);

/**
 * Renders a Three.js scene only when the browser supports WebGL and the
 * visitor has not asked for reduced motion. Otherwise the static fallback
 * is rendered — same layout, zero GPU work.
 */
export function Scene3D({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { allow3D } = useMotionState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!allow3D) return;
    const ric = (
      window as unknown as {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void;
      }
    ).requestIdleCallback;
    if (ric) {
      ric(() => setMounted(true), { timeout: 1200 });
    } else {
      const t = window.setTimeout(() => setMounted(true), 400);
      return () => window.clearTimeout(t);
    }
  }, [allow3D]);

  if (!mounted || !allow3D) return <>{fallback}</>;
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
