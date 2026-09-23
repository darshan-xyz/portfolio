import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { projects } from "@/data/portfolio";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { abs, breadcrumbs } from "@/lib/seo";


import type { Project } from "@/data/portfolio";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }): Project => {
    const project = projects.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Project not found — Darshan R" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.name} — Darshan R`;
    const url = abs(`/projects/${params.slug}`);
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.summary },
        { name: "keywords", content: loaderData.stack.join(", ") },
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
            "@type": "CreativeWork",
            name: loaderData.name,
            description: loaderData.description,
            url,
            author: { "@type": "Person", name: "Darshan R", url: abs("/") },
            keywords: loaderData.stack.join(", "),
            about: loaderData.domain,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbs([
              { name: "Home", path: "/" },
              { name: loaderData.name, path: `/projects/${params.slug}` },
            ]),
          ),
        },
      ],
    };
  },

  component: ProjectDetail,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="mx-auto max-w-3xl px-6 py-40 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent">404</p>
        <h1 className="mt-4 font-display text-4xl">Project not found</h1>
        <Link to="/" className="mt-8 inline-block text-accent underline">
          ← Back to portfolio
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

function ProjectDetail() {
  const project = Route.useLoaderData() as Project;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="pt-32 pb-24">
        <article className="mx-auto max-w-3xl px-6">
          <Link
            to="/"
            hash="projects"
            className="font-mono text-xs uppercase tracking-widest text-accent hover:underline"
          >
            ← All projects
          </Link>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.4em] text-accent">
            {project.domain}
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold md:text-6xl [text-wrap:pretty] [overflow-wrap:normal] [word-break:keep-all]">
            {project.name.replace(/-/g, "\u2011")}
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">{project.description}</p>

          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold">Highlights</h2>
            <ul className="mt-4 space-y-3">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-muted-foreground">
                  <span className="mt-2 h-1 w-3 flex-none bg-accent" aria-hidden />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold">Stack</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <li
                  key={s}
                  className="rounded border border-border bg-surface px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-foreground"
                >
                  {s}
                </li>
              ))}
            </ul>
          </section>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
