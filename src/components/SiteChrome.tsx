import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import resumeAsset from "@/assets/resume.pdf.asset.json";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV = [
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl bg-background/70 border-b border-border" : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
      >
        <Link
          to="/"
          className="font-display text-lg font-semibold tracking-tight"
          aria-label="Darshan R — home"
        >
          <span className="text-gradient">Darshan</span>
          <span className="text-foreground">.R</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-accent"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href={resumeAsset.url}
            download="Darshan_R_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-md border border-accent/40 bg-accent/10 px-4 py-2 font-mono text-xs uppercase tracking-widest text-accent transition-colors hover:bg-accent hover:text-accent-foreground md:inline-block"
          >
            Resume
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className="sr-only">Menu</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <ul className="flex flex-col px-6 py-4">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-mono text-sm uppercase tracking-widest text-muted-foreground hover:text-accent"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={resumeAsset.url}
                download="Darshan_R_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block rounded-md border border-accent/40 bg-accent/10 px-4 py-2 font-mono text-xs uppercase tracking-widest text-accent"
              >
                Download Resume
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          © {new Date().getFullYear()} Darshan R — Crafted with intent.
        </p>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          AI · ML · GENAI
        </p>
      </div>
    </footer>
  );
}
