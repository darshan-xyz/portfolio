# Darshan R — Portfolio

Personal portfolio showcasing AI/ML engineering work, projects, technical skills, and experience.

**Live →** [darshan-r.vercel.app](https://darshan-r.vercel.app)

---

## Tech Stack

| Layer      | Technology                                                              |
| ---------- | ----------------------------------------------------------------------- |
| Framework  | [TanStack Start](https://tanstack.com/start) (SSR & file-based routing) |
| UI         | React 19, [shadcn/ui](https://ui.shadcn.com) (Radix + CVA)              |
| Styling    | Tailwind CSS v4                                                         |
| 3D         | Three.js / React Three Fiber / Drei                                     |
| Animations | Framer Motion                                                           |
| Backend    | Supabase (contact form / data)                                          |
| Build      | Vite 8                                                                  |
| Language   | TypeScript                                                              |

## Features

- **Interactive 3D background** — WebGL shard field, wave terrain, and skills cloud rendered with R3F
- **Boot-loader sequence** — terminal-style intro animation before the main site reveals
- **Scroll-driven effects** — progress bar, floating particles, and marquee ticker
- **Custom cursor** — follows pointer movement across the site
- **Dynamic detail pages** — `/experience/:slug`, `/projects/:slug`, `/certifications/:slug`, `/activities/:slug`
- **SEO-first** — full `<head>` meta, Open Graph, Twitter cards, JSON-LD structured data, canonical URLs, sitemap
- **Security headers** — CSP, HSTS, cookie hardening, and permissions policy applied at the edge
- **Responsive design** — works across desktop, tablet, and mobile viewports

## Project Structure

```
src/
├── components/
│   ├── sections/       # Hero, Experience, Projects, Skills, Certifications, Contact
│   ├── three/          # CoreScene, HeroScene, ShardField, WaveTerrain, SkillsCloud
│   └── ui/             # shadcn/ui primitives
├── data/
│   └── portfolio.ts    # All content — profile, experience, projects, skills, certs, activities
├── hooks/              # Custom React hooks
├── integrations/       # External service clients
├── lib/                # Utilities (SEO helpers, error handling)
├── routes/             # TanStack file-based routes
│   ├── __root.tsx
│   ├── index.tsx
│   ├── experience.$slug.tsx
│   ├── projects.$slug.tsx
│   ├── certifications.$slug.tsx
│   ├── activities.$slug.tsx
│   └── sitemap[.]xml.ts
├── server.ts           # Edge server entry with security middleware
├── router.tsx          # Router configuration
└── styles.css          # Global styles & Tailwind directives
```

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (ships with Node)

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:8080)
npm run dev
```

### Other Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run build`     | Production build                     |
| `npm run build:dev` | Development build (unminified)       |
| `npm run preview`   | Preview the production build locally |
| `npm run lint`      | Run ESLint                           |
| `npm run format`    | Format with Prettier                 |

## Environment Variables

Create a `.env` file in the project root:

```env
SUPABASE_URL=<your-supabase-url>
SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
VITE_SITE_URL=https://darshan-r.vercel.app   # optional, defaults to this
```

## Deployment

The site deploys to **Vercel** with SSR via TanStack Start's server entry. Push to `main` to trigger a production deploy.

## License

This is a personal portfolio — source is public for reference, but not licensed for reuse.
