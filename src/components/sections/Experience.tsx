import { Link } from "@tanstack/react-router";
import {
  experience as defaultExperience,
  profile as defaultProfile,
  type ExperienceRole,
} from "@/data/portfolio";

interface ExperienceSectionProps {
  data?: ExperienceRole[];
  education?: Array<{ school: string; degree: string; period: string; grade: string }>;
}

export function ExperienceSection({
  data = defaultExperience,
  education = defaultProfile.education,
}: ExperienceSectionProps) {
  const experienceList = data;
  return (
    <section id="experience" className="relative border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent-2">
              [ 01 // logbook ]
            </p>
            <h2 className="mt-3 font-display text-5xl font-bold uppercase tracking-tighter text-accent md:text-6xl">
              EXPERIENCE
            </h2>
          </div>
          <span className="font-mono text-[10px] uppercase text-muted-foreground">
            declassified · {experienceList.length} entries
          </span>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {experienceList.map((role, i) => (
            <article
              key={role.company}
              className={`col-span-12 flex flex-col border border-border bg-surface/40 p-8 transition-colors hover:border-accent ${
                i === 0 ? "md:col-span-7" : "md:col-span-5"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
                <span className="text-accent">
                  LOG_{String(i + 1).padStart(2, "0")} · {role.period}
                </span>
                <span className="h-2 w-2 rounded-full bg-accent-2 glow-cyan" />
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold uppercase tracking-tight md:text-3xl">
                {role.role}
              </h3>
              <p className="mt-1 font-mono text-sm text-muted-foreground">@ {role.company}</p>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {role.outcomes.map((o) => (
                  <div
                    key={o.label}
                    className="border border-border/60 bg-background/60 p-3 text-center"
                  >
                    <div className="font-display text-lg font-bold text-accent">{o.metric}</div>
                    <div className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                      {o.label}
                    </div>
                  </div>
                ))}
              </div>

              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                {role.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <span className="mt-2 h-px w-3 flex-none bg-accent-2" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/experience/$slug"
                params={{ slug: role.slug }}
                className="group mt-8 inline-flex w-fit items-center gap-3 border border-accent/50 bg-accent/5 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.35em] text-accent transition-all hover:border-accent hover:bg-accent hover:text-accent-foreground"
              >
                <span aria-hidden>▤</span>
                open_file
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </article>
          ))}

          <div className="col-span-12 border border-border bg-background/60 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent-2">
              [ formation.log ]
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {education.map((ed) => (
                <div key={ed.school} className="border border-border/60 bg-surface/40 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                    {ed.period}
                  </p>
                  <h4 className="mt-2 font-display text-sm font-bold leading-snug uppercase">
                    {ed.degree}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground">{ed.school}</p>
                  <p className="mt-2 font-mono text-xs text-foreground">{ed.grade}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
