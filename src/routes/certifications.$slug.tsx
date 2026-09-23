import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { certifications, type Certification } from "@/data/portfolio";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { abs, breadcrumbs } from "@/lib/seo";


export const Route = createFileRoute("/certifications/$slug")({
  loader: ({ params }): Certification => {
    const cert = certifications.find((c) => c.slug === params.slug);
    if (!cert) throw notFound();
    return cert;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Credential not found — Darshan R" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.name} — ${loaderData.issuer} · Darshan R`;
    const url = abs(`/certifications/${params.slug}`);
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
            "@type": "EducationalOccupationalCredential",
            name: loaderData.name,
            description: loaderData.summary,
            url,
            credentialCategory: "certification",
            recognizedBy: { "@type": "Organization", name: loaderData.issuer },
            dateCreated: loaderData.year,
            about: { "@type": "Person", name: "Darshan R", url: abs("/") },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbs([
              { name: "Home", path: "/" },
              { name: loaderData.name, path: `/certifications/${params.slug}` },
            ]),
          ),
        },
      ],
    };
  },

  component: CertDetail,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="mx-auto max-w-3xl px-6 py-40 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent">404</p>
        <h1 className="mt-4 font-display text-4xl">Credential not found</h1>
        <Link to="/" hash="certifications" className="mt-8 inline-block text-accent underline">
          ← Back to credentials
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

function CertDetail() {
  const cert = Route.useLoaderData() as Certification;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="pt-32 pb-24">
        <article className="mx-auto max-w-4xl px-6">
          {/* Back button — sticky prominent */}
          <Link
            to="/"
            hash="certifications"
            className="group inline-flex items-center gap-3 rounded-full border border-border bg-surface/70 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.35em] text-accent transition-all hover:border-accent hover:bg-accent hover:text-accent-foreground"
          >
            <span aria-hidden className="transition-transform group-hover:-translate-x-1">←</span>
            Back to credentials
          </Link>

          <header className="mt-10 border-b border-border pb-10">
            <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em]">
              <span className="text-accent">// credential_file</span>
              <span className="text-muted-foreground">/ {cert.issuer}</span>
              {cert.year ? <span className="text-accent-2">/ {cert.year}</span> : null}
            </div>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight md:text-6xl">
              {cert.name}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              {cert.summary}
            </p>
          </header>

          <div className="mt-12 grid gap-10 md:grid-cols-3">
            <section className="md:col-span-2">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">
                // outcomes
              </h2>
              <ul className="mt-5 space-y-4">
                {cert.outcomes.map((o, i) => (
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
            </section>
            <aside>
              <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">
                // skills
              </h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {cert.skills.map((s) => (
                  <li
                    key={s}
                    className="rounded border border-border bg-surface px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-foreground"
                  >
                    {s}
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-xl border border-accent/40 bg-accent/5 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent">
                  issued_by
                </p>
                <p className="mt-2 font-display text-lg text-foreground">{cert.issuer}</p>
                {cert.year ? (
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{cert.year}</p>
                ) : null}
              </div>
            </aside>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
            <Link
              to="/"
              hash="certifications"
              className="font-mono text-xs uppercase tracking-widest text-accent hover:underline"
            >
              ← Back to credentials
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
