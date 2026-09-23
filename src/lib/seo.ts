export const SITE_URL =
  (typeof process !== "undefined" && process.env?.VITE_SITE_URL) ||
  import.meta.env?.VITE_SITE_URL ||
  "https://darshan-r.vercel.app";

export const abs = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}
