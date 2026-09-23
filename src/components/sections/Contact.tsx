import { useState, type FormEvent } from "react";
import { profile } from "@/data/portfolio";
import resumeAsset from "@/assets/resume.pdf.asset.json";

const SOCIALS = [
  { label: "email", value: profile.email, href: `mailto:${profile.email}` },
  {
    label: "phone",
    value: profile.phone,
    href: `tel:${profile.phone.replace(/\s/g, "")}`,
  },
  { label: "linkedin", value: "linkedin.com/in/darshan-r", href: profile.linkedin },
  { label: "github", value: "github.com/darshan-com", href: profile.github },
  { label: "leetcode", value: "leetcode.com/dar05", href: profile.leetcode },
];

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    const subject = encodeURIComponent(
      `[Portfolio] ${name.trim()}${company ? ` @ ${company.trim()}` : ""}`,
    );
    const body = encodeURIComponent(
      `Hi Darshan,\n\n${message.trim()}\n\n— ${name.trim()}${
        company ? ` (${company.trim()})` : ""
      }\nReply to: ${email.trim()}`,
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="contact" className="relative border-t border-border py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 100%, oklch(0.82 0.18 210 / 0.18), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6">
        {/* Stacked: heading, contact details, then form */}
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent">// handshake</p>
          <h2 className="mt-4 font-display text-[clamp(2.75rem,7vw,5.5rem)] font-semibold leading-[0.95] tracking-tight">
            Got a hard <span className="text-gradient italic">problem</span>?
            <br />
            Let's give it a <span className="text-gradient italic">brain</span>.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Roles, internships, or a weekend build — drop a message below.
          </p>
        </div>

        {/* Contact details ABOVE the message form */}
        <div className="mt-12 rounded-xl border border-border bg-background/70 p-5 font-mono text-sm shadow-[0_0_80px_-40px_var(--accent)] backdrop-blur-md">
          <div className="mb-4 flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.7_0.2_25)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.85_0.16_85)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.75_0.16_150)]" />
            <span className="ml-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              ~/contact.json
            </span>
          </div>
          <div className="text-muted-foreground">
            <div>
              <span className="text-accent-2">{"{"}</span>
            </div>
            {SOCIALS.map((s, i) => (
              <div key={s.label} className="min-w-0 pl-4">
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group grid min-w-0 grid-cols-[auto_auto_minmax(0,1fr)_auto] items-baseline gap-2 rounded px-1 -mx-1 py-0.5 transition-colors hover:bg-surface"
                >
                  <span className="text-accent">"{s.label}"</span>
                  <span className="text-muted-foreground">:</span>
                  <span className="truncate text-foreground group-hover:text-accent">
                    "{s.value}"
                  </span>
                  {i < SOCIALS.length - 1 && <span className="text-muted-foreground">,</span>}
                </a>
              </div>
            ))}
            <div>
              <span className="text-accent-2">{"}"}</span>
              <span className="cursor-blink" />
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-xl border border-border bg-surface/60 p-6 backdrop-blur-md md:p-8"
        >
          <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className="text-accent">▤ compose_message.exe</span>
            <span>secure_channel · e2e</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                / your_name *
              </span>
              <input
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                className="mt-2 w-full border border-border bg-background/70 px-4 py-3 font-mono text-sm text-foreground outline-none transition-colors focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                / reply_email *
              </span>
              <input
                required
                type="email"
                maxLength={255}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="mt-2 w-full border border-border bg-background/70 px-4 py-3 font-mono text-sm text-foreground outline-none transition-colors focus:border-accent"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                / company / role
              </span>
              <input
                maxLength={120}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme AI — Recruiter"
                className="mt-2 w-full border border-border bg-background/70 px-4 py-3 font-mono text-sm text-foreground outline-none transition-colors focus:border-accent"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                / message *
              </span>
              <textarea
                required
                maxLength={1500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Tell me about the problem you want to solve..."
                className="mt-2 w-full resize-none border border-border bg-background/70 px-4 py-3 font-mono text-sm text-foreground outline-none transition-colors focus:border-accent"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {message.length}/1500 · opens your mail client
            </span>
            <div className="flex flex-wrap gap-3">
              <a
                href={resumeAsset.url}
                download="Darshan_R_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-border bg-surface px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-foreground transition-colors hover:border-accent/60 hover:text-accent"
              >
                ↓ resume.pdf
              </a>
              <button
                type="submit"
                className="rounded-md bg-accent px-7 py-3 font-mono text-[11px] uppercase tracking-widest text-accent-foreground glow-cyan transition-transform hover:-translate-y-0.5"
              >
                {sent ? "resend_message()" : "send_message()"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
