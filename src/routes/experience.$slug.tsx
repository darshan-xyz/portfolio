import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { experience, type ExperienceRole } from "@/data/portfolio";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { abs, breadcrumbs } from "@/lib/seo";

import { TransmissionReel } from "@/components/TransmissionReel";

export const Route = createFileRoute("/experience/$slug")({
  loader: ({ params }): ExperienceRole => {
    const role = experience.find((r) => r.slug === params.slug);
    if (!role) throw notFound();
    return role;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Role not found — Darshan R" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.role} @ ${loaderData.company} — Darshan R`;
    const url = abs(`/experience/${params.slug}`);
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.summary },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: loaderData.summary },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "OrganizationRole",
            roleName: loaderData.role,
            description: loaderData.summary,
            url,
            member: { "@type": "Person", name: "Darshan R", url: abs("/") },
            worksFor: { "@type": "Organization", name: loaderData.company },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbs([
              { name: "Home", path: "/" },
              {
                name: `${loaderData.role} @ ${loaderData.company}`,
                path: `/experience/${params.slug}`,
              },
            ]),
          ),
        },
      ],
    };
  },

  component: ExperienceDetail,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="mx-auto max-w-3xl px-6 py-40 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent">404</p>
        <h1 className="mt-4 font-display text-4xl">Role file not found</h1>
        <Link to="/" hash="experience" className="mt-8 inline-block text-accent underline">
          ← Back to experience
        </Link>
      </div>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="mx-auto max-w-3xl px-6 py-40 text-center">
        <h1 className="font-display text-3xl">Something went wrong.</h1>
        <p className="mt-3 text-muted-foreground">{error.message}</p>
        <button
          onClick={reset}
          className="mt-6 rounded-md bg-accent px-5 py-2 font-mono text-xs uppercase tracking-widest text-accent-foreground"
        >
          Try again
        </button>
      </div>
      <SiteFooter />
    </div>
  ),
});

function ExperienceDetail() {
  const role = Route.useLoaderData() as ExperienceRole;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="pt-32 pb-24">
        <article className="mx-auto max-w-5xl px-6">
          <Link
            to="/"
            hash="experience"
            className="group inline-flex items-center gap-3 rounded-full border border-border bg-surface/70 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.35em] text-accent transition-all hover:border-accent hover:bg-accent hover:text-accent-foreground"
          >
            <span aria-hidden className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Back to experience
          </Link>

          <header className="mt-10 border-b border-border pb-10">
            <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em]">
              <span className="text-accent">// role_file</span>
              <span className="text-muted-foreground">/ {role.company}</span>
              <span className="text-accent-2">/ {role.period}</span>
              {role.location ? (
                <span className="text-muted-foreground">/ {role.location}</span>
              ) : null}
            </div>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight md:text-6xl">
              {role.role}
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
              {role.summary}
            </p>
          </header>

          <div className="mt-12 grid gap-10 md:grid-cols-3">
            <section className="md:col-span-2">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">
                // what_i_did
              </h2>
              <ul className="mt-5 space-y-4">
                {role.highlights.map((o, i) => (
                  <li
                    key={o}
                    className="flex gap-4 rounded-lg border border-border bg-surface/60 p-4"
                  >
                    <span className="font-mono text-xs text-accent-2">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-foreground">{o}</span>
                  </li>
                ))}
              </ul>

              <h2 className="mt-10 font-mono text-[10px] uppercase tracking-[0.4em] text-accent">
                // outcomes
              </h2>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {role.outcomes.map((o) => (
                  <div
                    key={o.label}
                    className="border border-border/60 bg-background/60 p-4 text-center"
                  >
                    <div className="font-display text-xl font-bold text-accent">{o.metric}</div>
                    <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                      {o.label}
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <aside>
              <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">
                // stack
              </h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {role.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded border border-border bg-surface px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-foreground"
                  >
                    {s}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <TransmissionReel
                  label={`${role.slug}.log`}
                  mode="waveform"
                  duration={role.period.slice(0, 8)}
                />
              </div>
            </aside>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
            <Link
              to="/"
              hash="experience"
              className="font-mono text-xs uppercase tracking-widest text-accent hover:underline"
            >
              ← Back to experience
            </Link>
            <Link
              to="/"
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-accent-2"
            >
              home /
            </Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
