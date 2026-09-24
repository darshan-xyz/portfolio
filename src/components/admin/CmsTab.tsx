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
} from "lucide-react";
import { projects as defaultProjects, type Project } from "@/data/portfolio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ResumeVersion {
  id: string;
  tag: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  downloadCount: number;
  isActive: boolean;
}

const INITIAL_RESUMES: ResumeVersion[] = [
  {
    id: "res-01",
    tag: "v2.5-ai-ml-lead",
    fileName: "Darshan_R_Resume.pdf",
    fileSize: "177 KB",
    uploadedAt: "Sep 23, 2026",
    downloadCount: 198,
    isActive: true,
  },
  {
    id: "res-02",
    tag: "v2.4-general-cs",
    fileName: "Darshan_R_CV_Classic.pdf",
    fileSize: "165 KB",
    uploadedAt: "Aug 15, 2026",
    downloadCount: 142,
    isActive: false,
  },
  {
    id: "res-03",
    tag: "v2.0-internship",
    fileName: "Darshan_Resume_2025.pdf",
    fileSize: "152 KB",
    uploadedAt: "June 2025",
    downloadCount: 89,
    isActive: false,
  },
];

export function CmsTab() {
  const [projectsList, setProjectsList] = useState<Project[]>(defaultProjects);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [resumes, setResumes] = useState<ResumeVersion[]>(INITIAL_RESUMES);

  const setActiveResume = (id: string) => {
    setResumes((prev) =>
      prev.map((r) => ({
        ...r,
        isActive: r.id === id,
      })),
    );
    toast.success("Active resume version updated across portfolio!");
  };

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
      {/* 1. Resume Asset Studio */}
      <Card className="border-white/10 bg-[#0B2A3B]/40 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="font-mono text-sm text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#B8FF3A]" />
              RESUME VERSION MANAGEMENT & ASSET STUDIO
            </CardTitle>
            <p className="text-xs text-white/50">
              Manage live active resume without redeploying. Download statistics are tracked per
              version.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() =>
              toast.info("Drag and drop file upload will connect to Supabase Storage.")
            }
            className="h-8 gap-1.5 bg-[#B8FF3A]/20 text-xs font-mono text-[#B8FF3A] hover:bg-[#B8FF3A]/30 border border-[#B8FF3A]/40"
          >
            <Upload className="h-3 w-3" />
            Upload New Version
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className={`flex items-center justify-between rounded-lg border p-3.5 transition-colors ${
                  resume.isActive
                    ? "border-[#B8FF3A]/40 bg-[#B8FF3A]/[0.03]"
                    : "border-white/5 bg-white/[0.01]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      resume.isActive
                        ? "bg-[#B8FF3A]/20 text-[#B8FF3A]"
                        : "bg-white/5 text-white/40"
                    }`}
                  >
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-white">
                        {resume.fileName}
                      </span>
                      <Badge
                        variant="outline"
                        className="border-white/20 font-mono text-[9px] text-white/60"
                      >
                        {resume.tag}
                      </Badge>
                      {resume.isActive && (
                        <Badge className="border-[#B8FF3A]/40 bg-[#B8FF3A]/20 font-mono text-[9px] text-[#B8FF3A]">
                          CURRENT LIVE VERSION
                        </Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-white/40">
                      Size: {resume.fileSize} · Uploaded: {resume.uploadedAt} ·{" "}
                      <span className="text-[#B8FF3A] font-mono">
                        {resume.downloadCount} downloads
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-8 items-center gap-1 rounded border border-white/10 px-2.5 text-xs text-white/70 hover:bg-white/5 hover:text-white"
                  >
                    <Eye className="h-3 w-3" />
                    Preview
                  </a>
                  {!resume.isActive && (
                    <Button
                      size="sm"
                      onClick={() => setActiveResume(resume.id)}
                      className="h-8 bg-white/10 text-xs text-white hover:bg-white/20"
                    >
                      Make Active
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2. Project Case Studies Manager */}
      <Card className="border-white/10 bg-[#0B2A3B]/40 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="font-mono text-sm text-white">
              PROJECT CASE STUDIES & ARSENAL CMS
            </CardTitle>
            <p className="text-xs text-white/50">
              Live updates to project highlights, tech stacks, and showcase ordering
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

                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-white/40">
                  <span className="font-mono">/{project.slug}</span>
                  <a
                    href={`/projects/${project.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#7CF9C9] hover:underline"
                  >
                    View Page
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Project Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border-white/10 bg-[#0B2A3B] text-white shadow-2xl">
            <CardHeader className="border-b border-white/10 pb-3">
              <CardTitle className="font-mono text-sm text-white">
                EDIT PROJECT // {editingProject.slug}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <label className="text-xs text-white/50 block mb-1">Project Name</label>
                <Input
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  className="border-white/10 bg-white/5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-white/50 block mb-1">Domain</label>
                <Input
                  value={editingProject.domain}
                  onChange={(e) => setEditingProject({ ...editingProject, domain: e.target.value })}
                  className="border-white/10 bg-white/5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-white/50 block mb-1">Summary</label>
                <textarea
                  rows={3}
                  value={editingProject.summary}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, summary: e.target.value })
                  }
                  className="w-full rounded-md border border-white/10 bg-white/5 p-2 text-xs text-white focus:border-[#7CF9C9] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-white/50 block mb-1">
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

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingProject(null)}
                  className="text-xs text-white/60 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveProject}
                  className="gap-1.5 bg-[#7CF9C9] text-xs font-semibold text-[#040914] hover:bg-[#7CF9C9]/90"
                >
                  <Save className="h-3 w-3" />
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
