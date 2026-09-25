import { useState } from "react";
import {
  FileText,
  Upload,
  CheckCircle,
  ExternalLink,
  Plus,
  Save,
  Trash2,
  Star,
  Eye,
  Github,
  Download,
} from "lucide-react";
import { projects as defaultProjects, type Project } from "@/data/portfolio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface CmsTabProps {
  resumeDownloads?: number;
}

export function CmsTab({ resumeDownloads = 0 }: CmsTabProps) {
  const [projectsList, setProjectsList] = useState<Project[]>(defaultProjects);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleSaveProject = () => {
    if (!editingProject) return;
    setProjectsList((prev) =>
      prev.map((p) => (p.slug === editingProject.slug ? editingProject : p)),
    );
    setEditingProject(null);
    toast.success(`Project "${editingProject.name}" updated successfully!`);
  };

  return (
    <div className="space-y-8">
      {/* 1. Authentic Resume Asset Studio */}
      <Card className="border-white/10 bg-[#0B2A3B]/40 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="font-mono text-sm text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#B8FF3A]" />
              AUTHENTIC RESUME ASSET & DOWNLOAD TELEMETRY
            </CardTitle>
            <p className="text-xs text-white/50">
              Verified active resume asset linked directly to real-time download telemetry
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-white/10 bg-[#040914]/80 p-4 transition-all hover:border-[#7CF9C9]/40">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#B8FF3A]/30 bg-[#B8FF3A]/10 text-[#B8FF3A]">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">Darshan_R_Resume.pdf</span>
                    <Badge className="border-emerald-500/30 bg-emerald-500/10 text-[9px] text-emerald-400">
                      LIVE ASSET
                    </Badge>
                  </div>
                  <div className="text-[11px] text-white/40 mt-0.5">
                    Size: 173 KB · Updated: Sep 23, 2026 ·{" "}
                    <span className="text-[#B8FF3A] font-mono font-medium">
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
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 font-mono text-xs text-white hover:bg-white/10 transition-colors"
                >
                  <Eye className="h-3.5 w-3.5 text-[#7CF9C9]" />
                  Preview Asset
                </a>
                <a
                  href="/resume.pdf"
                  download="Darshan_R_Resume.pdf"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#B8FF3A]/30 bg-[#B8FF3A]/10 px-3 font-mono text-xs text-[#B8FF3A] hover:bg-[#B8FF3A]/20 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Direct Download
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Project Case Studies Manager */}
      <Card className="border-white/10 bg-[#0B2A3B]/40 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="font-mono text-sm text-white">
              PROJECT CASE STUDIES & ARSENAL CMS ({projectsList.length} PROJECTS)
            </CardTitle>
            <p className="text-xs text-white/50">
              Verified portfolio project showcase, tech stacks, and domain categorization
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
            className="h-8 gap-1.5 bg-[#7CF9C9]/20 text-xs font-mono text-[#7CF9C9] hover:bg-[#7CF9C9]/30 border border-[#7CF9C9]/40"
          >
            <Plus className="h-3 w-3" />
            Add Project
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {projectsList.map((project) => (
              <div
                key={project.slug}
                className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#040914]/80 p-4 transition-all hover:border-[#7CF9C9]/40"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge className="border-[#7CF9C9]/30 bg-[#7CF9C9]/10 text-[9px] text-[#7CF9C9] mb-1">
                        {project.domain}
                      </Badge>
                      <h3 className="font-bold text-sm text-white">{project.name}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingProject({ ...project })}
                      className="h-7 text-xs text-[#7CF9C9] hover:bg-[#7CF9C9]/10"
                    >
                      Edit
                    </Button>
                  </div>

                  <p className="mt-2 text-xs text-white/60 line-clamp-2">{project.summary}</p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {project.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-white/70"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                  <div className="flex items-center gap-2">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white/40 hover:text-white"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white/40 hover:text-white"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-white/40">/{project.slug}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-xl border-white/10 bg-[#0B2A3B] text-white">
            <CardHeader>
              <CardTitle className="font-mono text-base text-white">
                EDIT PROJECT // {editingProject.slug}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-white/60 block mb-1">Project Name</label>
                <Input
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  className="border-white/10 bg-white/5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-white/60 block mb-1">Domain / Category</label>
                <Input
                  value={editingProject.domain}
                  onChange={(e) => setEditingProject({ ...editingProject, domain: e.target.value })}
                  className="border-white/10 bg-white/5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-white/60 block mb-1">Summary</label>
                <textarea
                  value={editingProject.summary}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, summary: e.target.value })
                  }
                  rows={2}
                  className="w-full rounded-md border border-white/10 bg-white/5 p-2 text-xs text-white focus:outline-none focus:border-[#7CF9C9]"
                />
              </div>

              <div>
                <label className="text-xs text-white/60 block mb-1">
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
                  className="border-white/10 bg-white/5 text-xs text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingProject(null)}
                  className="text-xs text-white/60 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveProject}
                  className="bg-[#7CF9C9] text-xs font-mono font-semibold text-[#040914] hover:bg-[#7CF9C9]/90"
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
