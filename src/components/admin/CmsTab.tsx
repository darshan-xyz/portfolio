import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Save,
  Trash2,
  Eye,
  Github,
  Download,
  Briefcase,
  Layers,
  Award,
  Users,
  User,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  getPortfolioData,
  savePortfolioData,
  resetPortfolioData,
  type PortfolioContentData,
  type SkillGroup,
  type EducationItem,
  type ProfileData,
} from "@/lib/admin/portfolio-store";
import type { Project, ExperienceRole, Certification, Activity } from "@/data/portfolio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

interface CmsTabProps {
  resumeDownloads?: number;
}

export function CmsTab({ resumeDownloads = 0 }: CmsTabProps) {
  const [data, setData] = useState<PortfolioContentData>(getPortfolioData);
  const [activeSubTab, setActiveSubTab] = useState<string>("projects");

  // Modal edit states
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingExperience, setEditingExperience] = useState<ExperienceRole | null>(null);
  const [editingSkillGroup, setEditingSkillGroup] = useState<{
    index: number;
    group: SkillGroup;
  } | null>(null);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editingProfile, setEditingProfile] = useState<ProfileData | null>(null);
  const [editingEducation, setEditingEducation] = useState<{
    index: number;
    item: EducationItem;
  } | null>(null);

  useEffect(() => {
    setData(getPortfolioData());
  }, []);

  const persistData = (updated: PortfolioContentData) => {
    setData(updated);
    savePortfolioData(updated);
  };

  const handleResetDefaults = () => {
    if (window.confirm("Reset all portfolio sections to default repository content?")) {
      const reset = resetPortfolioData();
      setData(reset);
      toast.info("Portfolio content reset to repository defaults.");
    }
  };

  // ===================== PROJECT HANDLERS =====================
  const handleSaveProject = () => {
    if (!editingProject) return;
    const exists = data.projects.some((p) => p.slug === editingProject.slug);
    const updatedProjects = exists
      ? data.projects.map((p) => (p.slug === editingProject.slug ? editingProject : p))
      : [editingProject, ...data.projects];

    persistData({ ...data, projects: updatedProjects });
    setEditingProject(null);
    toast.success(`Project "${editingProject.name}" saved successfully!`);
  };

  const handleDeleteProject = (slug: string) => {
    if (window.confirm("Delete this project from live portfolio?")) {
      persistData({ ...data, projects: data.projects.filter((p) => p.slug !== slug) });
      toast.success("Project removed.");
    }
  };

  // ===================== EXPERIENCE HANDLERS =====================
  const handleSaveExperience = () => {
    if (!editingExperience) return;
    const exists = data.experience.some((e) => e.slug === editingExperience.slug);
    const updatedExperience = exists
      ? data.experience.map((e) => (e.slug === editingExperience.slug ? editingExperience : e))
      : [editingExperience, ...data.experience];

    persistData({ ...data, experience: updatedExperience });
    setEditingExperience(null);
    toast.success(`Experience "${editingExperience.role}" saved successfully!`);
  };

  const handleDeleteExperience = (slug: string) => {
    if (window.confirm("Delete this experience role?")) {
      persistData({ ...data, experience: data.experience.filter((e) => e.slug !== slug) });
      toast.success("Experience entry removed.");
    }
  };

  // ===================== SKILL GROUP HANDLERS =====================
  const handleSaveSkillGroup = () => {
    if (!editingSkillGroup) return;
    const updated = [...data.skillGroups];
    if (editingSkillGroup.index >= 0 && editingSkillGroup.index < updated.length) {
      updated[editingSkillGroup.index] = editingSkillGroup.group;
    } else {
      updated.push(editingSkillGroup.group);
    }
    persistData({ ...data, skillGroups: updated });
    setEditingSkillGroup(null);
    toast.success(`Skill class "${editingSkillGroup.group.label}" updated!`);
  };

  const handleDeleteSkillGroup = (index: number) => {
    if (window.confirm("Delete this skill category?")) {
      const updated = data.skillGroups.filter((_, i) => i !== index);
      persistData({ ...data, skillGroups: updated });
      toast.success("Skill category removed.");
    }
  };

  // ===================== CERTIFICATION HANDLERS =====================
  const handleSaveCert = () => {
    if (!editingCert) return;
    const exists = data.certifications.some((c) => c.slug === editingCert.slug);
    const updatedCerts = exists
      ? data.certifications.map((c) => (c.slug === editingCert.slug ? editingCert : c))
      : [editingCert, ...data.certifications];

    persistData({ ...data, certifications: updatedCerts });
    setEditingCert(null);
    toast.success(`Credential "${editingCert.name}" saved!`);
  };

  const handleDeleteCert = (slug: string) => {
    if (window.confirm("Delete this credential?")) {
      persistData({ ...data, certifications: data.certifications.filter((c) => c.slug !== slug) });
      toast.success("Credential entry removed.");
    }
  };

  // ===================== ACTIVITY / COMMUNITY HANDLERS =====================
  const handleSaveActivity = () => {
    if (!editingActivity) return;
    const exists = data.activities.some((a) => a.slug === editingActivity.slug);
    const updatedActivities = exists
      ? data.activities.map((a) => (a.slug === editingActivity.slug ? editingActivity : a))
      : [editingActivity, ...data.activities];

    persistData({ ...data, activities: updatedActivities });
    setEditingActivity(null);
    toast.success(`Role "${editingActivity.role}" saved!`);
  };

  const handleDeleteActivity = (slug: string) => {
    if (window.confirm("Delete this community activity?")) {
      persistData({ ...data, activities: data.activities.filter((a) => a.slug !== slug) });
      toast.success("Activity removed.");
    }
  };

  // ===================== PROFILE & BIO HANDLERS =====================
  const handleSaveProfile = () => {
    if (!editingProfile) return;
    persistData({ ...data, profile: editingProfile });
    setEditingProfile(null);
    toast.success("Profile bio & identity saved!");
  };

  // ===================== EDUCATION HANDLERS =====================
  const handleSaveEducation = () => {
    if (!editingEducation) return;
    const updatedEd = [...data.profile.education];
    if (editingEducation.index >= 0 && editingEducation.index < updatedEd.length) {
      updatedEd[editingEducation.index] = editingEducation.item;
    } else {
      updatedEd.push(editingEducation.item);
    }
    persistData({
      ...data,
      profile: { ...data.profile, education: updatedEd },
    });
    setEditingEducation(null);
    toast.success("Education milestone saved!");
  };

  const handleDeleteEducation = (index: number) => {
    if (window.confirm("Delete this education milestone?")) {
      const updatedEd = data.profile.education.filter((_, i) => i !== index);
      persistData({
        ...data,
        profile: { ...data.profile, education: updatedEd },
      });
      toast.success("Education milestone removed.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Reset Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-mono text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            LIVE PORTFOLIO CMS & CONTENT STUDIO
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time visual editor with live sync across all sections: Projects, Experience,
            Skills, Certifications, Community & Profile.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleResetDefaults}
          className="h-8 gap-1.5 border-border bg-surface/50 text-xs font-mono text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset to Defaults
        </Button>
      </div>

      {/* 1. Resume Asset Studio Banner */}
      <Card className="border-border bg-surface/40 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="font-mono text-sm text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-accent-2" />
              AUTHENTIC RESUME ASSET & DOWNLOAD TELEMETRY
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Verified active resume asset linked directly to real-time download telemetry
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border bg-background/80 p-4 transition-all hover:border-accent/40">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent-2/30 bg-accent-2/10 text-accent-2">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">
                      Darshan_R_Resume.pdf
                    </span>
                    <Badge className="border-emerald-500/30 bg-emerald-500/10 text-[9px] text-emerald-400">
                      LIVE ASSET
                    </Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Size: 173 KB · Updated: Sep 23, 2026 ·{" "}
                    <span className="text-accent-2 font-mono font-medium">
                      {resumeDownloads} verified downloads
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-muted/20 px-3 font-mono text-xs text-foreground hover:bg-muted transition-colors"
                >
                  <Eye className="h-3.5 w-3.5 text-accent" />
                  Preview Asset
                </a>
                <a
                  href="/resume.pdf"
                  download="Darshan_R_Resume.pdf"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-accent-2/30 bg-accent-2/10 px-3 font-mono text-xs text-accent-2 hover:bg-accent-2/20 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Direct Download
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Interactive Multi-Section Edit Hub */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full space-y-4">
        <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-auto p-1 bg-surface border border-border rounded-xl">
          <TabsTrigger
            value="projects"
            className="flex items-center gap-1.5 font-mono text-xs py-2 data-[state=active]:bg-background data-[state=active]:text-accent"
          >
            <Layers className="h-3.5 w-3.5" />
            Projects ({data.projects.length})
          </TabsTrigger>
          <TabsTrigger
            value="experience"
            className="flex items-center gap-1.5 font-mono text-xs py-2 data-[state=active]:bg-background data-[state=active]:text-accent"
          >
            <Briefcase className="h-3.5 w-3.5" />
            Experience ({data.experience.length})
          </TabsTrigger>
          <TabsTrigger
            value="skills"
            className="flex items-center gap-1.5 font-mono text-xs py-2 data-[state=active]:bg-background data-[state=active]:text-accent"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Skills ({data.skillGroups.length})
          </TabsTrigger>
          <TabsTrigger
            value="certifications"
            className="flex items-center gap-1.5 font-mono text-xs py-2 data-[state=active]:bg-background data-[state=active]:text-accent"
          >
            <Award className="h-3.5 w-3.5" />
            Certs ({data.certifications.length})
          </TabsTrigger>
          <TabsTrigger
            value="activities"
            className="flex items-center gap-1.5 font-mono text-xs py-2 data-[state=active]:bg-background data-[state=active]:text-accent"
          >
            <Users className="h-3.5 w-3.5" />
            Community ({data.activities.length})
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="flex items-center gap-1.5 font-mono text-xs py-2 data-[state=active]:bg-background data-[state=active]:text-accent"
          >
            <User className="h-3.5 w-3.5" />
            Profile & Edu
          </TabsTrigger>
        </TabsList>

        {/* ==================== TAB 1: PROJECTS ==================== */}
        <TabsContent value="projects">
          <Card className="border-border bg-surface/40 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="font-mono text-sm text-foreground">
                  PROJECT CASE STUDIES & ARSENAL CMS ({data.projects.length} PROJECTS)
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Manage live portfolio projects, technical descriptions, highlights, and tech
                  stacks
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => {
                  setEditingProject({
                    slug: `new-project-${Date.now()}`,
                    name: "New AI Architecture Project",
                    summary: "Summary of engineering achievements and metrics.",
                    description: "Deep technical breakdown of pipeline and latency optimizations.",
                    highlights: ["Built scalable backend", "Integrated state-of-the-art models"],
                    stack: ["Python", "PyTorch", "FastAPI"],
                    domain: "Artificial Intelligence",
                  });
                }}
                className="h-8 gap-1.5 bg-accent/20 text-xs font-mono text-accent hover:bg-accent/30 border border-accent/40"
              >
                <Plus className="h-3 w-3" />
                Add Project
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {data.projects.map((project) => (
                  <div
                    key={project.slug}
                    className="flex flex-col justify-between rounded-xl border border-border bg-background/80 p-4 transition-all hover:border-accent/40"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Badge className="border-accent/30 bg-accent/10 text-[9px] text-accent mb-1">
                            {project.domain}
                          </Badge>
                          <h3 className="font-bold text-sm text-foreground">{project.name}</h3>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingProject({ ...project })}
                            className="h-7 text-xs text-accent hover:bg-accent/10"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProject(project.slug)}
                            className="h-7 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                        {project.summary}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {project.stack.map((s) => (
                          <span
                            key={s}
                            className="rounded border border-border bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        /{project.slug}
                      </span>
                      <a
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[10px] text-accent hover:underline"
                      >
                        preview page ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== TAB 2: EXPERIENCE ==================== */}
        <TabsContent value="experience">
          <Card className="border-border bg-surface/40 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="font-mono text-sm text-foreground">
                  WORK EXPERIENCE & LOGBOOK ({data.experience.length} ROLES)
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Add and modify industry engineering roles, outcomes, metrics, and highlights
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => {
                  setEditingExperience({
                    slug: `new-role-${Date.now()}`,
                    role: "AI / ML Engineer",
                    company: "Company Name",
                    period: "Present",
                    location: "Remote / Hybrid",
                    summary: "Summary of role responsibilities and engineering outcomes.",
                    highlights: [
                      "Architected production ML pipeline with latency optimization",
                      "Evaluated model quality and monitored inference drift",
                    ],
                    stack: ["Python", "PyTorch", "Docker"],
                    outcomes: [
                      { metric: "99.4%", label: "uptime" },
                      { metric: "2.4x", label: "throughput" },
                    ],
                  });
                }}
                className="h-8 gap-1.5 bg-accent/20 text-xs font-mono text-accent hover:bg-accent/30 border border-accent/40"
              >
                <Plus className="h-3 w-3" />
                Add Experience
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {data.experience.map((role) => (
                  <div
                    key={role.slug}
                    className="flex flex-col justify-between rounded-xl border border-border bg-background/80 p-4 transition-all hover:border-accent/40"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Badge className="border-accent-2/30 bg-accent-2/10 text-[9px] text-accent-2 mb-1">
                            {role.period}
                          </Badge>
                          <h3 className="font-bold text-sm text-foreground">{role.role}</h3>
                          <p className="font-mono text-xs text-muted-foreground mt-0.5">
                            @ {role.company} {role.location ? `· ${role.location}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingExperience({ ...role })}
                            className="h-7 text-xs text-accent hover:bg-accent/10"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteExperience(role.slug)}
                            className="h-7 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                        {role.summary}
                      </p>

                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {role.outcomes.map((o) => (
                          <div
                            key={o.label}
                            className="rounded border border-border bg-surface/50 p-1.5 text-center"
                          >
                            <div className="font-bold text-xs text-accent">{o.metric}</div>
                            <div className="font-mono text-[9px] text-muted-foreground uppercase truncate">
                              {o.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        /{role.slug}
                      </span>
                      <a
                        href={`/experience/${role.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[10px] text-accent hover:underline"
                      >
                        preview page ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== TAB 3: SKILLS ==================== */}
        <TabsContent value="skills">
          <Card className="border-border bg-surface/40 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="font-mono text-sm text-foreground">
                  SKILLS & TECH ARSENAL ({data.skillGroups.length} CATEGORIES)
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Organize skill clusters, programming languages, agent frameworks, and AI toolsets
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => {
                  setEditingSkillGroup({
                    index: -1,
                    group: {
                      label: "New Skill Category",
                      items: ["Skill A", "Skill B", "Skill C"],
                    },
                  });
                }}
                className="h-8 gap-1.5 bg-accent/20 text-xs font-mono text-accent hover:bg-accent/30 border border-accent/40"
              >
                <Plus className="h-3 w-3" />
                Add Category
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.skillGroups.map((group, idx) => (
                  <div
                    key={group.label}
                    className="flex flex-col justify-between rounded-xl border border-border bg-background/80 p-4 transition-all hover:border-accent/40"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 border-b border-border pb-2 mb-3">
                        <span className="font-bold text-xs font-mono uppercase text-foreground">
                          {group.label}
                        </span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setEditingSkillGroup({
                                index: idx,
                                group: { ...group, items: [...group.items] },
                              })
                            }
                            className="h-6 text-[11px] text-accent px-2 hover:bg-accent/10"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSkillGroup(idx)}
                            className="h-6 text-[11px] text-red-400 px-1.5 hover:bg-red-500/10 hover:text-red-300"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map((item) => (
                          <span
                            key={item}
                            className="rounded border border-accent/20 bg-accent/5 px-2 py-0.5 font-mono text-[10px] text-foreground"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-2 text-right">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {group.items.length} tools equipped
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== TAB 4: CERTIFICATIONS ==================== */}
        <TabsContent value="certifications">
          <Card className="border-border bg-surface/40 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="font-mono text-sm text-foreground">
                  CREDENTIALS & ACCREDITATIONS ({data.certifications.length} CERTIFICATIONS)
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Manage professional certificates, learning tracks, verified skills, and issuers
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => {
                  setEditingCert({
                    slug: `new-cert-${Date.now()}`,
                    name: "Certification Title",
                    issuer: "Organization / University",
                    year: "2026",
                    summary: "Summary of curriculum and verified technical mastery.",
                    skills: ["Skill 1", "Skill 2"],
                    outcomes: ["Outcome description 1", "Outcome description 2"],
                  });
                }}
                className="h-8 gap-1.5 bg-accent/20 text-xs font-mono text-accent hover:bg-accent/30 border border-accent/40"
              >
                <Plus className="h-3 w-3" />
                Add Credential
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {data.certifications.map((c) => (
                  <div
                    key={c.slug}
                    className="flex flex-col justify-between rounded-xl border border-border bg-background/80 p-4 transition-all hover:border-accent/40"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Badge className="border-accent/30 bg-accent/10 text-[9px] text-accent mb-1">
                            {c.issuer} {c.year ? `· ${c.year}` : ""}
                          </Badge>
                          <h3 className="font-bold text-sm text-foreground">{c.name}</h3>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingCert({ ...c })}
                            className="h-7 text-xs text-accent hover:bg-accent/10"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCert(c.slug)}
                            className="h-7 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{c.summary}</p>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {c.skills.map((s) => (
                          <span
                            key={s}
                            className="rounded border border-border bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <span className="font-mono text-[10px] text-muted-foreground">/{c.slug}</span>
                      <a
                        href={`/certifications/${c.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[10px] text-accent hover:underline"
                      >
                        preview page ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== TAB 5: COMMUNITY & ACTIVITIES ==================== */}
        <TabsContent value="activities">
          <Card className="border-border bg-surface/40 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="font-mono text-sm text-foreground">
                  COMMUNITY INVOLVEMENT & ACTIVITIES ({data.activities.length} ENTRIES)
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Showcase club leadership, open-source mentorship, student chapters, and hackathon
                  initiatives
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => {
                  setEditingActivity({
                    slug: `new-activity-${Date.now()}`,
                    role: "Lead Coordinator",
                    org: "Club / Student Chapter",
                    summary: "Overview of outreach and technical contributions.",
                    responsibilities: ["Led team sprints", "Organized technical hackathons"],
                  });
                }}
                className="h-8 gap-1.5 bg-accent/20 text-xs font-mono text-accent hover:bg-accent/30 border border-accent/40"
              >
                <Plus className="h-3 w-3" />
                Add Activity
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {data.activities.map((a) => (
                  <div
                    key={a.slug}
                    className="flex flex-col justify-between rounded-xl border border-border bg-background/80 p-4 transition-all hover:border-accent/40"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Badge className="border-accent-2/30 bg-accent-2/10 text-[9px] text-accent-2 mb-1">
                            {a.org}
                          </Badge>
                          <h3 className="font-bold text-sm text-foreground">{a.role}</h3>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingActivity({ ...a })}
                            className="h-7 text-xs text-accent hover:bg-accent/10"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteActivity(a.slug)}
                            className="h-7 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{a.summary}</p>

                      <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                        {a.responsibilities.slice(0, 2).map((r, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-accent mt-0.5">•</span>
                            <span className="line-clamp-1">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <span className="font-mono text-[10px] text-muted-foreground">/{a.slug}</span>
                      <a
                        href={`/activities/${a.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[10px] text-accent hover:underline"
                      >
                        preview page ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== TAB 6: PROFILE & EDUCATION ==================== */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Bio & Socials */}
            <Card className="border-border bg-surface/40 backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="font-mono text-sm text-foreground">
                    PROFILE IDENTITY & SOCIAL LINKS
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Headline, contact points, location, and bio shown across Hero, Footer, and
                    Contact sections
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setEditingProfile({ ...data.profile })}
                  className="h-8 gap-1.5 bg-accent/20 text-xs font-mono text-accent hover:bg-accent/30 border border-accent/40"
                >
                  Edit Profile
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-xl border border-border bg-background/80 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-mono">Full Name</span>
                    <span className="text-sm font-bold text-foreground">{data.profile.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-mono">Title</span>
                    <span className="text-xs font-medium text-accent">{data.profile.title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-mono">Location</span>
                    <span className="text-xs text-foreground">{data.profile.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-mono">Email</span>
                    <span className="text-xs font-mono text-foreground">{data.profile.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-mono">Phone</span>
                    <span className="text-xs font-mono text-foreground">{data.profile.phone}</span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground font-mono block mb-1">Bio</span>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {data.profile.bio}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education Milestones */}
            <Card className="border-border bg-surface/40 backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="font-mono text-sm text-foreground">
                    ACADEMIC FORMATION & EDUCATION ({data.profile.education.length})
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Degrees, colleges, CBSE schooling, grades, and graduation timelines
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() =>
                    setEditingEducation({
                      index: -1,
                      item: {
                        school: "University / Institution",
                        degree: "B.E Degree / Specialization",
                        period: "2023 — 2027",
                        grade: "CGPA / Percentage",
                      },
                    })
                  }
                  className="h-8 gap-1.5 bg-accent/20 text-xs font-mono text-accent hover:bg-accent/30 border border-accent/40"
                >
                  <Plus className="h-3 w-3" />
                  Add Education
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.profile.education.map((ed, idx) => (
                  <div
                    key={ed.school + idx}
                    className="flex items-center justify-between rounded-xl border border-border bg-background/80 p-3"
                  >
                    <div>
                      <span className="font-mono text-[10px] text-accent">{ed.period}</span>
                      <h4 className="font-bold text-xs text-foreground uppercase">{ed.degree}</h4>
                      <p className="text-[11px] text-muted-foreground">{ed.school}</p>
                      <span className="font-mono text-[11px] text-foreground font-medium">
                        {ed.grade}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setEditingEducation({
                            index: idx,
                            item: { ...ed },
                          })
                        }
                        className="h-7 text-xs text-accent hover:bg-accent/10"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEducation(idx)}
                        className="h-7 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ===================== MODAL: EDIT PROJECT ===================== */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-xl border-border bg-surface text-foreground max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-mono text-sm text-foreground">
                EDIT PROJECT // {editingProject.slug}
              </CardTitle>
              <Badge className="border-accent/30 bg-accent/10 font-mono text-[9px] text-accent">
                CMS STUDIO
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Project Name</label>
                <Input
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  className="border-border bg-muted/20 text-xs text-foreground"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Slug URL Identifier
                </label>
                <Input
                  value={editingProject.slug}
                  onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                  className="border-border bg-muted/20 text-xs text-foreground font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Domain / Category
                </label>
                <Input
                  value={editingProject.domain}
                  onChange={(e) => setEditingProject({ ...editingProject, domain: e.target.value })}
                  className="border-border bg-muted/20 text-xs text-foreground"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">Summary (Short)</label>
                <textarea
                  value={editingProject.summary}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, summary: e.target.value })
                  }
                  rows={2}
                  className="w-full rounded-md border border-border bg-muted/20 p-2 text-xs text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Technical Description (Deep Dive)
                </label>
                <textarea
                  value={editingProject.description}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, description: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-md border border-border bg-muted/20 p-2 text-xs text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Key Highlights (one per line)
                </label>
                <textarea
                  value={editingProject.highlights.join("\n")}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      highlights: e.target.value.split("\n").filter(Boolean),
                    })
                  }
                  rows={3}
                  className="w-full rounded-md border border-border bg-muted/20 p-2 text-xs text-foreground focus:outline-none focus:border-accent font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Tech Stack (comma separated)
                </label>
                <Input
                  value={editingProject.stack.join(", ")}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      stack: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="border-border bg-muted/20 text-xs text-foreground font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingProject(null)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveProject}
                  className="bg-accent text-xs font-mono font-semibold text-accent-foreground hover:bg-accent/90"
                >
                  <Save className="h-3.5 w-3.5 mr-1" />
                  Save Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===================== MODAL: EDIT EXPERIENCE ===================== */}
      {editingExperience && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-xl border-border bg-surface text-foreground max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-mono text-sm text-foreground">
                EDIT EXPERIENCE // {editingExperience.company}
              </CardTitle>
              <Badge className="border-accent-2/30 bg-accent-2/10 font-mono text-[9px] text-accent-2">
                LOGBOOK
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Job Title / Role
                  </label>
                  <Input
                    value={editingExperience.role}
                    onChange={(e) =>
                      setEditingExperience({ ...editingExperience, role: e.target.value })
                    }
                    className="border-border bg-muted/20 text-xs text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Company / Organization
                  </label>
                  <Input
                    value={editingExperience.company}
                    onChange={(e) =>
                      setEditingExperience({ ...editingExperience, company: e.target.value })
                    }
                    className="border-border bg-muted/20 text-xs text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Period (e.g. June 2025)
                  </label>
                  <Input
                    value={editingExperience.period}
                    onChange={(e) =>
                      setEditingExperience({ ...editingExperience, period: e.target.value })
                    }
                    className="border-border bg-muted/20 text-xs text-foreground font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Location</label>
                  <Input
                    value={editingExperience.location ?? ""}
                    onChange={(e) =>
                      setEditingExperience({ ...editingExperience, location: e.target.value })
                    }
                    className="border-border bg-muted/20 text-xs text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">Summary</label>
                <textarea
                  value={editingExperience.summary}
                  onChange={(e) =>
                    setEditingExperience({ ...editingExperience, summary: e.target.value })
                  }
                  rows={2}
                  className="w-full rounded-md border border-border bg-muted/20 p-2 text-xs text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Highlights (one per line)
                </label>
                <textarea
                  value={editingExperience.highlights.join("\n")}
                  onChange={(e) =>
                    setEditingExperience({
                      ...editingExperience,
                      highlights: e.target.value.split("\n").filter(Boolean),
                    })
                  }
                  rows={3}
                  className="w-full rounded-md border border-border bg-muted/20 p-2 text-xs text-foreground focus:outline-none focus:border-accent font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Tech Stack (comma separated)
                </label>
                <Input
                  value={editingExperience.stack.join(", ")}
                  onChange={(e) =>
                    setEditingExperience({
                      ...editingExperience,
                      stack: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="border-border bg-muted/20 text-xs text-foreground font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingExperience(null)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveExperience}
                  className="bg-accent text-xs font-mono font-semibold text-accent-foreground hover:bg-accent/90"
                >
                  <Save className="h-3.5 w-3.5 mr-1" />
                  Save Experience
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===================== MODAL: EDIT SKILL GROUP ===================== */}
      {editingSkillGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md border-border bg-surface text-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="font-mono text-sm text-foreground">
                EDIT SKILL CLUSTER
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Category Title</label>
                <Input
                  value={editingSkillGroup.group.label}
                  onChange={(e) =>
                    setEditingSkillGroup({
                      ...editingSkillGroup,
                      group: { ...editingSkillGroup.group, label: e.target.value },
                    })
                  }
                  className="border-border bg-muted/20 text-xs text-foreground font-semibold"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Skills & Tools (comma separated)
                </label>
                <textarea
                  value={editingSkillGroup.group.items.join(", ")}
                  onChange={(e) =>
                    setEditingSkillGroup({
                      ...editingSkillGroup,
                      group: {
                        ...editingSkillGroup.group,
                        items: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      },
                    })
                  }
                  rows={4}
                  className="w-full rounded-md border border-border bg-muted/20 p-2 text-xs text-foreground font-mono focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingSkillGroup(null)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveSkillGroup}
                  className="bg-accent text-xs font-mono font-semibold text-accent-foreground hover:bg-accent/90"
                >
                  <Save className="h-3.5 w-3.5 mr-1" />
                  Save Skills
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===================== MODAL: EDIT CERTIFICATION ===================== */}
      {editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-xl border-border bg-surface text-foreground max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-mono text-sm text-foreground">
                EDIT CREDENTIAL // {editingCert.slug}
              </CardTitle>
              <Badge className="border-accent/30 bg-accent/10 font-mono text-[9px] text-accent">
                ACCREDITATION
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Certificate Title
                  </label>
                  <Input
                    value={editingCert.name}
                    onChange={(e) => setEditingCert({ ...editingCert, name: e.target.value })}
                    className="border-border bg-muted/20 text-xs text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Issuer / Authority
                  </label>
                  <Input
                    value={editingCert.issuer}
                    onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                    className="border-border bg-muted/20 text-xs text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Year</label>
                  <Input
                    value={editingCert.year ?? ""}
                    onChange={(e) => setEditingCert({ ...editingCert, year: e.target.value })}
                    className="border-border bg-muted/20 text-xs text-foreground font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Slug Identifier
                  </label>
                  <Input
                    value={editingCert.slug}
                    onChange={(e) => setEditingCert({ ...editingCert, slug: e.target.value })}
                    className="border-border bg-muted/20 text-xs text-foreground font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">Summary</label>
                <textarea
                  value={editingCert.summary}
                  onChange={(e) => setEditingCert({ ...editingCert, summary: e.target.value })}
                  rows={2}
                  className="w-full rounded-md border border-border bg-muted/20 p-2 text-xs text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Skills Validated (comma separated)
                </label>
                <Input
                  value={editingCert.skills.join(", ")}
                  onChange={(e) =>
                    setEditingCert({
                      ...editingCert,
                      skills: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="border-border bg-muted/20 text-xs text-foreground font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Key Outcomes (one per line)
                </label>
                <textarea
                  value={editingCert.outcomes.join("\n")}
                  onChange={(e) =>
                    setEditingCert({
                      ...editingCert,
                      outcomes: e.target.value.split("\n").filter(Boolean),
                    })
                  }
                  rows={2}
                  className="w-full rounded-md border border-border bg-muted/20 p-2 text-xs text-foreground focus:outline-none focus:border-accent font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingCert(null)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveCert}
                  className="bg-accent text-xs font-mono font-semibold text-accent-foreground hover:bg-accent/90"
                >
                  <Save className="h-3.5 w-3.5 mr-1" />
                  Save Credential
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===================== MODAL: EDIT ACTIVITY ===================== */}
      {editingActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-xl border-border bg-surface text-foreground max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-mono text-sm text-foreground">
                EDIT COMMUNITY ACTIVITY // {editingActivity.slug}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Leadership Role
                  </label>
                  <Input
                    value={editingActivity.role}
                    onChange={(e) =>
                      setEditingActivity({ ...editingActivity, role: e.target.value })
                    }
                    className="border-border bg-muted/20 text-xs text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Club / Organization
                  </label>
                  <Input
                    value={editingActivity.org}
                    onChange={(e) =>
                      setEditingActivity({ ...editingActivity, org: e.target.value })
                    }
                    className="border-border bg-muted/20 text-xs text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">Summary</label>
                <textarea
                  value={editingActivity.summary}
                  onChange={(e) =>
                    setEditingActivity({ ...editingActivity, summary: e.target.value })
                  }
                  rows={2}
                  className="w-full rounded-md border border-border bg-muted/20 p-2 text-xs text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Responsibilities & Impact (one per line)
                </label>
                <textarea
                  value={editingActivity.responsibilities.join("\n")}
                  onChange={(e) =>
                    setEditingActivity({
                      ...editingActivity,
                      responsibilities: e.target.value.split("\n").filter(Boolean),
                    })
                  }
                  rows={3}
                  className="w-full rounded-md border border-border bg-muted/20 p-2 text-xs text-foreground focus:outline-none focus:border-accent font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingActivity(null)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveActivity}
                  className="bg-accent text-xs font-mono font-semibold text-accent-foreground hover:bg-accent/90"
                >
                  <Save className="h-3.5 w-3.5 mr-1" />
                  Save Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===================== MODAL: EDIT PROFILE BIO ===================== */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-xl border-border bg-surface text-foreground max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-mono text-sm text-foreground">
                EDIT PROFILE & BIO IDENTITY
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Full Name</label>
                  <Input
                    value={editingProfile.name}
                    onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                    className="border-border bg-muted/20 text-xs text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Title</label>
                  <Input
                    value={editingProfile.title}
                    onChange={(e) =>
                      setEditingProfile({ ...editingProfile, title: e.target.value })
                    }
                    className="border-border bg-muted/20 text-xs text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Email</label>
                  <Input
                    value={editingProfile.email}
                    onChange={(e) =>
                      setEditingProfile({ ...editingProfile, email: e.target.value })
                    }
                    className="border-border bg-muted/20 text-xs text-foreground font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Phone</label>
                  <Input
                    value={editingProfile.phone}
                    onChange={(e) =>
                      setEditingProfile({ ...editingProfile, phone: e.target.value })
                    }
                    className="border-border bg-muted/20 text-xs text-foreground font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Location</label>
                  <Input
                    value={editingProfile.location}
                    onChange={(e) =>
                      setEditingProfile({ ...editingProfile, location: e.target.value })
                    }
                    className="border-border bg-muted/20 text-xs text-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">LinkedIn URL</label>
                  <Input
                    value={editingProfile.linkedin}
                    onChange={(e) =>
                      setEditingProfile({ ...editingProfile, linkedin: e.target.value })
                    }
                    className="border-border bg-muted/20 text-xs text-foreground font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">GitHub URL</label>
                  <Input
                    value={editingProfile.github}
                    onChange={(e) =>
                      setEditingProfile({ ...editingProfile, github: e.target.value })
                    }
                    className="border-border bg-muted/20 text-xs text-foreground font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">LeetCode URL</label>
                  <Input
                    value={editingProfile.leetcode}
                    onChange={(e) =>
                      setEditingProfile({ ...editingProfile, leetcode: e.target.value })
                    }
                    className="border-border bg-muted/20 text-xs text-foreground font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">
                  Full Professional Bio
                </label>
                <textarea
                  value={editingProfile.bio}
                  onChange={(e) => setEditingProfile({ ...editingProfile, bio: e.target.value })}
                  rows={4}
                  className="w-full rounded-md border border-border bg-muted/20 p-2 text-xs text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingProfile(null)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveProfile}
                  className="bg-accent text-xs font-mono font-semibold text-accent-foreground hover:bg-accent/90"
                >
                  <Save className="h-3.5 w-3.5 mr-1" />
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ===================== MODAL: EDIT EDUCATION ===================== */}
      {editingEducation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md border-border bg-surface text-foreground">
            <CardHeader className="pb-2">
              <CardTitle className="font-mono text-sm text-foreground">
                EDIT EDUCATION MILESTONE
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Degree / Course</label>
                <Input
                  value={editingEducation.item.degree}
                  onChange={(e) =>
                    setEditingEducation({
                      ...editingEducation,
                      item: { ...editingEducation.item, degree: e.target.value },
                    })
                  }
                  className="border-border bg-muted/20 text-xs text-foreground"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">School / College</label>
                <Input
                  value={editingEducation.item.school}
                  onChange={(e) =>
                    setEditingEducation({
                      ...editingEducation,
                      item: { ...editingEducation.item, school: e.target.value },
                    })
                  }
                  className="border-border bg-muted/20 text-xs text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Timeline</label>
                  <Input
                    value={editingEducation.item.period}
                    onChange={(e) =>
                      setEditingEducation({
                        ...editingEducation,
                        item: { ...editingEducation.item, period: e.target.value },
                      })
                    }
                    className="border-border bg-muted/20 text-xs text-foreground font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Grade / CGPA</label>
                  <Input
                    value={editingEducation.item.grade}
                    onChange={(e) =>
                      setEditingEducation({
                        ...editingEducation,
                        item: { ...editingEducation.item, grade: e.target.value },
                      })
                    }
                    className="border-border bg-muted/20 text-xs text-foreground font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingEducation(null)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEducation}
                  className="bg-accent text-xs font-mono font-semibold text-accent-foreground hover:bg-accent/90"
                >
                  <Save className="h-3.5 w-3.5 mr-1" />
                  Save Education
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
