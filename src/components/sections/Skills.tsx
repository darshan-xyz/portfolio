import { useMemo, useState } from "react";
import { skillGroups } from "@/data/portfolio";

export function SkillsSection() {
  const [active, setActive] = useState<string>(skillGroups[0].label);

  const activeGroup = useMemo(
    () => skillGroups.find((g) => g.label === active) ?? skillGroups[0],
    [active],
  );



  return (
    <section id="skills" className="relative border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent-2">
              [ 03 // arsenal ]
            </p>
            <h2 className="mt-3 font-display text-5xl font-bold uppercase tracking-tighter text-accent md:text-6xl">
              LOADOUT
            </h2>
          </div>
          <span className="font-mono text-[10px] uppercase text-muted-foreground">
            every problem gets its own stack · {skillGroups.length} classes
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex min-h-[420px] flex-col border border-border bg-surface/40">
            <div className="flex flex-wrap gap-1.5 border-b border-border/60 p-4">
              {skillGroups.map((g) => (
                <button
                  key={g.label}
                  type="button"
                  onClick={() => setActive(g.label)}
                  className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                    active === g.label
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border text-muted-foreground hover:border-accent/60 hover:text-accent"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
            <div className="flex flex-1 flex-col p-6 md:p-8">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
                  {activeGroup.label}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                  {activeGroup.items.length} equipped
                </span>
              </div>
              <div className="mt-6 grid flex-1 grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                {activeGroup.items.map((s, i) => (
                  <div
                    key={s}
                    className="group flex items-center gap-2 border border-border/70 bg-background/60 p-2.5 transition-colors hover:border-accent/60"
                  >
                    <span className="font-mono text-[10px] text-accent/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-sm text-foreground">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
