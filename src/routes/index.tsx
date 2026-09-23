import { createFileRoute } from "@tanstack/react-router";
import { profile, projects, experience, certifications } from "@/data/portfolio";
import { abs } from "@/lib/seo";

import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { Reveal } from "@/components/Reveal";
import { HeroSection } from "@/components/sections/Hero";
import { ScrollMarquee } from "@/components/ScrollMarquee";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ScrollParticles } from "@/components/ScrollParticles";
import { ExperienceSection } from "@/components/sections/Experience";
import { ProjectsSection } from "@/components/sections/Projects";
import { SkillsSection } from "@/components/sections/Skills";
import { CertificationsSection } from "@/components/sections/Certifications";
import { ContactSection } from "@/components/sections/Contact";

const TITLE = "Darshan R — AI/ML Engineer & GenAI Developer";
const DESCRIPTION =
  "Portfolio of Darshan R — final-year CSE student building production-grade AI, machine learning, and generative AI systems. Computer vision, RAG, agentic AI, and cloud-native ML.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "keywords", content: "Darshan R, AI engineer, ML engineer portfolio, generative AI, computer vision, LangChain, agentic AI, RAG, SREC, Coimbatore" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: abs("/") },
      { property: "profile:first_name", content: "Darshan" },
      { property: "profile:last_name", content: "R" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: abs("/") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: abs("/"),
          name: TITLE,
          description: DESCRIPTION,
          mainEntity: {
            "@type": "Person",
            name: profile.name,
            jobTitle: profile.title,
            description: profile.bio,
            email: `mailto:${profile.email}`,
            telephone: profile.phone,
            url: abs("/"),
            image: abs("/favicon.ico"),
            address: {
              "@type": "PostalAddress",
              addressLocality: "Coimbatore",
              addressCountry: "IN",
            },
            alumniOf: {
              "@type": "CollegeOrUniversity",
              name: "Sri Ramakrishna Engineering College",
            },
            worksFor: experience.map((role) => ({
              "@type": "Organization",
              name: role.company,
            })),
            hasCredential: certifications.map((cert) => ({
              "@type": "EducationalOccupationalCredential",
              name: cert.name,
              credentialCategory: "certification",
              recognizedBy: { "@type": "Organization", name: cert.issuer },
            })),
            sameAs: [profile.linkedin, profile.github, profile.leetcode],
            knowsAbout: [
              "Artificial Intelligence",
              "Machine Learning",
              "Generative AI",
              "Computer Vision",
              "LangChain",
              "Retrieval-Augmented Generation",
              "Agentic AI",
              "Python",
            ],
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Projects by Darshan R",
          itemListElement: projects.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.name,
            url: abs(`/projects/${p.slug}`),
          })),
        }),
      },
    ],
  }),
  component: HomePage,
});


function HomePage() {
  return (
    <div className="min-h-screen text-foreground">
      <SiteNav />
      <ScrollProgress />
      <ScrollParticles />
      <main>
        <HeroSection />
        <ScrollMarquee />
        <Reveal><ExperienceSection /></Reveal>
        <Reveal><ProjectsSection /></Reveal>
        <ScrollMarquee />
        <Reveal><SkillsSection /></Reveal>
        <Reveal><CertificationsSection /></Reveal>
        <Reveal><ContactSection /></Reveal>
      </main>
      <SiteFooter />
    </div>
  );
}
