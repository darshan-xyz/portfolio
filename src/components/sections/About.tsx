import { Scene3D, LazyCoreScene } from "@/components/ClientOnly";

const PRINCIPLES = [
  { n: "01", title: "SHIP > POLISH", body: "A model in production teaches more than one in a notebook." },
  { n: "02", title: "EXPLAIN > IMPRESS", body: "SHAP, attention maps, honest metrics. Trust before flash." },
  { n: "03", title: "AGENTS > SCRIPTS", body: "Composable LangGraph flows and tool-using LLMs that reason." },
  { n: "04", title: "DESIGN > DECORATE", body: "The best model dies without a UI a human trusts." },
];

export function AboutSection() {
  return (
    <section id="about" className="relative border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent-2">
          [ 01 // manifesto.txt ]
        </p>
        <h2 className="mt-3 font-display text-5xl font-bold uppercase tracking-tighter text-accent md:text-6xl">
          OPERATING_DOCTRINE
        </h2>

        <div className="mt-10 grid grid-cols-12 gap-4">
          {/* Manifesto quote — large */}
          <div className="relative col-span-12 flex min-h-[320px] flex-col justify-between overflow-hidden border-l-2 border-accent-2 bg-surface/40 p-8 backdrop-blur-md md:p-12 lg:col-span-8">
            <blockquote className="font-display text-2xl font-medium leading-[1.2] tracking-tight md:text-3xl">
              I engineer{" "}
              <span className="text-accent">production-grade AI solutions</span> —
              from real-time computer vision pipelines and RAG systems to multi-agent
              workflows that solve complex enterprise problems.
            </blockquote>
            <div className="mt-8 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span className="border border-border px-3 py-1">B.E CSE · SREC</span>
              <span className="border border-border px-3 py-1">AI / ML Engineer</span>
              <span className="border border-border px-3 py-1">Tech Lead · FOSS</span>
            </div>
          </div>

          {/* Core visual */}
          <div className="relative col-span-12 flex aspect-square items-center justify-center overflow-hidden border border-border bg-background/60 lg:col-span-4 lg:aspect-auto">
            <div
              aria-hidden
              className="absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, var(--accent), transparent 60%)",
                filter: "blur(30px)",
              }}
            />
            <div className="relative h-full w-full">
              <Scene3D
                fallback={
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="h-24 w-24 rotate-45 border border-accent/50" />
                  </div>
                }
              >
                <LazyCoreScene />
              </Scene3D>
            </div>
            <div className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              core.icosahedron · v2.1
            </div>
          </div>

          {/* Principles as bento tiles */}
          {PRINCIPLES.map((p, i) => {
            const span =
              i === 0 || i === 3
                ? "lg:col-span-7"
                : "lg:col-span-5";
            return (
              <div
                key={p.n}
                className={`col-span-12 md:col-span-6 border border-border bg-surface/40 p-6 transition-colors hover:border-accent ${span}`}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                    PRINCIPLE_{p.n}
                  </span>
                  <span className="font-display text-3xl font-bold text-accent-2/40">
                    {p.n}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-bold uppercase tracking-tight text-foreground">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
