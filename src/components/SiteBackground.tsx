import { Scene3D, LazyWaveTerrain } from "@/components/ClientOnly";

/**
 * Fixed full-viewport 3D shard field that sits behind the entire site.
 * Sections should use transparent / semi-transparent backgrounds so the
 * scroll-driven scene shows through.
 *
 * When WebGL is unavailable or the visitor prefers reduced motion, a purely
 * static CSS aurora is rendered instead — identical composition, no GPU work.
 */
export function SiteBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0">
        <Scene3D
          fallback={
            <div className="h-full w-full">
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  background:
                    "radial-gradient(ellipse at 20% 20%, color-mix(in oklch, var(--accent) 18%, transparent) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, color-mix(in oklch, var(--accent-2) 14%, transparent) 0%, transparent 55%)",
                }}
              />
            </div>
          }
        >
          <LazyWaveTerrain />
        </Scene3D>
      </div>
      {/* stronger vignette so panels + text stay legible over the 3D scene */}
      <div className="absolute inset-0 bg-background/70" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, transparent 0%, var(--background) 85%)",
        }}
      />
    </div>
  );
}
