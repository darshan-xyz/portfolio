import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { projects, certifications, experience, activities } from "@/data/portfolio";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          ...projects.map((p) => ({
            path: `/projects/${p.slug}`,
            changefreq: "monthly",
            priority: "0.8",
          })),
          ...experience.map((r) => ({
            path: `/experience/${r.slug}`,
            changefreq: "monthly",
            priority: "0.7",
          })),
          ...certifications
            .filter((c) => Boolean(c.slug))
            .map((c) => ({
              path: `/certifications/${c.slug}`,
              changefreq: "yearly",
              priority: "0.6",
            })),
          ...activities.map((a) => ({
            path: `/activities/${a.slug}`,
            changefreq: "yearly",
            priority: "0.5",
          })),
        ];

        const urls = entries
          .map(
            (e) =>
              `  <url>\n    <loc>${SITE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
