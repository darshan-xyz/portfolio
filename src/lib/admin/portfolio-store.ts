import {
  profile as defaultProfile,
  experience as defaultExperience,
  projects as defaultProjects,
  skillGroups as defaultSkillGroups,
  certifications as defaultCertifications,
  activities as defaultActivities,
  type ExperienceRole,
  type Project,
  type Certification,
  type Activity,
} from "@/data/portfolio";

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface EducationItem {
  school: string;
  degree: string;
  period: string;
  grade: string;
}

export interface ProfileData {
  name: string;
  title: string;
  tagline: string;
  roles: string[];
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  leetcode: string;
  bio: string;
  education: EducationItem[];
}

export interface PortfolioContentData {
  profile: ProfileData;
  projects: Project[];
  experience: ExperienceRole[];
  skillGroups: SkillGroup[];
  certifications: Certification[];
  activities: Activity[];
}

const STORAGE_KEY = "darshan_portfolio_cms_v1";

// In-memory cache for fast sync reads in SSR / client
let memoryState: PortfolioContentData | null = null;

export function getDefaultPortfolioData(): PortfolioContentData {
  return {
    profile: JSON.parse(JSON.stringify(defaultProfile)),
    projects: JSON.parse(JSON.stringify(defaultProjects)),
    experience: JSON.parse(JSON.stringify(defaultExperience)),
    skillGroups: JSON.parse(JSON.stringify(defaultSkillGroups)),
    certifications: JSON.parse(JSON.stringify(defaultCertifications)),
    activities: JSON.parse(JSON.stringify(defaultActivities)),
  };
}

export function getPortfolioData(): PortfolioContentData {
  if (memoryState) return memoryState;

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        memoryState = {
          profile: parsed.profile ?? defaultProfile,
          projects: parsed.projects ?? defaultProjects,
          experience: parsed.experience ?? defaultExperience,
          skillGroups: parsed.skillGroups ?? defaultSkillGroups,
          certifications: parsed.certifications ?? defaultCertifications,
          activities: parsed.activities ?? defaultActivities,
        };
        return memoryState;
      }
    } catch {
      // Fallback on parse failure
    }
  }

  memoryState = getDefaultPortfolioData();
  return memoryState;
}

export function savePortfolioData(data: PortfolioContentData): void {
  memoryState = data;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent("portfolio:cms-updated", { detail: data }));
    } catch (err) {
      console.error("Failed to save portfolio CMS data to localStorage:", err);
    }
  }
}

export function resetPortfolioData(): PortfolioContentData {
  const defaults = getDefaultPortfolioData();
  savePortfolioData(defaults);
  return defaults;
}
