import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { activities, type Activity } from "@/data/portfolio";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { abs, breadcrumbs } from "@/lib/seo";

import { TransmissionReel } from "@/components/TransmissionReel";

export const Route = createFileRoute("/activities/$slug")({
  loader: ({ params }): Activity => {
    const a = activities.find((x) => x.slug === params.slug);
    if (!a) throw notFound();
    return a;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Activity not found — Darshan R" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.role} — ${loaderData.org} · Darshan R`;
    const url = abs(`/activities/${params.slug}`);
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
            memberOf: { "@type": "Organization", name: loaderData.org },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbs([
              { name: "Home", path: "/" },
              { name: `${loaderData.role} — ${loaderData.org}`, path: `/activities/${params.slug}` },
            ]),
          ),
        },
      ],
    };
  },

  component: ActivityDetail,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="mx-auto max-w-3xl px-6 py-40 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent">404</p>
        <h1 className="mt-4 font-display text-4xl">Activity not found</h1>
        <Link to="/" hash="certifications" className="mt-8 inline-block text-accent underline">
          ← Back
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

function ActivityDetail() {
  const a = Route.useLoaderData() as Activity;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="pt-32 pb-24">
        <article className="mx-auto max-w-4xl px-6">
          <Link
            to="/"
            hash="certifications"
            className="group inline-flex items-center gap-3 rounded-full border border-border bg-surface/70 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.35em] text-accent transition-all hover:border-accent hover:bg-accent hover:text-accent-foreground"
          >
            <span aria-hidden className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Back to community
          </Link>

          <header className="mt-10 border-b border-border pb-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
              // beyond_the_code
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl">
              {a.role}
            </h1>
            <p className="mt-3 font-mono text-sm text-muted-foreground">@ {a.org}</p>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">{a.summary}</p>
          </header>

          <div className="mt-12 grid gap-10 md:grid-cols-3">
            <section className="md:col-span-2">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">
                // responsibilities
              </h2>
              <ul className="mt-5 space-y-4">
                {a.responsibilities.map((r, i) => (
                  <li
                    key={r}
                    className="flex gap-4 rounded-lg border border-border bg-surface/60 p-4"
                  >
                    <span className="font-mono text-xs text-accent-2">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-foreground">{r}</span>
                  </li>
                ))}
              </ul>
            </section>
            <aside>
              <TransmissionReel label={`${a.slug}.log`} mode="static" duration="00:07" />
              <div className="mt-6 rounded-xl border border-accent/40 bg-accent/5 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
                  organisation
                </p>
                <p className="mt-2 font-display text-lg text-foreground">{a.org}</p>
              </div>
            </aside>
          </div>

          <div className="mt-16 flex items-center justify-between border-t border-border pt-8">
            <Link
              to="/"
              hash="certifications"
              className="font-mono text-xs uppercase tracking-widest text-accent hover:underline"
            >
              ← Back
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
