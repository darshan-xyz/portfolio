import { Link } from "@tanstack/react-router";
import { projects } from "@/data/portfolio";

export function ProjectsSection() {
  return (
    <section id="projects" className="relative border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent-2">
              [ 02 // deployed_systems ]
            </p>
            <h2 className="mt-3 font-display text-5xl font-bold uppercase tracking-tighter text-accent md:text-6xl">
              PROJECTS
            </h2>
          </div>
          <span className="font-mono text-[10px] uppercase text-muted-foreground">
            SELECTED_PROJECTS_v2.0 · {projects.length} entries
          </span>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
          {projects.map((p, i) => {
            return (
              <Link
                key={p.slug}
                to="/projects/$slug"
                params={{ slug: p.slug }}
                className="group relative flex min-h-[280px] min-w-0 flex-col justify-between overflow-hidden border border-border bg-surface/40 p-6 transition-colors hover:border-accent hover:bg-surface md:p-8"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 opacity-30 transition-transform duration-500 group-hover:scale-125"
                  style={{
                    background: "var(--accent)",
                    clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
                    filter: "blur(40px)",
                  }}
                />
                <div className="relative flex min-w-0 flex-1 flex-col">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                      PROJ_{String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="shrink-0 border border-border px-2 py-0.5 text-right font-mono text-[9px] uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                      {p.domain}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-bold uppercase leading-tight tracking-normal text-foreground transition-colors group-hover:text-accent-2 md:text-3xl [text-wrap:pretty] [overflow-wrap:normal] [word-break:keep-all]">
                    {p.name.replace(/-/g, "\u2011")}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground [text-wrap:pretty] [overflow-wrap:normal] [word-break:normal]">
                    {p.summary}
                  </p>
                </div>

                <div className="relative mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
                  <div className="flex min-w-0 flex-wrap gap-2">
                    {p.stack.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="whitespace-nowrap border border-accent/30 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <span className="flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-accent">
                    open_file
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                    >
                      <path d="M7 17L17 7M9 7h8v8" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
