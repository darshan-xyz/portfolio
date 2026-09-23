import { Link } from "@tanstack/react-router";
import { activities, certifications } from "@/data/portfolio";

const ISSUERS = ["PMI", "Microsoft", "FreeCodeCamp", "LinkedIn", "Great Learning"];
const COURSEWORK = [
  { name: "Data Structures & Algorithms", track: "Core CS" },
  { name: "Operating Systems", track: "Core CS" },
  { name: "Computer Networks", track: "Core CS" },
  { name: "DBMS & System Architecture", track: "Core CS" },
  { name: "Machine Learning & Deep Learning", track: "AI/ML" },
  { name: "Object-Oriented Programming (OOP)", track: "Core CS" },
];
const IN_PROGRESS = [
  { name: "LangGraph Multi-Agent Workflows", status: "ADVANCING · 88%" },
  { name: "Scalable RAG & ChromaDB Systems", status: "ADVANCING · 82%" },
  { name: "Real-Time Vision & Edge Pipeline", status: "ADVANCING · 76%" },
];

export function CertificationsSection() {
  const ticker = [...certifications, ...certifications];

  return (
    <section id="certifications" className="relative border-t border-border py-32">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent">
              // credentials · community
            </p>
            <h2 className="mt-4 font-display text-5xl font-semibold md:text-6xl">
              Always <span className="text-gradient italic">learning</span>. Always shipping.
            </h2>
          </div>
          <p className="max-w-xs font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            tap any credential to open the file
          </p>
        </header>

        {/* Stats bar */}
        <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: certifications.length, v: "certifications_earned" },
            { k: ISSUERS.length, v: "unique_issuers" },
            { k: "3+", v: "in_progress" },
            { k: "2024", v: "latest_credential" },
          ].map((s) => (
            <div key={s.v} className="border border-border bg-surface/40 p-5">
              <div className="font-display text-3xl font-bold text-accent">{s.k}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {s.v}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((c, i) => (
            <Link
              key={c.slug}
              to="/certifications/$slug"
              params={{ slug: c.slug }}
              className="group relative overflow-hidden rounded-xl border border-border bg-surface/60 p-5 transition-all hover:-translate-y-1 hover:border-accent hover:bg-surface"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                  cred_{String(i + 1).padStart(2, "0")}
                </div>
                <span
                  aria-hidden
                  className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-accent-2"
                >
                  open →
                </span>
              </div>
              <p className="mt-4 font-display text-lg font-medium leading-snug text-foreground">
                {c.name}
              </p>
              <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>{c.issuer}</span>
                {c.year ? <span className="text-accent-2">{c.year}</span> : null}
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-accent/5 transition-transform duration-500 group-hover:scale-150"
              />
            </Link>
          ))}
        </div>

        {/* Marquee */}
        <div
          className="relative mt-16 overflow-hidden border-y border-border bg-surface/40 py-6"
          aria-label="Certifications ticker"
        >
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent"
            aria-hidden
          />
          <div className="marquee-track flex w-max gap-4">
            {ticker.map((c, i) => (
              <div
                key={`${c.slug}-${i}`}
                className="flex items-center gap-4 rounded-full border border-border bg-background px-5 py-3"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent glow-cyan" aria-hidden />
                <span className="font-display text-sm font-medium text-foreground">{c.name}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  / {c.issuer}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Coursework + In-progress grid */}
        <div className="mt-16 grid gap-4 lg:grid-cols-2">
          <div className="border border-border bg-surface/40 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              // relevant_coursework
            </p>
            <ul className="mt-4 space-y-2">
              {COURSEWORK.map((c) => (
                <li
                  key={c.name}
                  className="flex items-center justify-between border-b border-border/60 pb-2 font-mono text-xs"
                >
                  <span className="text-foreground">{c.name}</span>
                  <span className="text-accent-2">{c.track}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-border bg-surface/40 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              // in_progress
            </p>
            <ul className="mt-4 space-y-3">
              {IN_PROGRESS.map((c) => (
                <li key={c.name}>
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-foreground">{c.name}</span>
                    <span className="text-accent">{c.status}</span>
                  </div>
                  <div className="mt-2 h-[3px] w-full overflow-hidden bg-border">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-accent-2"
                      style={{
                        width: c.status.match(/(\d+)%/)?.[1] + "%",
                        boxShadow: "0 0 8px var(--accent)",
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Issuers strip */}
        <div className="mt-10 border-y border-border bg-background/60 py-6">
          <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            // verified_by
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {ISSUERS.map((i) => (
              <span
                key={i}
                className="font-display text-base font-medium text-muted-foreground transition-colors hover:text-accent md:text-lg"
              >
                {i}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Community */}
      <div className="mx-auto mt-20 max-w-7xl px-6">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent">
          // beyond_the_code
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {activities.map((a, i) => (
            <Link
              key={a.slug}
              to="/activities/$slug"
              params={{ slug: a.slug }}
              className="group relative overflow-hidden rounded-xl border border-border bg-surface p-5 transition-all hover:-translate-y-1 hover:border-accent"
            >
              <div className="flex items-start justify-between">
                <div className="font-mono text-[10px] uppercase tracking-widest text-accent">
                  role_{String(i + 1).padStart(2, "0")}
                </div>
                <span
                  aria-hidden
                  className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-accent-2"
                >
                  open →
                </span>
              </div>
              <p className="mt-3 font-display text-base font-semibold leading-snug text-foreground">
                {a.role}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {a.org}
              </p>
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-accent/5 transition-transform duration-500 group-hover:scale-150"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
